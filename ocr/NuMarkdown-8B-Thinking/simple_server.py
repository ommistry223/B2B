from fastapi import FastAPI, File, UploadFile
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import re
import io
import os
import shutil
import numpy as np
from pathlib import Path

try:
    import easyocr
    EASYOCR_AVAILABLE = True
    # Initialize EasyOCR reader (will be lazy-loaded)
    _easyocr_reader = None
    def get_easyocr_reader():
        global _easyocr_reader
        if _easyocr_reader is None:
            print("Loading EasyOCR model (this may take a minute)...")
            _easyocr_reader = easyocr.Reader(['en'], gpu=False, verbose=False)
            print("EasyOCR model loaded!")
        return _easyocr_reader
except ImportError:
    EASYOCR_AVAILABLE = False
    def get_easyocr_reader():
        return None

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

TESSERACT_CONFIG = os.environ.get("TESSERACT_CONFIG", "--oem 3 --psm 6 -c tessedit_char_whitelist=0123456789.,₹RsINROabcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ")


def preprocess_image(image: "Image.Image") -> "Image.Image":
    """Advanced image preprocessing for better OCR accuracy"""
    if not PIL_AVAILABLE:
        return image

    # Convert to grayscale
    img = image.convert("L")
    
    # Apply autocontrast to improve text visibility
    img = ImageOps.autocontrast(img)
    
    # Upscale small images significantly to improve OCR accuracy (min 2000px)
    max_side = max(img.size)
    if max_side < 2000:
        scale = 2000 / max_side
        new_size = (int(img.size[0] * scale), int(img.size[1] * scale))
        img = img.resize(new_size, Image.Resampling.LANCZOS)
    
    # Apply multiple passes of sharpening for better text clarity
    for _ in range(2):
        img = img.filter(ImageFilter.SHARPEN)
    
    # Apply denoising for better clarity
    img = img.filter(ImageFilter.MedianFilter(size=3))
    
    # Increase contrast more aggressively for numbers
    from PIL import ImageEnhance
    enhancer = ImageEnhance.Contrast(img)
    img = enhancer.enhance(1.4)
    
    return img


def extract_text_with_easyocr(image: "Image.Image") -> tuple:
    """
    Extract text with confidence scores using EasyOCR
    Returns: (full_text, words_list, avg_confidence)
    """
    if not EASYOCR_AVAILABLE:
        return "", [], 0
    
    try:
        reader = get_easyocr_reader()
        if reader is None:
            return "", [], 0
        
        # Convert PIL image to numpy array for EasyOCR
        img_array = np.array(image)
        
        # Run EasyOCR
        results = reader.readtext(img_array)
        
        # Build full text and word-level data
        full_text = ""
        words_data = []
        
        for (bbox, text, confidence) in results:
            full_text += text + " "
            # Each word gets its position and confidence
            words_data.append({
                'text': text,
                'confidence': confidence,
                'bbox': bbox
            })
        
        avg_confidence = sum(w['confidence'] for w in words_data) / len(words_data) if words_data else 0
        
        return full_text.strip(), words_data, avg_confidence
        
    except Exception as e:
        print(f"EasyOCR Error: {e}")
        return "", [], 0


def parse_number(text: str):
    """Parse number from text with OCR error correction"""
    if not text:
        return None
    
    cleaned = text.strip()
    
    # Handle common OCR misreads
    if cleaned:
        result = []
        for i, char in enumerate(cleaned):
            if char.upper() == 'O':
                prev_is_digit = i > 0 and cleaned[i-1].isdigit()
                next_is_digit = i < len(cleaned) - 1 and cleaned[i+1].isdigit()
                if prev_is_digit or next_is_digit:
                    result.append('0')
                else:
                    result.append(char)
            else:
                result.append(char)
        cleaned = ''.join(result)
    
    # Extract number
    match = re.findall(r'[0-9]{1,3}(?:[, ]?[0-9]{3})*(?:\.\d{1,2})?', cleaned)
    if not match:
        return None
    value = match[-1].replace(',', '').replace(' ', '')
    try:
        return float(value)
    except ValueError:
        return None


def parse_quantity(text: str):
    """Parse quantity from text"""
    if not text:
        return None
    
    cleaned = text.strip()
    
    # Clean OCR artifacts
    if cleaned:
        result = []
        for i, char in enumerate(cleaned):
            if char.upper() == 'O' and i == 0:
                result.append('0')
            elif char.upper() == 'L' and i == 0:
                result.append('1')
            else:
                result.append(char)
        cleaned = ''.join(result)
    
    match = re.findall(r'[0-9]+(?:\.\d+)?', cleaned)
    if not match:
        return None
    try:
        return float(match[0])
    except ValueError:
        return None


def extract_items_from_image(image: "Image.Image", preprocessed: bool = False):
    """Extract line items using EasyOCR with intelligent layout detection"""
    if not (EASYOCR_AVAILABLE and PIL_AVAILABLE):
        return []

    try:
        reader = get_easyocr_reader()
        if reader is None:
            return []
        
        # Preprocess image
        img = image if preprocessed else preprocess_image(image)
        img_array = np.array(img)
        
        # Get detailed OCR results with bounding boxes
        results = reader.readtext(img_array, detail=1)
        
        if not results:
            return []
        
        # Organize OCR results by position (lines)
        lines_map = {}
        for bbox, text, confidence in results:
            if not text.strip():
                continue
            
            # Calculate vertical position (top of bounding box)
            top = min(point[1] for point in bbox)
            
            # Group into lines (similar y-position)
            line_key = int(top / 20)  # Group within 20px
            
            if line_key not in lines_map:
                lines_map[line_key] = {'texts': [], 'confidences': [], 'tops': []}
            
            lines_map[line_key]['texts'].append((text, confidence))
            lines_map[line_key]['confidences'].append(confidence)
            lines_map[line_key]['tops'].append(top)
        
        # Sort lines by position
        sorted_lines = sorted(lines_map.items(), key=lambda x: x[0])
        
        # Find header row (look for "item", "amount", "qty", etc.)
        header_line_idx = None
        columns = {}
        
        for idx, (line_key, data) in enumerate(sorted_lines):
            line_text = " ".join(t[0] for t in data['texts']).lower()
            
            if "item" in line_text and "amount" in line_text:
                header_line_idx = idx
                
                # Map column positions
                for text, conf in data['texts']:
                    text_lower = text.lower()
                    if text_lower in ["item", "items", "name", "description"]:
                        columns["item"] = data['tops'][data['texts'].index((text, conf))]
                    elif text_lower in ["qty", "quantity"]:
                        columns["quantity"] = data['tops'][data['texts'].index((text, conf))]
                    elif text_lower in ["price", "rate", "unit"]:
                        columns["price"] = data['tops'][data['texts'].index((text, conf))]
                    elif text_lower in ["amount", "amt", "total"]:
                        columns["amount"] = data['tops'][data['texts'].index((text, conf))]
                break
        
        if header_line_idx is None:
            return []
        
        # Extract items from subsequent lines
        items = []
        sorted_columns = sorted(columns.items(), key=lambda x: x[1])
        
        for line_key, data in sorted_lines[header_line_idx + 1:]:
            line_text = " ".join(t[0] for t in data['texts'])
            
            if not line_text.strip() or "total" in line_text.lower():
                continue
            
            # Assign each text to a column based on position
            col_buckets = {name: [] for name, _ in sorted_columns}
            
            for text, conf in data['texts']:
                text_top = data['tops'][data['texts'].index((text, conf))]
                
                # Find closest column
                closest_col = sorted_columns[0][0]
                for col_name, col_top in sorted_columns:
                    if abs(text_top - col_top) < abs(text_top - columns.get(closest_col, 9999)):
                        closest_col = col_name
                
                col_buckets[closest_col].append(text)
            
            # Parse the row data
            item_text = " ".join(col_buckets.get("item", []))
            qty_text = " ".join(col_buckets.get("quantity", []))
            price_text = " ".join(col_buckets.get("price", []))
            amount_text = " ".join(col_buckets.get("amount", []))
            
            # Extract numbers
            quantity = parse_quantity(qty_text)
            rate = parse_number(price_text)
            amount = parse_number(amount_text)
            
            # Clean description
            tokens = item_text.split()
            if tokens and tokens[0].isdigit():
                tokens = tokens[1:]
            description = " ".join(tokens).strip()
            
            if not description:
                description = item_text
            
            # Apply same logic as before for calculations
            if quantity is None:
                quantity = 1
            
            if amount is not None and quantity is not None:
                gst_multiplier = 1.18
                net_amount = amount / gst_multiplier
                calculated_rate = net_amount / quantity
                
                if rate is not None and calculated_rate > 0:
                    ratio = rate / calculated_rate
                    if ratio < 0.5 or ratio > 2:
                        rate = calculated_rate
                elif rate is None:
                    rate = calculated_rate
            
            if rate is None and amount is not None and quantity:
                rate = amount / quantity
            
            if amount is None and rate is not None and quantity:
                amount = rate * quantity * 1.18
            
            items.append({
                "index": str(len(items) + 1),
                "description": description,
                "quantity": quantity,
                "rate": rate,
                "amount": amount
            })
        
        return items
        
    except Exception as e:
        print(f"Error extracting items with EasyOCR: {e}")
        return []

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
    Uses EasyOCR for advanced deep learning-based text extraction.
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
        ocr_confidence = 0

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

        # OCR for PDFs with no embedded text using EasyOCR
        if is_pdf and PYMUPDF_AVAILABLE and PIL_AVAILABLE and EASYOCR_AVAILABLE:
            try:
                pdf_document = fitz.open(stream=content, filetype="pdf")
                ocr_text_needed = not extracted_text.strip() or len(extracted_text.strip()) < 50
                
                for page_num in range(len(pdf_document)):
                    page = pdf_document[page_num]
                    pix = page.get_pixmap(dpi=300)
                    img = Image.open(io.BytesIO(pix.tobytes("png")))
                    img = preprocess_image(img)
                    
                    if ocr_text_needed:
                        text, words, conf = extract_text_with_easyocr(img)
                        extracted_text += text
                        if conf > 0:
                            ocr_confidence = max(ocr_confidence, conf)
                    
                    # Extract items from first page
                    if page_num == 0 and not items_from_image:
                        items_from_image = extract_items_from_image(img, preprocessed=True)
                        
                pdf_document.close()
            except Exception as e:
                print(f"Error OCRing PDF with EasyOCR: {e}")

        # OCR for images using EasyOCR
        if is_image and PIL_AVAILABLE and EASYOCR_AVAILABLE:
            try:
                img = Image.open(io.BytesIO(content))
                img = preprocess_image(img)
                
                # Extract text with EasyOCR
                extracted_text, words_data, ocr_confidence = extract_text_with_easyocr(img)
                
                # Extract line items
                items_from_image = extract_items_from_image(img, preprocessed=True)
            except Exception as e:
                print(f"Error OCRing image with EasyOCR: {e}")

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
            note = "EasyOCR is not available. Please install easyocr: pip install easyocr"
            if not PYMUPDF_AVAILABLE and is_pdf:
                note = "PyMuPDF is not installed, so PDF text could not be extracted."
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
            "note": "Powered by EasyOCR (Deep Learning)",
            "extracted_data": invoice_data,
            "parser_version": "v7-easyocr",
            "ocr_confidence": round(ocr_confidence * 100, 1) if ocr_confidence > 0 else None
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
        # Clean the line first - remove common OCR artifacts
        cleaned = re.sub(r'\(\s*\d+(\.\d+)?\s*%\s*\)', '', line)
        cleaned = cleaned.replace('₹', ' ').replace('Rs.', ' ').replace('INR', ' ')
        
        # Remove common OCR noise characters
        cleaned = re.sub(r'[|\\/{}[\]<>]', '', cleaned)
        
        cleaned = re.sub(r'\s+', ' ', cleaned).strip()
        
        # Item must start with a number (index)
        if not re.match(r'^\d+\s+', cleaned):
            return None

        tokens = cleaned.split()
        item_index = tokens[0]
        tokens = tokens[1:]

        # Find unit token
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

        # Determine where item name ends (before numbers start)
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
        # Remove common OCR noise tokens
        name_tokens = [t for t in name_tokens if not re.fullmatch(r'[A-Z0-9]{4,}', t)]
        
        # Clean up item description - remove extra punctuation
        item_name = " ".join(name_tokens).strip()
        item_name = re.sub(r'[^a-zA-Z0-9\s\-_]', '', item_name)  # Keep only alphanumeric, spaces, hyphens, underscores
        item_name = re.sub(r'\s+', ' ', item_name).strip()
        # Remove leading dashes, bullets, or special characters
        item_name = re.sub(r'^[\-•·]+', '', item_name).strip()
        # Remove leading single characters that are likely OCR errors
        item_name = re.sub(r'^[a-zA-Z]\s+', '', item_name).strip()
        
        if not item_name:
            item_name = f"Item {item_index}"

        # Validate and correct qty - ensure positive and reasonable
        if qty is None and numeric_tokens:
            qty = numeric_tokens[0]
        if qty is None or qty <= 0:
            qty = 1

        # Validate amount - should be reasonable (not too large for invoice items)
        if amount is not None and amount > 1000000:
            amount = None  # Likely OCR error
        
        # Validate rate
        if rate is not None and rate > 100000:
            rate = None  # Likely OCR error

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
