# Prompt para gerar o Caloricio com IA

Use isso em qualquer ferramenta de geração de imagem (Recraft, Kittl, Adobe
Firefly, Canva Magic Media, Midjourney, DALL-E, etc). O objetivo é conseguir
uma arte que dê pra **recriar como SVG em camadas** depois (corpo + acessórios
trocáveis por categoria de exercício), então as regras de estilo abaixo não são
só estética — evitam gerar algo bonito mas impossível de vetorizar bem.

## Prompt principal

```
Cute mascot character design, front-facing, standing neutral pose, arms
slightly out from body, full body visible head to feet.
Flat vector illustration style, thick clean black outlines, solid flat colors,
no gradients, no drop shadows, no textures.
Simple geometric shapes, rounded and friendly proportions, big expressive eyes.
Plain solid white background, centered, nothing else in frame.
Character concept: a friendly fitness mascot for a calorie-tracking app called
"Caloricio" — energetic and a little goofy, not corporate.
Style reference: similar simplicity to Duolingo's owl or Pokémon-style mascot
design — NOT photorealistic, NOT 3D render, NOT painterly.
```

## Variações de espécie/conceito (troque só esta linha no prompt acima)

Peça 3-4 de uma vez se a ferramenta permitir, pra comparar:

- `Character concept: a one-eyed round green monster mascot, small horns, friendly big single eye, short arms`
- `Character concept: a fluffy round furry monster mascot, purple fur, small round ears, big round eyes`
- `Character concept: a small friendly robot mascot, rounded edges (not blocky/industrial), screen-like face with simple eyes, antenna with a small light on top`
- `Character concept: a cute blob/slime mascot, teal color, no visible arms or legs, simple round shape, big expressive face`
- `Character concept: a small round bird-dino hybrid mascot, egg-shaped body, tiny wings, small beak, tiny crest on head`

## Pedido extra: expressões/estados (depois de escolher 1 personagem)

Depois de escolher a espécie/estilo, gere a MESMA personagem em variações de
rosto, pra eu poder recriar os estados de reação:

```
Same character, same proportions, same color palette and outline style as
before, but with a skeptical/suspicious facial expression — one eyebrow
raised, eyes narrowed, flat mouth. Same front-facing pose, same plain white
background.
```

E, se quiser já visualizar acessórios (não obrigatório, eu consigo desenhar os
acessórios sozinho a partir do corpo base):

```
Same character wearing a small red running headband and simple running shoes,
same pose, same style, same plain white background.
```

## O que evitar (deixa mais difícil de vetorizar)

- Sombras, gradientes, texturas de pele/pelo realistas
- Poses em 3/4 ou de lado (dificulta manter simetria no SVG)
- Fundo com cenário, chão, objetos extras no quadro
- Estilo 3D/render/pintura digital realista

## Depois de gerar

Salve a(s) imagem(ns) e me mande o caminho do arquivo (ou cole a imagem aqui).
Eu recrio a personagem escolhida como SVG em camadas, mantendo o mecanismo de
troca de fantasia por categoria de exercício que já existe no projeto
(`mascote.js` / grupos `.fantasia-*` em `index.html`).

---

## Resultado aprovado (ChatGPT) — `img/caloricio-gpt.png`

O personagem gerado ficou ótimo e já cobre 2 estados:
- **Bandana vermelha, sorrindo** → estado neutro/padrão
- **Bandana verde, cara desconfiada** → estado "desconfiado" (universal, usado
  em qualquer categoria quando a duração é implausível)

Faltam as 4 fantasias que o código já espera (`Corrida`, `Natação`,
`Musculação`, `Bike`). Use os prompts abaixo **na mesma conversa/ferramenta**
em que gerou a imagem original, anexando `img/caloricio-gpt.png` como
referência, pra manter o mesmo rosto, cabelo, proporções e estilo — só mudando
a roupa.

### Prompt-base a repetir em cada pedido (cole junto com a imagem de referência)

```
Use the attached character (Caloricio) as the exact reference: same face
shape, same spiky brown hair, same chibi proportions, same flat vector
illustration style with thick black outlines, same color palette. Keep the
happy facial expression from the reference. Change ONLY the outfit as
described below. Same front-facing standing pose, same plain white
background, full body visible.
```

### Corrida
```
Outfit change: running gear — a fitted athletic tank top or moisture-wicking
t-shirt (keep the flame logo on the chest), running shorts, running sneakers
with a colored stripe, and sporty wraparound sunglasses pushed up or worn on
the face. Optional: a slim sweatband on the wrist (in addition to the
headband).
```

### Natação
```
Outfit change: swimming gear — swim goggles on the eyes, a swim cap covering
the hair completely, and swim trunks/speedo (no shirt, bare chest/torso in the
same flat illustration style, no muscle detail, just a simple flat torso
shape). Bare feet.
```

### Bike
```
Outfit change: cycling gear — a bicycle helmet on the head (instead of the
headband), a fitted cycling jersey (keep the flame logo), padded cycling
shorts, and fingerless cycling gloves.
```

### Musculação
```
Outfit change: weightlifting gear — a sleeveless gym tank top / stringer
(keep the flame logo), athletic shorts, lifting gloves, and holding a small
dumbbell in one hand at the side.
```

### Dica de consistência

Se a ferramenta permitir, gere as 4 na mesma sessão/thread, uma de cada vez,
sempre reforçando "same character as before" antes de pedir a próxima — isso
reduz a chance do rosto ou proporções mudarem entre as gerações.

### Depois de ter as 4 (ou quantas conseguir)

Salve cada uma em `img/` com um nome claro (ex: `caloricio-corrida.png`,
`caloricio-natacao.png`, `caloricio-bike.png`, `caloricio-musculacao.png`) e me
avisa. Como essas imagens já vêm como personagem inteiro (não peças soltas
pra montar em camadas), a forma mais simples de usar no código é trocar a
**imagem inteira** conforme a categoria/estado, em vez de montar acessórios
sobre um SVG — é uma pequena mudança de arquitetura em `app.js`/`index.html`
que faço quando as imagens estiverem prontas.
