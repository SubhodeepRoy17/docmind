# DocMind Deployment Guide

Complete guide for deploying DocMind to production.

## Overview

DocMind consists of two main components:
- **Frontend**: Next.js application (can be deployed to Vercel, Netlify, etc.)
- **Backend**: FastAPI application (needs Python hosting)

## Frontend Deployment (Vercel - Recommended)

### 1. Build Verification
```bash
pnpm build
pnpm start
# Test at http://localhost:3000
```

### 2. Deploy to Vercel

**Option A: GitHub Integration (Recommended)**
```bash
git push origin main
# Vercel will auto-deploy on push
```

**Option B: Vercel CLI**
```bash
pnpm add -g vercel
vercel login
vercel
```

### 3. Configure Environment Variables

In Vercel Dashboard → Settings → Environment Variables:

```
NEXT_PUBLIC_BACKEND_URL=https://your-backend-domain.com
```

## Backend Deployment Options

### Option 1: Render.com (Recommended - Free Tier Available)

1. **Create Web Service**
   - Go to https://render.com
   - Click "New +" → "Web Service"
   - Connect your GitHub repo `SubhodeepRoy17/docmind`

2. **Configure Service**
   - Name: `docmind-backend`
   - Runtime: `Python 3.11`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT backend.main:app`

3. **Set Environment Variables**
   - `ANTHROPIC_API_KEY`: Your Anthropic API key

4. **Deploy**
   - Click "Create Web Service"
   - Render auto-deploys on git push
   - Copy the public URL (e.g., `https://docmind-backend.onrender.com`)
   - Note: Free tier services spin down after 15 minutes of inactivity

### Option 2: Railway.app

1. **Create Web Service**
   - Go to https://railway.app
   - Click "New Project"
   - Connect your GitHub repo `SubhodeepRoy17/docmind`

2. **Configure Service**
   - Service: Web Service
   - Root Directory: `backend`
   - Runtime: Python 3.11

3. **Set Environment Variables**
   - `ANTHROPIC_API_KEY`: Your key
   - `PORT`: 8000

4. **Deploy**
   - Railway auto-deploys on git push
   - Get URL from Railway dashboard
   - Note: Railway free trial has limitations

### Option 3: AWS EC2 or DigitalOcean

1. **Create Virtual Machine**
   - OS: Ubuntu 22.04 LTS
   - Type: t3.small or similar
   - Security: Allow ports 80, 443, 8000

2. **Install Prerequisites**
   ```bash
   sudo apt update && sudo apt upgrade -y
   sudo apt install -y python3.11 python3.11-venv python3.11-dev
   sudo apt install -y nodejs npm
   ```

3. **Clone Repository**
   ```bash
   git clone https://github.com/yourname/docmind.git
   cd docmind/backend
   ```

4. **Setup Backend**
   ```bash
   python3.11 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   export ANTHROPIC_API_KEY="your-key"
   uvicorn main:app --host 0.0.0.0 --port 8000
   ```

5. **Setup Reverse Proxy (Nginx)**
   ```bash
   sudo apt install -y nginx
   
   # Create config at /etc/nginx/sites-available/docmind
   sudo tee /etc/nginx/sites-available/docmind > /dev/null <<EOF
   server {
       listen 80;
       server_name your-backend-domain.com;

       location / {
           proxy_pass http://localhost:8000;
           proxy_set_header Host \$host;
           proxy_set_header X-Real-IP \$remote_addr;
           proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto \$scheme;
       }
   }
   EOF
   
   sudo ln -s /etc/nginx/sites-available/docmind /etc/nginx/sites-enabled/
   sudo systemctl restart nginx
   ```

6. **Setup SSL (Let's Encrypt)**
   ```bash
   sudo apt install -y certbot python3-certbot-nginx
   sudo certbot --nginx -d your-backend-domain.com
   ```

### Option 4: Docker with Cloud Run (Google Cloud)

1. **Build Docker Image**
   ```bash
   docker build -t docmind-backend ./backend
   docker tag docmind-backend gcr.io/your-project/docmind-backend
   ```

2. **Push to Google Container Registry**
   ```bash
   docker push gcr.io/your-project/docmind-backend
   ```

3. **Deploy to Cloud Run**
   ```bash
   gcloud run deploy docmind-backend \
     --image gcr.io/your-project/docmind-backend \
     --platform managed \
     --region us-central1 \
     --set-env-vars ANTHROPIC_API_KEY=your-key
   ```

## Database Setup (Optional but Recommended)

For production, add a database:

### Supabase (PostgreSQL)

1. Create Supabase project at supabase.com
2. Get connection string
3. Update `backend/app/database.py`:

```python
import psycopg2
from psycopg2.pool import SimpleConnectionPool

# Connection pool for document metadata
pool = SimpleConnectionPool(1, 20, database_url)

async def save_document_metadata(doc_id, filename, text_length):
    conn = pool.getconn()
    try:
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO documents (id, filename, text_length, created_at) VALUES (%s, %s, %s, NOW())",
            (doc_id, filename, text_length)
        )
        conn.commit()
    finally:
        pool.putconn(conn)
```

## Vector Store Setup (Recommended for Scaling)

For better search quality with many documents:

### Pinecone

1. **Sign up** at pinecone.io
2. **Create index** (dimension: 1536 for OpenAI embeddings)
3. **Update backend**:

```python
# backend/requirements.txt
pinecone-client==3.0.0
openai==1.0.0

# backend/app/vector_store.py
import pinecone
from openai import OpenAI

client = OpenAI()
pinecone.init(api_key=os.getenv("PINECONE_API_KEY"))
index = pinecone.Index("docmind-index")

async def add_document(doc_id: str, text: str):
    # Get embeddings
    response = client.embeddings.create(
        input=text,
        model="text-embedding-3-small"
    )
    embedding = response.data[0].embedding
    
    # Store in Pinecone
    index.upsert([(doc_id, embedding)])
```

## Monitoring & Logging

### Error Tracking (Sentry)

```python
import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration

sentry_sdk.init(
    dsn=os.getenv("SENTRY_DSN"),
    integrations=[FastApiIntegration()],
    traces_sample_rate=1.0
)
```

### Logging

```python
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.post("/upload")
async def upload_document(file: UploadFile):
    logger.info(f"Uploading file: {file.filename}")
    try:
        # ... upload logic
    except Exception as e:
        logger.error(f"Upload failed: {str(e)}", exc_info=True)
        raise
```

## Performance Optimization

### 1. CDN for Frontend
- Vercel includes CDN by default
- Configure caching headers in `next.config.js`

### 2. Backend Caching
```python
from functools import lru_cache

@lru_cache(maxsize=100)
async def get_cached_documents():
    # Cache document list
    pass
```

### 3. Database Indexing
```sql
CREATE INDEX idx_documents_created_at ON documents(created_at);
CREATE INDEX idx_documents_user_id ON documents(user_id);
CREATE FULLTEXT INDEX idx_documents_text ON documents(text);
```

## Security Checklist

- [ ] Set `ANTHROPIC_API_KEY` in environment variables (never in code)
- [ ] Enable HTTPS/SSL certificate
- [ ] Configure CORS to specific origins (not `*`)
- [ ] Add rate limiting to API endpoints
- [ ] Validate file uploads (size, type)
- [ ] Use environment variables for all secrets
- [ ] Enable database encryption
- [ ] Regular security updates
- [ ] Monitor for unusual API usage
- [ ] Add authentication for document access

## Cost Estimation

**Typical Production Setup:**
- Frontend (Vercel): $0-20/month
- Backend (Railway/Render): $7-50/month
- Database (Supabase free tier): $0-50/month
- Vector Store (Pinecone starter): $0-100/month
- API costs (Anthropic): ~$10-100/month per 1M tokens

## Troubleshooting Deployment

### Backend connection timeout
- Check backend is running and accessible
- Verify firewall rules allow traffic
- Check Vercel environment variables

### Database connection errors
- Verify connection string
- Check IP whitelist on database service
- Test connection locally first

### Out of memory errors
- Reduce batch size for document processing
- Implement pagination for large results
- Use streaming for long responses

### High API costs
- Implement caching layer
- Optimize prompt engineering
- Use cheaper models where possible

## Post-Deployment

1. **Test the full flow**
   - Upload a document
   - Ask a question
   - Verify sources appear

2. **Set up monitoring**
   - Error tracking (Sentry)
   - Analytics (Vercel Web Analytics)
   - Logs (CloudWatch, Datadog, etc.)

3. **Document setup**
   - Save API URLs
   - Document environment variables
   - Create runbook for common issues

4. **Plan maintenance**
   - Regular updates
   - Security patches
   - Database backups
   - Cost monitoring

## Helpful Links

- Vercel Deployment: https://vercel.com/docs/concepts/deployments/overview
- Railway.app: https://railway.app/
- Render: https://render.com/
- Supabase: https://supabase.com/
- Pinecone: https://www.pinecone.io/
- Anthropic API: https://docs.anthropic.com/

---

Need help? Check README.md or QUICKSTART.md for more details.
