# page-cpqd-video

Versão web interativa, para TV touch, do vídeo institucional do CPQD no
Febraban Tech.

HTML + CSS + JavaScript puro, ES modules. **Sem build step, sem framework, sem
CDN, sem rede em runtime** — a TV do estande pode não ter conexão.

```bash
npm install          # só para o Playwright e para vendorizar as libs
npm run dev          # http://127.0.0.1:4173
npm run qa           # syntax + validação do manifesto + suíte E2E
```

## Onde mexer

| Quero... | Vá em |
|---|---|
| mudar ordem, duração ou texto de uma cena | `js/data/scenes.js` — **e só ali** |
| mudar cor | `js/data/brand.js` |
| criar um visual 3D novo | `js/three/scenes/` + registro em `index.js` |
| reprocessar o vídeo | `./scripts/ingest-video.sh <mp4>` |

`js/data/scenes.js` é o manifesto: menu, HUD, rotas, progresso, cena 3D e os
testes derivam dele. Acrescentar ou reordenar uma cena lá não pode exigir
mudança em nenhum outro módulo.

## Documentação

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — os 7 contratos entre módulos
- [`docs/CONTEUDO.md`](docs/CONTEUDO.md) — de onde veio cada conteúdo
- [`docs/QA.md`](docs/QA.md) — o que a suíte cobre e o que **não** cobre

## Controles

| | |
|---|---|
| Toque na mandala | vai para aquela solução |
| Toque num setor da roda | vai para o card do pilar |
| ← → ↑ ↓ | cena anterior / próxima |
| espaço | pausa e retoma |
| **M** | abre o menu · **Esc** fecha |
| **F** | tela cheia |
| swipe horizontal | navega |

A apresentação roda em laço. Depois de 3 minutos sem ninguém tocar, ela volta
sozinha para o início — é um totem, não pode amanhecer parada no card 23.

## Rodando no totem

**Clique duplo em `abrir-totem.command`** (macOS) ou **`abrir-totem.bat`**
(Windows). Abre em tela cheia, sem aba e sem barra de endereço.

**Não precisa de internet, nem de npm, nem de python. Só do navegador.**

### Por que funciona sem servidor

Abrir o `index.html` com dois cliques **não** funciona: o navegador bloqueia
ES modules em `file://` com *"CORS policy: origin null"*. É regra do navegador.

A flag `--allow-file-access-from-files` libera isso para arquivos locais, e é
o que os lançadores fazem. Eles usam um **perfil separado**
(`~/.cpqd-totem-perfil`), então essa permissão vale só para o totem e não
enfraquece a navegação normal de ninguém na máquina.

Serve Chrome, Edge, Brave ou Chromium — no Windows o Edge já vem instalado.

Verificado de ponta a ponta em `file://`: as 30 cenas, three.js desenhando, a
fonte vendorizada, a marca em SVG, e **zero requisições externas**. Há teste
que guarda isso (`tests/offline.spec.js`), então uma mudança futura que passe a
exigir servidor quebra na suíte antes de quebrar no estande.

### Se preferir um servidor

```bash
python3 -m http.server 4173 --bind 127.0.0.1
# ou
npm run dev
```

Os lançadores caem para essa rota sozinhos se não acharem navegador Chromium.

### Levar num pendrive

Copie a pasta inteira. Ela é autossuficiente — `js/vendor/` já tem three.js e
gsap, `assets/` tem a marca e as fontes. Não precisa de `node_modules/`.

## Documentação

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — os 7 contratos entre módulos
- [`docs/CONTEUDO.md`](docs/CONTEUDO.md) — de onde veio cada conteúdo
- [`docs/QA.md`](docs/QA.md) — o que a suíte cobre e o que **não** cobre

## Controles

| | |
|---|---|
| Toque na mandala | vai para aquela solução |
| Toque num setor da roda | vai para o card do pilar |
| ← → ↑ ↓ | cena anterior / próxima |
| espaço | pausa e retoma |
| **M** | abre o menu · **Esc** fecha |
| **F** | tela cheia |
| swipe horizontal | navega |

A apresentação roda em laço. Depois de 3 minutos sem ninguém tocar, ela volta
sozinha para o início — é um totem, não pode amanhecer parada no card 23.

## Rodando no totem

**Clique duplo em `abrir-totem.command`.** Ele sobe o servidor e abre o Chrome
em modo quiosque — sem aba, sem barra de endereço. Não precisa de npm nem de
terminal.

Se preferir a mão:

```bash
python3 -m http.server 4173 --bind 127.0.0.1   # macOS já tem python3
# ou
npm run dev                                     # se preferir node
```

### Por que precisa de servidor

Abrir o `index.html` direto (`file://`) **não funciona**: o navegador bloqueia
ES modules com "CORS policy: origin null". É regra do navegador, não dá para
contornar no código.

O servidor é **local**. Nada sai para a internet — ele serve apenas os arquivos
desta pasta, e a página não faz nenhuma requisição externa (há teste que prova
isso: `tests/offline.spec.js`).

**npm não é necessário para rodar.** Ele só serviu para instalar o Playwright
(testes) e para vendorizar three.js e gsap, que já estão em `js/vendor/`.

Abrindo o navegador na mão, o modo quiosque esconde aba e barra de endereço:

```bash
# macOS
open -a "Google Chrome" --args --kiosk --app=http://127.0.0.1:4173
# Linux
google-chrome --kiosk --app=http://127.0.0.1:4173
```

Sem isso, o botão **⛶** no canto inferior direito (ou a tecla **F**) entra em
tela cheia. O cursor some sozinho após 3 s parado.
