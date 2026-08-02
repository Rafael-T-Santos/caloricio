'use strict';
// Converte as artes PNG para WebP.
//
// Não existe encoder WebP em Node puro e não há binário local, então a
// conversão passa pelo canvas de um navegador. Isso era um passo manual —
// abrir o site, arrastar os arquivos, salvar um a um. Com o Playwright já
// instalado para os testes de DOM, o mesmo navegador faz o trabalho sozinho.
//
// uso: node tools/gerar-webp.cjs cardio pilates      # os 3 estados de cada
//      node tools/gerar-webp.cjs --todos             # tudo que estiver em img/
//      node tools/gerar-webp.cjs --saida /tmp/x foo  # sem sobrescrever img/
const fs = require('fs');
const path = require('path');

// Qualidade calibrada na arte chapada do mascote: abaixo disso aparece
// sujeira nos contornos pretos, acima o arquivo cresce sem ganho visível.
const QUALIDADE = 0.82;
const ESTADOS = ['normal', 'desconfiado', 'blink'];

async function converter(arquivos, saida) {
  const { chromium } = require('playwright');
  const navegador = await chromium.launch();
  const pagina = await navegador.newPage();
  const resultados = [];
  try {
    for (const origem of arquivos) {
      const b64 = fs.readFileSync(origem).toString('base64');
      // a constante vive no Node; o callback roda no navegador e só enxerga
      // o que for passado como argumento
      const dataUrl = await pagina.evaluate(async ({ png, q }) => {
        const img = new Image();
        await new Promise((ok, erro) => {
          img.onload = ok;
          img.onerror = () => erro(new Error('imagem não decodificou'));
          img.src = `data:image/png;base64,${png}`;
        });
        const c = document.createElement('canvas');
        c.width = img.naturalWidth;
        c.height = img.naturalHeight;
        // sem alpha o fundo transparente vira preto no WebP
        c.getContext('2d').drawImage(img, 0, 0);
        return c.toDataURL('image/webp', q);
      }, { png: b64, q: QUALIDADE });

      if (!dataUrl.startsWith('data:image/webp')) {
        throw new Error(`navegador não gerou WebP para ${origem} (devolveu ${dataUrl.slice(0, 30)})`);
      }
      const destino = path.join(saida, path.basename(origem).replace(/\.png$/, '.webp'));
      const bytes = Buffer.from(dataUrl.split(',')[1], 'base64');
      fs.writeFileSync(destino, bytes);
      resultados.push({
        destino,
        png: fs.statSync(origem).size,
        webp: bytes.length,
      });
    }
  } finally {
    await navegador.close();
  }
  return resultados;
}

if (require.main === module) {
  const args = process.argv.slice(2);
  let saida = 'img';
  const i = args.indexOf('--saida');
  if (i !== -1) saida = args.splice(i, 2)[1];

  let arquivos;
  if (args.includes('--todos')) {
    arquivos = fs
      .readdirSync('img')
      .filter((f) => f.startsWith('caloricio-') && f.endsWith('.png'))
      .map((f) => path.join('img', f));
  } else if (args.length) {
    arquivos = args
      .flatMap((nome) => ESTADOS.map((e) => path.join('img', `caloricio-${nome}-${e}.png`)))
      .filter((p) => fs.existsSync(p)); // nem todo visual tem blink
  } else {
    console.error('uso: node tools/gerar-webp.cjs <nome>... | --todos  [--saida <dir>]');
    process.exit(1);
  }

  converter(arquivos, saida)
    .then((rs) => {
      for (const r of rs) {
        const pct = ((1 - r.webp / r.png) * 100).toFixed(0);
        console.log(
          `${path.basename(r.destino)}: ${(r.png / 1024).toFixed(0)}KB -> ${(r.webp / 1024).toFixed(0)}KB (-${pct}%)`
        );
      }
    })
    .catch((e) => {
      console.error(e.message);
      process.exit(1);
    });
}

module.exports = { converter, QUALIDADE };
