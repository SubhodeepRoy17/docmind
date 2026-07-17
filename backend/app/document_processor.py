"""
Document Processor - Handles file uploads and text extraction
"""

import os
import uuid
from pathlib import Path
from typing import Optional
import json

from fastapi import UploadFile
import aiofiles
import pypdf

class DocumentProcessor:
    def __init__(self, uploads_dir: Path):
        """Initialize document processor"""
        self.uploads_dir = uploads_dir
        self.uploads_dir.mkdir(exist_ok=True)
        self.metadata_file = self.uploads_dir / "metadata.json"
        self.metadata = self._load_metadata()
    
    async def save_upload(self, file: UploadFile) -> Path:
        """Save uploaded file to disk"""
        document_id = str(uuid.uuid4())
        file_path = self.uploads_dir / f"{document_id}_{file.filename}"
        
        # Save file
        async with aiofiles.open(file_path, 'wb') as f:
            content = await file.read()
            await f.write(content)
        
        return file_path
    
    async def process_document(self, file_path: Path) -> str:
        """
        Process document and extract text
        Supports: PDF, TXT, DOCX (basic)
        """
        document_id = file_path.stem.split('_')[0]
        
        # Extract text based on file type
        file_ext = file_path.suffix.lower()
        
        if file_ext == '.pdf':
            text = await self._extract_pdf_text(file_path)
        elif file_ext == '.txt':
            text = await self._read_text_file(file_path)
        elif file_ext == '.docx':
            text = await self._extract_docx_text(file_path)
        else:
            text = ""
        
        # Save extracted text
        text_file = file_path.with_suffix('.txt')
        async with aiofiles.open(text_file, 'w', encoding='utf-8') as f:
            await f.write(text)
        
        # Update metadata
        self.metadata[document_id] = {
            "id": document_id,
            "filename": file_path.name,
            "original_filename": file_path.name.split('_', 1)[1],
            "file_path": str(file_path),
            "text_path": str(text_file),
            "file_type": file_ext,
            "text_length": len(text),
            "chunks": self._chunk_text(text)
        }
        self._save_metadata()
        
        return document_id
    
    async def _extract_pdf_text(self, file_path: Path) -> str:
        """Extract text from PDF file"""
        try:
            with open(file_path, 'rb') as f:
                reader = pypdf.PdfReader(f)
                text = ""
                for page in reader.pages:
                    text += page.extract_text() + "\n"
            return text
        except Exception as e:
            raise Exception(f"Failed to extract PDF text: {str(e)}")
    
    async def _read_text_file(self, file_path: Path) -> str:
        """Read plain text file"""
        try:
            async with aiofiles.open(file_path, 'r', encoding='utf-8') as f:
                return await f.read()
        except Exception as e:
            raise Exception(f"Failed to read text file: {str(e)}")
    
    async def _extract_docx_text(self, file_path: Path) -> str:
        """Extract text from DOCX file (basic implementation)"""
        try:
            # Note: Full DOCX support requires python-docx library
            # This is a simplified version
            import zipfile
            import xml.etree.ElementTree as ET
            
            text = ""
            with zipfile.ZipFile(file_path, 'r') as zip_ref:
                with zip_ref.open('word/document.xml') as xml_file:
                    root = ET.fromstring(xml_file.read())
                    for elem in root.iter():
                        if elem.text:
                            text += elem.text
            return text
        except Exception as e:
            raise Exception(f"Failed to extract DOCX text: {str(e)}")
    
    def _chunk_text(self, text: str, chunk_size: int = 1000, overlap: int = 200) -> list:
        """Split text into overlapping chunks for RAG retrieval"""
        chunks = []
        start = 0
        
        while start < len(text):
            end = min(start + chunk_size, len(text))
            chunk = text[start:end]
            chunks.append({
                "text": chunk,
                "start": start,
                "end": end
            })
            start = end - overlap
        
        return chunks
    
    async def list_documents(self) -> list:
        """List all uploaded documents"""
        return list(self.metadata.values())
    
    async def delete_document(self, document_id: str):
        """Delete a document"""
        if document_id in self.metadata:
            doc_info = self.metadata[document_id]
            
            # Delete files
            file_path = Path(doc_info["file_path"])
            text_path = Path(doc_info["text_path"])
            
            if file_path.exists():
                file_path.unlink()
            if text_path.exists():
                text_path.unlink()
            
            # Remove from metadata
            del self.metadata[document_id]
            self._save_metadata()
    
    def _load_metadata(self) -> dict:
        """Load metadata from file"""
        if self.metadata_file.exists():
            with open(self.metadata_file, 'r') as f:
                return json.load(f)
        return {}
    
    def _save_metadata(self):
        """Save metadata to file"""
        with open(self.metadata_file, 'w') as f:
            json.dump(self.metadata, f, indent=2)
