const chromium = require('@sparticuz/chromium');
const puppeteer = require('puppeteer-core');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Use POST' });
  }

  let browser = null;

  try {
    const { 
      html, 
      format = 'A4', 
      margin = { top: '20mm', right: '20mm', bottom: '20mm', left: '20mm' },
      printBackground = true
    } = req.body;

    if (!html) {
      return res.status(400).json({ error: 'HTML é obrigatório' });
    }

    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdf = await page.pdf({ 
      format, 
      margin, 
      printBackground 
    });
    
    await browser.close();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=documento.pdf');
    res.status(200).send(pdf);

  } catch (error) {
    if (browser) await browser.close();
    res.status(500).json({ error: error.message });
  }
};