#!/bin/bash

# Setup script for Segment-to-Context Frontend

set -e

echo "🚀 Setting up Segment-to-Context Frontend..."

# Check Node.js version
echo "📋 Checking Node.js version..."
node --version || { echo "❌ Node.js 18+ is required"; exit 1; }
npm --version || { echo "❌ npm is required"; exit 1; }

# Install dependencies
echo "📥 Installing dependencies..."
npm install

# Create .env.local file if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file from .env.local.example..."
    if [ -f .env.local.example ]; then
        cp .env.local.example .env.local
        echo "⚠️  Please update .env.local with your configuration"
    else
        echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
        echo "NEXT_PUBLIC_TENANT_ID=default-tenant" >> .env.local
        echo "✅ Created .env.local with default values"
    fi
fi

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env.local with your configuration"
echo "2. Start development server: npm run dev"
echo ""
echo "Make sure the backend is running at NEXT_PUBLIC_API_URL"
