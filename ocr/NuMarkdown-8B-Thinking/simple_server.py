from fastapi import FastAPI, File, UploadFile
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import re
import io
import os
import shutil
from pathlib import Path

try:
    import fitz  # PyMuPDF
    PYMUPDF_AVAILABLE = True
except ImportError:
    PYMUPDF_AVAILABLE = False

try:
    from PIL import Image, ImageOps, ImageFilter
    PIL_AVAILABLE = True
except ImportError:
    PIL_AVAILABLE = False

try:
    import pytesseract
    from pytesseract import Output
    TESSERACT_AVAILABLE = True
except ImportError:
    TESSERACT_AVAILABLE = False


def resolve_tesseract_cmd():
    env_path = os.environ.get("TESSERACT_CMD")
    if env_path and Path(env_path).exists():
        return env_path

    path_candidate = shutil.which("tesseract")
    if path_candidate:
        return path_candidate

    common_paths = [
        r"C:\Program Files\Tesseract-OCR\tesseract.exe",
        r"C:\Program Files (x86)\Tesseract-OCR\tesseract.exe",
        os.path.join(os.environ.get("LOCALAPPDATA", ""), "Programs", "Tesseract-OCR", "tesseract.exe"),
        r"C:\ProgramData\chocolatey\bin\tesseract.exe",
    ]
    for candidate in common_paths:
        if candidate and Path(candidate).exists():
            return candidate

    return None


TESSERACT_CMD = resolve_tesseract_cmd() if TESSERACT_AVAILABLE else None
if TESSERACT_AVAILABLE and TESSERACT_CMD:
    pytesseract.pytesseract.tesseract_cmd = TESSERACT_CMD
else:
    TESSERACT_AVAILABLE = False

TESSERACT_CONFIG = os.environ.get("TESSERACT_CONFIG", "--oem 1 --psm 6")


def preprocess_image(image: "Image.Image") -> "Image.Image":
    if not PIL_AVAILABLE:
        return image

    img = image.convert("L")
    img = ImageOps.autocontrast(img)
    # Upscale small images to improve OCR accuracy
    max_side = max(img.size)
    if max_side < 1800:
        scale = 1800 / max_side
        new_size = (int(img.size[0] * scale), int(img.size[1] * scale))
        img = img.resize(new_size, Image.Resampling.LANCZOS)
    img = img.filter(ImageFilter.SHARPEN)
    return img


def extract_items_from_image(image: "Image.Image", preprocessed: bool = False):
    if not (TESSERACT_AVAILABLE and PIL_AVAILABLE):
        return []

    def normalize_token(text: str):
        return re.sub(r'[^a-z]', '', text.lower())

    def parse_number(text: str):
        match = re.findall(r'[0-9]{1,3}(?:[, ]?[0-9]{3})*(?:\.\d{1,2})?', text)
        if not match:
            return None
        value = match[-1].replace(',', '').replace(' ', '')
        try:
            return float(value)
        except ValueError:
            return None

    def parse_quantity(text: str):
        match = re.findall(r'[0-9]+(?:\.\d+)?', text)
        if not match:
            return None
        try:
            return float(match[0])
        except ValueError:
            return None

    img = image if preprocessed else preprocess_image(image)
    data = pytesseract.image_to_data(img, output_type=Output.DICT, config=TESSERACT_CONFIG)

    lines_map = {}
    for i in range(len(data["text"])):
        text = data["text"][i].strip()
        if not text:
            continue
        key = (data["block_num"][i], data["par_num"][i], data["line_num"][i])
        lines_map.setdefault(key, []).append({
            "text": text,
            "left": data["left"][i],
            "top": data["top"][i],
            "width": data["width"][i],
            "height": data["height"][i],
        })

    lines = sorted(lines_map.values(), key=lambda words: min(w["top"] for w in words))
    if not lines:
        return []

    header_index = None
    columns = {}
    for idx, words in enumerate(lines):
        line_text = " ".join(w["text"] for w in sorted(words, key=lambda w: w["left"]))
        lower = line_text.lower()
        if "item" in lower and "amount" in lower:
            header_index = idx
            for word in words:
                token = normalize_token(word["text"])
                if token in {"item", "items", "name", "itemname"}:
                    columns["item"] = min(columns.get("item", word["left"]), word["left"])
                elif token in {"qty", "quantity"}:
                    columns["quantity"] = word["left"]
                elif token in {"unit"}:
                    columns["unit"] = word["left"]
                elif token in {"price", "rate"}:
                    columns["price"] = word["left"]
                elif token in {"gst", "tax"}:
                    columns["gst"] = word["left"]
                elif token in {"amount", "amt"}:
                    columns["amount"] = word["left"]
            if "item" not in columns:
                columns["item"] = min(w["left"] for w in words)
            if "amount" in columns:
                break

    if header_index is None or "amount" not in columns:
        return []

    column_order = sorted(columns.items(), key=lambda entry: entry[1])
    col_names = [name for name, _ in column_order]
    col_positions = [pos for _, pos in column_order]

    def assign_column(word):
        x_center = word["left"] + word["width"] / 2
        assigned = col_names[0]
        for name, pos in column_order:
            if x_center >= pos:
                assigned = name
            else:
                break
        return assigned

    items = []
    for words in lines[header_index + 1:]:
        line_text = " ".join(w["text"] for w in sorted(words, key=lambda w: w["left"]))
        if not line_text.strip():
            continue
        if "total" in line_text.lower():
            break

        buckets = {name: [] for name in col_names}
        for word in sorted(words, key=lambda w: w["left"]):
            col = assign_column(word)
            buckets[col].append(word["text"])

        row = {name: " ".join(tokens).strip() for name, tokens in buckets.items() if tokens}

        item_text = row.get("item", "")
        tokens = item_text.split()
        index = None
        if tokens and tokens[0].isdigit():
            index = tokens[0]
            tokens = tokens[1:]
        description = " ".join(tokens).strip()

        quantity = parse_quantity(row.get("quantity", ""))
        unit = row.get("unit", "").split()[0] if row.get("unit") else None
        rate = parse_number(row.get("price", ""))
        amount = parse_number(row.get("amount", ""))
        gst_value = parse_number(row.get("gst", ""))

        if not description and row.get("item"):
            description = row.get("item")

        if amount is None and rate is None:
            continue

        if quantity is None:
            quantity = 1

        if rate is None and amount is not None and quantity:
            rate = amount / quantity

        items.append({
            "index": index or str(len(items) + 1),
            "description": description,
            "quantity": quantity,
            "unit": unit,
            "rate": rate,
            "amount": amount,
            "gst": gst_value
        })

    return items

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

HTML_CONTENT = """
<!DOCTYPE html>
<html>
<head>
    <title>Invoice OCR - CreditFlow Pro</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            background: #F4F7FB;
            padding: 24px;
            line-height: 1.6;
        }

        .container {
            max-width: 800px;
            margin: 0 auto;
        }

        .header {
            background: #FFFFFF;
            padding: 24px;
            border-radius: 8px;
            border: 1px solid #E1E7F0;
            margin-bottom: 20px;
        }

        h1 {
            color: #0B1220;
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 8px;
        }

        .subtitle {
            color: #667085;
            font-size: 14px;
        }

        .upload-section {
            background: #FFFFFF;
            padding: 32px;
            border-radius: 8px;
            border: 1px solid #E1E7F0;
            margin-bottom: 20px;
        }

        .upload-zone {
            border: 2px dashed #D0D7E5;
            border-radius: 8px;
            padding: 40px;
            text-align: center;
            background: #F9FAFB;
            cursor: pointer;
            transition: all 0.2s;
        }

        .upload-zone:hover {
            border-color: #1F5EFF;
            background: #F4F7FB;
        }

        .upload-zone.dragover {
            border-color: #1F5EFF;
            background: #EEF2FF;
        }

        .upload-icon {
            font-size: 48px;
            color: #1F5EFF;
            margin-bottom: 16px;
        }

        .upload-text {
            color: #0B1220;
            font-size: 16px;
            font-weight: 500;
            margin-bottom: 8px;
        }

        .upload-hint {
            color: #667085;
            font-size: 14px;
        }

        input[type="file"] {
            display: none;
        }

        .button {
            background: #1F5EFF;
            color: white;
            border: none;
            border-radius: 6px;
            padding: 12px 24px;
            font-weight: 500;
            font-size: 14px;
            cursor: pointer;
            transition: background 0.2s;
            margin-top: 16px;
        }

        .button:hover {
            background: #1850E5;
        }

        .button:disabled {
            background: #D0D7E5;
            cursor: not-allowed;
        }

        .result-section {
            background: #FFFFFF;
            padding: 24px;
            border-radius: 8px;
            border: 1px solid #E1E7F0;
            display: none;
        }

        .result-title {
            color: #0B1220;
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 16px;
        }

        .result-content {
            background: #F9FAFB;
            border: 1px solid #E1E7F0;
            border-radius: 6px;
            padding: 16px;
            color: #0B1220;
            font-size: 14px;
            font-family: 'Monaco', 'Courier New', monospace;
            white-space: pre-wrap;
            max-height: 400px;
            overflow-y: auto;
        }

        .loading {
            display: none;
            text-align: center;
            padding: 20px;
            color: #667085;
        }

        .spinner {
            border: 3px solid #E1E7F0;
            border-top: 3px solid #1F5EFF;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 0 auto 12px;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .preview {
            margin-top: 16px;
            text-align: center;
        }

        .preview img {
            max-width: 100%;
            max-height: 300px;
            border-radius: 6px;
            border: 1px solid #E1E7F0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Invoice OCR</h1>
            <p class="subtitle">Upload an image or PDF of an invoice to extract information</p>
        </div>

        <div class="upload-section">
            <div class="upload-zone" id="dropZone">
                <div class="upload-icon">📄</div>
                <div class="upload-text">Drop your file here or click to browse</div>
                <div class="upload-hint">Supports PNG, JPG, JPEG, and PDF files</div>
            </div>
            <input type="file" id="fileInput" accept=".png,.jpg,.jpeg,.pdf">
            <div class="preview" id="preview"></div>
            <button class="button" id="extractBtn" disabled>Extract Invoice Data</button>
        </div>

        <div class="loading" id="loading">
            <div class="spinner"></div>
            <p>Processing your invoice...</p>
        </div>

        <div class="result-section" id="resultSection">
            <div class="result-title">Extracted Data</div>
            <div class="result-content" id="resultContent"></div>
        </div>
    </div>

    <script>
        const dropZone = document.getElementById('dropZone');
        const fileInput = document.getElementById('fileInput');
        const extractBtn = document.getElementById('extractBtn');
        const loading = document.getElementById('loading');
        const resultSection = document.getElementById('resultSection');
        const resultContent = document.getElementById('resultContent');
        const preview = document.getElementById('preview');

        let selectedFile = null;

        dropZone.addEventListener('click', () => fileInput.click());

        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('dragover');
        });

        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('dragover');
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                handleFile(files[0]);
            }
        });

        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                handleFile(e.target.files[0]);
            }
        });

        function handleFile(file) {
            selectedFile = file;
            extractBtn.disabled = false;

            // Show preview for images
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
                };
                reader.readAsDataURL(file);
            } else {
                preview.innerHTML = `<p style="color: #667085; margin-top: 16px;">📄 ${file.name}</p>`;
            }
        }

        extractBtn.addEventListener('click', async () => {
            if (!selectedFile) return;

            const formData = new FormData();
            formData.append('file', selectedFile);

            loading.style.display = 'block';
            resultSection.style.display = 'none';
            extractBtn.disabled = true;

            try {
                const response = await fetch('/upload', {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();

                if (response.ok) {
                    resultContent.textContent = JSON.stringify(data, null, 2);
                    resultSection.style.display = 'block';

                    // Send extracted data to parent window if embedded in iframe
                    if (window.parent !== window && data.extracted_data) {
                        console.log('📤 Sending OCR data to parent window:', data.extracted_data);
                        window.parent.postMessage({
                            type: 'OCR_EXTRACT_DATA',
                            data: data.extracted_data,
                            meta: {
                                status: data.status,
                                message: data.message,
                                note: data.note
                            }
                        }, '*');
                    }
                } else {
                    resultContent.textContent = 'Error: ' + (data.error || 'Failed to process file');
                    resultSection.style.display = 'block';
                }
            } catch (error) {
                resultContent.textContent = 'Error: ' + error.message;
                resultSection.style.display = 'block';
            } finally {
                loading.style.display = 'none';
                extractBtn.disabled = false;
            }
        });
    </script>
</body>
</html>
"""

@app.get("/", response_class=HTMLResponse)
async def root():
    return HTML_CONTENT

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    """
    Extract invoice data from uploaded file.
    Uses basic text extraction when vLLM backend is not configured.
    """
    try:
        # Read file content
        content = await file.read()
        extracted_text = ""
        filename = file.filename or "uploaded_file"
        lower_name = filename.lower()
        is_pdf = lower_name.endswith('.pdf')
        if file.content_type:
            is_image = file.content_type.startswith('image/')
        else:
            is_image = lower_name.endswith(('.png', '.jpg', '.jpeg', '.webp', '.bmp', '.tif', '.tiff'))
        items_from_image = []

        # Extract text from PDF if PyMuPDF is available
        if is_pdf and PYMUPDF_AVAILABLE:
            try:
                pdf_document = fitz.open(stream=content, filetype="pdf")
                for page_num in range(len(pdf_document)):
                    page = pdf_document[page_num]
                    extracted_text += page.get_text()
                pdf_document.close()
            except Exception as e:
                print(f"Error extracting PDF text: {e}")

        # OCR fallback for PDFs with no embedded text
        if is_pdf and PYMUPDF_AVAILABLE and PIL_AVAILABLE and TESSERACT_AVAILABLE:
            try:
                pdf_document = fitz.open(stream=content, filetype="pdf")
                ocr_text_needed = not extracted_text.strip() or len(extracted_text.strip()) < 50
                for page_num in range(len(pdf_document)):
                    page = pdf_document[page_num]
                    pix = page.get_pixmap(dpi=300)
                    img = Image.open(io.BytesIO(pix.tobytes("png")))
                    img = preprocess_image(img)
                    if ocr_text_needed:
                        extracted_text += pytesseract.image_to_string(img, config=TESSERACT_CONFIG)
                    if page_num == 0 and not items_from_image:
                        items_from_image = extract_items_from_image(img, preprocessed=True)
                pdf_document.close()
            except Exception as e:
                print(f"Error OCRing PDF: {e}")

        # OCR for images
        if is_image and PIL_AVAILABLE and TESSERACT_AVAILABLE:
            try:
                img = Image.open(io.BytesIO(content))
                img = preprocess_image(img)
                extracted_text = pytesseract.image_to_string(img, config=TESSERACT_CONFIG)
                items_from_image = extract_items_from_image(img, preprocessed=True)
            except Exception as e:
                print(f"Error OCRing image: {e}")

        # Parse invoice data from extracted text
        invoice_data = parse_invoice_text(extracted_text, filename)
        if items_from_image:
            invoice_data["items"] = items_from_image

        def has_useful_data(data):
            for value in data.values():
                if value is None:
                    continue
                text = str(value).strip()
                if text and text not in {"0", "0.0"}:
                    return True
            return False

        if not extracted_text.strip():
            note = "Install and configure Tesseract OCR for images/scanned PDFs."
            if not PYMUPDF_AVAILABLE and is_pdf:
                note = "PyMuPDF is not installed, so PDF text could not be extracted."
            elif TESSERACT_AVAILABLE:
                note = "OCR is enabled, but no readable text was detected."
            return JSONResponse({
                "status": "error",
                "message": "No text could be extracted from the file.",
                "filename": filename,
                "note": note,
                "extracted_data": invoice_data
            })

        status = "success" if has_useful_data(invoice_data) else "partial"
        message = "Invoice data extracted" if status == "success" else "Text extracted, but invoice fields were not detected."

        response_payload = {
            "status": status,
            "message": message,
            "filename": filename,
            "note": "For better accuracy, configure vLLM backend with NuMarkdown-8B-Thinking model",
            "extracted_data": invoice_data,
            "parser_version": "v6-gst-rate"
        }
        if os.environ.get("OCR_DEBUG") == "1":
            response_payload["debug_text"] = extracted_text[:4000]
        return JSONResponse(response_payload)

    except Exception as e:
        return JSONResponse({
            "status": "error",
            "message": f"Error processing file: {str(e)}",
            "filename": file.filename,
            "extracted_data": {
                "invoice_number": "",
                "date": "",
                "due_date": "",
                "vendor": "",
                "total": "0",
                "description": "Error extracting data",
                "notes": f"Could not process file: {str(e)}"
            }
        })

def parse_invoice_text(text: str, filename: str):
    """
    Parse invoice data from extracted text using regex patterns.
    """
    data = {
        "invoice_number": "",
        "date": "",
        "due_date": "",
        "vendor": "",
        "total": "0",
        "description": "",
        "notes": "",
        "items": []
    }

    if not text:
        return data

    # Extract invoice number - look for patterns like "Invoice No.: 398", "INV-123", etc.
    invoice_patterns = [
        r'Invoice\s+No\.?\s*:?\s*(\d+)',
        r'Invoice\s+#\s*(\d+)',
        r'INV[-\s]?(\d+)',
        r'Invoice\s+Number\s*:?\s*([A-Z0-9-]+)'
    ]
    for pattern in invoice_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            data["invoice_number"] = f"INV-{match.group(1)}"
            break

    # Extract date - look for patterns like "Date: 16-11-2024", "16/11/2024", etc.
    date_patterns = [
        r'Date\s*:?\s*(\d{1,2}[-/]\d{1,2}[-/]\d{4})',
        r'(\d{1,2}[-/]\d{1,2}[-/]\d{4})'
    ]
    for pattern in date_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            date_str = match.group(1)
            # Convert to YYYY-MM-DD format
            if '-' in date_str:
                parts = date_str.split('-')
            else:
                parts = date_str.split('/')

            if len(parts) == 3:
                day, month, year = parts
                if len(year) == 4:
                    data["date"] = f"{year}-{month.zfill(2)}-{day.zfill(2)}"
            break

    # Extract vendor/company name - usually at the top
    lines = [line.strip() for line in text.split('\n') if line.strip()]
    for line in lines[:10]:  # Check first 10 lines
        if line and len(line) > 3 and not any(skip in line.lower() for skip in ['invoice', 'original', 'tax', 'gst', 'phone', 'email']):
            if not re.match(r'^[A-Z0-9-]+\s*$', line):  # Not just numbers/codes
                data["vendor"] = line
                break

    def parse_amount(value: str):
        cleaned = value.replace(',', '').replace(' ', '')
        try:
            return float(cleaned)
        except ValueError:
            return None

    currency_pattern = r'(?:₹|Rs\.?|INR)\s*([0-9]{1,3}(?:[, ]?[0-9]{3})*(?:\.\d{1,2})?)'
    plain_amount_pattern = r'([0-9]{1,3}(?:[, ]?[0-9]{3})*(?:\.\d{1,2})?)'

    def extract_amounts(line: str, allow_plain: bool = False):
        amounts = []
        for match in re.finditer(currency_pattern, line, re.IGNORECASE):
            amount = parse_amount(match.group(1))
            if amount is not None:
                amounts.append(amount)
        if allow_plain and not amounts:
            for match in re.finditer(plain_amount_pattern, line):
                if '-' in line or '/' in line:
                    continue
                amount = parse_amount(match.group(1))
                if amount is not None:
                    amounts.append(amount)
        return amounts

    def is_number_token(token: str):
        return re.fullmatch(r'[0-9]{1,3}(?:[, ]?[0-9]{3})*(?:\.\d{1,2})?', token) is not None

    def parse_float_token(token: str):
        return parse_amount(token)

    unit_tokens = {
        "nos", "no", "box", "rol", "roll", "pcs", "pkt", "pack", "set",
        "kg", "g", "gm", "ltr", "l", "litre", "meter", "m"
    }

    def parse_item_line(line: str):
        cleaned = re.sub(r'\(\s*\d+(\.\d+)?\s*%\s*\)', '', line)
        cleaned = cleaned.replace('₹', ' ').replace('Rs.', ' ').replace('INR', ' ')
        cleaned = re.sub(r'\s+', ' ', cleaned).strip()
        if not re.match(r'^\d+\s+', cleaned):
            return None

        tokens = cleaned.split()
        item_index = tokens[0]
        tokens = tokens[1:]

        unit_index = None
        for idx, token in enumerate(tokens):
            if token.lower() in unit_tokens:
                unit_index = idx
                break

        qty = None
        unit = None
        if unit_index is not None and unit_index > 0 and is_number_token(tokens[unit_index - 1]):
            qty = parse_float_token(tokens[unit_index - 1])
            unit = tokens[unit_index]

        numeric_tokens = [parse_float_token(t) for t in tokens if is_number_token(t)]
        numeric_tokens = [n for n in numeric_tokens if n is not None]

        amount = None
        rate = None
        gst_value = None

        if numeric_tokens:
            amount = numeric_tokens[-1]
            if len(numeric_tokens) >= 4:
                rate = numeric_tokens[-3]
            elif len(numeric_tokens) == 3:
                rate = numeric_tokens[-2]
            elif len(numeric_tokens) == 2:
                rate = numeric_tokens[0]

        # Attempt to capture GST value (e.g. "9.00 (18.0%)")
        gst_match = re.search(r'([0-9]+(?:\.[0-9]{1,2})?)\s*\(?\s*18\.0?\s*%?\s*\)?', line)
        if gst_match:
            gst_value = parse_amount(gst_match.group(1))

        item_name_end = None
        if unit_index is not None:
            item_name_end = max(unit_index - 1, 0)
        else:
            for idx, token in enumerate(tokens):
                if is_number_token(token):
                    item_name_end = idx
                    break

        if item_name_end is None:
            item_name_end = len(tokens)

        name_tokens = tokens[:item_name_end]
        name_tokens = [t for t in name_tokens if not re.fullmatch(r'[A-Z0-9]{4,}', t)]
        item_name = " ".join(name_tokens).strip()
        if not item_name:
            item_name = f"Item {item_index}"

        if qty is None and numeric_tokens:
            qty = numeric_tokens[0]
        if qty is None:
            qty = 1

        if gst_value is not None:
            gross_from_gst = gst_value * (1.18 / 0.18)
            if amount is None or abs(gross_from_gst - amount) / max(amount, 1) > 0.08:
                amount = gross_from_gst

        if rate is None and amount is not None and qty:
            rate = amount / qty if qty else amount

        if amount is None and rate is not None and qty is not None:
            amount = rate * qty

        return {
            "index": item_index,
            "description": item_name,
            "quantity": qty,
            "unit": unit,
            "rate": rate,
            "amount": amount,
            "gst": gst_value
        }

    label_priority = [
        ("grand total", 4),
        ("total amount", 4),
        ("total payable", 4),
        ("amount due", 4),
        ("amount payable", 4),
        ("net total", 4),
        ("net amount", 4),
        ("balance", 3),
        ("invoice total", 3),
        ("total", 3),
        ("sub total", 1),
        ("subtotal", 1),
    ]

    candidates = []
    for idx, line in enumerate(lines):
        lower = line.lower()
        matched_priority = None
        for label, priority in label_priority:
            if label in lower:
                matched_priority = priority
                break

        if matched_priority is None:
            continue

        amounts = extract_amounts(line, allow_plain=True)
        if not amounts and idx + 1 < len(lines):
            amounts = extract_amounts(lines[idx + 1], allow_plain=True)
        for amount in amounts:
            candidates.append((matched_priority, amount))

    def find_label_amount(labels):
        for idx, line in enumerate(lines):
            lower = line.lower()
            if any(label in lower for label in labels):
                amounts = extract_amounts(line, allow_plain=True)
                if not amounts and idx + 1 < len(lines):
                    amounts = extract_amounts(lines[idx + 1], allow_plain=True)
                if amounts:
                    return max(amounts)
        return None

    if candidates:
        _, best_amount = max(candidates, key=lambda item: (item[0], item[1]))
        data["total"] = f"₹{best_amount:.2f}"
    else:
        fallback_amounts = []
        for line in lines:
            fallback_amounts.extend(extract_amounts(line, allow_plain=False))
        if fallback_amounts:
            data["total"] = f"₹{max(fallback_amounts):.2f}"

    subtotal_amount = find_label_amount(["sub total", "subtotal"])
    cgst_amount = find_label_amount(["cgst"])
    sgst_amount = find_label_amount(["sgst"])
    igst_amount = find_label_amount(["igst"])

    if subtotal_amount and any([cgst_amount, sgst_amount, igst_amount]):
        computed_total = subtotal_amount + (cgst_amount or 0) + (sgst_amount or 0) + (igst_amount or 0)
        current_total_value = parse_amount(data["total"].replace("₹", "")) if data["total"] else None
        if current_total_value is None or computed_total > current_total_value * 1.02:
            data["total"] = f"₹{computed_total:.2f}"

    # Extract line items
    items = []
    for line in lines:
        item = parse_item_line(line)
        if not item or not item.get("description"):
            continue
        if item.get("amount") is None and item.get("rate") is None:
            continue
        items.append(item)

    if items:
        seen = set()
        unique_items = []
        for item in items:
            key = (item.get("description"), round(item.get("amount", 0), 2))
            if key in seen:
                continue
            seen.add(key)
            unique_items.append(item)
        try:
            unique_items.sort(key=lambda entry: int(entry.get("index", 0)))
        except Exception:
            pass
        data["items"] = unique_items
    else:
        # Fallback: attempt to parse items from table text region
        start_idx = None
        end_idx = None
        for idx, line in enumerate(lines):
            lower = line.lower()
            if start_idx is None and ("item" in lower and "amount" in lower):
                start_idx = idx + 1
                continue
            if start_idx is not None and "total" in lower:
                end_idx = idx
                break
        table_lines = lines[start_idx:end_idx] if start_idx is not None else lines
        table_text = " ".join(table_lines)
        chunks = re.split(r'(?<!\d)(\d{1,2})\s+', table_text)
        fallback_items = []
        for i in range(1, len(chunks), 2):
            item_text = f"{chunks[i]} {chunks[i + 1]}".strip()
            item = parse_item_line(item_text)
            if item and item.get("description") and item.get("amount") is not None:
                fallback_items.append(item)
        if fallback_items:
            seen = set()
            unique_items = []
            for item in fallback_items:
                key = (item.get("description"), round(item.get("amount", 0), 2))
                if key in seen:
                    continue
                seen.add(key)
                unique_items.append(item)
            try:
                unique_items.sort(key=lambda entry: int(entry.get("index", 0)))
            except Exception:
                pass
            data["items"] = unique_items

    # Extract GSTIN if available
    gstin_match = re.search(r'GSTIN\s*:?\s*([A-Z0-9]+)', text, re.IGNORECASE)
    if gstin_match:
        data["notes"] = f"GSTIN: {gstin_match.group(1)}"

    # Detect GST rate
    def parse_percent(match):
        try:
            return float(match.group(1))
        except Exception:
            return None

    lower_text = text.lower()
    has_gst_tokens = any(token in lower_text for token in ["gst", "cgst", "sgst", "igst"])
    cgst_rate = None
    sgst_rate = None
    igst_rate = None
    gst_rate = None

    cgst_match = re.search(r'cgst\s*@?\s*([0-9]+(?:\.[0-9]+)?)\s*%', text, re.IGNORECASE)
    sgst_match = re.search(r'sgst\s*@?\s*([0-9]+(?:\.[0-9]+)?)\s*%', text, re.IGNORECASE)
    igst_match = re.search(r'igst\s*@?\s*([0-9]+(?:\.[0-9]+)?)\s*%', text, re.IGNORECASE)
    if cgst_match:
        cgst_rate = parse_percent(cgst_match)
    if sgst_match:
        sgst_rate = parse_percent(sgst_match)
    if igst_match:
        igst_rate = parse_percent(igst_match)

    if igst_rate is not None:
        gst_rate = igst_rate
    elif cgst_rate is not None and sgst_rate is not None:
        gst_rate = cgst_rate + sgst_rate
    else:
        gst_match = re.search(r'gst\s*@?\s*([0-9]+(?:\.[0-9]+)?)\s*%', text, re.IGNORECASE)
        if gst_match:
            gst_rate = parse_percent(gst_match)

    if gst_rate is None and not has_gst_tokens:
        gst_rate = 0

    if gst_rate is not None:
        data["gst_rate"] = gst_rate
        data["has_gst"] = gst_rate > 0
    else:
        data["has_gst"] = has_gst_tokens

    # Set description from vendor or filename
    if data["vendor"]:
        data["description"] = f"Invoice from {data['vendor']}"
    else:
        data["description"] = f"Scanned invoice: {filename}"

    # Calculate due date (30 days from invoice date if date is available)
    if data["date"]:
        try:
            from datetime import datetime, timedelta
            invoice_date = datetime.strptime(data["date"], "%Y-%m-%d")
            due_date = invoice_date + timedelta(days=30)
            data["due_date"] = due_date.strftime("%Y-%m-%d")
        except:
            pass

    return data

if __name__ == "__main__":
    print("🚀 Starting Invoice OCR Server...")
    print("📍 Server running at: http://localhost:7860")
    print("🎨 Theme: CreditFlow Pro Light")
    if not TESSERACT_AVAILABLE:
        print("⚠️  Tesseract OCR not detected - image/scanned PDF OCR will fail")
    print("⚠️  Note: vLLM backend not configured - returning demo data")
    uvicorn.run(app, host="0.0.0.0", port=7860)
