'use strict';
// Codec PNG mínimo em Node puro (zlib da stdlib) + remoção de fundo + downscale.
// Sem dependências externas: decodifica, tira o fundo branco por flood-fill a
// partir das bordas (com matte suave nas bordas antialiasadas), reduz a imagem
// e reencoda.
const fs = require('fs');
const zlib = require('zlib');

const SIG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

const CRC_TABLE = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function paeth(a, b, c) {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  if (pa <= pb && pa <= pc) return a;
  if (pb <= pc) return b;
  return c;
}

// -> { width, height, data: RGBA Uint8Array }
function decodePNG(buf) {
  if (!buf.slice(0, 8).equals(SIG)) throw new Error('não é PNG');
  let pos = 8;
  let ihdr = null;
  const idat = [];
  let palette = null;
  let trns = null;

  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos);
    const type = buf.toString('ascii', pos + 4, pos + 8);
    const data = buf.slice(pos + 8, pos + 8 + len);
    pos += 12 + len;
    if (type === 'IHDR') {
      ihdr = {
        width: data.readUInt32BE(0),
        height: data.readUInt32BE(4),
        bitDepth: data[8],
        colorType: data[9],
        interlace: data[12],
      };
    } else if (type === 'PLTE') palette = data;
    else if (type === 'tRNS') trns = data;
    else if (type === 'IDAT') idat.push(data);
    else if (type === 'IEND') break;
  }

  if (!ihdr) throw new Error('IHDR ausente');
  if (ihdr.bitDepth !== 8) throw new Error('bitDepth ' + ihdr.bitDepth + ' não suportado');
  if (ihdr.interlace !== 0) throw new Error('PNG entrelaçado não suportado');

  const channels = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 }[ihdr.colorType];
  if (!channels) throw new Error('colorType ' + ihdr.colorType + ' não suportado');

  const raw = zlib.inflateSync(Buffer.concat(idat));
  const { width, height } = ihdr;
  const bpp = channels;
  const stride = width * bpp;
  const lines = Buffer.alloc(height * stride);

  let rp = 0;
  for (let y = 0; y < height; y++) {
    const filter = raw[rp++];
    const cur = lines.slice(y * stride, (y + 1) * stride);
    raw.copy(cur, 0, rp, rp + stride);
    rp += stride;
    const prev = y > 0 ? lines.slice((y - 1) * stride, y * stride) : null;
    for (let i = 0; i < stride; i++) {
      const a = i >= bpp ? cur[i - bpp] : 0;
      const b = prev ? prev[i] : 0;
      const c = prev && i >= bpp ? prev[i - bpp] : 0;
      let v = cur[i];
      if (filter === 1) v += a;
      else if (filter === 2) v += b;
      else if (filter === 3) v += (a + b) >> 1;
      else if (filter === 4) v += paeth(a, b, c);
      cur[i] = v & 0xff;
    }
  }

  // normaliza tudo pra RGBA
  const out = new Uint8Array(width * height * 4);
  for (let i = 0, n = width * height; i < n; i++) {
    const s = i * bpp;
    const d = i * 4;
    if (ihdr.colorType === 6) {
      out[d] = lines[s]; out[d + 1] = lines[s + 1]; out[d + 2] = lines[s + 2]; out[d + 3] = lines[s + 3];
    } else if (ihdr.colorType === 2) {
      out[d] = lines[s]; out[d + 1] = lines[s + 1]; out[d + 2] = lines[s + 2]; out[d + 3] = 255;
    } else if (ihdr.colorType === 0) {
      out[d] = out[d + 1] = out[d + 2] = lines[s]; out[d + 3] = 255;
    } else if (ihdr.colorType === 4) {
      out[d] = out[d + 1] = out[d + 2] = lines[s]; out[d + 3] = lines[s + 1];
    } else if (ihdr.colorType === 3) {
      const idx = lines[s];
      out[d] = palette[idx * 3]; out[d + 1] = palette[idx * 3 + 1]; out[d + 2] = palette[idx * 3 + 2];
      out[d + 3] = trns && idx < trns.length ? trns[idx] : 255;
    }
  }
  return { width, height, data: out };
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const td = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(td), 0);
  return Buffer.concat([len, td, crc]);
}

function encodePNG({ width, height, data }) {
  const stride = width * 4;
  // filtro 5 (Paeth por scanline) melhora a compressão bastante em arte chapada
  const raw = Buffer.alloc(height * (stride + 1));
  for (let y = 0; y < height; y++) {
    const off = y * (stride + 1);
    raw[off] = 4; // Paeth
    for (let i = 0; i < stride; i++) {
      const cur = data[y * stride + i];
      const a = i >= 4 ? data[y * stride + i - 4] : 0;
      const b = y > 0 ? data[(y - 1) * stride + i] : 0;
      const c = y > 0 && i >= 4 ? data[(y - 1) * stride + i - 4] : 0;
      raw[off + 1 + i] = (cur - paeth(a, b, c)) & 0xff;
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  const idat = zlib.deflateSync(raw, { level: 9 });
  return Buffer.concat([SIG, chunk('IHDR', ihdr), chunk('IDAT', idat), chunk('IEND', Buffer.alloc(0))]);
}

// Flood-fill a partir das bordas: o que for "quase branco" e conectado à borda
// vira fundo. Alpha proporcional à distância do branco puro, pra não deixar
// halo branco no contorno antialiasado.
function removeWhiteBackground(img, tolerance = 60) {
  const { width, height, data } = img;
  const visited = new Uint8Array(width * height);
  const stack = [];
  const distFromWhite = (i) => {
    const d = i * 4;
    return Math.max(255 - data[d], 255 - data[d + 1], 255 - data[d + 2]);
  };
  for (let x = 0; x < width; x++) {
    stack.push(x, x + (height - 1) * width);
  }
  for (let y = 0; y < height; y++) {
    stack.push(y * width, y * width + width - 1);
  }
  while (stack.length) {
    const i = stack.pop();
    if (visited[i]) continue;
    if (distFromWhite(i) > tolerance) continue;
    visited[i] = 1;
    const x = i % width;
    const y = (i / width) | 0;
    if (x > 0) stack.push(i - 1);
    if (x < width - 1) stack.push(i + 1);
    if (y > 0) stack.push(i - width);
    if (y < height - 1) stack.push(i + width);
  }
  // A arte não usa branco puro (chega a 253), então tudo abaixo de `flat` conta
  // como fundo chapado e vira alpha 0. Só a faixa entre `flat` e `tolerance`
  // (a transição antialiasada até o contorno preto) ganha alpha parcial.
  // 26 também engole a marca d'água da IA no canto (distância máxima medida: 21)
  // sem tocar no personagem, que nunca entra no flood-fill.
  const flat = 26;
  let removed = 0;
  for (let i = 0, n = width * height; i < n; i++) {
    if (!visited[i]) continue;
    const d = distFromWhite(i);
    const alpha = d <= flat ? 0 : Math.round(255 * Math.min(1, (d - flat) / (tolerance - flat)));
    data[i * 4 + 3] = alpha;
    if (alpha === 0) {
      // zera o RGB junto: pixel invisível com cor constante comprime muito melhor
      data[i * 4] = data[i * 4 + 1] = data[i * 4 + 2] = 255;
      removed++;
    }
  }
  return removed;
}

// Corta as bordas totalmente transparentes que sobraram.
function trimTransparent(img, pad = 4) {
  const { width, height, data } = img;
  let minX = width, minY = height, maxX = -1, maxY = -1;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * 4 + 3] > 8) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX < 0) return img;
  minX = Math.max(0, minX - pad); minY = Math.max(0, minY - pad);
  maxX = Math.min(width - 1, maxX + pad); maxY = Math.min(height - 1, maxY + pad);
  const w = maxX - minX + 1;
  const h = maxY - minY + 1;
  const out = new Uint8Array(w * h * 4);
  for (let y = 0; y < h; y++) {
    const src = ((y + minY) * width + minX) * 4;
    out.set(data.subarray(src, src + w * 4), y * w * 4);
  }
  return { width: w, height: h, data: out };
}

// Box filter com alpha premultiplicado (evita franja escura na borda).
function resize(img, targetW) {
  const { width, height, data } = img;
  if (targetW >= width) return img;
  const targetH = Math.round((height * targetW) / width);
  const out = new Uint8Array(targetW * targetH * 4);
  const sx = width / targetW;
  const sy = height / targetH;
  for (let y = 0; y < targetH; y++) {
    const y0 = Math.floor(y * sy);
    const y1 = Math.min(height, Math.ceil((y + 1) * sy));
    for (let x = 0; x < targetW; x++) {
      const x0 = Math.floor(x * sx);
      const x1 = Math.min(width, Math.ceil((x + 1) * sx));
      let r = 0, g = 0, b = 0, a = 0, n = 0;
      for (let yy = y0; yy < y1; yy++) {
        for (let xx = x0; xx < x1; xx++) {
          const d = (yy * width + xx) * 4;
          const al = data[d + 3] / 255;
          r += data[d] * al; g += data[d + 1] * al; b += data[d + 2] * al; a += data[d + 3];
          n++;
        }
      }
      const d = (y * targetW + x) * 4;
      const am = a / n;
      const alNorm = am / 255;
      out[d] = alNorm > 0 ? Math.round(r / n / alNorm) : 0;
      out[d + 1] = alNorm > 0 ? Math.round(g / n / alNorm) : 0;
      out[d + 2] = alNorm > 0 ? Math.round(b / n / alNorm) : 0;
      out[d + 3] = Math.round(am);
    }
  }
  return { width: targetW, height: targetH, data: out };
}

// Apaga fragmentos soltos: quando os dois personagens da arte original quase se
// tocam, o corte no meio leva um pedaço do vizinho junto (ex: o halter do outro
// Caloricio na musculação). Mantém só componentes com pelo menos `minRatio` do
// tamanho do maior, então um acessório legitimamente separado sobreviveria.
// Limpa a metade recortada: mantém o personagem, mantém os objetos que o
// desenho quis (bola, garrafinha, alça do remo) e joga fora o resto.
//
// O corte é 1% do tamanho do personagem, e não é chute. Medindo os componentes
// das 50 metades de todas as artes: os objetos de verdade são 3,6% (garrafinha
// do cardio), 5,2% (alça do remo) e 7,3% (bola do vôlei); o maior lixo é um
// risco de 96px, 0,012%. Entre 0,012% e 3,6% não existe nada, então 1% cai no
// meio do vazio, com folga de 3,6x para um lado e 83x para o outro.
//
// `ladoInterno` diz onde a imagem foi cortada ao meio ('esq' corta na direita,
// 'dir' corta na esquerda). Componente que encosta ali é pedaço do personagem
// vizinho invadindo, e sai independente do tamanho — é a única coisa que o
// tamanho sozinho não distingue de um objeto legítimo.
function keepLargestComponent(img, opts = {}) {
  const { minRatio = 0.01, ladoInterno = null } =
    typeof opts === 'number' ? { minRatio: opts } : opts;
  const { width: w, height: h, data } = img;
  const label = new Int32Array(w * h).fill(-1);
  const sizes = [];
  for (let i = 0; i < w * h; i++) {
    if (label[i] !== -1 || data[i * 4 + 3] <= 16) continue;
    const id = sizes.length;
    const stack = [i];
    label[i] = id;
    let n = 0;
    let minX = w;
    let maxX = -1;
    while (stack.length) {
      const p = stack.pop();
      n++;
      const x = p % w;
      const y = (p / w) | 0;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (x > 0 && label[p - 1] === -1 && data[(p - 1) * 4 + 3] > 16) { label[p - 1] = id; stack.push(p - 1); }
      if (x < w - 1 && label[p + 1] === -1 && data[(p + 1) * 4 + 3] > 16) { label[p + 1] = id; stack.push(p + 1); }
      if (y > 0 && label[p - w] === -1 && data[(p - w) * 4 + 3] > 16) { label[p - w] = id; stack.push(p - w); }
      if (y < h - 1 && label[p + w] === -1 && data[(p + w) * 4 + 3] > 16) { label[p + w] = id; stack.push(p + w); }
    }
    sizes.push({ n, minX, maxX });
  }
  if (!sizes.length) return 0;
  const maior = Math.max(...sizes.map((c) => c.n));
  const manter = sizes.map((c) => {
    if (c.n === maior) return true; // o personagem
    if (c.n < maior * minRatio) return false;
    if (ladoInterno === 'esq' && c.maxX >= w - 1) return false; // vazou do vizinho
    if (ladoInterno === 'dir' && c.minX <= 0) return false;
    return true;
  });
  let apagados = 0;
  for (let i = 0; i < w * h; i++) {
    const id = label[i];
    if (id === -1) {
      // pixel de alpha baixo que sobrou fora de qualquer componente
      if (data[i * 4 + 3] > 0) { data[i * 4 + 3] = 0; apagados++; }
      continue;
    }
    if (!manter[id]) {
      data[i * 4 + 3] = 0;
      data[i * 4] = data[i * 4 + 1] = data[i * 4 + 2] = 255;
      apagados++;
    }
  }
  return apagados;
}

// Escala pela ALTURA (não largura) pra o personagem ter sempre o mesmo tamanho
// entre fantasias, mesmo quando uma delas é mais larga (halteres da musculação).
function resizeToHeight(img, targetH) {
  const targetW = Math.max(1, Math.round((img.width * targetH) / img.height));
  const { width, height, data } = img;
  const out = new Uint8Array(targetW * targetH * 4);
  const sx = width / targetW;
  const sy = height / targetH;
  for (let y = 0; y < targetH; y++) {
    const y0 = Math.floor(y * sy);
    const y1 = Math.max(y0 + 1, Math.min(height, Math.ceil((y + 1) * sy)));
    for (let x = 0; x < targetW; x++) {
      const x0 = Math.floor(x * sx);
      const x1 = Math.max(x0 + 1, Math.min(width, Math.ceil((x + 1) * sx)));
      let r = 0, g = 0, b = 0, a = 0, n = 0;
      for (let yy = y0; yy < y1; yy++) {
        for (let xx = x0; xx < x1; xx++) {
          const d = (yy * width + xx) * 4;
          const al = data[d + 3] / 255;
          r += data[d] * al; g += data[d + 1] * al; b += data[d + 2] * al; a += data[d + 3];
          n++;
        }
      }
      const d = (y * targetW + x) * 4;
      const am = a / n;
      const alNorm = am / 255;
      out[d] = alNorm > 0 ? Math.min(255, Math.round(r / n / alNorm)) : 255;
      out[d + 1] = alNorm > 0 ? Math.min(255, Math.round(g / n / alNorm)) : 255;
      out[d + 2] = alNorm > 0 ? Math.min(255, Math.round(b / n / alNorm)) : 255;
      out[d + 3] = Math.round(am);
    }
  }
  return { width: targetW, height: targetH, data: out };
}

// Coloca a arte num canvas fixo, centralizada na horizontal e alinhada pela
// base (pés sempre na mesma linha, independente da fantasia).
function padToCanvas(img, canvasW, canvasH, bottomMargin = 0) {
  const out = new Uint8Array(canvasW * canvasH * 4);
  for (let i = 0; i < out.length; i += 4) out[i] = out[i + 1] = out[i + 2] = 255;
  const offX = Math.round((canvasW - img.width) / 2);
  const offY = canvasH - bottomMargin - img.height;
  for (let y = 0; y < img.height; y++) {
    const ty = y + offY;
    if (ty < 0 || ty >= canvasH) continue;
    for (let x = 0; x < img.width; x++) {
      const tx = x + offX;
      if (tx < 0 || tx >= canvasW) continue;
      const s = (y * img.width + x) * 4;
      const d = (ty * canvasW + tx) * 4;
      out[d] = img.data[s]; out[d + 1] = img.data[s + 1];
      out[d + 2] = img.data[s + 2]; out[d + 3] = img.data[s + 3];
    }
  }
  return { width: canvasW, height: canvasH, data: out };
}

// Quantização leve: arte chapada não perde nada visível e o PNG comprime ~2x melhor.
function quantize(img, step = 8) {
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    if (d[i + 3] === 0) continue;
    d[i] = Math.min(255, Math.round(d[i] / step) * step);
    d[i + 1] = Math.min(255, Math.round(d[i + 1] / step) * step);
    d[i + 2] = Math.min(255, Math.round(d[i + 2] / step) * step);
  }
  return img;
}

// Divide uma arte "2 em 1" (Gemini devolve dois personagens lado a lado).
function metade(img, lado) {
  const w = Math.floor(img.width / 2);
  const h = img.height;
  const out = new Uint8Array(w * h * 4);
  const x0 = lado === 'esq' ? 0 : img.width - w;
  for (let y = 0; y < h; y++) {
    const s = (y * img.width + x0) * 4;
    out.set(img.data.subarray(s, s + w * 4), y * w * 4);
  }
  return { width: w, height: h, data: out };
}

module.exports = {
  decodePNG, encodePNG, removeWhiteBackground, trimTransparent,
  resize, resizeToHeight, padToCanvas, quantize, metade, keepLargestComponent,
};

if (require.main === module) {
  const [, , inFile, outFile, wArg] = process.argv;
  const targetW = wArg ? parseInt(wArg, 10) : 440;
  const src = fs.readFileSync(inFile);
  let img = decodePNG(src);
  const before = img.width + 'x' + img.height;
  removeWhiteBackground(img);
  img = trimTransparent(img);
  img = resize(img, targetW);
  const out = encodePNG(img);
  fs.writeFileSync(outFile, out);
  console.log(
    `${inFile.split(/[\\/]/).pop()}: ${before} ${(src.length / 1024).toFixed(0)}KB -> ${img.width}x${img.height} ${(out.length / 1024).toFixed(0)}KB`
  );
}
