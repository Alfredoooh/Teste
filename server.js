const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Rota de teste
app.get('/', (req, res) => {
  res.json({ 
    status: 'API Online', 
    message: 'Use POST /convert para converter HTML em PDF',
    version: '2.0.0'
  });
});

// Rota de conversão
app.post('/convert', async (req, res) => {
  let browser;
  
  try {
    const { html, format = 'A4' } = req.body;

    if (!html) {
      return res.status(400).json({ error: 'HTML não fornecido' });
    }

    console.log('🚀 Iniciando conversão...');

    // Configuração otimizada para Render Free
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ]
    });

    const page = await browser.newPage();
    
    // Define o conteúdo HTML
    await page.setContent(html, {
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    console.log('📄 Gerando PDF...');

    // Gera o PDF
    const pdf = await page.pdf({
      format: format,
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      }
    });

    await browser.close();
    browser = null;

    console.log('✅ PDF gerado com sucesso!');

    // Retorna o PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=documento.pdf');
    res.send(pdf);

  } catch (error) {
    console.error('❌ Erro:', error);
    
    if (browser) {
      await browser.close();
    }

    res.status(500).json({ 
      error: error.message,
      details: 'Erro ao gerar PDF'
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📍 Acesse: http://localhost:${PORT}`);
});