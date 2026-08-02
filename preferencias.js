// Guarda os dados pessoais entre visitas. São quatro campos que quase nunca
// mudam (sexo, idade, altura, peso) e que hoje o usuário redigita toda vez —
// num desafio em que se registra atividade quase todo dia, é a maior fricção
// do app.
//
// Recebe o storage por parâmetro para poder ser testado sem navegador, e
// porque localStorage não é garantido: em modo privado alguns navegadores
// lançam ao gravar, e o acesso pode estourar em contexto sem permissão.

export const CHAVE = 'caloricio:dados-pessoais';
export const CAMPOS = ['sexo', 'idade', 'altura', 'peso'];

const LIMITES = {
  idade: [1, 120],
  altura: [30, 250],
  peso: [1, 400],
};

// Só aceita de volta o que passaria na validação do formulário: dado corrompido
// ou de uma versão antiga não pode reaparecer como se fosse válido.
export function saneia(bruto) {
  if (!bruto || typeof bruto !== 'object') return null;
  const limpo = {};
  if (bruto.sexo === 'M' || bruto.sexo === 'F') limpo.sexo = bruto.sexo;
  for (const campo of ['idade', 'altura', 'peso']) {
    const n = Number(bruto[campo]);
    const [min, max] = LIMITES[campo];
    if (Number.isFinite(n) && n >= min && n <= max) limpo[campo] = String(bruto[campo]);
  }
  return Object.keys(limpo).length ? limpo : null;
}

export function criarPreferencias(storage) {
  const disponivel = (() => {
    try {
      const teste = '__caloricio_teste__';
      storage.setItem(teste, '1');
      storage.removeItem(teste);
      return true;
    } catch {
      return false;
    }
  })();

  return {
    disponivel,

    carregar() {
      if (!disponivel) return null;
      try {
        return saneia(JSON.parse(storage.getItem(CHAVE)));
      } catch {
        return null;
      }
    },

    salvar(dados) {
      if (!disponivel) return false;
      const limpo = saneia(dados);
      if (!limpo) return false;
      try {
        storage.setItem(CHAVE, JSON.stringify(limpo));
        return true;
      } catch {
        return false;
      }
    },

    limpar() {
      if (!disponivel) return false;
      try {
        storage.removeItem(CHAVE);
        return true;
      } catch {
        return false;
      }
    },
  };
}
