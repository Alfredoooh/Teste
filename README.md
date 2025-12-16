# 🎯 HTML to PDF API

API serverless para conversão de HTML para PDF com alta fidelidade de layout, margens e posicionamento.

## 🚀 Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone)

## 📖 Como Usar

### Endpoint
```
POST /api/convert
```

### Parâmetros (JSON)

| Parâmetro | Tipo | Obrigatório | Padrão | Descrição |
|-----------|------|-------------|--------|-----------|
| `html` | string | Sim* | - | Código HTML para converter |
| `url` | string | Sim* | - | URL para converter |
| `format` | string | Não | "A4" | Formato da página (A4, Letter, Legal, etc) |
| `margin` | object | Não | 20mm todos | Margens do documento |
| `printBackground` | boolean | Não | true | Imprimir cores de fundo |
| `landscape` | boolean | Não | false | Orientação paisagem |
| `scale` | number | Não | 1 | Escala da página (0.1 a 2) |

*É obrigatório fornecer `html` OU `url`, mas não ambos.

### Exemplo de Requisição

```javascript
fetch('https://seu-projeto.vercel.app/api/convert', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial; margin: 0; padding: 20px; }
            h1 { color: #333; }
            .box { 
              border: 2px solid #007bff; 
              padding: 15px; 
              margin: 10px 0; 
              background: #f0f8ff;
            }
          </style>
        </head>
        <body>
          <h1>Meu Documento</h1>
          <div class="box">
            <p>Conteúdo com formatação perfeita!</p>
          </div>
        </body>
      </html>
    `,
    format: 'A4',
    margin: {
      top: '25mm',
      right: '25mm',
      bottom: '25mm',
      left: '25mm'
    }
  })
})
.then(res => res.blob())
.then(blob => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'documento.pdf';
  a.click();
});
```

## 🛠️ Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Instalar Vercel CLI
npm i -g vercel

# Iniciar servidor local
vercel dev
```

## 📦 Tecnologias

- **Puppeteer Core**: Motor de renderização Chromium
- **chrome-aws-lambda**: Chromium otimizado para serverless
- **Vercel**: Plataforma de hospedagem serverless

## ⚙️ Configurações Avançadas

### Margens Personalizadas
```json
{
  "margin": {
    "top": "30mm",
    "right": "20mm",
    "bottom": "30mm",
    "left": "20mm"
  }
}
```

### CSS Paged Media
Você pode usar regras CSS específicas para impressão:

```html
<style>
  @page {
    size: A4;
    margin: 20mm;
  }
  
  @media print {
    .no-print { display: none; }
  }
  
  .page-break {
    page-break-after: always;
  }
</style>
```

## 📝 Licença

MIT