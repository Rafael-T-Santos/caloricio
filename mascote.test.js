import test from 'node:test';
import assert from 'node:assert/strict';
import {
  TETOS_DURACAO,
  REGRAS,
  FANTASIAS,
  FANTASIA_GENERICA,
  avaliarRegras,
  estadoDoMascote,
  caminhoImagem,
} from './mascote.js';

test('nenhuma regra bate → null (duração normal)', () => {
  assert.equal(avaliarRegras({ categoria: 'Corrida', duracaoMin: 60 }), null);
});

test('uma regra bate → desconfiado (corrida acima do teto)', () => {
  const r = avaliarRegras({ categoria: 'Corrida', duracaoMin: 181 });
  assert.ok(r);
  assert.equal(r.estado, 'desconfiado');
});

test('duração exatamente no teto NÃO dispara (regra é "maior que")', () => {
  assert.equal(avaliarRegras({ categoria: 'Corrida', duracaoMin: 180 }), null);
});

test('2+ regras batem → a de maior prioridade vence, independente da ordem', () => {
  const regras = [
    { trigger: { categoria: 'Corrida', duracaoMinMaiorQue: 100 }, estado: 'a', legenda: 'a', prioridade: 5 },
    { trigger: { categoria: 'Corrida', duracaoMinMaiorQue: 200 }, estado: 'b', legenda: 'b', prioridade: 20 },
    { trigger: { categoria: 'Corrida', duracaoMinMaiorQue: 150 }, estado: 'c', legenda: 'c', prioridade: 10 },
  ];
  const r = avaliarRegras({ categoria: 'Corrida', duracaoMin: 300 }, regras);
  assert.equal(r.estado, 'b');
});

test('toda categoria da tabela de tetos tem uma regra gerada', () => {
  assert.equal(REGRAS.length, Object.keys(TETOS_DURACAO).length);
  for (const regra of REGRAS) {
    assert.equal(regra.estado, 'desconfiado');
    assert.equal(typeof regra.prioridade, 'number');
  }
});

test('categoria com fantasia desenhada veste o visual certo', () => {
  const e = estadoDoMascote('Natação', 45);
  assert.equal(e.visual, 'natacao');
  assert.equal(e.desconfiado, false);
});

test('categoria sem fantasia desenhada cai no visual genérico', () => {
  const e = estadoDoMascote('Lutas', 45);
  assert.equal(e.visual, FANTASIA_GENERICA);
  assert.equal(e.desconfiado, false);
});

test('duração absurda → desconfiado com legenda, mantendo a fantasia da categoria', () => {
  const e = estadoDoMascote('Corrida', 999);
  assert.equal(e.visual, FANTASIAS.Corrida);
  assert.equal(e.desconfiado, true);
  assert.ok(e.legenda.length > 0);
  assert.ok(e.descricao.includes('desconfiado'));
});

test('sem duração informada, mascote só veste a fantasia (sem avaliar regras)', () => {
  const e = estadoDoMascote('Corrida', null);
  assert.equal(e.visual, 'corrida');
  assert.equal(e.desconfiado, false);
});

test('caminhoImagem monta o arquivo certo por visual e estado', () => {
  assert.equal(caminhoImagem('corrida', false), 'img/caloricio-corrida-normal.png');
  assert.equal(caminhoImagem('corrida', true), 'img/caloricio-corrida-desconfiado.png');
  assert.equal(caminhoImagem('neutro', false), `img/caloricio-${FANTASIA_GENERICA}-normal.png`);
});

test('estadoDoMascote inclui o caminho da imagem correspondente', () => {
  const e1 = estadoDoMascote('Natação', 45);
  assert.equal(e1.imagem, 'img/caloricio-natacao-normal.png');
  const e2 = estadoDoMascote('Corrida', 999);
  assert.equal(e2.imagem, 'img/caloricio-corrida-desconfiado.png');
  const e3 = estadoDoMascote('Lutas', 45);
  assert.equal(e3.imagem, `img/caloricio-${FANTASIA_GENERICA}-normal.png`);
});
