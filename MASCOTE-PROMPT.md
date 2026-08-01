# Prompts para gerar as artes do Caloricio

Guia de como pedir novas fantasias ao Gemini (ou outra ferramenta de imagem)
mantendo o personagem consistente com o que já está no ar.

---

## 1. Qual imagem enviar para começar

Envie **`img/referencia-caloricio.png`** como primeira mensagem da conversa nova.

Ela foi montada justamente para servir de referência: traz os dois estados
canônicos lado a lado (verde/sério à esquerda, vermelho/sorrindo à direita),
com o cabelo castanho bem visível, sem óculos cobrindo o rosto, e com margens
largas. Não use as artes de corrida ou bike como referência — nelas o
personagem da esquerda está de óculos escuros, e o modelo tende a carregar os
óculos para as fantasias seguintes.

---

## 2. Prompt-base (envie junto com a imagem, na primeira mensagem)

```
This is "Caloricio", the mascot of an internal calorie-tracking challenge.
Use the attached image as the exact and only reference for the character.

Every image you generate from now on must follow ALL of these rules:

CHARACTER (never change):
- Same face, same chibi proportions, same rosy cheeks, same big eyes.
- Hair is SHORT SPIKY BROWN hair (dark brown, roughly #402818). Never black,
  never any other color. When a costume covers the head, brown hair must still
  show around the edges.
- Same flat vector illustration style: thick black outlines, solid flat colors,
  no gradients, no drop shadows, no 3D shading, no textures.
- Keep the small white flame logo somewhere on the chest of the outfit.

LAYOUT (never change):
- TWO versions of the character side by side in one image, standing, facing
  front, full body from head to feet.
- LEFT version: GREEN color palette, serious / skeptical facial expression
  (one eyebrow raised, narrowed eyes, flat mouth).
- RIGHT version: RED color palette, happy expression with a big open smile.
- Plain solid white background, nothing else in the frame.

FRAMING (this is critical - the last batch came out cropped):
- Both characters, INCLUDING any equipment they hold or carry, must be fully
  inside the frame with clear empty margin on all four sides.
- Leave a wide empty vertical gap between the two characters. They must never
  touch, overlap, or come close to each other.
- Nothing may be cut off by the edge of the image or cross into the other
  character's side.

Confirm you understood, and wait for me to ask for each outfit one at a time.
```

Depois disso, mande **um pedido por mensagem**, sempre na mesma conversa.

---

## 3. Prompt por categoria

Cada bloco abaixo é uma mensagem separada. Sempre comece com
`Same character, same rules as before. New outfit:` para reforçar a
consistência.

### Musculação (REFAZER — a versão atual saiu com cabelo preto e halteres cortados)

```
Same character, same rules as before. New outfit: weightlifting.
Sleeveless gym stringer tank top with the flame logo, athletic shorts,
lifting gloves, and a small dumbbell held in ONE hand only, kept close to the
body. Reminder: the hair must be BROWN, not black. Keep the dumbbell well
inside the frame and far from the other character.
```

### Caminhada

```
Same character, same rules as before. New outfit: casual walking.
A light zip-up windbreaker over a t-shirt, comfortable jogger pants, chunky
walking sneakers, and a baseball cap worn forward with brown hair showing
under it.
```

### Funcional / HIIT

```
Same character, same rules as before. New outfit: functional / HIIT training.
A fitted short-sleeve compression shirt with the flame logo, training shorts,
knee sleeves, and a jump rope held in one hand with the rope hanging in a
small loop close to the body.
```

### Lutas

```
Same character, same rules as before. New outfit: martial arts.
A white karate/jiu-jitsu gi jacket with a black belt tied at the waist, gi
pants, barefoot, and red boxing gloves on both hands held up near the chest
in a guard position.
```

### Esportes

```
Same character, same rules as before. New outfit: soccer.
A soccer jersey with the flame logo, soccer shorts, tall soccer socks, and
cleats. A soccer ball resting on the ground right next to one foot, fully
inside the frame.
```

### Cardio

```
Same character, same rules as before. New outfit: gym cardio session.
A breathable sport t-shirt with the flame logo, running shorts, training
shoes, a small white towel draped around the neck, and a water bottle held
in one hand close to the body.
```

### Bem-estar

```
Same character, same rules as before. New outfit: yoga and pilates.
A comfortable loose tank top with the flame logo, soft stretchy leggings,
barefoot, and a rolled-up yoga mat carried under one arm, kept close to the
body and fully inside the frame.
```

---

## 4. Como salvar

Salve cada imagem em `img/sources/` com exatamente estes nomes (o pipeline
depende deles):

| Categoria (tabela MET) | Nome do arquivo |
|---|---|
| Musculação | `img/sources/caloricio-musculacao.png` (substitui a atual) |
| Caminhada | `img/sources/caloricio-caminhada.png` |
| Funcional/HIIT | `img/sources/caloricio-funcional.png` |
| Lutas | `img/sources/caloricio-lutas.png` |
| Esportes | `img/sources/caloricio-esportes.png` |
| Cardio | `img/sources/caloricio-cardio.png` |
| Bem-estar | `img/sources/caloricio-bemestar.png` |

Não precisa mandar todas de uma vez — cada uma que chegar eu já processo.

---

## 5. O que acontece depois (não precisa fazer nada disso)

Para cada arte nova eu rodo o pipeline que já existe: separo os dois
personagens, removo o fundo branco, elimino a marca d'água da IA, descarto
fragmentos que vazaram do vizinho, normalizo em 520x620 com os pés na mesma
linha, e ligo a categoria no `mascote.js`. O arquivo sai de ~4,8MB para
~130KB.

Checagens automáticas que eu faço em cada arte nova:
- conteúdo não pode encostar na borda do canvas (detecta corte)
- cor do cabelo comparada com a referência (detecta a troca para preto)
- tamanho do personagem consistente com as outras fantasias

---

## Regras de estilo (por que os prompts são assim)

- **Sem sombra, gradiente ou 3D**: mantém o estilo chapado coerente com o que
  já está no site.
- **Vista frontal, pose parada**: qualquer variação de ângulo quebra o
  alinhamento entre as fantasias, já que a troca é feita por substituição da
  imagem inteira.
- **Fundo branco liso**: é o que o pipeline usa para recortar o personagem.
- **Equipamento junto ao corpo**: acessório esticado para o lado é exatamente
  o que fez os halteres da musculação serem cortados na emenda.
