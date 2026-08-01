# Caloricio 🏃

Calculadora de gasto calórico por exercício para o desafio de calorias do time,
com o mascote **Caloricio** que reage ao que você digita — veste a fantasia da
categoria escolhida e fica desconfiado se a duração for implausível.

Feita para quem não tem relógio/wearable que já contabiliza o gasto calórico.

## Como funciona

- **TMB** pela fórmula de Mifflin-St Jeor (1990): `10×peso + 6,25×altura − 5×idade + 5` (homem) / `−161` (mulher)
- **Gasto do exercício**: `(TMB / 1440) × MET × duração(min)`
- **Tabela MET**: 38 atividades em 10 categorias (Compendium of Physical Activities, Ainsworth et al.)

Resultados são estimativas — condicionamento, temperatura e intensidade real variam.

## Rodando localmente

É um site estático, mas usa módulos ES — precisa de um servidor HTTP (não funciona
abrindo o arquivo direto por `file://`):

```bash
npx serve .
# ou
python -m http.server 8000
```

## Testes

```bash
node --test
```

Cobre a fórmula (validada contra a planilha de referência), a validação de faixa
e o motor de regras do mascote.

## Adicionando fantasias e reações novas

- **Fantasia nova**: adicione a categoria em `FANTASIAS` (`mascote.js`) e crie o
  grupo `.fantasia-<nome>` no SVG (`index.html`) + a regra de exibição no CSS.
- **Reação nova**: adicione uma entrada em `REGRAS` (`mascote.js`) com gatilho,
  estado, legenda e prioridade — a de maior prioridade vence quando várias batem.
- **Exercício novo**: uma linha em `MET_TABLE` (`calc.js`) — o dropdown atualiza
  sozinho.
