# Deploy DocMind Frontend on Vercel

Quick guide to deploy the Next.js frontend on Vercel (completely free).

## Prerequisites

- Backend already deployed on Render (see RENDER_DEPLOYMENT.md)
- Backend URL (e.g., https://docmind-backend.onrender.com)
- GitHub account
- Vercel account (sign up at https://vercel.com)

## Step-by-Step Deployment

### Step 1: Sign Up on Vercel

1. Go to https://vercel.com
2. Click "Sign up"
3. Choose "Continue with GitHub"
4. Authorize Vercel

### Step 2: Import Project

1. Click "Add New" → "Project"
2. Click "Import Git Repository"
3. Search for `docmind`
4. Click "Import" on `SubhodeepRoy17/docmind`

### Step 3: Configure Project

The configuration should auto-populate:

| Field | Value |
|-------|-------|
| **Framework** | Next.js |
| **Root Directory** | `.` (root) |
| **Build Command** | `pnpm build` |
| **Output Directory** | `.next` |

### Step 4: Add Environment Variables

1. Scroll down to "Environment Variables"
2. Click "Add New"
3. Set:
   - **Name**: `NEXT_PUBLIC_BACKEND_URL`
   - **Value**: Your Render backend URL (e.g., `https://docmind-backend.onrender.com`)
4. Select environments: Production, Preview, Development
5. Click "Add"

### Step 5: Deploy

1. Click "Deploy"
2. Vercel will build and deploy your frontend
3. Wait for the green checkmark
4. Click the URL to visit your live app!

## Your Frontend URL

After deployment, Vercel will give you a URL like:
```
https://docmind-abc123.vercel.app
```

This is your live DocMind application!

## Verifying Your Deployment

1. Visit your frontend URL
2. Click "Start using DocMind"
3. Upload a test document
4. Ask a question
5. Verify you get a response with citations

## Important Notes

### Environment Variable is Public

`NEXT_PUBLIC_BACKEND_URL` is intentionally public - it's sent to the browser. This is normal.

### Auto-Deployment

1. Every push to `main` branch will auto-deploy
2. Pull requests will create preview deployments
3. Great for testing before merging

### Custom Domain (Optional)

1. Go to your Vercel dashboard
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Follow DNS setup instructions

## Troubleshooting

### Build Fails

1. Check build logs: Click "Deployments" → latest → "Build Logs"
2. Common issues:
   - Missing environment variable
   - Node version mismatch
   - Dependencies not installed

### App Shows Blank Page

1. Check browser console for errors (F12)
2. Verify `NEXT_PUBLIC_BACKEND_URL` is set correctly
3. Ensure backend is running (test at `/health` endpoint)

### Upload Fails with "Failed to Fetch"

1. Verify backend URL is correct in environment variables
2. Make sure backend is responding: `https://your-backend.onrender.com/health`
3. Check if backend has spun down (first request can be slow)

### Slow Performance

1. Render free tier backend spins down after 15 minutes
2. First request to backend takes 30-60 seconds
3. Upgrade to paid plan for continuous performance

## Environment Variables in Production

To change your backend URL in production:

1. Go to Vercel dashboard
2. Click on your project
3. Go to "Settings" → "Environment Variables"
4. Update `NEXT_PUBLIC_BACKEND_URL`
5. Redeploy or wait for next push

## Using Preview Deployments

1. Create a pull request on GitHub
2. Vercel automatically creates a preview URL
3. Test changes before merging to main
4. URLs look like: `https://docmind-pr-123.vercel.app`

## Performance Tips

- Use Render's paid plan to avoid backend spin-downs
- Monitor Core Web Vitals in Vercel Analytics
- Optimize image uploads in the frontend
- Consider caching strategies for documents

## Getting Help

- Vercel docs: https://vercel.com/docs
- Vercel support: https://vercel.com/help
- Frontend logs: Check browser console (F12)
- Vercel analytics: Dashboard → "Analytics" tab

## Next Steps

1. ✓ Frontend is deployed on Vercel
2. ✓ Backend is deployed on Render
3. → Share your frontend URL with users
4. → Monitor both dashboards for issues
5. → Upgrade plans as needed for production
