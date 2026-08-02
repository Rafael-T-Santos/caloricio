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

## 2a. Onde colocar o equipamento — regra de ouro

Tudo que deu errado em arte deste projeto caiu numa destas duas armadilhas.
Vale reler antes de escrever qualquer pedido novo.

**1. Mão segurando objeto rígido dá errado.** É o erro mais teimoso do modelo:
a barra do haltere saiu por cima do punho fechado, a garrafinha atravessou o
pulso, o cabo do remo cruzou a perna. Os dedos quase nunca envolvem o objeto de
verdade.

**2. Objeto encostado no corpo também dá errado**, e por tabela. Pedir contato
empurra o modelo justamente para a pose de segurar — foi o que estragou a 2ª e a
3ª tentativa do remo.

Então a ordem de preferência é:

| Preferência | Como pedir | Exemplos que funcionaram |
|---|---|---|
| 1º — **vestido** | o equipamento é roupa: calçado, amarrado, pendurado | luvas de boxe, cinto, capacete, touca, meia antiderrapante, toalha no pescoço |
| 2º — **solto no chão** | ao lado do pé, sem encostar em nada | bola de futebol, vôlei, basquete, haltere, garrafinha, alça do remo |
| 3º — **na mão** | só quando o gesto É o exercício | corda de pular girando por cima da cabeça |

Objeto solto no chão **sobrevive ao pipeline** desde a mudança descrita em 2d, e
se estiver desenhado abaixo da linha dos pés ele é subido automaticamente. Não
precisa mais pedir contato com o corpo — aquilo era contorno de uma limitação
que não existe mais.

---

## 2b. Rodada de agosto/2026 — as 4 imagens (concluída)

Auditoria: todos os 38 exercícios tinham arte e não faltava nenhum arquivo em
disco. O que apareceu foram **duas artes erradas** e **dois exercícios vestidos
com a roupa de outro**. Os quatro prompts abaixo são os que geraram a arte que
está no ar hoje — servem de modelo para pedidos novos.

| # | Arte | Por quê |
|---|---|---|
| 1 | `lutas` (refeita) | o jiu-jitsu estava de luvas de boxe |
| 2 | `cardio` (refeita) | duas garrafinhas, uma em cada mão, com o encaixe errado |
| 3 | `pilates` (nova) | o Pilates aparecia vestido de yoga |
| 4 | `remo` (nova) | o Remo usava o genérico de academia |

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

## 2c. Resultado da rodada — as 4 entraram

Cardio, Pilates, Jiu-jitsu e Remo estão no ar. As duas últimas precisaram de
mais de uma geração, e o registro de por quê está abaixo: em nenhum dos casos o
desenho em si estava feio, o que travou foi proporção e pipeline.

### Jiu-jitsu — resolvido na 2ª geração: personagem estava fora de proporção

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

### Remo — resolvido com a 1ª tentativa, sem gerar de novo

Foram três versões, e **a primeira era a boa**: alça e corrente soltas no chão,
longe das mãos. Ela tinha sido recusada por um motivo que deixou de existir
(o pipeline apagava objeto solto — ver 2d). As outras duas tentaram encostar o
equipamento no corpo e pioraram: a 2ª saiu com duas barras pretas cruzando as
pernas, a 3ª com a alça atravessando a perna e passando na frente do tênis. Nas
duas as mãos voltaram a segurar, que era exatamente o que queríamos evitar.

O único defeito real da 1ª — a corrente descendo abaixo da sola — virou um passo
do pipeline (`seatDetachedObjects`) em vez de mais um pedido: objeto solto
desenhado abaixo dos pés é subido até a linha do chão. Isso resolve o estouro de
canvas e também alinha o objeto com a sombra do site, que fica na linha dos pés.
Nunca desce nada — objeto acima da linha (bola no ar, prancha encostada) é
intencional.

**Lição para os próximos pedidos:** peça o equipamento **solto no chão, ao lado
do pé**. Encostar no corpo era uma exigência da limitação antiga e hoje só
atrapalha, porque leva o modelo a desenhar a mão segurando.

### (histórico) Remo — 2ª tentativa: a alça no chão era apagada pelo pipeline

O desenho veio exatamente como pedi: alça preta com corrente, no chão, longe
das mãos. O problema é que **objeto solto no chão não sobrevive ao pipeline**.
Para separar os dois personagens da mesma imagem, o processamento descarta
fragmentos que vazaram do vizinho, e faz isso apagando tudo que não está ligado
ao corpo. A alça é um componente separado, então ela some — e sem a alça sobra
um macaquinho vermelho, que lê como luta olímpica, não como remo.

É o mesmo motivo pelo qual a bola do basquete, a do vôlei e a do futebol também
não aparecem nas artes atuais, apesar de estarem nos originais.

A saída **na época** foi pedir que o objeto encostasse no personagem, virando uma
peça só com ele. Deu errado duas vezes seguidas, e o prompt correspondente foi
removido deste documento de propósito, para ninguém copiá-lo: ele mandava o
equipamento tocar o corpo, que é hoje exatamente o oposto da regra de ouro (2a).

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

Havia aqui uma variante que mantinha o haltere na mão e descrevia a pegada em
detalhe. Foi removida: descrever a pegada não resolve, o modelo erra do mesmo
jeito, e a versão com o haltere no chão ficou boa. Ver a regra de ouro em 2a.

### Caminhada

```
Same character, same rules as before. New outfit: casual walking.
A light zip-up windbreaker over a t-shirt, comfortable jogger pants, chunky
walking sneakers, and a baseball cap worn forward with brown hair showing
under it.
```

### Funcional / HIIT — obsoleto

Este prompt pedia uma corda de pular na mão e gerou o visual `funcional`, que
**não é mais usado por nenhum exercício**: a categoria Funcional/HIIT usa o
visual de Crossfit (mãos livres, em 3b) e a corda ficou exclusiva do exercício
"Pular corda". Não gere por este bloco.

### Lutas — obsoleto, ver 2c

O prompt daqui pedia luvas de boxe por cima do kimono. Fazia sentido quando
`lutas` vestia as três lutas, mas Boxe e Muay Thai ganharam arte própria e
`lutas` passou a ser só o jiu-jitsu — onde a mão precisa agarrar o kimono e luva
nenhuma cabe. **Use o prompt de jiu-jitsu da seção 2c.**

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

Both hands empty and relaxed at his sides — nothing held, nothing touching or
crossing the hands.

Outfit worn on the body: a breathable short-sleeve sport t-shirt with the flame
logo, running shorts, training shoes, and a small white towel draped around the
neck with both ends hanging down over the chest.

Equipment: exactly ONE water bottle standing upright on the ground next to his
foot, separate from his body and fully inside the frame.
```

### Bem-estar (yoga)

O tapete enrolado debaixo do braço é uma exceção aceita à regra de ouro: não é
pegada de dedos em objeto rígido, é volume apoiado no braço, e sempre saiu bem.

```
Same character, same rules as before. New outfit: yoga.
A comfortable loose tank top with the flame logo, soft stretchy leggings,
barefoot, and a rolled-up yoga mat carried under one arm, kept close to the
body and fully inside the frame.
```

O Pilates saiu desta fantasia e tem prompt próprio na seção 2b.

---

## 3b. Fantasias por exercício (não por categoria)

Dá pra ter uma arte por exercício, mas **não vale a pena para os 38**: boa parte
tem exatamente a mesma roupa e muda só a intensidade. As quatro faixas de
Corrida (8, 10, 12 e 14 km/h) usam o mesmo uniforme; desenhar quatro seria
gerar a mesma imagem quatro vezes.

Contando só o que é visualmente distinto, são **22 visuais**, todos já gerados.

### Exercícios que continuam usando a fantasia da categoria

| Fantasia atual | Cobre |
|---|---|
| `caminhada` | as 4 caminhadas (só muda a velocidade e a inclinação) |
| `corrida` | as 4 corridas |
| `bike` | os 4 ciclismos de rua |
| `natacao` | natação leve, moderada e vigorosa |
| `musculacao` | musculação leve e moderada/vigorosa |
| `esportes` | futebol recreativo e competitivo |
| `cardio` | elíptico (camiseta, toalha e garrafinha é o que se veste num elíptico) |
| `lutas` | jiu-jitsu |
| `crossfit` | funcional e crossfit |
| `bemestar` | yoga |

### Os exercícios com arte própria

Estes 12 vieram desta rodada; Pilates e Remo entraram depois e têm os prompts
deles na seção 2b.

Mesmo fluxo: mesma conversa, prompt-base já enviado, um pedido por mensagem.

#### Spinning (bike indoor) — `caloricio-spinning.png`
```
Same character, same rules as before. New outfit: indoor spinning class.
A fitted sleeveless cycling jersey with the flame logo, padded cycling shorts,
cycling shoes, and a sweatband on the forehead. NO helmet and NO sunglasses —
this is indoors. A small towel hangs over one shoulder.
```

#### Pular corda — `caloricio-pularcorda.png`

Exceção deliberada à regra de ouro: aqui o gesto de segurar **é** o exercício, e
a corda é flexível, não uma barra rígida atravessando o punho. Saiu bem.

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

Both hands empty and relaxed at his sides — nothing held.

Outfit worn on the body: swim trunks and a swim cap with the flame logo. No
goggles — his eyes must stay visible.

Equipment: two blue foam dumbbells (water weights) resting on the ground next to
his feet, separate from his body and fully inside the frame.
```

#### Surf — `caloricio-surf.png`
```
Same character, same rules as before. New outfit: surfing.

Both hands empty and relaxed at his sides.

Outfit worn on the body: a short-sleeve wetsuit top with the flame logo, board
shorts, barefoot.

Equipment: a surfboard standing upright on the ground beside him, NOT touching
him and not overlapping his body, with a clear gap between the board and his
arm. Keep the whole board inside the frame and away from the other character.
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

Both hands empty and relaxed at his sides — he does NOT hold the racket.

Outfit worn on the body: a white polo shirt with the flame logo, white tennis
shorts, a visor cap with brown hair showing under it, wristbands, and tennis
shoes.

Equipment: a tennis racket lying flat on the ground next to his foot, separate
from his body and fully inside the frame.
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

**Nota:** foi assim que a categoria Funcional/HIIT passou a usar este visual de
mãos livres, e a corda de pular ficou exclusiva do exercício "Pular corda
(moderado)". O visual `funcional` antigo deixou de ser usado.

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
- **Equipamento compacto, perto do pé**: não precisa (nem deve) encostar no
  corpo — ver a regra de ouro em 2a —, mas também não pode se esticar para o
  lado. Acessório espalhado é o que fez os halteres da musculação serem cortados
  na emenda entre os dois personagens.
