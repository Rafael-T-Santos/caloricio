// Camada de UI: única parte que toca o DOM. calc.js e mascote.js são puros.
// Todo conteúdo dinâmico entra via textContent — nunca innerHTML.
import { MET_TABLE, computeBMR, computeGasto, validarCampos, agruparPorCategoria } from './calc.js';
import { estadoDoMascote, DESCRICOES_VISUAL } from './mascote.js';

const form = document.getElementById('form');
const selectExercicio = document.getElementById('exercicio');
const mascote = document.getElementById('mascote');
const legenda = document.getElementById('legenda');
const mascoteDesc = document.getElementById('mascote-desc');
const resultado = document.getElementById('resultado');
const kcalEl = document.getElementById('kcal');
const detalheEl = document.getElementById('detalhe');

// Dropdown gerado da tabela MET (fonte única) com optgroup por categoria.
function montarDropdown() {
  const placeholder = document.createElement('option');
  placeholder.value = '';
  placeholder.textContent = 'Selecione o exercício...';
  placeholder.disabled = true;
  placeholder.selected = true;
  selectExercicio.appendChild(placeholder);

  for (const grupo of agruparPorCategoria()) {
    const optgroup = document.createElement('optgroup');
    optgroup.label = grupo.categoria;
    for (const item of grupo.itens) {
      const option = document.createElement('option');
      option.value = item.nome;
      option.textContent = `${item.nome} — MET ${item.met.toLocaleString('pt-BR')}`;
      optgroup.appendChild(option);
    }
    selectExercicio.appendChild(optgroup);
  }
}

function exercicioSelecionado() {
  return MET_TABLE.find((i) => i.nome === selectExercicio.value) ?? null;
}

function aplicarMascote(estado) {
  const mudou =
    mascote.dataset.visual !== estado.visual ||
    mascote.dataset.desconfiado !== String(estado.desconfiado);
  mascote.dataset.visual = estado.visual;
  mascote.dataset.desconfiado = String(estado.desconfiado);
  legenda.textContent = estado.legenda;
  mascoteDesc.textContent = estado.descricao;
  if (mudou) {
    mascote.classList.remove('reagindo');
    // reinicia a animação de pulo mesmo em trocas consecutivas
    void mascote.offsetWidth;
    mascote.classList.add('reagindo');
  }
}

function mostrarErros(erros) {
  for (const campo of ['idade', 'altura', 'peso', 'duracao']) {
    const wrapper = document.getElementById(campo).closest('.campo');
    const erroEl = document.getElementById(`erro-${campo}`);
    erroEl.textContent = erros[campo] ?? '';
    wrapper.classList.toggle('invalido', Boolean(erros[campo]));
  }
}

// Reação em tempo real: ao escolher o exercício o Caloricio já se veste,
// antes mesmo de calcular.
selectExercicio.addEventListener('change', () => {
  const item = exercicioSelecionado();
  if (!item) return;
  const duracao = Number(document.getElementById('duracao').value) || null;
  aplicarMascote(estadoDoMascote(item.categoria, duracao));
});

// Se a duração mudar depois do exercício escolhido, reavalia o desconfiado.
document.getElementById('duracao').addEventListener('input', () => {
  const item = exercicioSelecionado();
  if (!item) return;
  const duracao = Number(document.getElementById('duracao').value) || null;
  aplicarMascote(estadoDoMascote(item.categoria, duracao));
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
  if (!item) {
    erros.exercicio = true;
    selectExercicio.focus();
  }
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

montarDropdown();
mascoteDesc.textContent = DESCRICOES_VISUAL.neutro;
