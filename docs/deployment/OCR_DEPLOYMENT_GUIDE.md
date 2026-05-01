# Deploy OCR Service to Hugging Face Spaces

## Why Hugging Face Spaces?
- ✅ FREE for public spaces
- ✅ Built for AI/ML models  
- ✅ Easy deployment
- ✅ Automatic HTTPS
- ✅ Global CDN

## Steps to Deploy:

### 1. Create Hugging Face Account
Go to: https://huggingface.co/join

### 2. Create New Space
1. Go to: https://huggingface.co/spaces
2. Click **"Create new Space"**
3. Name: `b2b-invoice-ocr`
4. License: Apache 2.0
5. SDK: **Docker**
6. Click **"Create Space"**

### 3. Upload Files to Space

Upload these files from `e:\B2B\ocr\NuMarkdown-8B-Thinking\`:
- `Dockerfile`
- `requirements.txt`
- `simple_server.py`
- `app.py`
- `README.md`

### 4. Update Dockerfile

Make sure Dockerfile exposes port 7860:
```dockerfile
EXPOSE 7860
CMD ["python", "simple_server.py"]
```

### 5. Wait for Build

Hugging Face will automatically build and deploy. Takes 5-10 minutes.

### 6. Get Your OCR URL

Your service will be at:
```
https://your-username-b2b-invoice-ocr.hf.space
```

### 7. Update Frontend Environment

Add to `.env`:
```
VITE_OCR_URL=https://your-username-b2b-invoice-ocr.hf.space
```

Update `netlify.toml`:
```toml
[build.environment]
  VITE_API_URL = "https://b2b-backend-qht2.onrender.com/api"
  VITE_OCR_URL = "https://your-username-b2b-invoice-ocr.hf.space"
  NODE_VERSION = "20"
```

### 8. Update OcrModal Component

File: `src/pages/create-invoice/components/OcrModal.jsx`

Change line 6 from:
```jsx
const activeUrl = useMemo(() => ocrUrl || 'http://localhost:7860', [ocrUrl])
```

To:
```jsx
const activeUrl = useMemo(() => ocrUrl || import.meta.env.VITE_OCR_URL || 'http://localhost:7860', [ocrUrl])
```

### 9. Redeploy Frontend

```bash
git add .
git commit -m "Add OCR service URL configuration"
git push
```

---

## Alternative: Render Deployment (Paid)

OCR requires significant resources. On Render:
- **Free plan**: Won't work (spins down, needs GPU)
- **Starter plan**: $7/month minimum

---

## For NOW: Make OCR Optional

Until you deploy, update the component to show a helpful message when OCR is unavailable.

Which option do you want to pursue?
1. Deploy to Hugging Face (Free, I'll guide you)
2. Keep it local-only for now
3. Skip OCR feature entirely
