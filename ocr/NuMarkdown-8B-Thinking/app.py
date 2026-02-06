import gradio as gr
import requests
import base64
from PIL import Image
from io import BytesIO
from pathlib import Path
import fitz

print("=== DEBUG: Starting app.py ===")

# Get example images
import os
example_dir = os.path.join(os.environ.get('HOME', '/home/user'), 'app', 'example_images')
# example_dir = "example_images"  # Relative path since it's in the same directory
example_images = []
if os.path.exists(example_dir):
    for filename in os.listdir(example_dir):
        if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.bmp')):
            example_images.append(os.path.join(example_dir, filename))
    print(f"Found {len(example_images)} example images")

def encode_image_to_base64(image: Image.Image) -> str:
    buffered = BytesIO()
    image.save(buffered, format="JPEG")
    img_str = base64.b64encode(buffered.getvalue()).decode()
    return f"data:image/jpeg;base64,{img_str}"

def load_image_from_input(file_path, image):
    if image is not None:
        return image

    if not file_path:
        return None

    path = Path(file_path)
    if path.suffix.lower() == ".pdf":
        doc = fitz.open(file_path)
        if doc.page_count == 0:
            doc.close()
            return None
        page = doc.load_page(0)
        pix = page.get_pixmap(dpi=200)
        doc.close()
        return Image.open(BytesIO(pix.tobytes("png")))

    return Image.open(file_path)


def query_vllm_api(file_path, image, temperature, max_tokens=12_000):
    print(
        f"=== DEBUG: query_vllm_api called with file={bool(file_path)}, image={image is not None}, temp={temperature} ==="
    )

    image = load_image_from_input(file_path, image)
    if image is None:
        return "No file provided", "No file provided", "Please upload an invoice image or PDF first."

    try:
        messages = []
        # Optional: Resize image if needed (to avoid huge uploads)
        max_size = 2048
        if max(image.size) > max_size:
            ratio = max_size / max(image.size)
            new_size = tuple(int(dim * ratio) for dim in image.size)
            image = image.resize(new_size, Image.Resampling.LANCZOS)

        image_b64 = encode_image_to_base64(image)
        messages.append({
            "role": "user",
            "content": [
                {"type": "image_url", "image_url": {"url": image_b64}}
            ]
        })

        payload = {
            "model": "numind/NuMarkdown-8B-Thinking",
            "messages": messages,
            "max_tokens": max_tokens,
            "temperature": temperature
        }

        print("=== DEBUG: About to make vLLM API request ===")
        response = requests.post(
            "http://localhost:8000/v1/chat/completions",
            json=payload,
            timeout=60
        )
        response.raise_for_status()
        data = response.json()

        result = data["choices"][0]["message"]["content"]

        # Handle the thinking/answer parsing
        try:
            reasoning = result.split("<think>")[1].split("</think>")[0]
            answer = result.split("<answer>")[1].split("</answer>")[0]
        except IndexError:
            # If no thinking tags, return the full result
            reasoning = "No thinking trace found"
            answer = result

        return reasoning, answer, answer

    except requests.exceptions.RequestException as e:
        error_msg = f"API request failed: {e}"
        print(f"=== DEBUG: Request error: {error_msg} ===")
        return error_msg, error_msg, error_msg
    except Exception as e:
        error_msg = f"Unexpected error: {e}"
        print(f"=== DEBUG: Unexpected error: {error_msg} ===")
        return error_msg, error_msg, error_msg

print("=== DEBUG: Creating Gradio interface ===")


with gr.Blocks(title="CreditFlow Pro - Invoice OCR") as demo:
    gr.HTML("""
    <div style="text-align: left; padding: 20px 24px; background: #FFFFFF; border: 1px solid #E1E7F0; border-radius: 16px; margin-bottom: 16px;">
        <h1 style="color: #0B1220; margin: 0; font-size: 1.6em; font-weight: 700;">Invoice OCR</h1>
        <p style="color: #667085; margin: 6px 0 0; font-size: 0.98em;">Upload an invoice PDF or image to extract data.</p>
    </div>
    """)


    with gr.Row():
        with gr.Column(scale=2):
            temperature = gr.Slider(0.1, 1.2, value=0.4, step=0.1, label="Creativity")
            btn = gr.Button("Extract Invoice", variant="primary", size="lg")
            file_in = gr.File(
                label="Invoice PDF or Image",
                file_types=[".pdf", ".png", ".jpg", ".jpeg", ".webp"],
                type="filepath",
            )
            img_in = gr.Image(type="pil", label="Or paste an image")

        with gr.Column(scale=2):
            with gr.Accordion("🔍 Extraction Output", open=True):
                with gr.Tabs():
                    with gr.TabItem("🧠 Reasoning"):
                        thinking = gr.Textbox(
                            lines=15,
                            max_lines=25,
                            show_label=False,
                            placeholder="The model's reasoning process will appear here...",
                        )
                    with gr.TabItem("📝 Rendered Markdown"):
                        output = gr.Markdown(label="📝 Extracted Markdown")
                    with gr.TabItem("📄 Raw Output"):
                        raw_answer = gr.Textbox(
                            lines=15,
                            max_lines=25,
                            show_label=False,
                            placeholder="The raw model output will appear here...",
                        )

    btn.click(
        query_vllm_api,
        inputs=[file_in, img_in, temperature],
        outputs=[thinking, raw_answer, output],
    )

    # Add examples if we have any
    if example_images:
        gr.Examples(
            examples=example_images[:5],  # Limit to 5 examples
            inputs=img_in,
            label="📸 Try these example images"
        )

print("=== DEBUG: Gradio interface created ===")

if __name__ == "__main__":
    print("=== DEBUG: About to launch Gradio ===")
    demo.launch(
        server_name="0.0.0.0",
        server_port=7860,
        share=False,
        theme=gr.themes.Soft(primary_hue="blue", secondary_hue="violet"),
        css="""
    * {
        font-family: 'Inter', 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif !important;
    }
    body, .gradio-container {
        background: #F4F7FB;
        color: #0B1220;
    }
    .gradio-container .prose, .gradio-container label {
        color: #667085;
    }
    .gradio-container .block, .gradio-container .panel, .gradio-container .gr-box {
        background: #FFFFFF;
        border: 1px solid #E1E7F0;
        border-radius: 16px;
    }
    .gradio-container button.primary {
        background: linear-gradient(135deg, #1F5EFF 0%, #9B5CFF 100%);
        border: none;
    }
    .gradio-container button.primary:hover {
        filter: brightness(1.05);
    }
    .gradio-container button.secondary, .gradio-container button {
        border-radius: 12px;
    }
    .gradio-container input, .gradio-container textarea, .gradio-container select {
        background: #FFFFFF;
        color: #0B1220;
        border: 1px solid #D7DEE8;
        border-radius: 12px;
    }
    .gradio-container input:focus, .gradio-container textarea:focus, .gradio-container select:focus {
        outline: none;
        border-color: #5B8CFF;
        box-shadow: 0 0 0 2px rgba(91, 140, 255, 0.2);
    }
    .gradio-container .tabitem {
        border-color: #E1E7F0;
    }
    .gradio-container .tabitem.selected {
        color: #0B1220;
        border-color: #5B8CFF;
    }
    .gradio-container .tabitem, .gradio-container .tabitem.selected {
        border-radius: 10px 10px 0 0;
    }
    .gradio-container .gr-accordion {
        border-radius: 16px;
        border: 1px solid #E1E7F0;
        overflow: hidden;
    }
    .gradio-container .gr-accordion .label {
        color: #0B1220;
    }
    .gradio-container .gr-accordion .content {
        background: #F8FAFF;
    }
    .gradio-container .wrap .label {
        color: #A5B4FC;
        font-weight: 600;
    }
    .gradio-container .slider input[type="range"] {
        accent-color: #5B8CFF;
    }
    .gradio-container .gr-file, .gradio-container .gr-image {
        background: #FFFFFF;
        border: 1px dashed #D7DEE8;
        border-radius: 16px;
    }
    .gradio-container .gr-file:hover, .gradio-container .gr-image:hover {
        border-color: #5B8CFF;
    }
    .gradio-container .gr-markdown, .gradio-container .gr-textbox {
        background: #FFFFFF;
        border-radius: 14px;
        border: 1px solid #E1E7F0;
    }
    .gradio-container .gr-padded {
        padding: 16px;
    }
    .gradio-container a {
        color: #5B8CFF;
    }
    .gradio-container a:hover {
        color: #9B5CFF;
    }
"""
    )
    print("=== DEBUG: Gradio launched ===")
