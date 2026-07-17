"""
Vector Store - Handles document retrieval using simple text matching
For production, replace with proper vector embeddings (Pinecone, Weaviate, etc.)
"""

import json
from typing import Optional
from datetime import datetime

class VectorStore:
    def __init__(self):
        """Initialize vector store"""
        self.documents = {}  # document_id -> document data
        self.chunks = []     # all chunks for searching
    
    async def add_document(self, document_id: str, text: str):
        """Add document to store"""
        # Split into chunks
        chunks = self._split_into_chunks(text, chunk_size=500)
        
        # Store document
        self.documents[document_id] = {
            "id": document_id,
            "text": text,
            "chunks": chunks,
            "created_at": datetime.now().isoformat()
        }
        
        # Add chunks to searchable list
        for i, chunk in enumerate(chunks):
            self.chunks.append({
                "document_id": document_id,
                "chunk_index": i,
                "text": chunk,
                "length": len(chunk)
            })
    
    async def remove_document(self, document_id: str):
        """Remove document from store"""
        if document_id in self.documents:
            del self.documents[document_id]
            self.chunks = [c for c in self.chunks if c["document_id"] != document_id]
    
    async def retrieve(self, query: str, top_k: int = 5) -> list:
        """
        Retrieve most relevant document chunks for a query
        Uses simple keyword matching - in production, use semantic search
        """
        # Simple BM25-like scoring based on term frequency
        query_terms = query.lower().split()
        
        scored_chunks = []
        for chunk in self.chunks:
            score = 0
            chunk_text = chunk["text"].lower()
            
            # Calculate relevance score
            for term in query_terms:
                if len(term) > 2:  # Skip short words
                    score += chunk_text.count(term)
            
            if score > 0:
                scored_chunks.append({
                    **chunk,
                    "score": score,
                    "excerpt": chunk["text"][:200] + "..."
                })
        
        # Sort by score and return top_k
        scored_chunks.sort(key=lambda x: x["score"], reverse=True)
        return scored_chunks[:top_k]
    
    def _split_into_chunks(self, text: str, chunk_size: int = 500, overlap: int = 100) -> list:
        """Split text into overlapping chunks"""
        chunks = []
        start = 0
        
        while start < len(text):
            end = min(start + chunk_size, len(text))
            chunk = text[start:end].strip()
            
            if chunk:
                chunks.append(chunk)
            
            start = end - overlap
            if start >= len(text) - chunk_size:
                break
        
        return chunks
    
    async def search(self, query: str, top_k: int = 5) -> list:
        """Search for relevant documents"""
        return await self.retrieve(query, top_k)
