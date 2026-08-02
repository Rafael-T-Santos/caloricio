'use strict';
// Gera os ícones do manifest a partir da própria arte do mascote, para não
// depender de um asset solto que ninguém sabe de onde veio.
//
// O ícone "maskable" precisa de mais folga: o sistema recorta em círculo,
// losango ou squircle conforme o aparelho, e só a área central (~80% do lado)
// é garantida. Por isso ele sai com o personagem menor.
const t = require('./png-tool.cjs');
const fs = require('fs');
const path = require('path');

const FUNDO = [77, 124, 15]; // verde escuro do site: contrasta com o moletom verde do mascote

function recortarConteudo(img) {
  const { width: w, height: h, data } = img;
  let minX = w, maxX = -1, minY = h, maxY = -1;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (data[(y * w + x) * 4 + 3] > 16) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  const cw = maxX - minX + 1;
  const ch = maxY - minY + 1;
  const out = new Uint8Array(cw * ch * 4);
  for (let y = 0; y < ch; y++) {
    const s = ((y + minY) * w + minX) * 4;
    out.set(data.subarray(s, s + cw * 4), y * cw * 4);
  }
  return { width: cw, height: ch, data: out };
}

// Achata o personagem sobre o fundo sólido, centralizado, ocupando `ocupacao`
// da menor dimensão do ícone.
function montarIcone(personagem, lado, ocupacao) {
  const alvo = Math.round(lado * ocupacao);
  const escalado = t.resizeToHeight(personagem, alvo);
  const out = new Uint8Array(lado * lado * 4);
  for (let i = 0; i < out.length; i += 4) {
    out[i] = FUNDO[0]; out[i + 1] = FUNDO[1]; out[i + 2] = FUNDO[2]; out[i + 3] = 255;
  }
  const offX = Math.round((lado - escalado.width) / 2);
  const offY = Math.round((lado - escalado.height) / 2);
  for (let y = 0; y < escalado.height; y++) {
    const ty = y + offY;
    if (ty < 0 || ty >= lado) continue;
    for (let x = 0; x < escalado.width; x++) {
      const tx = x + offX;
      if (tx < 0 || tx >= lado) continue;
      const s = (y * escalado.width + x) * 4;
      const a = escalado.data[s + 3] / 255;
      if (a <= 0) continue;
      const d = (ty * lado + tx) * 4;
      out[d] = Math.round(escalado.data[s] * a + out[d] * (1 - a));
      out[d + 1] = Math.round(escalado.data[s + 1] * a + out[d + 1] * (1 - a));
      out[d + 2] = Math.round(escalado.data[s + 2] * a + out[d + 2] * (1 - a));
    }
  }
  return { width: lado, height: lado, data: out };
}

const origem = path.join('img', 'caloricio-gpt-normal.png');
const personagem = recortarConteudo(t.decodePNG(fs.readFileSync(origem)));

const saidas = [
  ['icone-192.png', 192, 0.82],
  ['icone-512.png', 512, 0.82],
  // menor porque o sistema recorta as bordas de um ícone maskable
  ['icone-512-mascarado.png', 512, 0.6],
];

for (const [nome, lado, ocupacao] of saidas) {
  const icone = montarIcone(personagem, lado, ocupacao);
  const buf = t.encodePNG(t.quantize(icone, 8));
  fs.writeFileSync(path.join('img', nome), buf);
  console.log(`${nome}: ${lado}x${lado} ${(buf.length / 1024).toFixed(0)}KB`);
}
