# Arquitetura

HTML + CSS + JavaScript puro, ES modules, **sem build step e sem framework**.
`three` e `gsap` são vendorizados em `js/vendor/` e resolvidos por import map.
A página roda com o cabo de rede desligado — a TV do estande pode não ter rede.

```
index.html          import map + as três faixas do grid
css/                tokens, base, cena, hud, menu
js/
  data/scenes.js    O MANIFESTO — tudo deriva daqui
  data/brand.js     paleta e pilares (fonte única da cor)
  engine/           store, clock, router, input
  ui/               scene-view, hud, menu, icons, qr
  three/            stage + scenes/ (registro)
  vendor/           three 0.185.1, gsap 3.13.0
scripts/            serve, ingest-video, syntax-check, validate-manifest, vendor
tests/              suíte Playwright em 3 projetos
```

## Os 7 contratos

### Contrato 1 — O manifesto é a especificação
`js/data/scenes.js` é a única fonte de verdade. Menu, HUD, rotas, progresso,
cena 3D e os próprios testes derivam dele por função pura (`chapters()`,
`solutions()`, `progressAt()`, `totalDurationMs()`).

**Acrescentar, remover ou reordenar uma cena não pode exigir mudança em nenhum
outro módulo.** Se exigir, o acoplamento é o bug. Nenhum id de cena aparece
escrito em CSS, em view ou em teste — os testes iteram `SCENES`.

Cada cena carrega `fonte: { tIn, tOut }`, os segundos reais no vídeo. Sem isso
o ritmo vira palpite, e `scripts/validate-manifest.mjs` recusa.

### Contrato 2 — Estado num lugar só
`engine/store.js` guarda um índice dentro de `SCENES` e avisa quem assinou.
Não conhece DOM nem three.js. Nenhuma view mantém índice próprio.

`engine/clock.js` tem **o único `requestAnimationFrame` do projeto**. Ele move
o avanço automático (respeitando `durationMs`) e o `update(dt)` da cena 3D.
O tempo decorrido dentro da cena **não** passa pelo store — seriam 60
notificações por segundo; o HUD recebe um `aoQuadro()` direto.

### Contrato 3 — Cena 3D: dono do que aloca
Um módulo em `js/three/scenes/` exporta `criar(ctx)` e devolve:

```js
{ scene, camera, update(dt, t), resize(w, h), dispose() }
```

- cria a **própria** `THREE.Scene` e a própria câmera;
- **zero alocação em `update()`** — nada de `new`, literal de array/objeto ou
  `.map`/`.filter`. A 60fps, uma alocação por quadro são 3.600 objetos por
  minuto para o GC. Há teste estático sobre o código-fonte;
- **`dispose()` devolve tudo** o que alocou. O palco ainda passa um pente fino
  (`disposeDeep`) como rede de segurança, e o teste de vazamento mede
  `renderer.info.memory` ao longo de duas voltas completas.

Cena nova: escreva o módulo, registre em `scenes/index.js`, aponte `scene3d`
no manifesto. Nenhum outro arquivo precisa saber.

### Contrato 4 — A view é função da cena
`ui/scene-view.js` recebe uma cena e desenha o card. O `layout` decide a forma
(`abertura`, `pilares`, `mandala`, `titulo-pilar`, `solucao`, `cta`,
`encerramento`); **nenhum id de cena aparece ali**.

**Sinal de assentamento:** ao terminar a timeline de entrada do GSAP a view
marca `#app[data-scene-settled="true"]`. Medir geometria no meio de um tween lê
um tamanho menor que o de repouso e produz falha intermitente. Testes esperam
por esse atributo, **nunca por timeout**.

### Contrato 5 — O HUD mostra contexto, não título
O HUD desenha marca, pilar, contador, progresso e controles. **Nunca o título
da cena** — isso pertence ao card. Duplicar era exatamente o que produzia dois
textos no mesmo lugar, em camadas diferentes, sem nenhuma medição acusar.

### Contrato 6 — Menu derivado
`ui/menu.js` monta a lista de `interludes()` + `chapters()`. Reordenar o
manifesto reordena o menu sem tocar no módulo.

### Contrato 7 — Cor num lugar só
`js/data/brand.js` tem a paleta e injeta custom properties no `:root`.
`css/tokens.css` cuida de **medida**, não de cor. Cor nova entra no `brand.js`
com a origem anotada.

## Decisões de layout que sustentam o QA

**`#app` é um grid de três linhas** — cabeçalho, palco, controles. Cada um
ocupa linha própria, então o HUD **não pode** cair por cima do conteúdo por
construção, não por sorte de z-index. O canvas 3D fica em `position: absolute`
atrás de tudo.

**Escala por proporção, não por media query.** A raiz usa
`min(100vw/120, 100vh/67.5)`: 1rem = 16px em 1080p, 32px em 4K. A TV muda de
tamanho, não de layout. O piso de toque é físico — `max(5.5rem, 88px)` — para
não encolher junto com a raiz.

**A faixa inferior esquerda pertence à moeda do pilar e aos anéis 3D**, como no
vídeo. Por isso os controles vão para a direita e a barra de progresso começa
depois de 16rem.

**Empilhamento explícito por elemento.** Uma regra genérica
(`#app > :not(#palco)`) tinha especificidade de dois ids e sobrescrevia o
z-index do menu, que aparecia por cima só por acidente da ordem do DOM.
