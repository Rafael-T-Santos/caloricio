# TODOS

## Deploy automático (CI/CD) em vez de manual

**What:** Configurar publicação automática (GitHub Actions ou integração nativa
Vercel/Netlify) a cada push, em vez de arrastar/publicar manualmente.

**Why:** Ao longo do desafio de calorias, novas fantasias do mascote e novas regras
vão ser adicionadas com frequência — deploy manual cria risco de esquecer de
republicar depois de uma mudança.

**Pros:** Site sempre reflete a última versão do código sem passo manual; reduz
chance de "corrigi no código mas esqueci de publicar".

**Cons:** Configuração inicial extra que não é estritamente necessária para um
site pequeno com baixa frequência de deploy — pode não valer o tempo dado o prazo
apertado do lançamento desta semana.

**Context:** Surgiu na revisão de engenharia do design doc do Caloricio
(`devra-unknown-design-20260801-100405.md`). Decisão da revisão: adiar, não
bloqueia o lançamento inicial via GitHub Pages/Vercel/Netlify manual.

**Depends on/blocked by:** Nenhum — pode ser feito a qualquer momento depois do
lançamento inicial, quando/se o ritmo de deploys manuais se tornar incômodo.

## Rodar /design-consultation completo (sistema de design formal)

**What:** Consultoria de design completa — pesquisa de referências visuais,
sistema de design formal (DESIGN.md com tokens, tipografia, paleta, espaçamento).

**Why:** A revisão de design deste lançamento fixou decisões mínimas (fonte
Nunito, paleta verde-lima, estados do mascote) suficientes para não cair em
visual genérico de IA, mas não é um sistema de design formal.

**Pros:** Base mais sólida pra evoluir o visual se o projeto crescer (ex: virar
um desafio anual recorrente, ou ganhar mais funcionalidades).

**Cons:** Não é necessário para um projeto interno pequeno e pontual — esforço
desproporcional ao escopo atual.

**Context:** Surgiu na revisão de design do Caloricio
(`devra-unknown-design-20260801-100405.md`). Decisão: adiar — as decisões
mínimas já tomadas cobrem o lançamento desta semana.

**Depends on/blocked by:** Nenhum — só faz sentido revisitar se o projeto
continuar existindo além deste primeiro desafio.
