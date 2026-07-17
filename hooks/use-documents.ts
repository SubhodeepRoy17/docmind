import { useState, useCallback, useEffect } from 'react'

interface Document {
  id: string
  filename: string
  original_filename?: string
  size?: number
  text_length?: number
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'

export function useDocuments() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Fetch documents on mount
  useEffect(() => {
    fetchDocuments()
  }, [])

  const fetchDocuments = useCallback(async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/documents`)
      if (response.ok) {
        const data = await response.json()
        setDocuments(data.documents || [])
      }
    } catch (error) {
      console.error('Failed to fetch documents:', error)
    }
  }, [])

  const uploadDocument = useCallback(async (file: File) => {
    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch(`${BACKEND_URL}/upload`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || 'Failed to upload document')
      }

      const result = await response.json()
      
      // Add new document to list
      setDocuments(prev => [...prev, {
        id: result.document_id,
        filename: result.filename,
        original_filename: result.filename,
        size: result.size,
      }])

      return result
    } catch (error) {
      console.error('Upload error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  const deleteDocument = useCallback(async (documentId: string) => {
    try {
      const response = await fetch(`${BACKEND_URL}/documents/${documentId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setDocuments(prev => prev.filter(doc => doc.id !== documentId))
      }
    } catch (error) {
      console.error('Delete error:', error)
      throw error
    }
  }, [])

  const refreshDocuments = useCallback(async () => {
    await fetchDocuments()
  }, [fetchDocuments])

  return {
    documents,
    isLoading,
    uploadDocument,
    deleteDocument,
    refreshDocuments,
  }
}
