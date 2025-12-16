const chromium = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');

module.exports = async (req, res) => {
  // Permitir apenas POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido. Use POST.' });
  }

  let browser = null;

  try {
    const { 
      html, 
      url,
      format = 'A4',
      margin = { top: '20mm', right: '20mm', bottom: '20mm', left: '20mm' },
      printBackground = true,
      landscape = false,
      scale = 1
    } = req.body;

    // Validação de entrada
    if (!html && !url) {
      return res.status(400).json({ 
        error: 'É necessário fornecer "html" ou "url" no corpo da requisição' 
      });
    }

    // Configurar o navegador Chromium
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });

    const page = await browser.newPage();

    // Carregar HTML ou URL
    if (html) {
      await page.setContent(html, {
        waitUntil: ['networkidle0', 'domcontentloaded']
      });
    } else {
      await page.goto(url, {
        waitUntil: ['networkidle0', 'domcontentloaded']
      });
    }

    // Gerar PDF com configurações precisas
    const pdf = await page.pdf({
      format,
      margin,
      printBackground,
      landscape,
      scale,
      preferCSSPageSize: true,
      displayHeaderFooter: false
    });

    await browser.close();

    // Retornar PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=documento.pdf');
    res.setHeader('Content-Length', pdf.length);
    res.status(200).send(pdf);

  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    
    if (browser) {
      await browser.close();
    }

    res.status(500).json({ 
      error: 'Erro ao gerar PDF',
      message: error.message 
    });
  }
};