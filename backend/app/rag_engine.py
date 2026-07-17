"""
RAG Engine - Handles document retrieval and Claude integration
"""

import os
from pathlib import Path
from typing import Optional
import json

from anthropic import Anthropic
from app.vector_store import VectorStore

class RAGEngine:
    def __init__(self):
        """Initialize RAG engine with Anthropic client"""
        api_key = os.getenv("ANTHROPIC_API_KEY")
        if not api_key:
            raise ValueError("ANTHROPIC_API_KEY environment variable not set")
        
        self.client = Anthropic()
        self.vector_store = VectorStore()
        self.conversation_history = {}
        
    async def add_document(self, document_id: str, file_path: Path):
        """Add a document to the vector store for retrieval"""
        try:
            # Extract text from document (processed by DocumentProcessor)
            text_content = self._load_document_text(file_path)
            
            # Add to vector store
            await self.vector_store.add_document(document_id, text_content)
            
        except Exception as e:
            print(f"[v0] Failed to add document to RAG: {str(e)}")
            raise Exception(f"Failed to add document to RAG: {str(e)}")
    
    async def remove_document(self, document_id: str):
        """Remove a document from the vector store"""
        await self.vector_store.remove_document(document_id)
    
    async def query(self, query: str, session_id: Optional[str] = None) -> tuple[str, list]:
        """
        Query the RAG system and get response from Claude
        Returns: (response_text, sources)
        """
        try:
            # Retrieve relevant documents
            retrieved_docs = await self.vector_store.retrieve(query, top_k=5)
            
            # Build context from retrieved documents
            context = self._build_context(retrieved_docs)
            
            # Initialize conversation history for session if needed
            if session_id and session_id not in self.conversation_history:
                self.conversation_history[session_id] = []
            
            history = self.conversation_history.get(session_id, [])
            
            # Build messages with context
            messages = self._build_messages(query, context, history)
            
            # Get response from Claude
            response = self.client.messages.create(
                model="claude-3-5-sonnet-20241022",
                max_tokens=1024,
                system="""You are DocMind, an intelligent document assistant. 
                You answer questions based on the provided document context.
                Always cite which document or section you're referring to.
                If the answer is not in the documents, say so clearly.""",
                messages=messages
            )
            
            response_text = response.content[0].text
            
            # Store in conversation history
            if session_id:
                self.conversation_history[session_id].append({
                    "role": "user",
                    "content": query
                })
                self.conversation_history[session_id].append({
                    "role": "assistant",
                    "content": response_text
                })
            
            # Format sources
            sources = [
                {
                    "document_id": doc.get("document_id"),
                    "filename": doc.get("filename"),
                    "excerpt": doc.get("excerpt", ""),
                    "relevance_score": doc.get("score")
                }
                for doc in retrieved_docs
            ]
            
            return response_text, sources
            
        except Exception as e:
            raise Exception(f"Query failed: {str(e)}")
    
    def _build_context(self, retrieved_docs: list) -> str:
        """Build context string from retrieved documents"""
        if not retrieved_docs:
            return "No relevant documents found."
        
        context_parts = []
        for doc in retrieved_docs:
            context_parts.append(
                f"Document: {doc.get('filename', 'Unknown')}\n"
                f"Content: {doc.get('excerpt', '')}\n"
            )
        
        return "\n---\n".join(context_parts)
    
    def _build_messages(self, query: str, context: str, history: list) -> list:
        """Build message list with conversation history"""
        messages = list(history)  # Include history
        
        # Add current query with context
        messages.append({
            "role": "user",
            "content": f"""Based on the following document context, please answer this question:

DOCUMENT CONTEXT:
{context}

QUESTION:
{query}"""
        })
        
        return messages
    
    def _load_document_text(self, file_path: Path) -> str:
        """Load text content from a processed document"""
        text_file = file_path.with_suffix('.txt')
        if text_file.exists():
            try:
                return text_file.read_text(encoding='utf-8')
            except Exception as e:
                print(f"[v0] Error reading text file: {e}")
                return ""
        return ""
