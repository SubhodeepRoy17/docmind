'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Loader2 } from 'lucide-react'
import Message from './message'
import { useChat } from '@/hooks/use-chat'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  sources?: Array<{
    document_id: string
    filename: string
    excerpt: string
    relevance_score?: number
  }>
  timestamp: Date
}

interface Document {
  id: string
  filename: string
}

interface ChatInterfaceProps {
  documents: Document[]
  selectedDocuments: Set<string>
}

export default function ChatInterface({ documents, selectedDocuments }: ChatInterfaceProps) {
  const { messages, isLoading, sendMessage } = useChat()
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    if (documents.length === 0) {
      alert('Please upload at least one document first')
      return
    }

    const query = input
    setInput('')
    
    // Reset textarea height
    if (inputRef.current) {
      inputRef.current.style.height = 'auto'
    }

    await sendMessage(query)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Check if we're not in IME composition mode
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault()
      handleSubmit(e as any)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    // Auto-resize textarea
    e.target.style.height = 'auto'
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
  }

  return (
    <div className="flex h-96 md:h-screen flex-col">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-4">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <p className="text-lg font-semibold text-foreground">
                {documents.length === 0 ? 'Upload a document to get started' : 'Ask me anything about your documents'}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {documents.length === 0 
                  ? 'Upload PDFs, text files, or Word documents' 
                  : 'I&apos;ll search your documents and provide answers with sources'}
              </p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <Message key={message.id} message={message} />
          ))
        )}
        {isLoading && (
          <div className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <span className="text-sm text-muted-foreground">Searching documents...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="flex gap-3">
        <textarea
          ref={inputRef}
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={documents.length === 0 ? 'Upload documents first...' : 'Ask a question about your documents...'}
          disabled={isLoading || documents.length === 0}
          className="flex-1 rounded-lg border border-border bg-card px-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 resize-none max-h-[120px] min-h-[44px]"
          rows={1}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim() || documents.length === 0}
          className="flex-shrink-0 rounded-lg bg-primary px-4 py-2 text-primary-foreground font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          <span className="hidden sm:inline">Send</span>
        </button>
      </form>
    </div>
  )
}
