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

## Estrutura

| Arquivo | Papel |
|---|---|
| `calc.js` | Tabela MET (fonte única) e as fórmulas. Sem DOM. |
| `mascote.js` | Qual fantasia vestir e quando ficar desconfiado. Sem DOM. |
| `seletor.js` | Seletor de exercício em dois níveis (categoria → exercício). |
| `app.js` | Única camada que toca o DOM. |
| `preferencias.js` | Guarda os dados pessoais entre visitas. |
| `cartao.js` | Desenha o resultado como imagem pra compartilhar. |
| `sw.js` | Service worker: faz o app abrir e calcular sem rede. |
| `tools/` | Pipeline de arte (só roda na máquina, não vai pro navegador). |

O seletor é próprio em vez de `<select>` porque o picker nativo do Android
achata os `<optgroup>` e a hierarquia categoria → exercício se perde.

## Exportando o resultado

Depois de calcular, o mascote e o resultado ficam dentro de um card com borda, e
o botão "Compartilhar imagem" gera essa composição em PNG 1080x1350.

O desenho é feito direto no canvas, sem biblioteca de captura de DOM: o card é
simples e desenhar à mão é determinístico, sem os problemas de fonte e CORS que
essas bibliotecas têm. No celular usa `navigator.share` com arquivo, que entrega
direto no outro app; onde isso não existe, baixa o arquivo.

## Processando arte nova

Depois de salvar a arte 2-em-1 gerada pela IA em `img/sources/`:

```bash
node tools/gerar-artes.cjs musculacao caminhada    # um ou vários nomes
```

O pipeline separa os dois personagens, remove o fundo branco por flood-fill
das bordas, elimina a marca d'água da IA, descarta fragmentos que vazaram do
personagem vizinho, normaliza em 690x740 ancorando pela distância entre os olhos e grava em
`img/`. Sai de ~4,8MB para ~130KB por arte. É determinístico: rodar de novo na
mesma origem gera o mesmo arquivo.

### Convertendo para WebP

O site serve WebP (~70% menor que o PNG, visualmente idêntico nesta arte
chapada) e mantém o PNG como fallback; `app.js` detecta o suporte e escolhe.

Não existe encoder WebP em Node puro, então a conversão passa pelo canvas do
navegador. Depois de gerar arte nova, rode o servidor local com o endpoint de
gravação e converta pelo navegador — os testes acusam se algum arquivo existir
só num dos dois formatos.

### Quadro de piscada

```bash
node tools/gerar-piscada.cjs corrida lutas    # gera img/caloricio-<nome>-blink.png
```

Desenha a pálpebra fechada por cima da arte, em vez de gerar por IA: a piscada
dura ~110ms, então o resto do corpo precisa ser pixel a pixel idêntico ao quadro
de olho aberto — qualquer regeração desloca o personagem e a troca lê como
tremida. O script detecta a esclera, apaga o olho por flood até encontrar pele
(a sobrancelha fica intacta porque há um vão de pele entre ela e o olho) e
desenha um arco com a espessura do contorno da própria arte.

A natação não tem piscada: os óculos cobrem os olhos e apagá-los levaria os
óculos junto. Está registrado em `VISUAIS_SEM_PISCADA` (`mascote.js`), e os
testes verificam que todo visual que pode piscar tem o arquivo no disco.

## Adicionando fantasias e reações novas

- **Fantasia nova**: gere a arte com os prompts de `MASCOTE-PROMPT.md`, salve em
  `img/sources/`, e adicione a categoria em `FANTASIAS` + uma linha em
  `DESCRICOES_VISUAL` (`mascote.js`). Os testes acusam se faltar descrição ou
  se o arquivo de imagem não existir.
- **Reação nova**: adicione uma entrada em `REGRAS` (`mascote.js`) com gatilho,
  estado, legenda e prioridade — a de maior prioridade vence quando várias batem.
- **Exercício novo**: uma linha em `MET_TABLE` (`calc.js`) — o seletor atualiza
  sozinho.
