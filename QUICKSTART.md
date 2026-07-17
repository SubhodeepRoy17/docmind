# DocMind Quick Start Guide

Get DocMind running in minutes!

## 1. Set Up Your API Key

Get your Anthropic API key from https://console.anthropic.com, then:

```bash
cp backend/.env.example backend/.env
# Edit backend/.env and add your ANTHROPIC_API_KEY
```

## 2. Run Locally (Development)

### Option A: Terminal Mode (Easiest)

**Terminal 1 - Start Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```

**Terminal 2 - Start Frontend:**
```bash
pnpm install  # First time only
pnpm dev
```

**Access the app:**
- Frontend: http://localhost:3000
- API Docs: http://localhost:8000/docs

### Option B: Docker (One Command)

```bash
docker-compose up --build
```

Then open http://localhost:3000

## 3. Use DocMind

1. **Upload Documents**
   - Click "Upload Document" in the sidebar
   - Select a PDF, TXT, or DOCX file
   - Wait for processing to complete

2. **Ask Questions**
   - Type your question in the chat box
   - Press Enter or click Send
   - Get answers with source citations

3. **Manage Documents**
   - View all uploaded documents in the sidebar
   - Click the trash icon to delete documents

## Common Issues

### Backend won't connect
- Make sure backend is running (`http://localhost:8000/docs` should work)
- Check `NEXT_PUBLIC_BACKEND_URL` in frontend (defaults to `http://localhost:8000`)

### Upload fails
- Verify file is PDF, TXT, or DOCX
- Check backend console for errors
- Ensure `backend/uploads` directory exists

### Questions not working
- Confirm documents are uploaded (check sidebar)
- Look for errors in browser console (F12)
- Check backend API docs for responses

### Python environment issues
- Delete `venv` folder and recreate
- Try: `python3 -m venv venv` instead of `python`
- On Windows, use `venv\Scripts\activate.bat`

## Next Steps

After getting the app running:

1. **Deploy to Vercel** (Frontend only)
   ```bash
   pnpm build
   git push origin main
   ```
   Connect your Vercel project and deploy

2. **Deploy Backend** to your own server or:
   - Railway.app
   - Render.com
   - AWS EC2/ECS
   - DigitalOcean
   - Heroku

3. **Update Environment Variable**
   - Set `NEXT_PUBLIC_BACKEND_URL` to your backend's public URL
   - Redeploy frontend

4. **Scale Improvements**
   - Add database (PostgreSQL)
   - Use proper vector store (Pinecone)
   - Add authentication
   - Move uploads to cloud storage

## Architecture Overview

```
┌─────────────────────────────────────────────┐
│         User Browser                         │
│  (Next.js Frontend - http://localhost:3000) │
└────────────────────┬────────────────────────┘
                     │
                     │ HTTP/API Calls
                     │
┌────────────────────▼────────────────────────┐
│      FastAPI Backend - http://localhost:8000│
│                                              │
│  • Document Processing (PDF/DOCX/TXT)      │
│  • Vector Store (In-Memory)                 │
│  • Claude Integration                       │
│  • RAG Engine                               │
└──────────────────────────────────────────────┘
```

## File Structure Quick Reference

```
Frontend:
  app/docmind/page.tsx           # Main page
  components/docmind/            # UI components
  hooks/use-chat.ts              # Chat logic
  hooks/use-documents.ts         # Document logic

Backend:
  backend/main.py                # FastAPI app
  backend/app/rag_engine.py      # RAG logic
  backend/app/vector_store.py    # Search
  backend/app/document_processor.py  # File handling
```

## API Examples

### Upload a Document
```bash
curl -X POST http://localhost:8000/upload \
  -F "file=@myfile.pdf"
```

### Ask a Question
```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"query": "What is this document about?"}'
```

### List Documents
```bash
curl http://localhost:8000/documents
```

## Need Help?

1. **Check the main README** for detailed docs
2. **Run backend with --reload** for auto-restart on code changes
3. **Check browser console** (F12) for frontend errors
4. **Check terminal output** for backend errors
5. **Review `docker-compose.yml`** to understand the setup

## Success! 🎉

You now have a working DocMind instance. Start uploading documents and asking questions!

For more details, see README.md
