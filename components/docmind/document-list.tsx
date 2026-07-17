'use client'

import { Trash2, FileText, CheckCircle2, Circle } from 'lucide-react'
import { useState } from 'react'

interface Document {
  id: string
  filename: string
  original_filename?: string
  size?: number
  text_length?: number
}

interface DocumentListProps {
  documents: Document[]
  selectedDocuments: Set<string>
  onSelectionChange: (selected: Set<string>) => void
  onDelete: (documentId: string) => Promise<void>
  isLoading?: boolean
}

export default function DocumentList({
  documents,
  selectedDocuments,
  onSelectionChange,
  onDelete,
  isLoading = false,
}: DocumentListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedDocuments)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    onSelectionChange(newSelected)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this document?')) {
      setDeletingId(id)
      try {
        await onDelete(id)
      } finally {
        setDeletingId(null)
      }
    }
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown'
    const kb = bytes / 1024
    const mb = kb / 1024
    if (mb >= 1) return `${mb.toFixed(1)} MB`
    return `${kb.toFixed(1)} KB`
  }

  if (documents.length === 0) {
    return (
      <div className="py-4 text-center">
        <FileText className="mx-auto mb-2 h-8 w-8 text-muted-foreground opacity-50" />
        <p className="text-sm text-muted-foreground">No documents uploaded yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-2 max-h-96 overflow-y-auto">
      {documents.map((doc) => (
        <div
          key={doc.id}
          className="group flex items-center gap-3 rounded-lg border border-border p-3 hover:bg-muted/50 transition-colors"
        >
          <button
            onClick={() => toggleSelection(doc.id)}
            className="flex-shrink-0 text-primary hover:text-primary transition-colors"
          >
            {selectedDocuments.has(doc.id) ? (
              <CheckCircle2 className="h-5 w-5" />
            ) : (
              <Circle className="h-5 w-5" />
            )}
          </button>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {doc.original_filename || doc.filename || 'Unknown'}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatFileSize(doc.size)}
            </p>
          </div>

          <button
            onClick={() => handleDelete(doc.id)}
            disabled={isLoading || deletingId === doc.id}
            className="flex-shrink-0 rounded p-1.5 text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
            title="Delete document"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
