import test from 'node:test';
import assert from 'node:assert/strict';
import {
  MET_TABLE,
  computeBMR,
  computeGasto,
  validarCampos,
  agruparPorCategoria,
} from './calc.js';

// Exemplo conhecido da planilha: homem, 35 anos, 180cm, 120kg → TMB 2155
const EXEMPLO = { sexo: 'M', idade: 35, altura: 180, peso: 120 };

test('TMB masculina bate com o exemplo da planilha (2155)', () => {
  assert.equal(computeBMR(EXEMPLO), 2155);
});

test('TMB feminina aplica -161 em vez de +5', () => {
  const tmbF = computeBMR({ ...EXEMPLO, sexo: 'F' });
  assert.equal(tmbF, 2155 - 5 - 161);
});

test('Caminhada leve (MET 3,0) por 30min → 135 kcal arredondado, como na planilha', () => {
  const gasto = computeGasto(2155, 3.0, 30);
  assert.equal(Math.round(gasto), 135);
});

test('Corrida leve (MET 8,3) por 30min → ≈373 kcal arredondado', () => {
  const gasto = computeGasto(2155, 8.3, 30);
  assert.equal(Math.round(gasto), 373);
});

test('tabela MET tem 38 atividades em 10 categorias', () => {
  assert.equal(MET_TABLE.length, 38);
  const categorias = new Set(MET_TABLE.map((i) => i.categoria));
  assert.equal(categorias.size, 10);
});

test('validação aceita valores dentro das faixas', () => {
  const r = validarCampos({ idade: 35, altura: 180, peso: 120, duracao: 30 });
  assert.equal(r.ok, true);
  assert.deepEqual(r.erros, {});
});

test('validação rejeita campo vazio como obrigatório', () => {
  const r = validarCampos({ idade: '', altura: 180, peso: 120, duracao: 30 });
  assert.equal(r.ok, false);
  assert.equal(r.erros.idade, 'Campo obrigatório');
});

test('validação rejeita valores fora de faixa (peso 0, idade 200, altura 1800, duração 999999)', () => {
  const r = validarCampos({ idade: 200, altura: 1800, peso: 0, duracao: 999999 });
  assert.equal(r.ok, false);
  assert.ok(r.erros.idade);
  assert.ok(r.erros.altura);
  assert.ok(r.erros.peso);
  assert.ok(r.erros.duracao);
});

test('duração aceita até 1440 e rejeita 1441', () => {
  const ok = validarCampos({ idade: 35, altura: 180, peso: 120, duracao: 1440 });
  assert.equal(ok.ok, true);
  const ruim = validarCampos({ idade: 35, altura: 180, peso: 120, duracao: 1441 });
  assert.equal(ruim.ok, false);
});

test('agrupamento por categoria preserva todas as 38 atividades', () => {
  const grupos = agruparPorCategoria();
  assert.equal(grupos.length, 10);
  const total = grupos.reduce((n, g) => n + g.itens.length, 0);
  assert.equal(total, 38);
  assert.equal(grupos[0].categoria, 'Caminhada');
});
