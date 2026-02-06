import gradio as gr

# Simple test without vLLM dependencies
css = """
body, .gradio-container {
    background: #F4F7FB !important;
    font-family: 'Inter', system-ui, -apple-system, sans-serif !important;
}
.contain, .wrap, .tabitem {
    background: #FFFFFF !important;
    border: 1px solid #E1E7F0 !important;
    border-radius: 8px !important;
}
button {
    background: #1F5EFF !important;
    color: white !important;
    border: none !important;
    border-radius: 6px !important;
    padding: 8px 16px !important;
    font-weight: 500 !important;
}
button:hover {
    background: #1850E5 !important;
}
.prose p, .prose h1, .prose h2 {
    color: #0B1220 !important;
}
"""

with gr.Blocks(css=css, theme=gr.themes.Soft(primary_hue="blue", secondary_hue="violet")) as demo:
    gr.HTML("""
    <div style="background: #FFFFFF; padding: 24px; border-radius: 8px; border: 1px solid #E1E7F0; margin-bottom: 20px;">
        <h1 style="color: #0B1220; font-size: 28px; font-weight: 700; margin-bottom: 8px;">Invoice OCR</h1>
        <p style="color: #667085; font-size: 14px;">Upload an image or PDF of an invoice to extract information</p>
    </div>
    """)

    with gr.Tab("Upload File"):
        file_input = gr.File(label="Upload Image or PDF", file_types=[".png", ".jpg", ".jpeg", ".pdf"])
        extract_btn = gr.Button("Extract Invoice Data", variant="primary")
        output = gr.Textbox(label="Extracted Data", lines=10, placeholder="Extracted invoice data will appear here...")

if __name__ == "__main__":
    print("=== Starting Simple Gradio Test ===")
    demo.launch(
        server_name="0.0.0.0",
        server_port=7860,
        share=False
    )
