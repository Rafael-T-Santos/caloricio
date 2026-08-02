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

## 2b. Rodada atual — 4 imagens

Auditoria de agosto/2026: todos os 38 exercícios têm arte e não falta nenhum
arquivo em disco. O que apareceu foram **duas artes erradas** e **dois
exercícios vestidos com a roupa de outro**. É só isso que precisa desta rodada.

| # | Arte | Por quê |
|---|---|---|
| 1 | `lutas` (REFAZER) | o jiu-jitsu está de luvas de boxe |
| 2 | `cardio` (REFAZER) | duas garrafinhas, uma em cada mão, com o encaixe errado |
| 3 | `pilates` (NOVA) | hoje o Pilates aparece vestido de yoga |
| 4 | `remo` (NOVA) | hoje o Remo usa o genérico de academia |

O **Elíptico continua no `cardio`** de propósito: camiseta, toalha no pescoço e
garrafinha é literalmente o que se veste num elíptico, então arte separada não
acrescentaria nada. É o único da lista que resolvi não desdobrar.

### 1. Jiu-jitsu — `caloricio-lutas.png` (substitui a atual)

**O problema:** a arte atual tem kimono, faixa preta **e luvas de boxe**. Ela
foi feita quando `lutas` era a fantasia compartilhada das três lutas, e as
luvas eram um meio-termo aceitável. Depois que Boxe e Muay Thai ganharam arte
própria, `lutas` passou a vestir só o jiu-jitsu — e aí o meio-termo virou erro:
no jiu-jitsu as mãos agarram o kimono, com luva de boxe não dá pra lutar.

```
Same character, same rules as before. New outfit: Brazilian jiu-jitsu.

IMPORTANT: absolutely NO boxing gloves, NO MMA gloves and NO hand wraps. Both
hands must be completely bare with individual fingers visible. Jiu-jitsu is a
grappling sport — the hands grip the fabric of the gi, so any glove is wrong.
The previous version of this outfit had red boxing gloves; remove them
entirely.

Outfit worn on the body: a thick white jiu-jitsu gi jacket with a wide lapel
crossed over the chest, closed by a black belt tied in a knot at the waist,
matching loose white gi pants, and bare feet.

Hands: both hands empty and relaxed, hanging down at his sides, fingers
visible. No object of any kind in either hand.
```

**Variante**, se ficar parado demais — a pegada é em tecido, que é mais
tolerante que barra rígida, mas ainda assim é uma mão segurando algo:

```
Same as above, but one hand grips his own gi lapel at chest height, with the
fingers clearly curled around the thick fabric and the thumb closing over it.
The other hand stays empty at his side. Still no gloves of any kind.
```

### 2. Cardio — `caloricio-cardio.png` (substitui a atual)

**O problema:** a arte atual tem **uma garrafinha em cada mão** (a descrição
sempre disse uma só), e nas duas o objeto atravessa o punho em vez de ser
segurado. É a armadilha conhecida do objeto agarrado. A saída é a mesma que
resolveu a musculação: mão vazia, equipamento no chão.

```
Same character, same rules as before. New outfit: gym cardio session.

IMPORTANT: the character must NOT hold anything in his hands. Both hands are
empty and relaxed, hanging down at his sides in loose fists, exactly like the
hands in the original reference image. The previous version drew a water bottle
in EACH hand, with the bottles crossing over the wrists instead of being held —
do not draw any object touching, crossing or overlapping the hands.

Outfit worn on the body: a breathable short-sleeve sport t-shirt with the flame
logo, running shorts, training shoes, and a small white towel draped around the
neck with both ends hanging down over the chest.

Equipment: exactly ONE water bottle, standing upright on the ground next to his
right foot, clearly separated from his body and fully inside the frame. Only
one bottle in the whole image per character.
```

### 3. Pilates — `caloricio-pilates.png` (nova)

**Por quê:** hoje Pilates e Yoga dividem a fantasia `bemestar`, que é um tapete
de yoga enrolado debaixo do braço. Quem faz pilates percebe na hora que está
vestido de outra coisa. O sinal mais forte e mais seguro de desenhar é a meia
antiderrapante: é **calçada**, não segurada.

```
Same character, same rules as before. New outfit: pilates.

This must read clearly as pilates and NOT as yoga — no yoga mat anywhere in the
image. Both hands empty and relaxed at his sides, no object in the hands.

Outfit worn on the body: a fitted long-sleeve athletic top with the flame logo,
snug cropped leggings, and grippy pilates socks on both feet — ankle-height
socks with small visible rubber dots on the sole.

Equipment: ONE pilates ring (a "magic circle": a flexible ring about the size of
his torso, with two padded grips on opposite sides) standing upright on the
ground beside him, leaning lightly against his leg, fully inside the frame.
```

**Se o anel sair deformado**, troque a última frase por esta — bola é bem mais
fácil de desenhar, e as meias sozinhas já identificam o pilates:

```
Equipment: ONE small soft exercise ball resting on the ground next to his foot,
fully inside the frame. No ring.
```

### 4. Remo (ergômetro) — `caloricio-remo.png` (nova)

**Por quê:** o remo é o movimento mais característico da categoria Cardio e
hoje não tem nada que o identifique. O cuidado aqui é não pedir a alça do
ergômetro na mão: alça é uma **barra reta atravessando os dois punhos fechados**,
exatamente o desenho que deu errado no haltere da musculação.

```
Same character, same rules as before. New outfit: indoor rowing (ergometer).

IMPORTANT: he must NOT hold the rowing handle. Both hands are empty and relaxed
at his sides. A straight bar drawn across two closed fists is exactly the
mistake to avoid — no handle, no bar, no rope in the hands.

Outfit worn on the body: a sleeveless rowing singlet (a snug one-piece athletic
top) with the flame logo, short compression shorts, and a sweatband on one
wrist.

Equipment: the black handle of a rowing machine, with a short length of chain
still attached to it, lying flat on the ground next to his foot, clearly
separated from his body and fully inside the frame.
```

---

## 2d. Objetos soltos agora sobrevivem

O pipeline apagava tudo que não estivesse ligado ao corpo do personagem, para
descartar pedaços do vizinho que vazam na hora de cortar a imagem ao meio. Isso
levava junto os objetos que o desenho quis: a garrafinha do cardio e a bola do
vôlei nunca chegaram ao site.

O corte agora é **1% do tamanho do personagem**, e o número saiu de medir os
componentes das 50 metades de todas as artes: os objetos de verdade são 3,6%
(garrafinha), 5,2% (alça do remo) e 7,3% (bola do vôlei), enquanto o maior lixo
é um risco de 96px, 0,012%. Entre 0,012% e 3,6% não existe nada — 1% cai no meio
do vazio. Além disso, componente que encosta na linha onde a imagem foi cortada
ao meio sai fora independente do tamanho: aquilo é o vizinho invadindo, e é a
única coisa que o tamanho sozinho não distingue de um objeto legítimo.

**Consequência para os prompts:** objeto no chão voltou a ser a melhor opção.
Não peça mais o equipamento encostando no corpo — foi isso que embolou a
segunda tentativa do remo.

### Cuidado: o original do surf tem marca d'água

`img/sources/caloricio-surf.png` é uma regeração posterior à arte publicada e
traz a palavra "nonatinho" escrita na prancha. A arte que está no ar veio de um
original anterior, limpo, que não temos mais. **Não reprocesse o surf** sem
antes gerar um original novo sem marca d'água.

---

## 2c. Resultado da rodada — 2 entraram, 2 precisam voltar

**Cardio e Pilates entraram** e já estão no ar. **Jiu-jitsu e Remo voltaram**,
cada um por um motivo diferente — e nenhum dos dois é culpa do desenho em si,
que veio certo. Os prompts corrigidos estão abaixo.

### Jiu-jitsu — precisa voltar: personagem fora de proporção

As luvas de boxe sumiram, as mãos saíram livres, o kimono e a faixa ficaram
certos. O problema é outro: **o personagem foi desenhado mais comprido**. O
pipeline ancora pela distância entre os olhos justamente para o mascote ter
sempre o mesmo tamanho em todas as fantasias, e nessa arte o corpo abaixo dos
olhos mede 487px na escala padrão, contra no máximo 417px de todas as outras 20
artes. Não cabe no canvas: os pés saem cortados nos joelhos.

Encolher só essa arte para caber resolveria o corte, mas aí o mascote mudaria
de tamanho ao escolher jiu-jitsu, que é exatamente o que a ancoragem por olhos
existe para impedir. Por isso o certo é regerar.

```
Same character, same rules as before. New outfit: Brazilian jiu-jitsu.

PROPORTIONS ARE CRITICAL — the last attempt drew the body too long. Keep the
exact chibi proportions of the attached reference image: the head must be very
large relative to the body, roughly one third of the total height, with short
stubby legs. Do not lengthen the legs or the torso to fit the gi. Compare with
the reference before finishing: total height should be about 3 head-heights.

NO boxing gloves, NO MMA gloves, NO hand wraps. Both hands completely bare with
individual fingers visible, empty and relaxed at his sides.

Outfit worn on the body: a thick white jiu-jitsu gi jacket with a wide lapel
crossed over the chest, closed by a black belt tied in a knot at the waist,
matching white gi pants that end above the ankles, and bare feet.
```

### Remo — 3ª tentativa: a corrente não pode passar abaixo dos pés

**Situação:** a 1ª tentativa (alça solta no chão) era a certa — ela só foi
recusada porque o pipeline apagava objeto solto, o que já está resolvido (2d). A
2ª tentativa, com a alça encostando no corpo, embolou: saíram duas barras pretas
cruzando as pernas e as mãos voltaram a segurar. **Voltamos para a 1ª**, que já
está em `img/sources/caloricio-remo.png`.

Falta pouco: nela a corrente se estende **abaixo da linha dos pés**, e aí o
personagem precisa de 449px de canvas abaixo dos olhos, contra 435 disponíveis.
São 14px — só o rabo da corrente. Peça de novo com essa única restrição a mais:

```
Same character, same rules as before. New outfit: indoor rowing (ergometer).

Both hands empty and relaxed at his sides — he does NOT hold the handle. Do not
draw any bar crossing his fists or his legs. Exactly ONE handle in the image per
character.

Outfit worn on the body: a sleeveless rowing singlet (a snug one-piece athletic
top) with the flame logo, short compression shorts, and a sweatband on one wrist.

Equipment: the black handle of a rowing machine with a short chain, lying flat
on the ground next to his foot, separate from his body and not touching it.

CRITICAL FRAMING: the handle and the chain must sit ON THE SAME GROUND LINE as
his feet. Nothing may extend below the level of the soles of his shoes — the
lowest point of the whole drawing must be his shoes, not the chain. Keep the
chain short and beside the shoe, never trailing down past it.
```

### (histórico) Remo — 2ª tentativa: a alça no chão era apagada pelo pipeline

O desenho veio exatamente como pedi: alça preta com corrente, no chão, longe
das mãos. O problema é que **objeto solto no chão não sobrevive ao pipeline**.
Para separar os dois personagens da mesma imagem, o processamento descarta
fragmentos que vazaram do vizinho, e faz isso apagando tudo que não está ligado
ao corpo. A alça é um componente separado, então ela some — e sem a alça sobra
um macaquinho vermelho, que lê como luta olímpica, não como remo.

É o mesmo motivo pelo qual a bola do basquete, a do vôlei e a do futebol também
não aparecem nas artes atuais, apesar de estarem nos originais.

A saída é a que já funciona na raquete de tênis e na prancha de surf: o objeto
**encosta no personagem**, virando uma peça só com ele.

```
Same character, same rules as before. New outfit: indoor rowing (ergometer).

He must NOT hold the rowing handle in his hands — both hands stay empty and
relaxed at his sides. A straight bar drawn across two closed fists is the
mistake to avoid.

CRITICAL: the equipment must physically TOUCH his body, not float separately on
the ground. An object that does not touch him gets removed in processing.

Outfit worn on the body: a sleeveless rowing singlet (a snug one-piece athletic
top) with the flame logo, short compression shorts, and a sweatband on one
wrist.

Equipment: the black handle of a rowing machine standing upright on the ground
and LEANING AGAINST HIS LEG, touching his calf, with a short length of chain
resting on the ground beside his foot and also touching his shoe. The handle
and the chain must overlap his body silhouette so they read as one piece with
him.
```

---

## 3. Prompt por categoria

Cada bloco abaixo é uma mensagem separada. Sempre comece com
`Same character, same rules as before. New outfit:` para reforçar a
consistência.

### Musculação (REFAZER — 2ª tentativa: o haltere ficou por cima do punho, não na mão)

**O problema:** modelos de imagem erram sistematicamente mão segurando objeto
rígido. Na tentativa anterior a barra do haltere foi desenhada atravessando
por cima do punho fechado, em vez dos dedos envolverem a barra.

**A solução:** não pedir para segurar nada. Nas Lutas as luvas de boxe
ficaram perfeitas porque são **calçadas**, não agarradas. Mesmo princípio aqui:
equipamento vestido no corpo, e o haltere apoiado no chão.

```
Same character, same rules as before. New outfit: weightlifting.

IMPORTANT: the character must NOT hold anything in his hands. Both hands are
empty, relaxed, hanging down at his sides in loose fists — exactly like the
hands in the original reference image. Do not draw any object touching,
crossing or overlapping the hands.

Outfit worn on the body: a sleeveless gym stringer tank top with the flame
logo, athletic shorts, a wide weightlifting belt around the waist, fingerless
lifting gloves worn on both hands, and training shoes.

Equipment: ONE dumbbell lying flat on the ground next to his right foot,
clearly separated from his body, fully inside the frame. The dumbbell rests on
the floor and is not connected to the character in any way.
```

**Se ainda assim não gostar**, tente esta variante — mantém o haltere na mão,
mas descreve a pegada explicitamente em vez de deixar o modelo improvisar:

```
Same character, same rules as before. New outfit: weightlifting.
Sleeveless gym stringer tank top with the flame logo, athletic shorts, and
training shoes.

He holds ONE dumbbell in his right hand, arm hanging straight down at his side.
Draw the grip correctly: his fingers curl AROUND the dumbbell bar and close
over the front of it, the thumb wraps from the other side, and the bar is
hidden behind the fingers where it passes through the hand. The bar must never
be drawn on top of or across the closed fist. The left hand is empty.
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

## 3b. Fantasias por exercício (não por categoria)

Dá pra ter uma arte por exercício, mas **não vale a pena para os 38**: boa parte
tem exatamente a mesma roupa e muda só a intensidade. As quatro faixas de
Corrida (8, 10, 12 e 14 km/h) usam o mesmo uniforme; desenhar quatro seria
gerar a mesma imagem quatro vezes.

Contando só o que é visualmente distinto, dá **21 visuais** — 10 que já existem
e 12 novos.

### Exercícios que continuam usando a fantasia da categoria

| Fantasia atual | Cobre |
|---|---|
| `caminhada` | as 4 caminhadas (só muda a velocidade e a inclinação) |
| `corrida` | as 4 corridas |
| `bike` | os 4 ciclismos de rua |
| `natacao` | natação leve, moderada e vigorosa |
| `musculacao` | musculação leve e moderada/vigorosa |
| `esportes` | futebol recreativo e competitivo |
| `cardio` | elíptico e remo (a arte própria do remo não vingou — ver 2c) |
| `lutas` | jiu-jitsu |
| `funcional` | funcional e crossfit |
| `bemestar` | yoga |

### Os 12 que merecem arte própria

Mesmo fluxo: mesma conversa, prompt-base já enviado, um pedido por mensagem.

#### Spinning (bike indoor) — `caloricio-spinning.png`
```
Same character, same rules as before. New outfit: indoor spinning class.
A fitted sleeveless cycling jersey with the flame logo, padded cycling shorts,
cycling shoes, and a sweatband on the forehead. NO helmet and NO sunglasses —
this is indoors. A small towel hangs over one shoulder.
```

#### Pular corda — `caloricio-pularcorda.png`
```
Same character, same rules as before. New outfit: jump rope training.
A sleeveless training tank with the flame logo, athletic shorts, and light
training shoes. A jump rope held in both hands with the rope arcing over his
head, the arc kept fully inside the frame and away from the other character.
```

#### Boxe — `caloricio-boxe.png`
```
Same character, same rules as before. New outfit: boxing training.
Bare chest with a sleeveless boxing top, boxing trunks with a wide waistband
and the flame logo, tall boxing boots, and large red boxing gloves worn on
both hands, held up in a guard position close to the face.
```

#### Muay Thai / Kickboxing — `caloricio-muaythai.png`
```
Same character, same rules as before. New outfit: muay thai.
Bare chest, muay thai shorts (short and wide, with the flame logo), a
traditional mongkhon headband, ankle wraps, barefoot, and hand wraps on both
hands held in a guard position.
```

#### Hidroginástica — `caloricio-hidroginastica.png`
```
Same character, same rules as before. New outfit: water aerobics.
Swim trunks, a swim cap with the flame logo, and blue foam dumbbells (water
weights) held one in each hand, close to the body. No goggles — his eyes must
stay visible.
```

#### Surf — `caloricio-surf.png`
```
Same character, same rules as before. New outfit: surfing.
A short-sleeve wetsuit top with the flame logo, board shorts, barefoot, and a
surfboard standing upright on the ground beside him, leaning against his arm,
fully inside the frame.
```

#### Dança / Zumba — `caloricio-danca.png`
```
Same character, same rules as before. New outfit: dance and zumba class.
A colorful loose tank top with the flame logo, comfortable sweatpants, dance
sneakers, and a sweatband on one wrist. Both hands empty and relaxed at his
sides.
```

#### Vôlei — `caloricio-volei.png`
```
Same character, same rules as before. New outfit: volleyball.
A sleeveless volleyball jersey with the flame logo, sport shorts, knee pads on
both knees, and court shoes. A volleyball resting on the ground next to one
foot, fully inside the frame.
```

#### Basquete — `caloricio-basquete.png`
```
Same character, same rules as before. New outfit: basketball.
A basketball jersey with the flame logo, long basketball shorts, tall socks,
and high-top basketball shoes. A basketball resting on the ground next to one
foot, fully inside the frame.
```

#### Tênis — `caloricio-tenis.png`
```
Same character, same rules as before. New outfit: tennis.
A white polo shirt with the flame logo, white tennis shorts, a visor cap with
brown hair showing under it, wristbands, and tennis shoes. A tennis racket
resting on the ground standing upright beside him, leaning against his leg.
```

#### Escalada — `caloricio-escalada.png`
```
Same character, same rules as before. New outfit: indoor climbing.
A fitted t-shirt with the flame logo, climbing shorts, a climbing harness with
straps around the waist and thighs, and climbing shoes. A chalk bag hanging at
his waist. Both hands empty.
```

#### Funcional / Crossfit — `caloricio-crossfit.png`
```
Same character, same rules as before. New outfit: crossfit box training.
A fitted compression t-shirt with the flame logo, training shorts, knee
sleeves on both knees, a weightlifting belt, and flat training shoes. Both
hands empty and relaxed at his sides — no equipment held.
```

**Nota:** a arte `funcional` atual segura uma corda de pular. Se você gerar a
de Pular corda, faz sentido usar esta nova de Crossfit para a categoria e
deixar a atual só para o exercício "Pular corda (moderado)".

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
| Cardio | `img/sources/caloricio-cardio.png` (substitui a atual) |
| Bem-estar | `img/sources/caloricio-bemestar.png` |
| Pilates | `img/sources/caloricio-pilates.png` |
| Remo (ergômetro) | `img/sources/caloricio-remo.png` |
| Spinning | `img/sources/caloricio-spinning.png` |
| Pular corda | `img/sources/caloricio-pularcorda.png` |
| Boxe | `img/sources/caloricio-boxe.png` |
| Muay Thai | `img/sources/caloricio-muaythai.png` |
| Hidroginástica | `img/sources/caloricio-hidroginastica.png` |
| Surf | `img/sources/caloricio-surf.png` |
| Dança / Zumba | `img/sources/caloricio-danca.png` |
| Vôlei | `img/sources/caloricio-volei.png` |
| Basquete | `img/sources/caloricio-basquete.png` |
| Tênis | `img/sources/caloricio-tenis.png` |
| Escalada | `img/sources/caloricio-escalada.png` |
| Crossfit | `img/sources/caloricio-crossfit.png` |

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
- inspeção ampliada das mãos com `node tools/zoom.cjs <arte> 5 60 100 92`, que
  é onde o defeito costuma estar e onde ele não aparece no tamanho de exibição
  — foi assim que apareceram as duas garrafinhas do cardio

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
