# QA

```
npm run qa       # syntax + validação do manifesto + suíte E2E
npm run dev      # http://127.0.0.1:4173
npx playwright test --project=tv-1080p
```

Três projetos: **tv-1080p** (1920×1080), **tv-4k** (3840×2160) e **touch**
(1920×1080 com `hasTouch`). Toda cena do manifesto vira teste automaticamente —
os specs iteram `SCENES`, nenhum id de cena está escrito em teste.

## As três camadas

**1. `scripts/syntax-check.mjs`** — passa todo JS pelo parser do Node e importa
os módulos de dados fora do browser. Pega erro de sintaxe em milissegundos, sem
subir navegador.

**2. `scripts/validate-manifest.mjs`** — o manifesto contra os contratos:
id kebab-case e único, layout conhecido, `scene3d` presente no registro 3D,
pilar existente, ícone existente, solução com 2+ chips e aplicações. E o que
mais importa: **`fonte.tIn`/`tOut` obrigatórios**, janelas contíguas (o fim de
uma cena é o início da próxima) e a soma batendo com a duração do vídeo dentro
de 100 ms. Sem isso o ritmo volta a ser palpite.

**3. Suíte Playwright** — 7 specs, **611 testes** (0 falhando, 4 skips):

| Spec | O que garante |
|---|---|
| `manifest.spec.js` | cada cena renderiza o título do manifesto; **nenhum texto do manifesto é descartado na tela**; chips e aplicações completos; a mandala lista exatamente as soluções |
| `navigation.spec.js` | botões, teclado, swipe, menu, mandala, rotas, laço, autoplay, progresso |
| `responsive.spec.js` | **sobreposição**, transbordo, safe area, sem rolagem, paridade 1080p↔4K |
| `a11y-touch.spec.js` | alvos ≥88×88, sem dependência de hover, foco, ARIA, contraste |
| `three-lifecycle.spec.js` | dispose completo, zero alocação em `update()`, vazamento de GPU |
| `offline.spec.js` | **nenhuma origem externa**: varre o código, checa o import map, e prova que a página monta inteira com toda a rede bloqueada |
| `regressoes.spec.js` | um teste por bug real já encontrado — ver o registro no fim |

As asserções de navegação usam `esperarCena()`, que confere **a tela** (título
renderizado + cena 3D montada) além do estado. Comparar só o store foi o que
deixou o P0 do menu passar despercebido.

## Duas armadilhas que já morderam este projeto

### Suíte verde não significa página certa

A suíte já passou inteira com o cabeçalho do HUD escrevendo por cima do título
da cena. Nenhuma medição pegava: não havia transbordo, os alvos tinham 88px, o
texto era legível — os elementos só ocupavam **o mesmo espaço, em camadas
diferentes**.

Por isso `responsive.spec.js` compara **retângulos**: para cada uma das 29
cenas, nenhum elemento de texto do card pode intersectar `#hud-topo` nem
`#hud-base`. A mensagem de falha diz qual elemento colidiu com qual.

E a defesa estrutural vem antes do teste: `#app` é um grid de três linhas, então
o HUD **não pode** ocupar a linha do conteúdo. O teste guarda a propriedade; o
layout a garante.

**Mesmo assim: depois de mudar qualquer coisa visual, tire screenshot e olhe.**

### Não meça geometria no meio da animação

Um item a meio tween do GSAP mede menor que o tamanho de repouso, e isso
produzia falhas não determinísticas. `js/ui/scene-view.js` marca
`#app[data-scene-settled="true"]` quando a entrada assenta. O helper `irPara()`
espera por esse sinal. **Nunca use timeout.**

## O que a suíte cobre

- As 29 cenas: renderização, título, texto, ausência de transbordo, ausência de
  sobreposição — em 1080p, 4K e touch.
- Navegação por botão, teclado (← → espaço Escape M Home End), swipe e clique
  na mandala; laço nas duas pontas; rota por hash, inclusive hash inválido.
- Reprodução automática respeitando `durationMs`; pausa suspendendo o avanço.
- Alvos de toque ≥88×88 no HUD, no menu e nos 18 itens da mandala.
- Vazamento de GPU: duas voltas completas pelas 29 cenas sem crescer
  `renderer.info.memory`.
- Zero alocação em `update()` — análise estática do código-fonte de cada cena
  3D, procurando `new`, literais e métodos de array que copiam.
- Nenhum erro de console ou `pageerror` ao percorrer todas as cenas.

## O que a suíte NÃO cobre

Diga em voz alta antes de confiar demais nela:

- **Aparência.** Nenhum teste sabe se a página está bonita ou se parece com o
  vídeo. Sobreposição e transbordo são medidos; composição não. Só olho humano.
- **Fidelidade ao vídeo.** Que o texto de um card bata com o frame de origem é
  garantido pelo `fonte.tIn/tOut` e por revisão manual, não por teste.
- **A TV real.** GPU, driver, taxa de atualização e digitalizador de toque do
  aparelho do estande. Chromium headless não é a TV.
- **Sessão longa.** A suíte roda minutos; a TV roda o dia inteiro em laço. O
  teste de vazamento cobre duas voltas, não oito horas.
- **Contraste em todas as combinações.** Só um caso é medido (título sobre
  fundo claro), não a matriz inteira.
- **Leitor de tela.** Há `aria-label`, `aria-current`, `role="progressbar"` e
  `aria-live`, mas ninguém rodou VoiceOver nisso.
- **O QR na câmera.** A matriz foi validada por round-trip com `zbarimg`;
  ninguém apontou um celular para a TV.
- **Tela cheia de verdade.** O teste confere o contrato do controle (existe, é
  alvo válido, anuncia estado, não derruba a página); o estado real depende do
  navegador e do sistema, e headless costuma recusar. **Teste na TV.**
- **A fonte é a certa?** A suíte garante que a Poppins carrega e é aplicada.
  Ninguém confirmou que ela é a fonte oficial da marca CPQD.

## Regra que não se quebra

**Nunca afrouxe, pule ou desabilite um teste para ficar verde.** Se um teste
falha, ou o código está errado ou o teste está medindo errado — decida qual e
conserte a causa.

### Registro de bugs achados

**Encontrados por auditoria contra o vídeo, não pela suíte:**

| Bug | Como escapou |
|---|---|
| Uma cena inteira ausente (o card institucional de 9,7–15,5 s) | a suíte valida o manifesto contra si mesmo; ela não sabe o que o vídeo tem |
| Poppins vendorizada e **nunca ligada** — a página inteira em Helvetica | nenhum teste olhava a família tipográfica |
| Marca renderizada como texto liso em vez do wordmark | idem |
| Ícones ilegíveis (o de onboarding não lia como nada) | idem |

**Encontrados por auditoria de fluxo:**

| Bug | Gravidade |
|---|---|
| Escolher no menu mudava store, hash e HUD e **deixava o card na cena anterior** | P0 — e a suíte passava, porque conferia o store |
| Router engolia a primeira rota após navegação interna | P1 |
| Índice não-finito travava o app permanentemente | P2 |
| Multitoque gerava swipe fantasma | P2 |
| Menu cobria os próprios controles | P2 |
| Foco não voltava ao fechar o menu; era roubado a cada troca de cena | P2 |

**Encontrados pela suíte:** `#menu` em `z-index: 1` por especificidade;
sobreposição das pílulas da mandala no cabeçalho; `:nth-of-type` pegando a roda
em vez da coluna direita.

### Testes que estavam medindo errado

Aconteceu cinco vezes neste projeto, e vale o registro:

1. O teste de vazamento contava a LUT de BRDF do three (uma textura interna do
   renderer, alocada uma vez e nunca liberada) como vazamento. **Teste medindo
   errado** → passou a medir a partir de uma volta de aquecimento.
2. O mesmo teste era flaky sob carga paralela: media `renderer.info` sem
   garantir que um render tinha acontecido entre as trocas. **Teste medindo
   errado** → passou a medir sempre na mesma cena, após dois quadros garantidos.
3. O teste de swipe construía um `TouchEvent` sem `identifier`, então explodia
   antes de exercitar o gesto — nunca testou nada. **Teste quebrado** → passou a
   montar `Touch` de verdade. O gesto sempre funcionou.
4. O teste de título usava `innerText`, que aplica `text-transform` — o núcleo
   da mandala (uppercase por CSS) nunca batia com o manifesto. **Teste medindo
   errado** → passou a usar `textContent`, que é o texto de origem.
5. O teste de vazamento estourava o tempo em 90 idas e voltas ao browser sob
   carga paralela. O que parecia vazamento era lentidão de round-trip. **Teste
   medindo errado** → o laço inteiro passou a rodar dentro da página.

E uma vez o teste estava certo: o `#menu` ficava em `z-index: 1` em vez de 5,
porque uma regra genérica (`#app > :not(#palco)`) tinha especificidade de dois
ids e sobrescrevia a específica. O menu só aparecia por cima **por acidente da
ordem do DOM**. **Bug real** → empilhamento explícito por elemento.
