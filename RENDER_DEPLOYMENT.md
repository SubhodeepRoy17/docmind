# Deploy DocMind Backend on Render

Quick guide to deploy the FastAPI backend on Render.com (completely free to start).

## Prerequisites

- GitHub account (with access to SubhodeepRoy17/docmind)
- Anthropic API key (get free at https://console.anthropic.com)
- Render account (sign up at https://render.com)

## Step-by-Step Deployment

### Step 1: Sign Up on Render

1. Go to https://render.com
2. Click "Sign up"
3. Sign in with GitHub (recommended)
4. Click "Authorize render-oss"

### Step 2: Create Web Service

1. Click the "+" button or "New" → "Web Service"
2. In the "Connect a Repository" section, search for `docmind`
3. Click "Connect" on the `SubhodeepRoy17/docmind` repository
4. If not visible, click "Connect account" to link your GitHub

### Step 3: Configure the Service

Fill in the service configuration:

| Field | Value |
|-------|-------|
| **Name** | `docmind-backend` |
| **Environment** | `Python 3.11` |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `gunicorn -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT backend.main:app` |
| **Plan** | `Free` (you can upgrade later) |

### Step 4: Add Environment Variables

Scroll down to "Environment" section:

1. Click "Add Environment Variable"
2. Set:
   - **Key**: `ANTHROPIC_API_KEY`
   - **Value**: Your Claude API key (from https://console.anthropic.com)

### Step 5: Deploy

1. Click "Create Web Service"
2. Render will start building your backend
3. Watch the build logs to confirm everything works
4. Once deployed, you'll see "Your service is live" message

### Step 6: Get Your Backend URL

1. On your service dashboard, look for the URL field
2. It will look like: `https://docmind-backend.onrender.com`
3. Copy this URL - you'll need it for the frontend deployment

## Important Notes

### Free Tier Limitations

- Service spins down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds
- Perfect for development and testing
- For production, upgrade to Starter plan ($7/month)

### Build Command Explanation

```bash
pip install -r requirements.txt
```

This installs all Python dependencies from the requirements.txt file.

### Start Command Explanation

```bash
gunicorn -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT backend.main:app
```

- `gunicorn` - Production WSGI server
- `-w 4` - Run 4 worker processes
- `-k uvicorn.workers.UvicornWorker` - Use Uvicorn workers for async FastAPI
- `--bind 0.0.0.0:$PORT` - Listen on all interfaces on Render's assigned port
- `backend.main:app` - Import the FastAPI app from backend/main.py

## Troubleshooting

### Build Fails

1. Check the build logs for errors
2. Ensure all Python dependencies in `requirements.txt` are compatible
3. Verify `ANTHROPIC_API_KEY` is set correctly

### Service is Stuck in Spinning

1. Click "Cancel Build"
2. Make a small commit to GitHub
3. Render will automatically redeploy

### Backend URL Not Working

1. Wait 1-2 minutes after deployment
2. Try visiting: `https://your-backend-url.onrender.com/health`
3. Check the Render logs for runtime errors

### Upload Fails with "Failed to Fetch"

1. Verify backend URL is correct
2. Check CORS is enabled (it should be by default)
3. Ensure frontend has correct `NEXT_PUBLIC_BACKEND_URL`

## Next Steps

1. ✓ Backend is deployed on Render
2. → Deploy frontend on Vercel (see DEPLOY_NOW.md)
3. → Set frontend's `NEXT_PUBLIC_BACKEND_URL` to your Render backend URL

## Monitoring Your Service

1. Go to your Render dashboard
2. Click on "docmind-backend"
3. Check "Logs" tab for errors
4. Monitor resource usage in "Metrics" tab

## Upgrading to Paid Plan

For production use:
1. Click "Settings" on your service
2. Click "Upgrade Plan"
3. Choose "Starter" ($7/month) or higher
4. Your service will run continuously without spinning down

## Getting Help

- Render docs: https://render.com/docs
- Backend logs: Check the "Logs" tab in your Render dashboard
- Backend API docs: Visit `https://your-backend-url.onrender.com/docs`
