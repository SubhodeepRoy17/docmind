# DocMind - Deployment Guide

Your code is ready to deploy! Here's how to get it live in minutes.

## GitHub Repository
✓ Repository is already created and all code is pushed to: https://github.com/SubhodeepRoy17/docmind

## Option 1: Deploy Backend on Railway (Recommended - 5 mins)

Railway is the easiest way to deploy the FastAPI backend.

### Steps:
1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub"
4. Connect your GitHub and select `SubhodeepRoy17/docmind`
5. Railway will automatically detect the `railway.json` configuration
6. Set environment variables:
   - `ANTHROPIC_API_KEY`: Your Claude API key
7. Click "Deploy"
8. Get your backend URL from the Railway dashboard (looks like `https://docmind-prod.railway.app`)

## Option 2: Deploy Frontend on Vercel (Recommended - 3 mins)

Vercel is perfect for Next.js apps.

### Steps:
1. Go to https://vercel.com
2. Click "New Project"
3. Import `SubhodeepRoy17/docmind` from GitHub
4. Set environment variables:
   - `NEXT_PUBLIC_BACKEND_URL`: Your Railway backend URL (from Option 1)
5. Click "Deploy"
6. Your frontend will be live at `https://docmind-*.vercel.app`

## Option 3: Deploy Both on Railway (Advanced)

If you want everything on one platform:

1. Create two separate Railway projects
2. One for backend (using `backend/` directory)
3. One for frontend (using root directory with Next.js)

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
- Check Railway logs for errors
- Verify ANTHROPIC_API_KEY is set
- Ensure backend URL is correct in frontend

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
- Railway logs: https://railway.app/dashboard
- Vercel logs: https://vercel.com/dashboard
- GitHub issues: https://github.com/SubhodeepRoy17/docmind/issues
