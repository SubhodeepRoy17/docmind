import { useState, useCallback, useRef } from 'react'

interface Source {
  document_id: string
  filename: string
  excerpt: string
  relevance_score?: number
}

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  sources?: Source[]
  timestamp: Date
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const sessionIdRef = useRef<string>()

  // Generate session ID on first use
  if (!sessionIdRef.current) {
    sessionIdRef.current = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  const sendMessage = useCallback(async (query: string) => {
    setIsLoading(true)

    // Add user message to UI immediately
    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMessage])

    try {
      const response = await fetch(`${BACKEND_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          session_id: sessionIdRef.current,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || 'Failed to get response')
      }

      const result = await response.json()

      // Add assistant message
      const assistantMessage: ChatMessage = {
        id: `assistant_${Date.now()}`,
        role: 'assistant',
        content: result.response,
        sources: result.sources || [],
        timestamp: new Date(),
      }

      setMessages(prev => [...prev, assistantMessage])
      sessionIdRef.current = result.session_id
    } catch (error) {
      console.error('Chat error:', error)
      
      // Add error message
      const errorMessage: ChatMessage = {
        id: `error_${Date.now()}`,
        role: 'assistant',
        content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }, [])

  const clearMessages = useCallback(() => {
    setMessages([])
    sessionIdRef.current = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }, [])

  return {
    messages,
    isLoading,
    sendMessage,
    clearMessages,
  }
}
