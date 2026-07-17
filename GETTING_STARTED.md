# Getting Started with DocMind

Welcome to DocMind! This guide will help you get up and running in the fastest way possible.

## Prerequisites

- Node.js 18+ (for frontend)
- Python 3.11+ (for backend)
- Anthropic API Key (get one free at https://console.anthropic.com)

## 5-Minute Quick Start

### Step 1: Get Your API Key
1. Go to https://console.anthropic.com
2. Sign up or log in
3. Create a new API key
4. Copy it (you'll need it in Step 3)

### Step 2: Prepare Environment Files

**In the root directory, create `.env.local`:**
```bash
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

**In the `backend` directory, create `.env`:**
```bash
ANTHROPIC_API_KEY=your_api_key_from_step_1
```

### Step 3: Start Backend (Terminal 1)

```bash
cd backend

# Create virtual environment (first time only)
python -m venv venv
source venv/bin/activate    # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the server
python -m uvicorn main:app --reload --port 8000
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### Step 4: Start Frontend (Terminal 2)

```bash
# Install dependencies (first time only)
pnpm install

# Start development server
pnpm dev
```

You should see:
```
▲ Next.js 16.x
  Local: http://localhost:3000
```

### Step 5: Open in Browser

Go to http://localhost:3000

That's it! You now have DocMind running locally.

## Testing It Out

1. **Upload a Document**
   - Click "Upload Document" button
   - Select or drag a PDF, TXT, or Word document
   - Wait for processing to complete

2. **Ask a Question**
   - Type a question in the chat box
   - Press Enter or click Send
   - See the AI response with source citations

3. **Upload Another Document**
   - The app will remember all documents
   - You can ask questions about any of them

## Troubleshooting

### Python Module Not Found
```bash
cd backend
pip install -r requirements.txt
```

### Port 8000 Already in Use
```bash
# Use a different port
python -m uvicorn main:app --reload --port 8001
# Then update .env.local: NEXT_PUBLIC_BACKEND_URL=http://localhost:8001
```

### Port 3000 Already in Use
```bash
# Start on different port
pnpm dev -- -p 3001
```

### ANTHROPIC_API_KEY Error
- Make sure `backend/.env` has your actual API key
- Don't use quotes around the key
- Restart backend after adding the key

### Backend Connection Error
- Check backend is running (should see "Uvicorn running..." message)
- Verify `NEXT_PUBLIC_BACKEND_URL` matches backend port
- Try http://localhost:8000/docs in browser

### Upload Fails
- Check file type (PDF, TXT, or DOCX only)
- Try a smaller file first
- Check backend console for error details

## Next Steps After Getting Started

1. **Explore the Code**
   - Frontend components in `components/docmind/`
   - Backend routes in `backend/main.py`
   - Hooks in `hooks/`

2. **Try Docker**
   ```bash
   docker-compose up --build
   ```

3. **Read Full Documentation**
   - `README.md` - Complete guide
   - `QUICKSTART.md` - More quick start options
   - `DEPLOYMENT.md` - Deploy to production
   - `BUILD_SUMMARY.md` - What was built

4. **Customize**
   - Change colors in `app/globals.css`
   - Modify prompts in `backend/app/rag_engine.py`
   - Add features to components

5. **Deploy**
   - Frontend to Vercel
   - Backend to Railway, Render, or your server
   - See `DEPLOYMENT.md` for detailed instructions

## Project Structure (Quick Reference)

```
Frontend (Next.js):
  app/docmind/page.tsx           - Main page
  components/docmind/            - UI components
  hooks/use-chat.ts              - Chat logic
  hooks/use-documents.ts         - Document logic
  
Backend (FastAPI):
  backend/main.py                - API routes
  backend/app/rag_engine.py      - AI logic
  backend/app/vector_store.py    - Search
  backend/app/document_processor.py - File handling
```

## Key Commands

```bash
# Frontend development
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm start            # Run production build
pnpm lint             # Check code

# Backend development
python -m uvicorn main:app --reload    # Dev with auto-reload
python -m uvicorn main:app             # Production run

# Docker
docker-compose up                      # Start everything
docker-compose down                    # Stop everything
docker-compose build                   # Rebuild images

# Environment
source venv/bin/activate              # Activate Python virtual env
deactivate                            # Deactivate Python virtual env
```

## API Endpoints (For Testing)

```bash
# Upload a file
curl -X POST http://localhost:8000/upload \
  -F "file=@myfile.pdf"

# Ask a question
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"query": "What is this document about?"}'

# List documents
curl http://localhost:8000/documents

# View API docs
# Open: http://localhost:8000/docs
```

## Common Questions

**Q: Do I need to restart anything after uploading a document?**
A: No, the app updates automatically.

**Q: Can I use the app while backend is building?**
A: No, the backend needs to be running. Frontend will show "Backend unavailable" message.

**Q: Where are uploaded documents stored?**
A: Locally in `backend/uploads/` directory (development) or cloud storage (production).

**Q: Can multiple people use it at the same time?**
A: In development, yes. In production, you'd add authentication to control access.

**Q: How do I change the theme colors?**
A: Edit `app/globals.css` and change the color values. The app uses CSS custom properties.

**Q: Is there a mobile version?**
A: Yes! The design is responsive and works on mobile, tablet, and desktop.

## Performance Tips

- Use smaller documents for faster processing
- Ask specific questions for better answers
- Use conversation context - ask follow-up questions
- Close other browser tabs to free up memory

## Need More Help?

1. **How do I deploy this?** → See `DEPLOYMENT.md`
2. **How do I modify the AI behavior?** → Edit `backend/app/rag_engine.py`
3. **How do I add authentication?** → See `DEPLOYMENT.md` "Scaling" section
4. **How do I use this with my database?** → See `DEPLOYMENT.md` database section
5. **Something isn't working** → Check terminal/console logs first

## Summary

You now have a working AI document Q&A system! 

- Docs are stored locally while developing
- API talks to Claude for intelligent answers
- Conversation history is maintained
- Sources are cited automatically

Start uploading documents and asking questions!

---

**Quick Links:**
- Full docs: `README.md`
- Quick start: `QUICKSTART.md`
- Deployment: `DEPLOYMENT.md`
- What was built: `BUILD_SUMMARY.md`
- Anthropic API: https://docs.anthropic.com/

Happy building! 🚀
