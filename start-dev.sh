#!/bin/bash
# DocMind Development Startup Script

echo "=========================================="
echo "  DocMind - Starting Development Server"
echo "=========================================="
echo ""

# Check if backend folder exists
if [ ! -d "backend" ]; then
    echo "❌ Error: backend directory not found"
    exit 1
fi

# Check for environment files
if [ ! -f ".env.development.local" ]; then
    echo "⚠️  No .env.development.local found"
    cp .env.local.example .env.development.local 2>/dev/null || echo "   Created from example"
fi

if [ ! -f "backend/.env" ]; then
    echo "⚠️  No backend/.env found"
    cp backend/.env.example backend/.env 2>/dev/null || echo "   Created from example"
fi

echo ""
echo "Starting backend server on http://localhost:8000..."
echo "Starting frontend server on http://localhost:3000..."
echo ""
echo "Run these commands in separate terminals:"
echo ""
echo "Terminal 1 (Backend):"
echo "  cd backend"
echo "  python -m uvicorn main:app --reload --port 8000"
echo ""
echo "Terminal 2 (Frontend):"
echo "  pnpm dev"
echo ""
echo "Then open http://localhost:3000 in your browser"
echo ""
echo "=========================================="
