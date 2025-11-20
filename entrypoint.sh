#!/bin/sh

echo "🚀 Starting React Frontend Setup with Vite..."

sleep 5
cd /app

if [ ! -f "package.json" ]; then
    echo "📦 Erstelle React App mit Vite..."
    npm create vite@latest . -- --template react --yes
    npm install
    echo "✅ React App mit Vite erstellt!"
else
    echo "✅ React App gefunden!"
    if [ ! -d "node_modules" ]; then
        npm install
    fi
fi

echo "🎯 Starte Development Server..."
npm run dev -- --host 0.0.0.0 --port 3000
