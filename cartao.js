// Exporta o resultado como imagem, pra subir em outro app.
//
// Desenha direto no canvas em vez de usar biblioteca de "printar DOM": o card
// é simples (fundo, borda, mascote e quatro linhas de texto) e desenhar à mão
// é determinístico, sem dependência e sem os problemas de fonte e CORS que as
// bibliotecas de captura têm.

const LARGURA = 1080;
const ALTURA = 1350; // 4:5, proporção que a maioria dos apps aceita sem cortar

const COR = {
  fundo: '#faf9f6',
  cartao: '#ffffff',
  borda: '#84cc16',
  titulo: '#4d7c0f',
  texto: '#1f2937',
  suave: '#6b7280',
  fraco: '#9ca3af',
};

function fonte(peso, tamanho) {
  // Nunito é a fonte do site; as alternativas cobrem o caso de ela não ter
  // carregado, pra não cair numa serifada que destoa.
  return `${peso} ${tamanho}px Nunito, 'Trebuchet MS', sans-serif`;
}

function retanguloArredondado(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function carregarImagem(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`não carregou: ${src}`));
    img.src = src;
  });
}

// Espera a fonte estar pronta antes de medir e desenhar texto: sem isso o
// primeiro compartilhamento sai com a fonte alternativa e o espaçamento errado.
async function esperarFonte() {
  if (!document.fonts) return;
  try {
    await document.fonts.load(fonte(900, 120));
    await document.fonts.load(fonte(700, 40));
    await document.fonts.ready;
  } catch {
    /* segue com a fonte alternativa */
  }
}

export async function desenharCartao({ kcal, exercicio, duracaoMin, data, imagem }) {
  await esperarFonte();
  const mascote = await carregarImagem(imagem);

  const canvas = document.createElement('canvas');
  canvas.width = LARGURA;
  canvas.height = ALTURA;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = COR.fundo;
  ctx.fillRect(0, 0, LARGURA, ALTURA);

  const m = 40;
  retanguloArredondado(ctx, m, m, LARGURA - m * 2, ALTURA - m * 2, 48);
  ctx.fillStyle = COR.cartao;
  ctx.fill();
  ctx.lineWidth = 10;
  ctx.strokeStyle = COR.borda;
  ctx.stroke();

  ctx.textAlign = 'center';
  const meio = LARGURA / 2;

  ctx.fillStyle = COR.titulo;
  ctx.font = fonte(900, 68);
  ctx.fillText('Caloricio', meio, 160);

  // Mascote proporcional, ancorado pela base para o chão ficar sempre na mesma
  // linha independentemente da fantasia.
  const alturaMascote = 640;
  const larguraMascote = (mascote.naturalWidth / mascote.naturalHeight) * alturaMascote;
  const baseMascote = 830;
  ctx.drawImage(mascote, meio - larguraMascote / 2, baseMascote - alturaMascote, larguraMascote, alturaMascote);

  // sombra elíptica, o mesmo recurso da tela pra ele não parecer flutuando
  ctx.save();
  ctx.globalAlpha = 0.15;
  ctx.fillStyle = COR.texto;
  ctx.beginPath();
  ctx.ellipse(meio, baseMascote - 18, larguraMascote * 0.21, 16, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.fillStyle = COR.suave;
  ctx.font = fonte(700, 38);
  ctx.fillText('Você queimou aproximadamente', meio, 950);

  ctx.fillStyle = COR.titulo;
  ctx.font = fonte(900, 130);
  ctx.fillText(`${kcal} kcal`, meio, 1090);

  ctx.fillStyle = COR.texto;
  ctx.font = fonte(700, 40);
  // Nome de exercício longo não pode vazar da borda do card.
  const larguraMax = LARGURA - m * 2 - 80;
  let linha = `${exercicio} · ${duracaoMin} min`;
  if (ctx.measureText(linha).width > larguraMax) {
    ctx.font = fonte(700, 32);
    if (ctx.measureText(linha).width > larguraMax) {
      while (linha.length > 8 && ctx.measureText(`${linha}…`).width > larguraMax) {
        linha = linha.slice(0, -1);
      }
      linha += '…';
    }
  }
  ctx.fillText(linha, meio, 1165);

  ctx.fillStyle = COR.fraco;
  ctx.font = fonte(700, 32);
  ctx.fillText(data, meio, 1225);

  return canvas;
}

function paraBlob(canvas) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('canvas não gerou imagem'))), 'image/png');
  });
}

function baixar(blob, nome) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nome;
  document.body.appendChild(a);
  a.click();
  a.remove();
  // revoga depois do clique; revogar antes cancelaria o download em alguns navegadores
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}

// Compartilha a imagem. No celular usa o compartilhamento nativo, que entrega
// direto no outro app; no desktop (e onde a API não aceita arquivo) baixa.
// Devolve como terminou, pra interface poder avisar.
export async function compartilharCartao(dados) {
  const canvas = await desenharCartao(dados);
  const blob = await paraBlob(canvas);
  const nomeArquivo = `caloricio-${dados.data.replace(/\//g, '-')}.png`;
  const arquivo = new File([blob], nomeArquivo, { type: 'image/png' });

  if (navigator.canShare?.({ files: [arquivo] })) {
    try {
      await navigator.share({
        files: [arquivo],
        title: 'Caloricio',
        text: `${dados.exercicio} · ${dados.duracaoMin} min · ${dados.kcal} kcal`,
      });
      return 'compartilhado';
    } catch (e) {
      // cancelar o menu de compartilhamento não é erro: não force um download
      // que a pessoa não pediu.
      if (e?.name === 'AbortError') return 'cancelado';
    }
  }

  baixar(blob, nomeArquivo);
  return 'baixado';
}
