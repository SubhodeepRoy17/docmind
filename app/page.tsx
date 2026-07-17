import Link from 'next/link'
import { FileText, MessageSquare, Zap } from 'lucide-react'

export default function Page() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-16 md:py-24">
        {/* Hero */}
        <div className="mb-16 text-center">
          <h1 className="text-4xl font-bold text-foreground md:text-5xl lg:text-6xl text-balance">
            Welcome to <span className="text-primary">DocMind</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            Upload your documents and ask questions. Powered by AI, backed by your data.
          </p>
          
          <Link
            href="/docmind"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-3 text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
          >
            Start using DocMind
            <span>→</span>
          </Link>
        </div>

        {/* Features */}
        <div className="grid gap-6 md:grid-cols-3 mb-16">
          <div className="rounded-lg border border-border bg-card p-6">
            <FileText className="h-8 w-8 text-primary mb-3" />
            <h3 className="font-semibold text-card-foreground mb-2">Upload Documents</h3>
            <p className="text-sm text-muted-foreground">
              Support for PDF, TXT, and DOCX files. Easily manage multiple documents.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <MessageSquare className="h-8 w-8 text-primary mb-3" />
            <h3 className="font-semibold text-card-foreground mb-2">Ask Questions</h3>
            <p className="text-sm text-muted-foreground">
              Get intelligent answers based on your document content with source citations.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <Zap className="h-8 w-8 text-primary mb-3" />
            <h3 className="font-semibold text-card-foreground mb-2">Powered by AI</h3>
            <p className="text-sm text-muted-foreground">
              Uses Claude and advanced retrieval techniques for accurate responses.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="rounded-lg border border-border bg-card p-8">
          <h2 className="text-2xl font-bold text-card-foreground mb-6">How It Works</h2>
          
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground font-semibold">
                1
              </div>
              <div>
                <h3 className="font-semibold text-card-foreground">Upload Documents</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Upload your PDF, text, or Word documents to DocMind
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground font-semibold">
                2
              </div>
              <div>
                <h3 className="font-semibold text-card-foreground">Ask Questions</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Type any question about your documents in natural language
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground font-semibold">
                3
              </div>
              <div>
                <h3 className="font-semibold text-card-foreground">Get Answers</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Receive accurate answers with sources cited from your documents
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
