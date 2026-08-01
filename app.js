// Camada de UI: única parte que toca o DOM. calc.js e mascote.js são puros.
// Todo conteúdo dinâmico entra via textContent — nunca innerHTML.
import { computeBMR, computeGasto, validarCampos, agruparPorCategoria } from './calc.js';
import { estadoDoMascote, DESCRICOES_VISUAL } from './mascote.js';
import { criarSeletorExercicio } from './seletor.js';

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
    aplicarMascote(estadoDoMascote(item.categoria, duracaoAtual()));
  },
});

function exercicioSelecionado() {
  return seletor.valor;
}

function duracaoAtual() {
  return Number(document.getElementById('duracao').value) || null;
}

let fimDaReacao = null;

function aplicarMascote(estado) {
  const mudou = mascoteImg.getAttribute('src') !== estado.imagem;
  mascoteImg.src = estado.imagem;
  mascoteImg.alt = estado.descricao;
  legenda.textContent = estado.legenda;
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
  aplicarMascote(estadoDoMascote(item.categoria, duracaoAtual()));
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

  kcalEl.textContent = String(Math.round(gasto)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  detalheEl.textContent = `${item.nome} por ${duracaoMin} min · TMB ${Math.round(bmr)} kcal/dia`;

  aplicarMascote(estadoDoMascote(item.categoria, duracaoMin));

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

mascoteImg.alt = DESCRICOES_VISUAL.neutro;
agendarPulinho();
