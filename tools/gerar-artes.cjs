'use strict';
// Pipeline de arte do Caloricio: pega os originais 2-em-1 gerados pela IA em
// img/sources/, separa os dois personagens, tira o fundo, normaliza o tamanho
// (mesma altura de personagem, pés na mesma linha) e grava em img/.
const t = require('./png-tool.cjs');
const fs = require('fs');
const path = require('path');

const ALTURA_PERSONAGEM = 600; // altura útil do personagem, igual em todas
const CANVAS_W = 520;          // largura fixa (cabe os halteres da musculação)
const CANVAS_H = 620;          // altura fixa
const MARGEM_BASE = 10;        // respiro abaixo dos pés

// esquerda = paleta verde/expressão séria, direita = vermelha/sorrindo
const LADOS = [
  ['esq', 'desconfiado'],
  ['dir', 'normal'],
];

const nomes = process.argv.slice(2);
if (!nomes.length) {
  console.error('uso: node tools/gerar-artes.cjs <nome> [nome...]  (ex: corrida natacao)');
  process.exit(1);
}

for (const nome of nomes) {
  const origem = path.join('img', 'sources', `caloricio-${nome}.png`);
  if (!fs.existsSync(origem)) {
    console.error(`FALTANDO: ${origem}`);
    continue;
  }
  const src = t.decodePNG(fs.readFileSync(origem));
  for (const [lado, estado] of LADOS) {
    let img = t.metade(src, lado);
    t.removeWhiteBackground(img);
    t.keepLargestComponent(img);
    img = t.trimTransparent(img, 0);
    img = t.resizeToHeight(img, ALTURA_PERSONAGEM);
    img = t.padToCanvas(img, CANVAS_W, CANVAS_H, MARGEM_BASE);
    t.quantize(img, 8);
    const destino = path.join('img', `caloricio-${nome}-${estado}.png`);
    const out = t.encodePNG(img);
    fs.writeFileSync(destino, out);
    console.log(`${path.basename(destino)}: ${img.width}x${img.height} ${(out.length / 1024).toFixed(0)}KB`);
  }
}
