'use client'

import { useState } from 'react'
import DocumentUploader from '@/components/docmind/document-uploader'
import ChatInterface from '@/components/docmind/chat-interface'
import DocumentList from '@/components/docmind/document-list'
import { useDocuments } from '@/hooks/use-documents'

export default function DocMindPage() {
  const { documents, isLoading, uploadDocument, deleteDocument, refreshDocuments } = useDocuments()
  const [selectedDocuments, setSelectedDocuments] = useState<Set<string>>(new Set())
  const [showDocuments, setShowDocuments] = useState(true)

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl p-4 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground md:text-4xl">DocMind</h1>
          <p className="mt-2 text-muted-foreground">Intelligent document Q&A powered by AI</p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Sidebar - Documents */}
          {showDocuments && (
            <div className="md:col-span-1">
              <div className="rounded-lg border border-border bg-card p-6">
                <h2 className="mb-4 text-lg font-semibold text-card-foreground">Documents</h2>
                
                {/* Document Uploader */}
                <div className="mb-6">
                  <DocumentUploader onUpload={uploadDocument} isLoading={isLoading} />
                </div>

                {/* Document List */}
                <DocumentList 
                  documents={documents}
                  selectedDocuments={selectedDocuments}
                  onSelectionChange={setSelectedDocuments}
                  onDelete={deleteDocument}
                  isLoading={isLoading}
                />
              </div>
            </div>
          )}

          {/* Main Chat Area */}
          <div className={showDocuments ? 'md:col-span-2' : 'md:col-span-3'}>
            <div className="rounded-lg border border-border bg-card p-6">
              <ChatInterface 
                documents={documents}
                selectedDocuments={selectedDocuments}
              />
            </div>
          </div>
        </div>

        {/* Mobile Toggle */}
        <div className="mt-4 flex gap-2 md:hidden">
          <button
            onClick={() => setShowDocuments(!showDocuments)}
            className="flex-1 rounded-lg bg-primary px-4 py-2 text-primary-foreground font-medium"
          >
            {showDocuments ? 'Show Chat' : 'Show Documents'}
          </button>
        </div>
      </div>
    </main>
  )
}
