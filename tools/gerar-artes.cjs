'use strict';
// Pipeline de arte do Caloricio: pega os originais 2-em-1 gerados pela IA em
// img/sources/, separa os dois personagens, tira o fundo e normaliza.
//
// A normalização é feita PELOS OLHOS, não pelo retângulo do conteúdo. Se fosse
// pelo conteúdo, equipamento grande mudaria o tamanho do personagem: a corda de
// pular passa muito acima da cabeça e encolhia o boneco para 91% do tamanho das
// outras fantasias, e a prancha de surf o deslocava para o lado. Ancorando na
// distância entre os olhos, o personagem fica do mesmo tamanho e na mesma
// posição em todas as roupas — trocar de fantasia não faz ele pular.
const t = require('./png-tool.cjs');
const { acharOlhos } = require('./gerar-piscada.cjs');
const fs = require('fs');
const path = require('path');

const DISTANCIA_OLHOS_ALVO = 116; // px entre os centros dos dois olhos
// Canvas dimensionado pelo pior caso medido a partir do centro dos olhos:
// 323px à esquerda (prancha de surf), 326 à direita, 290 acima (arco da corda
// de pular) e 417 abaixo. Com folga de ~20px em cada lado.
const CANVAS_W = 690;
const CANVAS_H = 740;
const OLHOS_X_ALVO = 345;
const OLHOS_Y_ALVO = 305;

// esquerda = paleta verde/expressão séria, direita = vermelha/sorrindo
const LADOS = [
  ['esq', 'desconfiado'],
  ['dir', 'normal'],
];

// Coloca a arte no canvas ancorando um ponto dela num ponto do canvas.
function ancorar(img, canvasW, canvasH, ancoraX, ancoraY, alvoX, alvoY) {
  const out = new Uint8Array(canvasW * canvasH * 4);
  for (let i = 0; i < out.length; i += 4) out[i] = out[i + 1] = out[i + 2] = 255;
  const offX = Math.round(alvoX - ancoraX);
  const offY = Math.round(alvoY - ancoraY);
  let perdidos = 0;
  for (let y = 0; y < img.height; y++) {
    const ty = y + offY;
    for (let x = 0; x < img.width; x++) {
      const tx = x + offX;
      const s = (y * img.width + x) * 4;
      if (img.data[s + 3] === 0) continue;
      if (tx < 0 || tx >= canvasW || ty < 0 || ty >= canvasH) { perdidos++; continue; }
      const d = (ty * canvasW + tx) * 4;
      out[d] = img.data[s]; out[d + 1] = img.data[s + 1];
      out[d + 2] = img.data[s + 2]; out[d + 3] = img.data[s + 3];
    }
  }
  return { img: { width: canvasW, height: canvasH, data: out }, perdidos };
}

function processar(nome, avisos) {
  const origem = path.join('img', 'sources', `caloricio-${nome}.png`);
  if (!fs.existsSync(origem)) {
    avisos.push(`FALTANDO: ${origem}`);
    return;
  }
  const src = t.decodePNG(fs.readFileSync(origem));

  // Primeira passada: recorta os dois lados e tenta achar os olhos em cada um.
  const metades = LADOS.map(([lado, estado]) => {
    let img = t.metade(src, lado);
    t.removeWhiteBackground(img);
    t.keepLargestComponent(img);
    img = t.trimTransparent(img, 0);
    return { estado, img, olhos: acharOlhos(img) };
  });

  // Os dois personagens da mesma arte são desenhados na mesma escala, então
  // quem tem olhos visíveis dita o fator para os dois. Isso resolve corrida,
  // bike e natação no estado desconfiado, onde óculos escuros escondem a
  // esclera e a detecção não tem em que se apoiar.
  const comOlhos = metades.find((m) => m.olhos);
  if (!comOlhos) {
    avisos.push(`${nome}: nenhum dos dois lados teve olhos detectados — pulado`);
    return;
  }
  const fator = DISTANCIA_OLHOS_ALVO / (comOlhos.olhos[1].cx - comOlhos.olhos[0].cx);

  // Onde a base do personagem de referência cai no canvas. Serve de âncora
  // para o lado sem olhos, mantendo os dois alinhados entre si.
  let baseRefY = null;
  let baseRefX = null;

  // O lado de referência tem que sair primeiro: é dele que vem a âncora usada
  // pelo lado sem olhos.
  const ordem = [comOlhos, ...metades.filter((m) => m !== comOlhos)];
  for (const m of ordem) {
    const img = t.resizeToHeight(m.img, Math.round(m.img.height * fator));
    let ancoraX, ancoraY;
    if (m.olhos) {
      ancoraX = ((m.olhos[0].cx + m.olhos[1].cx) / 2) * fator;
      ancoraY = ((m.olhos[0].cy + m.olhos[1].cy) / 2) * fator;
      if (m === comOlhos) {
        baseRefX = OLHOS_X_ALVO - ancoraX + img.width / 2;
        baseRefY = OLHOS_Y_ALVO - ancoraY + img.height;
      }
    } else {
      // Sem olhos: alinha pela base e pelo centro horizontal, na mesma posição
      // em que o irmão de referência ficou. Só cai aqui quando óculos cobrem os
      // olhos, e esses casos não têm equipamento largo que desloque o centro.
      avisos.push(`${nome}-${m.estado}: olhos cobertos, alinhado pelo irmão`);
      ancoraX = img.width / 2 - (baseRefX - OLHOS_X_ALVO);
      ancoraY = img.height - (baseRefY - OLHOS_Y_ALVO);
    }

    const { img: final, perdidos } = ancorar(
      img, CANVAS_W, CANVAS_H, ancoraX, ancoraY, OLHOS_X_ALVO, OLHOS_Y_ALVO
    );
    if (perdidos > 0) avisos.push(`${nome}-${m.estado}: ${perdidos}px cortados fora do canvas`);
    t.quantize(final, 8);
    const destino = path.join('img', `caloricio-${nome}-${m.estado}.png`);
    const out = t.encodePNG(final);
    fs.writeFileSync(destino, out);
    console.log(`${path.basename(destino)}: ${final.width}x${final.height} ${(out.length / 1024).toFixed(0)}KB`);
  }
}

if (require.main === module) {
  const nomes = process.argv.slice(2);
  if (!nomes.length) {
    console.error('uso: node tools/gerar-artes.cjs <nome> [nome...]  (ex: corrida natacao)');
    process.exit(1);
  }
  const avisos = [];
  for (const nome of nomes) processar(nome, avisos);
  if (avisos.length) {
    console.log('\nAVISOS:');
    for (const a of avisos) console.log('  ' + a);
  }
}

module.exports = { processar, DISTANCIA_OLHOS_ALVO, OLHOS_Y_ALVO, CANVAS_W, CANVAS_H };
