"""
DocMind RAG Application - FastAPI Backend
Main application file with document upload and chat endpoints
"""

import os
import json
from pathlib import Path
from typing import Optional
from datetime import datetime

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
from dotenv import load_dotenv

from .app.rag_engine import RAGEngine
from .app.document_processor import DocumentProcessor

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="DocMind RAG API",
    description="Retrieval-Augmented Generation API for document Q&A",
    version="1.0.0"
)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize components
uploads_dir = Path("uploads")
uploads_dir.mkdir(exist_ok=True)

rag_engine = RAGEngine()
doc_processor = DocumentProcessor(uploads_dir)

# Pydantic models
class ChatRequest(BaseModel):
    query: str
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    sources: list[dict]
    session_id: str

class UploadResponse(BaseModel):
    filename: str
    size: int
    upload_time: str
    document_id: str

class HealthResponse(BaseModel):
    status: str
    version: str

# Routes

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "version": "1.0.0"
    }

@app.post("/upload", response_model=UploadResponse)
async def upload_document(file: UploadFile = File(...)):
    """
    Upload a document (PDF, TXT, DOCX) for processing.
    Processes the document and stores it for RAG retrieval.
    """
    try:
        # Validate file type
        allowed_extensions = {'.pdf', '.txt', '.docx'}
        file_ext = Path(file.filename).suffix.lower()
        
        if file_ext not in allowed_extensions:
            raise HTTPException(
                status_code=400,
                detail=f"File type not supported. Allowed: {', '.join(allowed_extensions)}"
            )
        
        # Save uploaded file
        file_path = await doc_processor.save_upload(file)
        
        # Process document
        document_id = await doc_processor.process_document(file_path)
        
        # Add to RAG engine
        try:
            await rag_engine.add_document(document_id, file_path)
        except Exception as rag_error:
            print(f"[v0] Warning: RAG indexing failed: {rag_error}")
            # Continue anyway, user can still chat
        
        # Get file info
        file_size = file_path.stat().st_size
        
        return {
            "filename": file.filename,
            "size": file_size,
            "upload_time": datetime.now().isoformat(),
            "document_id": document_id
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"[v0] Upload error: {e}")
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Send a query and get a response based on uploaded documents.
    Uses Claude with RAG to provide accurate, sourced answers.
    """
    try:
        if not request.query.strip():
            raise HTTPException(status_code=400, detail="Query cannot be empty")
        
        # Get response from RAG engine
        response, sources = await rag_engine.query(request.query, request.session_id)
        
        # Generate session ID if not provided
        session_id = request.session_id or f"session_{datetime.now().timestamp()}"
        
        return {
            "response": response,
            "sources": sources,
            "session_id": session_id
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"[v0] Chat error: {e}")
        raise HTTPException(status_code=500, detail=f"Chat failed: {str(e)}")

@app.get("/documents")
async def list_documents():
    """List all uploaded documents"""
    try:
        documents = await doc_processor.list_documents()
        return {"documents": documents}
    except Exception as e:
        print(f"[v0] List documents error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to list documents: {str(e)}")

@app.delete("/documents/{document_id}")
async def delete_document(document_id: str):
    """Delete a document from the system"""
    try:
        await doc_processor.delete_document(document_id)
        try:
            await rag_engine.remove_document(document_id)
        except:
            pass  # Continue even if RAG removal fails
        return {"status": "deleted", "document_id": document_id}
    except Exception as e:
        print(f"[v0] Delete document error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to delete document: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        reload=True
    )
