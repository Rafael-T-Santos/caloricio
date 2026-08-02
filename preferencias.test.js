import test from 'node:test';
import assert from 'node:assert/strict';
import { criarPreferencias, saneia, CHAVE } from './preferencias.js';

function storageFalso({ quebraAoGravar = false } = {}) {
  const mapa = new Map();
  return {
    getItem: (k) => (mapa.has(k) ? mapa.get(k) : null),
    setItem: (k, v) => {
      if (quebraAoGravar) throw new Error('QuotaExceeded');
      mapa.set(k, String(v));
    },
    removeItem: (k) => mapa.delete(k),
    _mapa: mapa,
  };
}

test('saneia aceita dados válidos', () => {
  const r = saneia({ sexo: 'M', idade: '35', altura: '180', peso: '120' });
  assert.deepEqual(r, { sexo: 'M', idade: '35', altura: '180', peso: '120' });
});

test('saneia descarta valores fora de faixa e sexo inválido', () => {
  const r = saneia({ sexo: 'X', idade: '200', altura: '180', peso: '0' });
  assert.deepEqual(r, { altura: '180' });
});

test('saneia devolve null para lixo', () => {
  assert.equal(saneia(null), null);
  assert.equal(saneia('texto'), null);
  assert.equal(saneia({ idade: 'abc' }), null);
});

test('salva e carrega de volta', () => {
  const p = criarPreferencias(storageFalso());
  assert.equal(p.disponivel, true);
  p.salvar({ sexo: 'F', idade: '28', altura: '165', peso: '60' });
  assert.deepEqual(p.carregar(), { sexo: 'F', idade: '28', altura: '165', peso: '60' });
});

test('não devolve dado corrompido no storage', () => {
  const s = storageFalso();
  s.setItem(CHAVE, '{isso não é json');
  assert.equal(criarPreferencias(s).carregar(), null);
});

test('não devolve dado gravado fora de faixa por versão antiga', () => {
  const s = storageFalso();
  s.setItem(CHAVE, JSON.stringify({ sexo: 'M', idade: '999', altura: '180', peso: '80' }));
  const r = criarPreferencias(s).carregar();
  assert.equal(r.idade, undefined, 'idade absurda não pode voltar');
  assert.equal(r.altura, '180');
});

test('storage que lança ao gravar é tratado como indisponível', () => {
  const p = criarPreferencias(storageFalso({ quebraAoGravar: true }));
  assert.equal(p.disponivel, false);
  assert.equal(p.salvar({ sexo: 'M', idade: '30', altura: '170', peso: '70' }), false);
  assert.equal(p.carregar(), null);
});

test('limpar remove os dados', () => {
  const p = criarPreferencias(storageFalso());
  p.salvar({ sexo: 'M', idade: '35', altura: '180', peso: '120' });
  p.limpar();
  assert.equal(p.carregar(), null);
});
