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
  // A categoria usa o visual de crossfit (mãos livres); a arte com a corda
  // girando é exclusiva do exercício "Pular corda".
  'Funcional/HIIT': 'crossfit',
  Lutas: 'lutas',
  Esportes: 'esportes',
  Cardio: 'cardio',
  'Bem-estar': 'bemestar',
};

// Fantasia de um exercício específico, quando ele merece um visual próprio
// dentro da categoria (boxe e muay thai não se vestem como jiu-jitsu). O que
// não estiver aqui usa a fantasia da categoria — as quatro faixas de Corrida,
// por exemplo, só mudam de velocidade, não de roupa.
// Para adicionar: uma linha aqui, uma em DESCRICOES_VISUAL, e os arquivos
// -normal/-desconfiado/-blink em img/. Os testes acusam se faltar qualquer um.
export const FANTASIAS_POR_EXERCICIO = {
  'Spinning (bike indoor)': 'spinning',
  'Pular corda (moderado)': 'pularcorda',
  'Boxe (treino/sparring)': 'boxe',
  'Muay Thai / Kickboxing': 'muaythai',
  'Hidroginástica': 'hidroginastica',
  'Surf (prática geral)': 'surf',
  'Dança (geral)': 'danca',
  Zumba: 'danca',
  'Vôlei (recreativo)': 'volei',
  'Basquete (recreativo)': 'basquete',
  'Tênis': 'tenis',
  'Escalada (indoor)': 'escalada',
};

// Rede de segurança: categoria sem fantasia mapeada cai aqui em vez de pedir
// uma imagem que não existe. Também é o visual do estado inicial.
export const FANTASIA_GENERICA = 'gpt';

// Visuais que não têm quadro de piscada. A natação está aqui porque os óculos
// cobrem os olhos: apagar o olho apagaria os óculos junto, e o mascote perderia
// o equipamento no meio da piscada. Quem está de óculos de natação não pisca.
export const VISUAIS_SEM_PISCADA = new Set(['natacao']);

export function podePiscar(visual, desconfiado) {
  // O desconfiado já tem os olhos semicerrados de propósito — piscar por cima
  // disso descaracteriza a reação.
  if (desconfiado) return false;
  const chave = visual === 'neutro' ? FANTASIA_GENERICA : visual;
  return !VISUAIS_SEM_PISCADA.has(chave);
}

// Cada visual vira até 3 arquivos: img/caloricio-<visual>-normal.png,
// -desconfiado.png e -blink.png. 'neutro' (antes de qualquer seleção) usa a
// mesma arte genérica.
export function caminhoImagem(visual, desconfiado, piscando = false) {
  const chave = visual === 'neutro' ? FANTASIA_GENERICA : visual;
  const estado = desconfiado ? 'desconfiado' : piscando ? 'blink' : 'normal';
  return `img/caloricio-${chave}-${estado}.png`;
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
  crossfit: 'Caloricio de camiseta de compressão, cinto de treino e joelheiras',
  spinning: 'Caloricio de regata de ciclismo e faixa na testa, com toalha no ombro',
  pularcorda: 'Caloricio girando uma corda de pular por cima da cabeça',
  boxe: 'Caloricio de shorts de boxe e luvas vermelhas em posição de guarda',
  muaythai: 'Caloricio de shorts de muay thai, faixa na cabeça e bandagens nas mãos',
  hidroginastica: 'Caloricio de touca com halteres de espuma para hidroginástica',
  surf: 'Caloricio de roupa de surf com a prancha em pé ao lado',
  danca: 'Caloricio de regata solta e tênis, pronto pra dançar',
  volei: 'Caloricio de uniforme de vôlei com joelheiras e uma bola ao lado',
  basquete: 'Caloricio de uniforme de basquete com uma bola ao lado do pé',
  tenis: 'Caloricio de polo branco e viseira, segurando uma raquete',
  escalada: 'Caloricio de cadeirinha de escalada com saquinho de magnésio',
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
export function estadoDoMascote(categoria, duracaoMin, exercicio = null) {
  const visual =
    (exercicio && FANTASIAS_POR_EXERCICIO[exercicio]) ?? FANTASIAS[categoria] ?? FANTASIA_GENERICA;
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
    imagemPiscando: podePiscar(visual, desconfiado)
      ? caminhoImagem(visual, desconfiado, true)
      : null,
  };
}
