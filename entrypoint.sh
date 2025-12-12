#!/bin/sh

echo "🚀 Starting React Frontend Setup with Vite..."

cd /app

if [ -f "package.json" ]; then
    echo "✅ React App gefunden!"
    echo "🎯 Starte Development Server..."
    npm run dev -- --host 0.0.0.0 --port 3000
else
    echo "❌ package.json nicht gefunden!"
    exit 1
fi
