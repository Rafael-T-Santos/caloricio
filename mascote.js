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

// Fantasias com arte pronta (ilustração gerada + recortada em img/). As 10
// categorias da tabela MET estão cobertas. Para uma categoria nova: acrescente
// uma linha aqui, uma descrição em DESCRICOES_VISUAL, e os 2 arquivos de imagem
// (normal/desconfiado) em img/.
export const FANTASIAS = {
  Caminhada: 'caminhada',
  Corrida: 'corrida',
  Bike: 'bike',
  'Natação': 'natacao',
  'Musculação': 'musculacao',
  'Funcional/HIIT': 'funcional',
  Lutas: 'lutas',
  Esportes: 'esportes',
  Cardio: 'cardio',
  'Bem-estar': 'bemestar',
};

// Rede de segurança: categoria sem fantasia mapeada cai aqui em vez de pedir
// uma imagem que não existe. Também é o visual do estado inicial.
export const FANTASIA_GENERICA = 'gpt';

// Cada visual vira 2 arquivos de imagem: img/caloricio-<visual>-normal.png e
// img/caloricio-<visual>-desconfiado.png. 'neutro' (antes de qualquer seleção)
// usa a mesma arte genérica.
export function caminhoImagem(visual, desconfiado) {
  const chave = visual === 'neutro' ? FANTASIA_GENERICA : visual;
  return `img/caloricio-${chave}-${desconfiado ? 'desconfiado' : 'normal'}.png`;
}

// Descrições por visual, usadas como texto alternativo pra leitor de tela.
// As chaves têm que bater com os valores de FANTASIAS (mais 'gpt' e 'neutro'),
// senão o alt vira "undefined" pra quem usa leitor de tela.
export const DESCRICOES_VISUAL = {
  caminhada: 'Caloricio de boné e jaqueta corta-vento, pronto pra caminhar',
  corrida: 'Caloricio de roupa de corrida, óculos esportivos e tênis',
  bike: 'Caloricio de capacete e roupa de ciclismo',
  natacao: 'Caloricio de óculos de natação, touca e sunga',
  musculacao: 'Caloricio de regata, cinto de levantamento e luvas, com um haltere',
  funcional: 'Caloricio de camiseta de treino com uma corda de pular',
  lutas: 'Caloricio de kimono com faixa preta e luvas de boxe',
  esportes: 'Caloricio de uniforme de futebol com uma bola ao lado do pé',
  cardio: 'Caloricio com toalha no pescoço e garrafinha de água',
  bemestar: 'Caloricio com um tapete de yoga enrolado sob o braço',
  gpt: 'Caloricio de faixa na cabeça e moletom, pronto pro treino',
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
