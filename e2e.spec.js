// Testes de fluxo em navegador de verdade.
//
// Os outros arquivos cobrem fórmula, regras do mascote e preferências — lógica
// pura, sem DOM. A camada de interface ficava descoberta, e foi ali que um bug
// chegou em produção: o painel do seletor continuava capturando cliques depois
// de fechado, porque `display: flex` no CSS vence o atributo `hidden`. Isso é
// layout calculado; só um navegador de verdade percebe.
//
// Nome `.spec.js` de propósito: `node --test` não descobre esse padrão, então
// `npm test` continua rodando só a lógica, sem exigir navegador instalado.
// Este arquivo roda por `npm run test:e2e`.
import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const RAIZ = process.cwd();
const TIPOS = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.webmanifest': 'application/manifest+json',
};

let servidor;
let navegador;
let base;

before(async () => {
  servidor = http.createServer((req, res) => {
    // corta a query antes de decidir se é a raiz, senão "/?x=1" vira 404
    let caminho = req.url.split('?')[0];
    if (caminho === '/' || caminho === '') caminho = '/index.html';
    const arquivo = path.join(RAIZ, decodeURIComponent(caminho));
    fs.readFile(arquivo, (erro, dados) => {
      if (erro) {
        res.writeHead(404);
        res.end('404');
        return;
      }
      res.writeHead(200, {
        'Content-Type': TIPOS[path.extname(arquivo)] ?? 'application/octet-stream',
      });
      res.end(dados);
    });
  });
  await new Promise((r) => servidor.listen(0, '127.0.0.1', r));
  base = `http://127.0.0.1:${servidor.address().port}`;
  navegador = await chromium.launch();
});

after(async () => {
  await navegador?.close();
  await new Promise((r) => servidor.close(r));
});

// Contexto novo a cada teste: localStorage limpo e sem service worker de um
// teste anterior servindo código velho por cima do que acabou de mudar.
async function novoContexto() {
  const contexto = await navegador.newContext({ serviceWorkers: 'block' });
  // Corta qualquer requisição pra fora (a fonte do Google): o resultado do
  // teste não pode depender da internet estar de pé.
  await contexto.route('**/*', (rota) => {
    const host = new URL(rota.request().url()).hostname;
    return host === '127.0.0.1' || host === 'localhost' ? rota.continue() : rota.abort();
  });
  return contexto;
}

async function abrirApp(contexto) {
  const pagina = await contexto.newPage();
  const erros = [];
  pagina.on('pageerror', (e) => erros.push(String(e)));
  await pagina.goto(base);
  // app.js pronto = já trocou o pixel transparente do HTML pela arte inicial
  await pagina.waitForFunction(() =>
    document.getElementById('mascote-img').getAttribute('src').startsWith('img/')
  );
  return { pagina, erros };
}

async function preencherPessoais(pagina) {
  await pagina.fill('#idade', '35');
  await pagina.fill('#altura', '180');
  await pagina.fill('#peso', '120');
}

async function escolherExercicio(pagina, categoria, indice) {
  await pagina.click('#seletor-botao');
  await pagina.waitForSelector('#seletor-lista [role="option"]');
  await pagina.click(`#seletor-lista [role="option"][data-categoria="${categoria}"]`);
  await pagina.waitForFunction(
    (c) => document.getElementById('seletor-titulo').textContent === c,
    categoria
  );
  await pagina.locator('#seletor-lista [role="option"]').nth(indice).click();
  // fecharPainel só marca hidden depois da transição de 200ms
  await pagina.waitForFunction(() => document.getElementById('seletor-painel').hidden === true);
}

// Homem, 35 anos, 180cm, 120kg -> TMB 2155. Corrida leve (MET 8.3) por 50 min
// -> 2155/1440 * 8.3 * 50 = 621,06 -> "621".
async function calcularCorrida50(pagina) {
  await escolherExercicio(pagina, 'Corrida', 0);
  await preencherPessoais(pagina);
  await pagina.fill('#duracao', '50');
  await pagina.click('.calcular');
  await pagina.waitForSelector('#resultado:not([hidden])');
}

test('seletor navega categoria -> exercício e devolve a escolha', async () => {
  const contexto = await novoContexto();
  const { pagina, erros } = await abrirApp(contexto);
  await escolherExercicio(pagina, 'Lutas', 1);
  assert.equal(await pagina.textContent('#seletor-valor'), 'Boxe (treino/sparring)');
  // o boxe tem fantasia própria dentro de Lutas
  assert.match(await pagina.getAttribute('#mascote-img', 'src'), /caloricio-boxe-normal/);
  assert.deepEqual(erros, []);
  await contexto.close();
});

// Este teste existe por causa do bug que chegou em produção: o painel ficava
// invisível (opacity 0) mas continuava ocupando o centro da tela e comendo
// todos os cliques.
test('painel fechado não intercepta clique no meio da tela', async () => {
  const contexto = await novoContexto();
  const { pagina } = await abrirApp(contexto);
  await escolherExercicio(pagina, 'Corrida', 0);

  const estado = await pagina.evaluate(() => {
    const painel = document.getElementById('seletor-painel');
    const fundo = document.getElementById('seletor-fundo');
    const alvo = document.elementFromPoint(window.innerWidth / 2, window.innerHeight / 2);
    return {
      displayPainel: getComputedStyle(painel).display,
      displayFundo: getComputedStyle(fundo).display,
      cliqueCaiuNoPainel: painel.contains(alvo) || fundo.contains(alvo),
    };
  });
  assert.equal(estado.displayPainel, 'none', 'painel fechado tem que sair do fluxo do layout');
  assert.equal(estado.displayFundo, 'none', 'fundo fechado tem que sair do fluxo do layout');
  assert.equal(estado.cliqueCaiuNoPainel, false, 'painel fechado não pode receber o clique');

  // a prova de verdade: o formulário volta a responder
  await preencherPessoais(pagina);
  await pagina.fill('#duracao', '50');
  await pagina.click('.calcular');
  await pagina.waitForSelector('#resultado:not([hidden])');
  assert.equal(await pagina.textContent('#kcal'), '621');
  await contexto.close();
});

test('reabrir o seletor cai direto no nível do exercício já escolhido', async () => {
  const contexto = await novoContexto();
  const { pagina } = await abrirApp(contexto);
  await escolherExercicio(pagina, 'Natação', 1);
  await pagina.click('#seletor-botao');
  await pagina.waitForSelector('#seletor-lista [role="option"]');
  assert.equal(await pagina.textContent('#seletor-titulo'), 'Natação');
  const marcado = pagina.locator('#seletor-lista [role="option"][aria-selected="true"] .seletor-nome');
  assert.equal(await marcado.textContent(), 'Natação moderada');
  await contexto.close();
});

test('Escape fecha o painel e devolve o foco ao botão', async () => {
  const contexto = await novoContexto();
  const { pagina } = await abrirApp(contexto);
  await pagina.click('#seletor-botao');
  await pagina.waitForSelector('#seletor-lista [role="option"]');
  await pagina.keyboard.press('Escape');
  await pagina.waitForFunction(() => document.getElementById('seletor-painel').hidden === true);
  assert.equal(await pagina.evaluate(() => document.activeElement.id), 'seletor-botao');
  // a trava de rolagem do body precisa sair junto, senão a página fica presa
  assert.equal(
    await pagina.evaluate(() => document.body.classList.contains('sem-rolagem')),
    false
  );
  await contexto.close();
});

test('calcular sem escolher exercício acusa erro e não mostra resultado', async () => {
  const contexto = await novoContexto();
  const { pagina } = await abrirApp(contexto);
  await preencherPessoais(pagina);
  await pagina.fill('#duracao', '30');
  await pagina.click('.calcular');
  assert.equal(await pagina.textContent('#erro-exercicio'), 'Escolha um exercício');
  assert.equal(await pagina.evaluate(() => document.getElementById('resultado').hidden), true);
  await contexto.close();
});

test('valor fora da faixa acusa no campo certo e só nele', async () => {
  const contexto = await novoContexto();
  const { pagina } = await abrirApp(contexto);
  await escolherExercicio(pagina, 'Corrida', 0);
  await pagina.fill('#idade', '35');
  await pagina.fill('#altura', '180');
  await pagina.fill('#peso', '0');
  await pagina.fill('#duracao', '30');
  await pagina.click('.calcular');
  assert.equal(await pagina.textContent('#erro-peso'), 'Peso deve ser entre 1 e 400 kg');
  assert.equal(await pagina.textContent('#erro-idade'), '');
  assert.equal(await pagina.evaluate(() => document.getElementById('resultado').hidden), true);
  await contexto.close();
});

test('atalho de duração preenche, marca e reavalia o mascote', async () => {
  const contexto = await novoContexto();
  const { pagina } = await abrirApp(contexto);
  await escolherExercicio(pagina, 'Corrida', 0);

  await pagina.click('#atalhos-duracao button[data-min="45"]');
  assert.equal(await pagina.inputValue('#duracao'), '45');
  assert.equal(
    await pagina.getAttribute('#atalhos-duracao button[data-min="45"]', 'aria-pressed'),
    'true'
  );
  assert.equal(
    await pagina.getAttribute('#atalhos-duracao button[data-min="30"]', 'aria-pressed'),
    'false'
  );

  // digitar à mão desmarca os atalhos; acima do teto de 180 min o mascote desconfia
  await pagina.fill('#duracao', '200');
  assert.equal(
    await pagina.getAttribute('#atalhos-duracao button[data-min="45"]', 'aria-pressed'),
    'false'
  );
  assert.match(await pagina.getAttribute('#mascote-img', 'src'), /caloricio-corrida-desconfiado/);
  assert.match(await pagina.textContent('#legenda'), /Tem certeza disso/);
  await contexto.close();
});

test('arte que falha cai na genérica em vez de ficar quebrada', async () => {
  const contexto = await novoContexto();
  const { pagina } = await abrirApp(contexto);
  await pagina.evaluate(() => {
    document.getElementById('mascote-img').src = 'img/caloricio-nao-existe-normal.webp';
  });
  await pagina.waitForFunction(() => document.getElementById('mascote-img').naturalWidth > 0);
  assert.match(await pagina.getAttribute('#mascote-img', 'src'), /caloricio-gpt-normal/);
  assert.equal(
    await pagina.getAttribute('#mascote-img', 'alt'),
    'Caloricio te esperando começar'
  );
  await contexto.close();
});

test('exportar baixa um PNG 1080x1350 quando não há compartilhamento nativo', async () => {
  const contexto = await novoContexto();
  const { pagina } = await abrirApp(contexto);
  // desktop sem Web Share: o app tem que cair no download
  await pagina.evaluate(() => {
    delete navigator.canShare;
    delete navigator.share;
  });
  await calcularCorrida50(pagina);

  const [download] = await Promise.all([
    pagina.waitForEvent('download'),
    pagina.click('#compartilhar'),
  ]);
  const arquivo = await download.path();
  const bytes = fs.readFileSync(arquivo);

  // assinatura PNG + largura/altura do bloco IHDR
  assert.deepEqual([...bytes.subarray(0, 4)], [0x89, 0x50, 0x4e, 0x47]);
  assert.equal(bytes.readUInt32BE(16), 1080);
  assert.equal(bytes.readUInt32BE(20), 1350);
  assert.match(download.suggestedFilename(), /^caloricio-.*\.png$/);
  await pagina.waitForFunction(
    () => document.getElementById('acoes-aviso').textContent !== ''
  );
  assert.equal(await pagina.textContent('#acoes-aviso'), 'Imagem salva nos seus downloads.');
  await contexto.close();
});

// Cancelar o menu de compartilhamento não é erro: baixar assim mesmo entregaria
// um arquivo que a pessoa acabou de recusar.
test('cancelar o compartilhamento não força um download', async () => {
  const contexto = await novoContexto();
  const { pagina } = await abrirApp(contexto);
  await pagina.evaluate(() => {
    navigator.canShare = () => true;
    navigator.share = () => Promise.reject(Object.assign(new Error('cancelou'), { name: 'AbortError' }));
  });
  await calcularCorrida50(pagina);

  let baixou = false;
  pagina.on('download', () => {
    baixou = true;
  });
  await pagina.click('#compartilhar');
  await pagina.waitForFunction(
    () => document.getElementById('compartilhar').disabled === false
  );
  assert.equal(baixou, false, 'cancelar não pode virar download');
  assert.equal(await pagina.textContent('#acoes-aviso'), '');
  await contexto.close();
});

test('dados pessoais voltam na visita seguinte', async () => {
  const contexto = await novoContexto();
  const { pagina } = await abrirApp(contexto);
  await calcularCorrida50(pagina);

  // mesma origem, mesmo storage, página nova
  const { pagina: pagina2 } = await abrirApp(contexto);
  await pagina2.waitForSelector('#lembrete:not([hidden])');
  assert.equal(await pagina2.inputValue('#idade'), '35');
  assert.equal(await pagina2.inputValue('#altura'), '180');
  assert.equal(await pagina2.inputValue('#peso'), '120');

  await pagina2.click('#esquecer');
  assert.equal(await pagina2.inputValue('#peso'), '');
  const { pagina: pagina3 } = await abrirApp(contexto);
  assert.equal(await pagina3.inputValue('#peso'), '');
  await contexto.close();
});
