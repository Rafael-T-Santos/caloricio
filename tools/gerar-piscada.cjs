'use strict';
// Gera a variante de olhos fechados de cada arte, desenhando por cima.
//
// Por que desenhar em vez de gerar por IA: a piscada dura ~120ms, então o
// resto do corpo precisa ser pixel a pixel idêntico ao quadro de olho aberto.
// Qualquer regeração desloca o personagem e a troca lê como tremida. Aqui só
// a região dos olhos muda; o resto é cópia exata.
const t = require('./png-tool.cjs');
const fs = require('fs');
const path = require('path');

// A diferença entre vermelho e azul é o que separa pele de cinza/branco: a
// pele da arte é (255,200,144), diferença 111. Sem esse teste, branco puro
// (255,255,255) passaria como pele — r>=g>=b vale para valores iguais — e o
// flood pararia na esclera em vez de apagá-la.
const ehPele = (r, g, b) => r > 170 && r - b > 30 && r >= g && g >= b;

// Esclera: mancha clara, opaca e fechada no terço superior. O par de olhos sai
// como os dois maiores componentes com o mesmo cy.
function acharOlhos(img) {
  const { width: w, height: h, data } = img;
  const claro = (i) =>
    data[i * 4 + 3] > 200 && data[i * 4] > 200 && data[i * 4 + 1] > 200 && data[i * 4 + 2] > 200;
  const limite = Math.floor(h * 0.45);
  const lab = new Int32Array(w * h).fill(-1);
  const comps = [];
  for (let i = 0; i < w * limite; i++) {
    if (lab[i] !== -1 || !claro(i)) continue;
    const id = comps.length;
    const st = [i];
    lab[i] = id;
    let n = 0, minX = w, maxX = 0, minY = h, maxY = 0;
    while (st.length) {
      const p = st.pop();
      n++;
      const x = p % w, y = (p / w) | 0;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
      for (const q of [x > 0 ? p - 1 : -1, x < w - 1 ? p + 1 : -1, y > 0 ? p - w : -1, y < limite - 1 ? p + w : -1]) {
        if (q >= 0 && lab[q] === -1 && claro(q)) { lab[q] = id; st.push(q); }
      }
    }
    comps.push({ n, minX, maxX, minY, maxY, cx: (minX + maxX) / 2, cy: (minY + maxY) / 2, w: maxX - minX + 1, h: maxY - minY + 1 });
  }
  // Limiares relativos à altura da imagem: a mesma função roda tanto no
  // original recortado (~1200px) quanto na arte já normalizada (~640px).
  const areaMin = 0.0006 * h * h;
  const ladoMin = 0.025 * h;
  const candidatos = comps
    .filter(
      (c) =>
        c.n > areaMin && c.w > ladoMin && c.h > ladoMin &&
        c.w / c.h > 0.5 && c.w / c.h < 2.5 &&
        c.cy > h * 0.12 && c.cy < h * 0.55
    )
    .sort((a, b) => b.n - a.n);
  for (let i = 0; i < candidatos.length; i++) {
    for (let j = i + 1; j < candidatos.length; j++) {
      const a = candidatos[i], b = candidatos[j];
      const mesmaLinha = Math.abs(a.cy - b.cy) < 10;
      const mesmoTamanho = Math.max(a.n, b.n) / Math.min(a.n, b.n) < 1.6;
      if (mesmaLinha && mesmoTamanho) return [a, b].sort((p, q) => p.cx - q.cx);
    }
  }
  return null;
}

// Cor da pele ao redor do olho: anel de amostras descartando contorno e esclera.
function corDaPele(img, olho) {
  const { width: w, data } = img;
  const amostras = [];
  const raioX = olho.w * 0.85, raioY = olho.h * 0.85;
  for (let ang = 0; ang < 360; ang += 5) {
    const rad = (ang * Math.PI) / 180;
    const x = Math.round(olho.cx + Math.cos(rad) * raioX);
    const y = Math.round(olho.cy + Math.sin(rad) * raioY);
    const d = (y * w + x) * 4;
    if (data[d + 3] < 200) continue;
    const [r, g, b] = [data[d], data[d + 1], data[d + 2]];
    if (ehPele(r, g, b)) amostras.push([r, g, b]);
  }
  if (!amostras.length) return [250, 200, 160];
  const mediana = (k) => amostras.map((a) => a[k]).sort((x, y) => x - y)[amostras.length >> 1];
  return [mediana(0), mediana(1), mediana(2)];
}

// Cor do traço: o pixel mais escuro do olho (contorno/pupila da própria arte).
function corDoTraco(img, olho) {
  const { width: w, data } = img;
  let melhor = [40, 30, 30], lum = 1e9;
  for (let y = olho.minY; y <= olho.maxY; y++) {
    for (let x = olho.minX; x <= olho.maxX; x++) {
      const d = (y * w + x) * 4;
      if (data[d + 3] < 200) continue;
      const l = data[d] + data[d + 1] + data[d + 2];
      if (l < lum) { lum = l; melhor = [data[d], data[d + 1], data[d + 2]]; }
    }
  }
  return melhor;
}

// Apaga o olho: a partir da esclera, espalha por tudo que NÃO é pele (esclera,
// pupila, contorno do olho) e pinta de pele. Para sozinho ao encostar na pele,
// então a sobrancelha — separada por um vão de pele — fica intacta.
function apagarOlho(img, olho, pele) {
  const { width: w, height: h, data } = img;
  const margem = 16;
  const x0 = Math.max(0, olho.minX - margem), x1 = Math.min(w - 1, olho.maxX + margem);
  const y0 = Math.max(0, olho.minY - margem), y1 = Math.min(h - 1, olho.maxY + margem);
  const visto = new Set();
  const st = [];
  for (let y = olho.minY; y <= olho.maxY; y++) {
    for (let x = olho.minX; x <= olho.maxX; x++) st.push(y * w + x);
  }
  while (st.length) {
    const p = st.pop();
    if (visto.has(p)) continue;
    const x = p % w, y = (p / w) | 0;
    if (x < x0 || x > x1 || y < y0 || y > y1) continue;
    const d = p * 4;
    if (data[d + 3] < 200) continue;
    if (ehPele(data[d], data[d + 1], data[d + 2])) continue;
    visto.add(p);
    data[d] = pele[0]; data[d + 1] = pele[1]; data[d + 2] = pele[2]; data[d + 3] = 255;
    if (x > x0) st.push(p - 1);
    if (x < x1) st.push(p + 1);
    if (y > y0) st.push(p - w);
    if (y < y1) st.push(p + w);
  }

  // Dilata 2px: os pixels de transição entre o contorno preto e a pele são um
  // meio-termo que passa raspando no teste de pele e sobreviveria ao flood,
  // deixando um anel escuro fantasma. Há 13px de pele até a sobrancelha, então
  // dilatar essa margem não a alcança.
  let borda = [...visto];
  for (let passo = 0; passo < 2; passo++) {
    const proxima = [];
    for (const p of borda) {
      const x = p % w, y = (p / w) | 0;
      for (const q of [x > x0 ? p - 1 : -1, x < x1 ? p + 1 : -1, y > y0 ? p - w : -1, y < y1 ? p + w : -1]) {
        if (q < 0 || visto.has(q)) continue;
        const d = q * 4;
        if (data[d + 3] < 200) continue;
        visto.add(q);
        proxima.push(q);
        data[d] = pele[0]; data[d + 1] = pele[1]; data[d + 2] = pele[2];
      }
    }
    borda = proxima;
  }
  return visto.size;
}

// Arco de pálpebra fechada, convexo pra cima (olho feliz fechado).
function desenharArco(img, olho, traco, espessura) {
  const { width: w, height: h, data } = img;
  const meiaLargura = olho.w * 0.46;
  const xEsq = olho.cx - meiaLargura, xDir = olho.cx + meiaLargura;
  const yBase = olho.cy + olho.h * 0.16;
  const yTopo = olho.cy - olho.h * 0.20;
  const r = espessura / 2;
  const pintar = (px, py, cobertura) => {
    if (px < 0 || px >= w || py < 0 || py >= h) return;
    const d = (py * w + px) * 4;
    if (data[d + 3] < 200) return;
    const a = Math.min(1, cobertura);
    data[d] = Math.round(data[d] * (1 - a) + traco[0] * a);
    data[d + 1] = Math.round(data[d + 1] * (1 - a) + traco[1] * a);
    data[d + 2] = Math.round(data[d + 2] * (1 - a) + traco[2] * a);
  };
  // curva quadrática amostrada densamente, com disco antialiasado em cada passo
  for (let i = 0; i <= 600; i++) {
    const s = i / 600;
    const x = (1 - s) * (1 - s) * xEsq + 2 * (1 - s) * s * olho.cx + s * s * xDir;
    const y = (1 - s) * (1 - s) * yBase + 2 * (1 - s) * s * yTopo + s * s * yBase;
    // afina nas pontas, como traço de pincel
    const esp = r * (0.55 + 0.45 * Math.sin(Math.PI * s));
    for (let dy = -Math.ceil(esp) - 1; dy <= Math.ceil(esp) + 1; dy++) {
      for (let dx = -Math.ceil(esp) - 1; dx <= Math.ceil(esp) + 1; dx++) {
        const dist = Math.hypot(dx, dy);
        if (dist > esp + 1) continue;
        pintar(Math.round(x) + dx, Math.round(y) + dy, Math.min(1, esp + 0.5 - dist));
      }
    }
  }
}

function gerarPiscada(caminhoEntrada, caminhoSaida) {
  const img = t.decodePNG(fs.readFileSync(caminhoEntrada));
  const olhos = acharOlhos(img);
  if (!olhos) return { ok: false, motivo: 'olhos não detectados' };
  const espessura = Math.max(6, Math.round(olhos[0].h * 0.17));
  for (const olho of olhos) {
    const pele = corDaPele(img, olho);
    const traco = corDoTraco(img, olho);
    apagarOlho(img, olho, pele);
    desenharArco(img, olho, traco, espessura);
  }
  fs.writeFileSync(caminhoSaida, t.encodePNG(t.quantize(img, 8)));
  return { ok: true, olhos: olhos.map((o) => `${Math.round(o.cx)},${Math.round(o.cy)}`) };
}

module.exports = { gerarPiscada, acharOlhos };

if (require.main === module) {
  const nomes = process.argv.slice(2);
  if (!nomes.length) {
    console.error('uso: node tools/gerar-piscada.cjs <visual> [visual...]  (ex: corrida gpt)');
    process.exit(1);
  }
  for (const nome of nomes) {
    const entrada = path.join('img', `caloricio-${nome}-normal.png`);
    const saida = path.join('img', `caloricio-${nome}-blink.png`);
    const r = gerarPiscada(entrada, saida);
    console.log(`${nome}: ${r.ok ? 'ok (olhos em ' + r.olhos.join(' e ') + ')' : 'FALHOU — ' + r.motivo}`);
  }
}
