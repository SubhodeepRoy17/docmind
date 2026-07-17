# DocMind - Intelligent Document Q&A

DocMind is a Retrieval-Augmented Generation (RAG) application that allows you to upload documents and ask questions about their content. Built with Next.js, FastAPI, and Claude.

## Features

- **Document Upload**: Support for PDF, TXT, and DOCX files
- **Intelligent Q&A**: Ask questions about your documents using natural language
- **Source Citations**: Every answer includes citations from your documents
- **Conversation History**: Maintains context across multiple questions
- **Clean UI**: Modern, responsive interface built with React and Tailwind CSS

## Architecture

### Frontend
- **Framework**: Next.js 16 with React 19
- **Styling**: Tailwind CSS with custom sage green theme
- **State Management**: React hooks with SWR for data fetching
- **API Communication**: Axios for HTTP requests

### Backend
- **Framework**: FastAPI with Python 3.11
- **LLM**: Claude 3.5 Sonnet via Anthropic API
- **Vector Store**: Simple in-memory implementation (scalable to Pinecone, Weaviate, etc.)
- **Document Processing**: PDF/DOCX extraction with text chunking

## Prerequisites

- **Node.js** 18+ (for frontend)
- **Python** 3.11+ (for backend)
- **Docker & Docker Compose** (optional, for containerized deployment)
- **Anthropic API Key** (get one at https://console.anthropic.com)

## Local Development Setup

### 1. Clone and Install Dependencies

```bash
# Install frontend dependencies
pnpm install

# Create Python virtual environment
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cd ..
```

### 2. Configure Environment Variables

```bash
# Copy and update frontend environment
cp .env.local.example .env.local
# Update NEXT_PUBLIC_BACKEND_URL if needed (default: http://localhost:8000)

# Copy and update backend environment
cp backend/.env.example backend/.env
# Add your ANTHROPIC_API_KEY
```

### 3. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Backend will be available at `http://localhost:8000`
API docs available at `http://localhost:8000/docs`

**Terminal 2 - Frontend:**
```bash
pnpm dev
```

Frontend will be available at `http://localhost:3000`

## Production Deployment

### Quick Deploy (8 minutes)

**Option 1: Render Backend + Vercel Frontend (Recommended - Free to Start)**
1. Deploy backend on Render: See [RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md)
2. Deploy frontend on Vercel: See [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md)

**Option 2: Docker Compose**
```bash
docker-compose up --build
# Access at http://localhost:3000
```

For detailed deployment instructions, see [DEPLOY_NOW.md](DEPLOY_NOW.md) and [DEPLOYMENT.md](DEPLOYMENT.md)


## Docker Deployment

### Build and Run with Docker Compose

```bash
# Build images
docker-compose build

# Run services
docker-compose up
```

The application will be available at:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000`
- API Docs: `http://localhost:8000/docs`

### Environment Variables for Docker

Set `ANTHROPIC_API_KEY` before running:

```bash
export ANTHROPIC_API_KEY="your-api-key-here"
docker-compose up
```

Or add to a `.env` file:
```
ANTHROPIC_API_KEY=your-api-key-here
```

## API Endpoints

### Backend FastAPI Endpoints

- **POST /upload** - Upload a document
  - Request: multipart/form-data with `file` field
  - Response: `{ filename, size, upload_time, document_id }`

- **POST /chat** - Send a query
  - Request: `{ query: string, session_id?: string }`
  - Response: `{ response: string, sources: [...], session_id: string }`

- **GET /documents** - List all documents
  - Response: `{ documents: [...] }`

- **DELETE /documents/{document_id}** - Delete a document

- **GET /health** - Health check

## Project Structure

```
.
├── app/                          # Next.js app directory
│   ├── docmind/                  # DocMind pages
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page
│   └── globals.css               # Global styles
├── components/
│   └── docmind/                  # DocMind components
│       ├── chat-interface.tsx
│       ├── document-list.tsx
│       ├── document-uploader.tsx
│       └── message.tsx
├── hooks/                        # Custom React hooks
│   ├── use-chat.ts
│   └── use-documents.ts
├── backend/                      # FastAPI backend
│   ├── app/
│   │   ├── document_processor.py
│   │   ├── rag_engine.py
│   │   └── vector_store.py
│   ├── main.py                   # FastAPI app
│   ├── requirements.txt
│   ├── Dockerfile
│   └── uploads/                  # Uploaded documents
├── docker-compose.yml            # Docker Compose config
├── Dockerfile                    # Frontend Docker config
└── README.md                     # This file
```

## Features & Implementation

### RAG (Retrieval-Augmented Generation)
1. Documents are uploaded and processed (text extraction)
2. Text is split into chunks for efficient retrieval
3. Chunks are stored in a vector store with simple keyword matching
4. For production, integrate with Pinecone, Weaviate, or similar
5. On each query:
   - Retrieved relevant document chunks
   - Build context from top-k matches
   - Send to Claude with conversation history
   - Return response with source citations

### Document Processing
- **PDF**: Extracted using pypdf library
- **TXT**: Read directly
- **DOCX**: Basic extraction via zipfile (for production, use python-docx)
- All text saved separately for quick retrieval

### Vector Store
- Current: Simple in-memory BM25-like scoring
- Production options:
  - Pinecone (semantic search)
  - Weaviate (open-source)
  - Supabase pgvector (PostgreSQL)
  - Chroma (embedded)

## Scaling & Production Improvements

1. **Database**: Add PostgreSQL for document storage and metadata
2. **Vector Embeddings**: Use OpenAI/Claude embeddings + Pinecone
3. **Authentication**: Add user accounts with Auth.js or Supabase Auth
4. **Storage**: Move uploads to Vercel Blob or S3
5. **Caching**: Add Redis for session management
6. **Monitoring**: Integrate with Sentry for error tracking
7. **Rate Limiting**: Add rate limiting for API endpoints
8. **Search Ranking**: Implement semantic search with embeddings

## Troubleshooting

### Backend Connection Issues
- Ensure backend is running on `http://localhost:8000`
- Check `NEXT_PUBLIC_BACKEND_URL` in `.env.local`
- Frontend network tab should show successful requests to `/api/*`

### CORS Errors
- Backend has CORS middleware configured for `*` origins
- For production, update `allow_origins` in `main.py`

### Upload Failures
- Check file size (adjust if needed)
- Verify file format (PDF, TXT, DOCX only)
- Ensure `/backend/uploads` directory exists and is writable

### Memory Issues
- Vector store is in-memory; for large document sets, use external vector DB
- Consider implementing document pagination/filtering

## API Key Management

- Get your Anthropic API key at: https://console.anthropic.com
- Never commit `.env` files with real keys
- Use environment variables in production
- Rotate keys regularly

## Contributing

To improve DocMind:
1. Implement semantic search with embeddings
2. Add authentication
3. Improve document processing (images, tables)
4. Add real-time streaming responses
5. Implement user profiles and document sharing

## License

This project is open source and available for educational and commercial use.

## Support

For issues or questions:
- Check API docs at `http://localhost:8000/docs`
- Review logs in terminal windows
- Verify environment variables are set correctly
