// Recorta uma região da arte e amplia, pra conferir detalhe de perto.
//
// Existe porque defeito de mão (objeto atravessando o punho, equipamento
// duplicado) não aparece no tamanho em que a arte é exibida — foi ampliando
// que apareceram as duas garrafinhas do cardio. As coordenadas são em
// PORCENTAGEM, não em pixel, pra mesma chamada servir em qualquer arte
// independente do tamanho.
//
// uso: node tools/zoom.cjs <arquivo> <x0> <y0> <x1> <y1> [saida]
// ex.: node tools/zoom.cjs img/caloricio-cardio-normal.png 5 60 100 92
//
// Sem <saida>, grava ao lado do original com sufixo -zoom.
const { decodePNG, encodePNG } = require('./png-tool.cjs');
const fs = require('fs');
const path = require('path');

const LARGURA_ALVO = 900; // amplia até chegar perto disso

function zoom(arquivo, x0p, y0p, x1p, y1p, saida) {
  const img = decodePNG(fs.readFileSync(arquivo));
  const x0 = Math.max(0, Math.round((img.width * x0p) / 100));
  const y0 = Math.max(0, Math.round((img.height * y0p) / 100));
  const x1 = Math.min(img.width, Math.round((img.width * x1p) / 100));
  const y1 = Math.min(img.height, Math.round((img.height * y1p) / 100));
  const w = x1 - x0;
  const h = y1 - y0;
  if (w <= 0 || h <= 0) throw new Error(`região vazia: ${w}x${h}`);

  // ampliação por repetição de pixel (nearest): interpolar suavizaria justo a
  // borda que a gente quer inspecionar.
  const escala = Math.max(1, Math.floor(LARGURA_ALVO / w));
  const lw = w * escala;
  const lh = h * escala;
  const data = Buffer.alloc(lw * lh * 4);
  for (let y = 0; y < lh; y++) {
    for (let x = 0; x < lw; x++) {
      const s = ((y0 + Math.floor(y / escala)) * img.width + (x0 + Math.floor(x / escala))) * 4;
      const d = (y * lw + x) * 4;
      // achata sobre branco: transparente e branco ficam iguais na tela, mas
      // assim o contorno preto fica legível em qualquer visualizador.
      const a = img.data[s + 3] / 255;
      data[d] = Math.round(img.data[s] * a + 255 * (1 - a));
      data[d + 1] = Math.round(img.data[s + 1] * a + 255 * (1 - a));
      data[d + 2] = Math.round(img.data[s + 2] * a + 255 * (1 - a));
      data[d + 3] = 255;
    }
  }
  fs.writeFileSync(saida, encodePNG({ width: lw, height: lh, data }));
  return { w, h, lw, lh, saida };
}

if (require.main === module) {
  const [arquivo, x0, y0, x1, y1, saida] = process.argv.slice(2);
  if (!arquivo || y1 === undefined) {
    console.error('uso: node tools/zoom.cjs <arquivo> <x0%> <y0%> <x1%> <y1%> [saida]');
    process.exit(1);
  }
  const destino =
    saida ?? path.join(path.dirname(arquivo), `${path.basename(arquivo, '.png')}-zoom.png`);
  const r = zoom(arquivo, +x0, +y0, +x1, +y1, destino);
  console.log(`${r.saida}: recorte ${r.w}x${r.h} ampliado para ${r.lw}x${r.lh}`);
}

module.exports = { zoom };
