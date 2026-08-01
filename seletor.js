// Seletor de exercício em dois níveis (categoria -> exercício).
//
// Existe porque o <select> nativo do Android achata os <optgroup>: a lista
// vira 38 itens corridos e a hierarquia que organiza a escolha desaparece.
// Aqui o nível 1 mostra as 10 categorias e o nível 2 os exercícios da
// categoria escolhida, com o MET de cada um.
//
// Só toca o DOM; a fórmula e as regras do mascote seguem em módulos puros.

const ICONES = {
  Caminhada: '🚶',
  Corrida: '🏃',
  Bike: '🚴',
  'Natação': '🏊',
  'Musculação': '🏋️',
  'Funcional/HIIT': '⚡',
  Lutas: '🥊',
  Esportes: '⚽',
  Cardio: '❤️',
  'Bem-estar': '🧘',
};

export function criarSeletorExercicio({ grupos, aoEscolher }) {
  const botao = document.getElementById('seletor-botao');
  const valorEl = document.getElementById('seletor-valor');
  const fundo = document.getElementById('seletor-fundo');
  const painel = document.getElementById('seletor-painel');
  const titulo = document.getElementById('seletor-titulo');
  const lista = document.getElementById('seletor-lista');
  const voltar = document.getElementById('seletor-voltar');
  const fechar = document.getElementById('seletor-fechar');

  let selecionado = null; // { nome, met, categoria }
  let categoriaAberta = null;
  let focoAnterior = null;

  const itensFocaveis = () => [...lista.querySelectorAll('[role="option"]')];

  function montarNivelCategorias() {
    categoriaAberta = null;
    titulo.textContent = 'Escolha a categoria';
    voltar.hidden = true;
    lista.setAttribute('aria-label', 'Categorias de exercício');
    lista.replaceChildren();
    for (const grupo of grupos) {
      const li = document.createElement('li');
      li.className = 'seletor-item';
      li.setAttribute('role', 'option');
      li.tabIndex = -1;
      li.dataset.categoria = grupo.categoria;
      const selecionadaAqui = selecionado && selecionado.categoria === grupo.categoria;
      li.setAttribute('aria-selected', String(Boolean(selecionadaAqui)));

      const icone = document.createElement('span');
      icone.className = 'seletor-icone';
      icone.setAttribute('aria-hidden', 'true');
      icone.textContent = ICONES[grupo.categoria] ?? '•';

      const texto = document.createElement('span');
      texto.className = 'seletor-texto';
      const nome = document.createElement('span');
      nome.className = 'seletor-nome';
      nome.textContent = grupo.categoria;
      const sub = document.createElement('span');
      sub.className = 'seletor-sub';
      sub.textContent = selecionadaAqui
        ? selecionado.nome
        : `${grupo.itens.length} ${grupo.itens.length === 1 ? 'opção' : 'opções'}`;
      texto.append(nome, sub);

      const seta = document.createElement('span');
      seta.className = 'seletor-avanca';
      seta.setAttribute('aria-hidden', 'true');
      seta.textContent = '›';

      li.append(icone, texto, seta);
      li.addEventListener('click', () => montarNivelExercicios(grupo));
      lista.appendChild(li);
    }
  }

  function montarNivelExercicios(grupo) {
    categoriaAberta = grupo;
    titulo.textContent = grupo.categoria;
    voltar.hidden = false;
    lista.setAttribute('aria-label', `Exercícios de ${grupo.categoria}`);
    lista.replaceChildren();
    for (const item of grupo.itens) {
      const li = document.createElement('li');
      li.className = 'seletor-item';
      li.setAttribute('role', 'option');
      li.tabIndex = -1;
      const ativo = selecionado && selecionado.nome === item.nome;
      li.setAttribute('aria-selected', String(Boolean(ativo)));
      if (ativo) li.classList.add('ativo');

      const texto = document.createElement('span');
      texto.className = 'seletor-texto';
      const nome = document.createElement('span');
      nome.className = 'seletor-nome';
      nome.textContent = item.nome;
      const sub = document.createElement('span');
      sub.className = 'seletor-sub';
      sub.textContent = `Intensidade ${item.met.toLocaleString('pt-BR')} MET`;
      texto.append(nome, sub);

      const marca = document.createElement('span');
      marca.className = 'seletor-marca';
      marca.setAttribute('aria-hidden', 'true');
      marca.textContent = ativo ? '✓' : '';

      li.append(texto, marca);
      li.addEventListener('click', () => escolher(item, grupo.categoria));
      lista.appendChild(li);
    }
  }

  function escolher(item, categoria) {
    selecionado = { nome: item.nome, met: item.met, categoria };
    valorEl.textContent = item.nome;
    botao.classList.add('preenchido');
    aoEscolher(selecionado);
    fecharPainel();
  }

  function focarPrimeiro() {
    const itens = itensFocaveis();
    const ativo = itens.find((i) => i.getAttribute('aria-selected') === 'true');
    (ativo ?? itens[0])?.focus();
  }

  function abrirPainel() {
    focoAnterior = document.activeElement;
    // reabre já dentro da categoria escolhida: evita repetir o nível 1 à toa
    if (selecionado) {
      const grupo = grupos.find((g) => g.categoria === selecionado.categoria);
      grupo ? montarNivelExercicios(grupo) : montarNivelCategorias();
    } else {
      montarNivelCategorias();
    }
    fundo.hidden = false;
    painel.hidden = false;
    botao.setAttribute('aria-expanded', 'true');
    document.body.classList.add('sem-rolagem');
    requestAnimationFrame(() => {
      painel.classList.add('aberto');
      fundo.classList.add('aberto');
      focarPrimeiro();
    });
  }

  function fecharPainel() {
    painel.classList.remove('aberto');
    fundo.classList.remove('aberto');
    botao.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('sem-rolagem');
    setTimeout(() => {
      painel.hidden = true;
      fundo.hidden = true;
    }, 200);
    focoAnterior?.focus();
  }

  const aberto = () => !painel.hidden;

  botao.addEventListener('click', abrirPainel);
  fundo.addEventListener('click', fecharPainel);
  fechar.addEventListener('click', fecharPainel);
  voltar.addEventListener('click', () => {
    montarNivelCategorias();
    focarPrimeiro();
  });

  painel.addEventListener('keydown', (e) => {
    const itens = itensFocaveis();
    const i = itens.indexOf(document.activeElement);
    if (e.key === 'Escape') {
      e.preventDefault();
      fecharPainel();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      itens[Math.min(itens.length - 1, i + 1)]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      i <= 0 ? itens[0]?.focus() : itens[i - 1].focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      itens[0]?.focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      itens[itens.length - 1]?.focus();
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      document.activeElement?.click();
    } else if (e.key === 'ArrowLeft' && categoriaAberta) {
      e.preventDefault();
      montarNivelCategorias();
      focarPrimeiro();
    } else if (e.key === 'Tab') {
      // mantém o foco dentro do painel enquanto ele estiver aberto
      const foco = [voltar.hidden ? null : voltar, fechar, ...itens].filter(Boolean);
      const pos = foco.indexOf(document.activeElement);
      const proximo = e.shiftKey ? pos - 1 : pos + 1;
      if (proximo < 0 || proximo >= foco.length) {
        e.preventDefault();
        foco[e.shiftKey ? foco.length - 1 : 0].focus();
      }
    }
  });

  return {
    get valor() {
      return selecionado;
    },
    focar: () => botao.focus(),
    marcarErro(temErro) {
      botao.classList.toggle('invalido', temErro);
    },
    estaAberto: aberto,
  };
}
