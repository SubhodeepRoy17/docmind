# DocMind - Deployment Guide

Your code is ready to deploy! Here's how to get it live in minutes.

## GitHub Repository
✓ Repository is already created and all code is pushed to: https://github.com/SubhodeepRoy17/docmind

## Option 1: Deploy Backend on Render (Recommended - 5 mins)

Render offers a free tier and is the easiest way to deploy the FastAPI backend.

### Steps:
1. Go to https://render.com
2. Sign up and create a new account
3. Click "New +" → "Web Service"
4. Connect GitHub and select `SubhodeepRoy17/docmind`
5. Configure the service:
   - Name: `docmind-backend`
   - Environment: `Python 3.11`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT backend.main:app`
6. Add environment variable:
   - Key: `ANTHROPIC_API_KEY`
   - Value: Your Claude API key
7. Click "Create Web Service"
8. Get your backend URL from Render dashboard (looks like `https://docmind-backend.onrender.com`)

## Option 2: Deploy Frontend on Vercel (Recommended - 3 mins)

Vercel is perfect for Next.js apps.

### Steps:
1. Go to https://vercel.com
2. Click "New Project"
3. Import `SubhodeepRoy17/docmind` from GitHub
4. Set environment variables:
   - `NEXT_PUBLIC_BACKEND_URL`: Your Render backend URL (from Option 1, e.g., `https://docmind-backend.onrender.com`)
5. Click "Deploy"
6. Your frontend will be live at `https://docmind-*.vercel.app`

## Option 3: Deploy Both on Render (Advanced)

If you want everything on one platform:

1. Deploy backend first (Option 1 above)
2. Deploy frontend with backend URL (Option 2 above)
3. Both will be on the Render platform

## Environment Variables Needed

### Backend (.env or environment variables)
```
ANTHROPIC_API_KEY=sk-ant-api03-...
```

### Frontend (.env.local or Vercel project settings)
```
NEXT_PUBLIC_BACKEND_URL=https://your-railway-backend-url.railway.app
```

## Deploy With Docker (Self-Hosted)

If you want to deploy to your own server:

```bash
# Clone the repo
git clone https://github.com/SubhodeepRoy17/docmind.git
cd docmind

# Set environment variables
echo "ANTHROPIC_API_KEY=your-key" > backend/.env

# Build and run with Docker Compose
docker-compose up --build

# Access at http://localhost:3000
```

## Testing After Deployment

1. Visit your frontend URL
2. Click "Start using DocMind"
3. Upload a PDF or document
4. Ask a question about the document
5. Verify you get an AI-powered response with source citations

## Troubleshooting

### Backend not responding
- Check Render logs for errors: go to your service dashboard and click "Logs"
- Verify ANTHROPIC_API_KEY is set in Render environment variables
- Ensure backend URL is correct in frontend (NEXT_PUBLIC_BACKEND_URL)
- Note: Free tier on Render may spin down after 15 minutes of inactivity, causing first request to be slow

### Upload fails with "Failed to fetch"
- Check NEXT_PUBLIC_BACKEND_URL is set correctly
- Verify backend is running (check Railway dashboard)
- Check browser console for CORS errors

### Documents not processing
- Check backend logs for Python errors
- Verify pypdf installation (check Railway build logs)
- Try uploading a simpler PDF file

## What's Deployed

**Backend (FastAPI):**
- `/upload` - Upload documents
- `/chat` - Send queries
- `/documents` - List uploaded documents
- `/health` - Health check
- `/docs` - Swagger API documentation

**Frontend (Next.js):**
- `/` - Landing page
- `/docmind` - Main application interface

## Next Steps After Deployment

1. Share your live app URL with users
2. Monitor Railway and Vercel dashboards
3. Set up custom domain (optional)
4. Enable authentication (future enhancement)
5. Add persistent storage (database + vector store)

## Support

For issues, check:
- Render logs: https://render.com/dashboard (select your service and view Logs tab)
- Vercel logs: https://vercel.com/dashboard
- GitHub issues: https://github.com/SubhodeepRoy17/docmind/issues

## Important Notes

**Render Free Tier:**
- Services spin down after 15 minutes of inactivity
- First request after spin-down may take 30-60 seconds
- For production, upgrade to paid tier or use paid plan on other platforms

**Pricing:**
- Render Backend: Free tier available
- Vercel Frontend: Free tier available
- Total cost to get started: $0
