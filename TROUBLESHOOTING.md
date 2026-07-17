# DocMind Troubleshooting Guide

## "Failed to Fetch" Error During Upload

This error typically means the frontend cannot connect to the backend API. Here are the solutions:

### 1. Backend Server Not Running

**Problem:** You see "Failed to fetch" when trying to upload documents.

**Solution:**
```bash
# Terminal 1: Start the backend
cd backend
python -m uvicorn main:app --reload --port 8000
```

You should see output like:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete
```

**Check:** Visit http://localhost:8000/health - you should see `{"status":"healthy","version":"1.0.0"}`

### 2. Wrong Backend URL

**Problem:** Backend is running but frontend still shows "Failed to fetch"

**Solution:** Make sure `.env.development.local` has the correct backend URL:
```
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

If it doesn't, add it:
```bash
echo "NEXT_PUBLIC_BACKEND_URL=http://localhost:8000" >> .env.development.local
```

Then restart the frontend with `pnpm dev`

### 3. CORS Issues

**Problem:** Network tab shows CORS errors

**Solution:** This is already fixed in the backend - it has CORS enabled for all origins. But if you're still seeing this:

Check backend logs for CORS errors. The main.py has CORS middleware configured:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 4. Missing Dependencies

**Problem:** Backend crashes with import errors

**Solution:**
```bash
cd backend
pip install -r requirements.txt
# or if using venv:
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 5. Missing Environment Variables

**Problem:** Backend starts but crashes on upload

**Solution:** Make sure `backend/.env` has ANTHROPIC_API_KEY:
```
ANTHROPIC_API_KEY=sk-ant-api03-...your-key...
```

Get your API key from: https://console.anthropic.com

### 6. Port Already in Use

**Problem:** "Address already in use" error

**Solution:**
```bash
# Find what's using port 8000
lsof -i :8000

# Kill the process
kill -9 <PID>

# Or use a different port
python -m uvicorn main:app --reload --port 8001
# Then update .env.development.local to use 8001
```

### 7. Frontend Not Seeing Backend URL

**Problem:** NEXT_PUBLIC_BACKEND_URL seems correct but not working

**Solution:** The frontend needs to be restarted after changing environment variables:
```bash
# Kill the dev server (Ctrl+C)
# Then restart
pnpm dev
```

Check browser console (F12 → Console tab) to verify the URL:
```javascript
console.log(process.env.NEXT_PUBLIC_BACKEND_URL)
```

### 8. File Upload Issues

**Problem:** Upload works but file is rejected

**Solution:** Make sure file types are supported:
- ✓ PDF (.pdf)
- ✓ Text (.txt)
- ✓ Word (.docx)

Other formats will be rejected by the frontend.

### 9. Backend Processing Errors

**Problem:** File uploads but gets "processing error"

**Solution:** Check backend logs for detailed error messages. Common causes:
- PDF is corrupted or not readable
- File is too large
- Missing pypdf library

Install dependencies:
```bash
pip install -r backend/requirements.txt
```

### 10. Network/Firewall Issues

**Problem:** Backend and frontend running but still "Failed to fetch"

**Solution:** 
- Check if firewall is blocking port 8000
- Try accessing http://localhost:8000/health directly in browser
- If using Docker/VM, make sure ports are properly forwarded

## Quick Diagnostic Checklist

Run through this checklist:

1. ✓ Backend running: `curl http://localhost:8000/health`
2. ✓ Frontend running: `curl http://localhost:3000`
3. ✓ `.env.development.local` has `NEXT_PUBLIC_BACKEND_URL=http://localhost:8000`
4. ✓ `backend/.env` has `ANTHROPIC_API_KEY`
5. ✓ No port conflicts
6. ✓ Dependencies installed: `pip list | grep -E "(fastapi|uvicorn|anthropic)"`
7. ✓ Network connectivity: No firewall blocking
8. ✓ Frontend restarted after env changes

## Getting Help

If you're still stuck:

1. Check browser console (F12) for specific error messages
2. Check backend terminal for error logs (look for red/ERROR lines)
3. Run: `python -m py_compile backend/*.py backend/app/*.py` to check syntax
4. Verify dependencies: `pip list` should include fastapi, uvicorn, anthropic, etc.

## Common Error Messages

### "Failed to fetch"
→ Backend not running or URL wrong

### "CORS error"
→ Backend CORS not configured (already fixed in code)

### "413 Payload Too Large"
→ File upload size too large (increase in backend/main.py)

### "ModuleNotFoundError: No module named 'anthropic'"
→ Run `pip install -r backend/requirements.txt`

### "No such file or directory: uploads"
→ Backend will create this automatically, but check file permissions

### "ANTHROPIC_API_KEY environment variable not set"
→ Add to backend/.env: `ANTHROPIC_API_KEY=your-key-here`
