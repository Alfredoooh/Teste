#!/usr/bin/env bash
set -e

echo "📦 Instalando dependências..."
npm install

echo "🌐 Instalando Chromium para Playwright..."
npx playwright install chromium

echo "🔧 Instalando dependências do sistema..."
npx playwright install-deps chromium

echo "✅ Build concluído com sucesso!"