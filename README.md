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

A página precisa de um servidor (ES modules não carregam de `file://`). Nada
sai para a internet: o servidor é local e serve só os arquivos do projeto.

```bash
npm run dev        # http://127.0.0.1:4173
```

Para esconder a aba e a barra de endereço, o mais confiável é abrir o navegador
já em modo quiosque — melhor que o botão de tela cheia, porque sobrevive a um
recarregamento:

```bash
# macOS
open -a "Google Chrome" --args --kiosk --app=http://127.0.0.1:4173

# Linux
google-chrome --kiosk --app=http://127.0.0.1:4173
```

Se preferir abrir normal, o botão **⛶** no canto inferior direito (ou a tecla
**F**) entra em tela cheia. O cursor some sozinho após 3 s parado.
