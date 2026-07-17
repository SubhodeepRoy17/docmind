'use client'

import { useState, useRef } from 'react'
import { Upload } from 'lucide-react'

interface DocumentUploaderProps {
  onUpload: (file: File) => Promise<void>
  isLoading?: boolean
}

export default function DocumentUploader({ onUpload, isLoading = false }: DocumentUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      await handleFile(files[0])
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files
    if (files && files.length > 0) {
      await handleFile(files[0])
    }
  }

  const handleFile = async (file: File) => {
    const validTypes = ['application/pdf', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    
    if (!validTypes.includes(file.type)) {
      alert('Please upload a PDF, TXT, or DOCX file')
      return
    }

    setUploadProgress(0)
    try {
      await onUpload(file)
      setUploadProgress(100)
      setTimeout(() => setUploadProgress(0), 1000)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error) {
      alert('Failed to upload file: ' + (error instanceof Error ? error.message : 'Unknown error'))
      setUploadProgress(0)
    }
  }

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileSelect}
        accept=".pdf,.txt,.docx"
        className="hidden"
        disabled={isLoading}
      />
      
      <button
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        disabled={isLoading}
        className={`w-full rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
          isDragging 
            ? 'border-primary bg-primary/5' 
            : 'border-border hover:border-primary hover:bg-primary/5'
        } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <Upload className="mx-auto mb-2 h-6 w-6 text-primary" />
        <p className="text-sm font-medium text-foreground">
          {isLoading ? 'Uploading...' : 'Upload Document'}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Drag and drop or click to select
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          PDF, TXT, or DOCX
        </p>
        
        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="mt-3 h-1 w-full bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}
      </button>
    </div>
  )
}
