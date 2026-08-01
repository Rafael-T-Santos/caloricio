// Motor de reações do Caloricio.
//
// Regras: todas as que baterem com o input são avaliadas e a de MAIOR
// prioridade vence — a posição na lista nunca decide. Isso permite adicionar
// regras novas em qualquer ordem sem risco de uma regra antiga "engolir" a
// nova silenciosamente.

// Tetos de duração (min) por categoria que disparam o "desconfiado".
// São gatilhos de brincadeira, não ciência — ajustáveis à vontade.
export const TETOS_DURACAO = {
  Corrida: 180,
  Caminhada: 240,
  'Natação': 120,
  Bike: 300,
  'Musculação': 180,
  'Funcional/HIIT': 120,
  Lutas: 180,
  Esportes: 180,
  Cardio: 180,
  'Bem-estar': 240,
};

// Fantasias com arte pronta (ilustração gerada + recortada em img/). Categorias
// fora deste mapa usam o visual genérico até a arte ficar pronta — adicionar
// uma fantasia nova é só acrescentar uma linha aqui + os 2 arquivos de imagem
// (normal/desconfiado) em img/.
export const FANTASIAS = {
  Corrida: 'corrida',
  'Natação': 'natacao',
  'Musculação': 'musculacao',
  Bike: 'bike',
};

export const FANTASIA_GENERICA = 'gpt';

// Cada visual vira 2 arquivos de imagem: img/caloricio-<visual>-normal.png e
// img/caloricio-<visual>-desconfiado.png. 'neutro' (antes de qualquer seleção)
// usa a mesma arte genérica.
export function caminhoImagem(visual, desconfiado) {
  const chave = visual === 'neutro' ? FANTASIA_GENERICA : visual;
  return `img/caloricio-${chave}-${desconfiado ? 'desconfiado' : 'normal'}.png`;
}

// Descrições por visual, usadas como texto alternativo pra leitor de tela.
export const DESCRICOES_VISUAL = {
  corrida: 'Caloricio de roupa de corrida, óculos esportivos e tênis',
  natacao: 'Caloricio de óculos de natação, touca e sunga',
  musculacao: 'Caloricio de regata segurando um halter',
  bike: 'Caloricio de capacete de ciclista',
  generica: 'Caloricio com faixa na cabeça, pronto pro treino',
  neutro: 'Caloricio te esperando começar',
};

// Uma regra de desconfiado por categoria, gerada a partir dos tetos.
// Regras futuras (outros gatilhos, outras reações) entram neste mesmo array
// com sua própria prioridade.
export const REGRAS = Object.entries(TETOS_DURACAO).map(([categoria, teto]) => ({
  trigger: { categoria, duracaoMinMaiorQue: teto },
  estado: 'desconfiado',
  legenda: `Hmm... mais de ${teto} minutos de ${categoria}? Tem certeza disso? 🤨`,
  prioridade: 10,
}));

function regraBate(regra, { categoria, duracaoMin }) {
  const t = regra.trigger;
  if (t.categoria !== undefined && t.categoria !== categoria) return false;
  if (t.duracaoMinMaiorQue !== undefined && !(duracaoMin > t.duracaoMinMaiorQue)) return false;
  return true;
}

// Retorna a regra vencedora (maior prioridade entre as que batem) ou null.
export function avaliarRegras(input, regras = REGRAS) {
  let vencedora = null;
  for (const regra of regras) {
    if (!regraBate(regra, input)) continue;
    if (!vencedora || regra.prioridade > vencedora.prioridade) vencedora = regra;
  }
  return vencedora;
}

// Estado completo do mascote para uma seleção: qual visual vestir, se está
// desconfiado, a legenda/descrição a exibir, e o caminho da imagem a mostrar.
export function estadoDoMascote(categoria, duracaoMin) {
  const visual = FANTASIAS[categoria] ?? FANTASIA_GENERICA;
  const regra = duracaoMin != null ? avaliarRegras({ categoria, duracaoMin }) : null;
  const desconfiado = Boolean(regra);
  return {
    visual,
    desconfiado,
    legenda: regra ? regra.legenda : '',
    descricao: desconfiado
      ? `${DESCRICOES_VISUAL[visual]}, com cara de desconfiado`
      : DESCRICOES_VISUAL[visual],
    imagem: caminhoImagem(visual, desconfiado),
  };
}
