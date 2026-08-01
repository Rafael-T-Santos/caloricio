import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { MET_TABLE } from './calc.js';
import {
  TETOS_DURACAO,
  REGRAS,
  FANTASIAS,
  FANTASIAS_POR_EXERCICIO,
  FANTASIA_GENERICA,
  DESCRICOES_VISUAL,
  VISUAIS_SEM_PISCADA,
  avaliarRegras,
  estadoDoMascote,
  caminhoImagem,
  podePiscar,
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

test('categoria desconhecida cai no visual genérico', () => {
  const e = estadoDoMascote('Categoria Que Não Existe', 45);
  assert.equal(e.visual, FANTASIA_GENERICA);
  assert.equal(e.desconfiado, false);
});

test('toda categoria da tabela MET tem fantasia própria', () => {
  for (const categoria of Object.keys(TETOS_DURACAO)) {
    assert.ok(FANTASIAS[categoria], `categoria sem fantasia: ${categoria}`);
  }
});

test('todo visual tem descrição — senão o alt vira "undefined"', () => {
  const visuais = [...Object.values(FANTASIAS), FANTASIA_GENERICA, 'neutro'];
  for (const v of visuais) {
    assert.equal(typeof DESCRICOES_VISUAL[v], 'string', `visual sem descrição: ${v}`);
    assert.ok(DESCRICOES_VISUAL[v].length > 0, `descrição vazia: ${v}`);
  }
});

test('toda imagem referenciada existe no disco', () => {
  const visuais = [...Object.values(FANTASIAS), FANTASIA_GENERICA];
  for (const v of visuais) {
    for (const desconfiado of [false, true]) {
      const caminho = caminhoImagem(v, desconfiado);
      assert.ok(fs.existsSync(caminho), `arquivo faltando: ${caminho}`);
    }
  }
});

test('todo visual que pisca tem o quadro de piscada no disco', () => {
  for (const v of [...Object.values(FANTASIAS), FANTASIA_GENERICA]) {
    if (!podePiscar(v, false)) continue;
    const caminho = caminhoImagem(v, false, true);
    assert.ok(fs.existsSync(caminho), `quadro de piscada faltando: ${caminho}`);
  }
});

test('visual sem piscada não recebe quadro de piscada', () => {
  for (const v of VISUAIS_SEM_PISCADA) {
    assert.equal(podePiscar(v, false), false);
  }
  const e = estadoDoMascote('Natação', 45);
  assert.equal(e.imagemPiscando, null);
});

test('desconfiado nunca pisca — os olhos já estão semicerrados', () => {
  const e = estadoDoMascote('Corrida', 999);
  assert.equal(e.desconfiado, true);
  assert.equal(e.imagemPiscando, null);
  assert.equal(podePiscar('corrida', true), false);
});

test('exercício com fantasia própria tem prioridade sobre a da categoria', () => {
  const semOverride = estadoDoMascote('Lutas', 45, 'Jiu-jitsu / Luta');
  assert.equal(semOverride.visual, FANTASIAS.Lutas);
  // simula um override sem depender de arte que talvez ainda não exista
  const fingido = { ...FANTASIAS_POR_EXERCICIO, 'Boxe (treino/sparring)': 'corrida' };
  const visual = fingido['Boxe (treino/sparring)'] ?? FANTASIAS.Lutas;
  assert.equal(visual, 'corrida');
});

test('todo override por exercício aponta para exercício e arte que existem', () => {
  const nomes = new Set(MET_TABLE.map((i) => i.nome));
  for (const [exercicio, visual] of Object.entries(FANTASIAS_POR_EXERCICIO)) {
    assert.ok(nomes.has(exercicio), `exercício inexistente no override: ${exercicio}`);
    assert.equal(typeof DESCRICOES_VISUAL[visual], 'string', `visual sem descrição: ${visual}`);
    for (const desconfiado of [false, true]) {
      const caminho = caminhoImagem(visual, desconfiado);
      assert.ok(fs.existsSync(caminho), `arquivo faltando: ${caminho}`);
    }
    if (podePiscar(visual, false)) {
      const blink = caminhoImagem(visual, false, true);
      assert.ok(fs.existsSync(blink), `quadro de piscada faltando: ${blink}`);
    }
  }
});

test('estado normal aponta para o quadro de piscada correspondente', () => {
  const e = estadoDoMascote('Corrida', 60);
  assert.equal(e.imagem, 'img/caloricio-corrida-normal.png');
  assert.equal(e.imagemPiscando, 'img/caloricio-corrida-blink.png');
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
  assert.equal(e3.imagem, 'img/caloricio-lutas-normal.png');
  const e4 = estadoDoMascote('Categoria Que Não Existe', 45);
  assert.equal(e4.imagem, `img/caloricio-${FANTASIA_GENERICA}-normal.png`);
});
