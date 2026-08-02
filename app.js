// Camada de UI: única parte que toca o DOM. calc.js e mascote.js são puros.
// Todo conteúdo dinâmico entra via textContent — nunca innerHTML.
import { computeBMR, computeGasto, validarCampos, agruparPorCategoria } from './calc.js';
import { estadoDoMascote, DESCRICOES_VISUAL, definirFormatoImagem } from './mascote.js';
import { criarSeletorExercicio } from './seletor.js';
import { criarPreferencias, CAMPOS } from './preferencias.js';

const form = document.getElementById('form');
const mascote = document.getElementById('mascote');
const mascoteImg = document.getElementById('mascote-img');
const legenda = document.getElementById('legenda');
const resultado = document.getElementById('resultado');
const kcalEl = document.getElementById('kcal');
const detalheEl = document.getElementById('detalhe');

// O seletor é alimentado pela mesma tabela MET do cálculo (fonte única).
const seletor = criarSeletorExercicio({
  grupos: agruparPorCategoria(),
  aoEscolher: (item) => {
    seletor.marcarErro(false);
    aplicarMascote(estadoDoMascote(item.categoria, duracaoAtual(), item.nome));
  },
});

function exercicioSelecionado() {
  return seletor.valor;
}

function duracaoAtual() {
  return Number(document.getElementById('duracao').value) || null;
}

let fimDaReacao = null;
let estadoAtual = null;

function aplicarMascote(estado) {
  const mudou = mascoteImg.getAttribute('src') !== estado.imagem;
  estadoAtual = estado;
  mascoteImg.src = estado.imagem;
  mascoteImg.alt = estado.descricao;
  legenda.textContent = estado.legenda;
  if (estado.imagemPiscando) precarregar(estado.imagemPiscando);
  if (!mudou) return;
  mascote.classList.remove('reagindo', 'pulando');
  // reinicia a animação mesmo em trocas consecutivas
  void mascote.offsetWidth;
  mascote.classList.add('reagindo');
  // a classe precisa sair no fim, senão o pulinho espontâneo fica bloqueado
  clearTimeout(fimDaReacao);
  fimDaReacao = setTimeout(() => mascote.classList.remove('reagindo'), 650);
}

function mostrarErros(erros) {
  for (const campo of ['idade', 'altura', 'peso', 'duracao']) {
    const wrapper = document.getElementById(campo).closest('.campo');
    const erroEl = document.getElementById(`erro-${campo}`);
    erroEl.textContent = erros[campo] ?? '';
    wrapper.classList.toggle('invalido', Boolean(erros[campo]));
  }
}

// A reação em tempo real ao escolher o exercício acontece no callback
// aoEscolher do seletor. Aqui só falta reavaliar o "desconfiado" quando a
// duração muda depois de o exercício já estar escolhido.
document.getElementById('duracao').addEventListener('input', () => {
  const item = exercicioSelecionado();
  if (!item) return;
  aplicarMascote(estadoDoMascote(item.categoria, duracaoAtual(), item.nome));
});

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const valores = {
    sexo: document.getElementById('sexo').value,
    idade: document.getElementById('idade').value,
    altura: document.getElementById('altura').value,
    peso: document.getElementById('peso').value,
    duracao: document.getElementById('duracao').value,
  };

  const { ok, erros } = validarCampos(valores);
  const item = exercicioSelecionado();
  document.getElementById('erro-exercicio').textContent = item ? '' : 'Escolha um exercício';
  seletor.marcarErro(!item);
  if (!item) seletor.focar();
  mostrarErros(erros);
  if (!ok || !item) {
    // não deixa um resultado antigo visível junto de um formulário inválido
    resultado.hidden = true;
    resultado.classList.remove('visivel');
    return;
  }

  const bmr = computeBMR({
    sexo: valores.sexo,
    idade: Number(valores.idade),
    altura: Number(valores.altura),
    peso: Number(valores.peso),
  });
  const duracaoMin = Number(valores.duracao);
  const gasto = computeGasto(bmr, item.met, duracaoMin);

  // Grava só depois de um cálculo válido: assim o que fica salvo é sempre um
  // conjunto que passou na validação, não rascunho de digitação.
  guardarDados();

  kcalEl.textContent = String(Math.round(gasto)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  detalheEl.textContent = `${item.nome} por ${duracaoMin} min · TMB ${Math.round(bmr)} kcal/dia`;

  aplicarMascote(estadoDoMascote(item.categoria, duracaoMin, item.nome));

  // reveal com transição: hidden → visível no próximo frame
  resultado.hidden = false;
  resultado.classList.remove('visivel');
  requestAnimationFrame(() => {
    requestAnimationFrame(() => resultado.classList.add('visivel'));
  });
});

// Pulinho espontâneo em intervalo irregular. Só roda com a aba visível e
// respeita quem pediu menos movimento no sistema.
const menosMovimento = window.matchMedia('(prefers-reduced-motion: reduce)');

// Mantém os quadros de piscada em cache: trocar o src sem o arquivo carregado
// deixaria o mascote sem imagem por um instante, o que aparece feio num
// intervalo de 110ms.
const jaCarregadas = new Set();
function precarregar(caminho) {
  if (jaCarregadas.has(caminho)) return;
  jaCarregadas.add(caminho);
  new Image().src = caminho;
}

// Piscada: troca o quadro por ~110ms. De vez em quando pisca duas vezes
// seguidas, que é o que pessoas de verdade fazem.
function piscar() {
  const alvo = estadoAtual?.imagemPiscando;
  if (!alvo || !jaCarregadas.has(alvo)) return;
  const aberto = estadoAtual.imagem;
  const fechar = () => {
    if (estadoAtual?.imagem !== aberto) return;
    mascoteImg.src = alvo;
    setTimeout(() => {
      if (estadoAtual?.imagem === aberto) mascoteImg.src = aberto;
    }, 110);
  };
  fechar();
  if (Math.random() < 0.3) setTimeout(fechar, 260);
}

function agendarPiscada() {
  const espera = 2800 + Math.random() * 4200;
  setTimeout(() => {
    if (!document.hidden && !menosMovimento.matches && !seletor.estaAberto()) piscar();
    agendarPiscada();
  }, espera);
}

function agendarPulinho() {
  const espera = 6000 + Math.random() * 7000;
  setTimeout(() => {
    // não pula com o painel de seleção aberto: rouba atenção de quem escolhe
    if (
      !document.hidden &&
      !menosMovimento.matches &&
      !seletor.estaAberto() &&
      !mascote.classList.contains('reagindo')
    ) {
      mascote.classList.add('pulando');
      setTimeout(() => mascote.classList.remove('pulando'), 900);
    }
    agendarPulinho();
  }, espera);
}

// --- Dados pessoais entre visitas ---
// localStorage pode simplesmente não existir (contexto sem permissão), por isso
// o acesso vai dentro de try.
const preferencias = criarPreferencias(
  (() => {
    try {
      return window.localStorage;
    } catch {
      return { getItem: () => null, setItem: () => {}, removeItem: () => {} };
    }
  })()
);

const lembrete = document.getElementById('lembrete');

function restaurarDados() {
  const dados = preferencias.carregar();
  if (!dados) return;
  for (const campo of CAMPOS) {
    if (dados[campo] !== undefined) document.getElementById(campo).value = dados[campo];
  }
  lembrete.hidden = false;
}

function guardarDados() {
  if (!preferencias.disponivel) return;
  const dados = Object.fromEntries(CAMPOS.map((c) => [c, document.getElementById(c).value]));
  if (preferencias.salvar(dados)) lembrete.hidden = false;
}

document.getElementById('esquecer').addEventListener('click', () => {
  preferencias.limpar();
  for (const campo of CAMPOS) {
    const el = document.getElementById(campo);
    if (campo === 'sexo') el.selectedIndex = 0;
    else el.value = '';
  }
  lembrete.hidden = true;
  document.getElementById('idade').focus();
});

// Detecta WebP de forma síncrona: canvas.toDataURL devolve o PNG pedido de
// volta quando o formato não é suportado. Precisa ser antes do primeiro
// desenho, senão o mascote carregaria em PNG e trocaria de arquivo depois.
function suportaWebp() {
  try {
    const c = document.createElement('canvas');
    c.width = c.height = 1;
    return c.toDataURL('image/webp').startsWith('data:image/webp');
  } catch {
    return false;
  }
}

if (suportaWebp()) definirFormatoImagem('webp');

// Estado inicial: a arte genérica, mas com a descrição de "ainda não escolheu"
// em vez da descrição da fantasia genérica.
aplicarMascote({ ...estadoDoMascote(null, null), descricao: DESCRICOES_VISUAL.neutro });
restaurarDados();

// Offline: o app é usado na academia, onde o sinal costuma ser ruim. Falha aqui
// não pode derrubar nada — sem service worker o site simplesmente funciona
// online, como antes. Só roda em contexto seguro (HTTPS ou localhost).
if ('serviceWorker' in navigator && window.isSecureContext) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}
agendarPulinho();
agendarPiscada();
