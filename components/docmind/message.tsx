'use client'

import { Bot, User, FileText } from 'lucide-react'

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

interface MessageProps {
  message: ChatMessage
}

export default function Message({ message }: MessageProps) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div className={`flex-shrink-0 h-8 w-8 rounded-lg flex items-center justify-center ${
        isUser 
          ? 'bg-primary text-primary-foreground' 
          : 'bg-accent text-accent-foreground'
      }`}>
        {isUser ? (
          <User className="h-4 w-4" />
        ) : (
          <Bot className="h-4 w-4" />
        )}
      </div>

      {/* Content */}
      <div className={`flex-1 ${isUser ? 'text-right' : ''}`}>
        <div className={`inline-block max-w-xs md:max-w-md lg:max-w-lg rounded-lg p-3 ${
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-card-foreground border border-border'
        }`}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
            {message.content}
          </p>
        </div>

        {/* Sources */}
        {message.sources && message.sources.length > 0 && (
          <div className={`mt-2 space-y-1 ${isUser ? 'text-right' : ''}`}>
            <p className="text-xs font-semibold text-muted-foreground">Sources:</p>
            {message.sources.map((source, index) => (
              <div
                key={index}
                className={`inline-block max-w-xs rounded-lg bg-muted/50 p-2 text-left ${
                  isUser ? 'ml-auto block text-right' : ''
                }`}
              >
                <div className="flex items-start gap-2">
                  <FileText className="h-3 w-3 mt-0.5 flex-shrink-0 text-primary" />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">
                      {source.filename}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                      &ldquo;{source.excerpt}&rdquo;
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
