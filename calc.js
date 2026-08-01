// Fonte única de verdade da tabela MET (38 atividades, 10 categorias).
// Portada da planilha de referência do time — o dropdown é gerado a partir
// daqui, nunca escrito à mão no HTML.
export const MET_TABLE = [
  { nome: 'Caminhada leve (4 km/h)', met: 3.0, categoria: 'Caminhada' },
  { nome: 'Caminhada moderada (5,5 km/h)', met: 3.8, categoria: 'Caminhada' },
  { nome: 'Caminhada rápida (6,5 km/h)', met: 4.8, categoria: 'Caminhada' },
  { nome: 'Caminhada com inclinação (esteira)', met: 6.0, categoria: 'Caminhada' },
  { nome: 'Corrida leve (8 km/h)', met: 8.3, categoria: 'Corrida' },
  { nome: 'Corrida moderada (10 km/h)', met: 9.8, categoria: 'Corrida' },
  { nome: 'Corrida forte (12 km/h)', met: 11.8, categoria: 'Corrida' },
  { nome: 'Corrida muito forte (14 km/h)', met: 14.8, categoria: 'Corrida' },
  { nome: 'Ciclismo leve (<16 km/h)', met: 4.0, categoria: 'Bike' },
  { nome: 'Ciclismo moderado (16-19 km/h)', met: 6.8, categoria: 'Bike' },
  { nome: 'Ciclismo forte (19-22 km/h)', met: 8.0, categoria: 'Bike' },
  { nome: 'Ciclismo muito forte (>22 km/h)', met: 10.0, categoria: 'Bike' },
  { nome: 'Spinning (bike indoor)', met: 8.5, categoria: 'Bike' },
  { nome: 'Pilates', met: 3.0, categoria: 'Bem-estar' },
  { nome: 'Yoga', met: 2.5, categoria: 'Bem-estar' },
  { nome: 'Musculação leve', met: 3.5, categoria: 'Musculação' },
  { nome: 'Musculação moderada/vigorosa', met: 6.0, categoria: 'Musculação' },
  { nome: 'Funcional (treino intervalado)', met: 8.0, categoria: 'Funcional/HIIT' },
  { nome: 'Crossfit', met: 9.0, categoria: 'Funcional/HIIT' },
  { nome: 'Pular corda (moderado)', met: 10.0, categoria: 'Funcional/HIIT' },
  { nome: 'Jiu-jitsu / Luta', met: 10.3, categoria: 'Lutas' },
  { nome: 'Boxe (treino/sparring)', met: 9.0, categoria: 'Lutas' },
  { nome: 'Muay Thai / Kickboxing', met: 10.3, categoria: 'Lutas' },
  { nome: 'Natação leve', met: 6.0, categoria: 'Natação' },
  { nome: 'Natação moderada', met: 8.3, categoria: 'Natação' },
  { nome: 'Natação vigorosa', met: 10.0, categoria: 'Natação' },
  { nome: 'Hidroginástica', met: 5.5, categoria: 'Natação' },
  { nome: 'Surf (prática geral)', met: 5.0, categoria: 'Esportes' },
  { nome: 'Dança (geral)', met: 4.8, categoria: 'Esportes' },
  { nome: 'Zumba', met: 6.5, categoria: 'Esportes' },
  { nome: 'Futebol (recreativo)', met: 7.0, categoria: 'Esportes' },
  { nome: 'Futebol (competitivo)', met: 10.0, categoria: 'Esportes' },
  { nome: 'Vôlei (recreativo)', met: 4.0, categoria: 'Esportes' },
  { nome: 'Basquete (recreativo)', met: 6.5, categoria: 'Esportes' },
  { nome: 'Tênis', met: 7.3, categoria: 'Esportes' },
  { nome: 'Escalada (indoor)', met: 7.5, categoria: 'Esportes' },
  { nome: 'Elíptico', met: 5.0, categoria: 'Cardio' },
  { nome: 'Remo (ergômetro) moderado', met: 7.0, categoria: 'Cardio' },
];

// Faixas humanas razoáveis — fora disso é erro de digitação ou brincadeira,
// e a calculadora recusa em vez de exibir um número sem sentido.
export const LIMITES = {
  idade: { min: 1, max: 120, label: 'Idade deve ser entre 1 e 120 anos' },
  peso: { min: 1, max: 400, label: 'Peso deve ser entre 1 e 400 kg' },
  altura: { min: 30, max: 250, label: 'Altura deve ser entre 30 e 250 cm' },
  duracao: { min: 1, max: 1440, label: 'Duração deve ser entre 1 e 1440 minutos (24h)' },
};

// TMB por Mifflin-St Jeor (1990), igual à planilha de referência.
export function computeBMR({ sexo, idade, altura, peso }) {
  const base = 10 * peso + 6.25 * altura - 5 * idade;
  return sexo === 'F' ? base - 161 : base + 5;
}

// Gasto do exercício = (TMB / 1440 min) × MET × duração(min). Sem arredondar —
// o arredondamento para inteiro acontece só na exibição.
export function computeGasto(bmr, met, duracaoMin) {
  return (bmr / 1440) * met * duracaoMin;
}

// Valida os campos numéricos contra as faixas. Retorna { ok, erros } onde
// erros mapeia campo → mensagem, pra exibição inline por campo.
export function validarCampos({ idade, altura, peso, duracao }) {
  const valores = { idade, altura, peso, duracao };
  const erros = {};
  for (const [campo, limite] of Object.entries(LIMITES)) {
    const v = valores[campo];
    if (v === '' || v === null || v === undefined || Number.isNaN(Number(v))) {
      erros[campo] = 'Campo obrigatório';
    } else if (Number(v) < limite.min || Number(v) > limite.max) {
      erros[campo] = limite.label;
    }
  }
  return { ok: Object.keys(erros).length === 0, erros };
}

// Agrupa a tabela MET por categoria, na ordem em que as categorias aparecem.
// O dropdown (<optgroup>/<option>) é renderizado a partir deste retorno.
export function agruparPorCategoria(tabela = MET_TABLE) {
  const grupos = [];
  const porCategoria = new Map();
  for (const item of tabela) {
    if (!porCategoria.has(item.categoria)) {
      const grupo = { categoria: item.categoria, itens: [] };
      porCategoria.set(item.categoria, grupo);
      grupos.push(grupo);
    }
    porCategoria.get(item.categoria).itens.push(item);
  }
  return grupos;
}
