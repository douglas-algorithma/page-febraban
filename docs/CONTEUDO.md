# Conteúdo: de onde veio cada coisa

`CONTENT_STATUS = 'final'`.

Toda a ordem, duração e texto desta página foram extraídos do vídeo
**"04828 - Vídeo Febraban V5 - High Quality.mp4"**
(1920×1080, 60 fps, 256,216667 s, h264 21 Mbps).

Nada aqui é palpite. Cada cena do manifesto carrega `fonte: { tIn, tOut }` com
os segundos reais no vídeo, e `scripts/validate-manifest.mjs` recusa o
manifesto se as janelas não forem contíguas ou não somarem a duração do vídeo.

## Como o ritmo foi medido

O vídeo é motion graphics com dissolves suaves. **Detecção de corte seco não
serve**: com limiar 0,25 acha 1 corte em 4 minutos; com 0,08 acha 4.

O ritmo veio da **energia de mudança por frame** (filtro `scdet` do ffmpeg
sobre os 15.373 frames), agregada em janelas de 0,5 s. O padrão é inequívoco:

- **~5,0 s de repouso absoluto** por card (score < 0,05 — quadros idênticos);
- **~2,5 s de transição** entre cards;
- cadência média de **7,7 s** por card;
- três pausas longas de **13–14 s**: são as recapitulações da mandala.

`./scripts/ingest-video.sh <mp4>` reproduz tudo isso em `.ingest/`
(`ritmo.txt` traz as janelas de repouso já recortadas).

## Estrutura encontrada

| Cenas | Bloco |
|---|---|
| 1–3 | abertura, quatro pilares, mandala |
| 4–13 | **Segurança Digital**: título + 9 soluções |
| 14 | mandala (recap) |
| 15–18 | **Confiança Digital**: título + 3 soluções |
| 19 | mandala (recap) |
| 20–26 | **Operações Inteligentes**: título + 6 soluções |
| 27–29 | mandala final, QR de contato, selo CPQD 50 anos |

**A mandala é o dispositivo de navegação do próprio vídeo** — reaparece 3× como
recapitulação entre pilares. Virou o menu da TV touch sem invenção nenhuma.

## Duas coisas que divergem da Mandala de Soluções

Ambas foram lidas do vídeo, não decididas por mim. Valem sua conferência:

1. **A mandala mostra 17 caixas; o vídeo tem 18 cards de solução.**
   "Data Center — Gerência da Planta e Monitoramento Inteligente" é **uma**
   caixa na roda, mas o vídeo dedica **dois** cards separados, com números
   diferentes (frames de 204 s e 212 s). Mantive os dois, cada um navegável.

2. **Inovação Aplicada é o anel externo, não um quadrante.**
   No frame da mandala (36 s) o círculo interno tem três setores — Segurança
   Digital, Confiança Digital, Operações Inteligentes — e "INOVAÇÃO APLICADA"
   corre pelo **anel que os envolve**. Por isso não tem card de título nem
   bloco de soluções. Está modelado assim em `brand.js`.

## Locução

**Não existe.** O container tem faixa AAC estéreo 48 kHz, mas é silêncio
digital: `mean_volume: -91.0 dB`, `max_volume: -91.0 dB`.

Nenhum conteúdo desta página veio de áudio. Não há número nem claim novo para
aprovar.

## Números que aparecem nos cards

Todos foram lidos dos frames em resolução plena. Se algum não bater com a
Mandala, a origem é o vídeo:

| Solução | Números |
|---|---|
| Ensaios para POS | Atendemos 90% das adquirentes |
| Antifraude | +8,4 bi · +12 bi · +274,8 bi · total +295,2 bi requisições/ano |
| Identidade Digital | 35 milhões · +300 milhões · 76% redução |
| Onboarding | 99% · +130 milhões · +900 milhões |
| Higienização de Dados | +100 mil · incremento de 50% |
| IA Aplicada ao Negócio | Mais de 100 projetos de IA |
| Data Center — Gerência | 99,9% de efetividade |
| Data Center — Monitoramento | 22 datacenters · 62 AZ · +1.600 · +21 mi · +150 mil |
| Gestão Inteligente de POS | 30–40% · +5–10% TPV · até 50% |

## Paleta

Amostrada por histograma de recorte dos frames, em `js/data/brand.js`.
Onde o JPEG desloca o tom, prevalece o valor de marca:

| Token | Amostrado | Adotado |
|---|---|---|
| roxo (títulos) | `#301857` | **`#372060`** |
| roxo médio (chips, painel) | `#48267C` | **`#48267D`** |
| verde-limão | `#B8FE0B` | **`#B6F000`** |
| lilás | `#B9A9CE` | **`#B9A9CE`** |
| quase-carvão (etiqueta) | `#0E0818` | **`#0E0818`** |

As amostras confirmam a IDV: roxo #372060 e verde-limão #B6F000.

## QR Code

Reproduzido do vídeo, **não gerado por palpite**. Recorte do frame de 249 s,
binarizado, amostrado numa matriz 29×29 (QR versão 3) em `js/ui/qr.js`.

Validado por round-trip: a matriz renderizada de volta e lida com `zbarimg`
devolve o mesmo destino lido do frame original —
`https://www.cpqd.com.br/febrabantech-lp`.

Emitido como SVG vetorial para ficar nítido também em 4K.

## Desvios deliberados do vídeo

Coisas que a página faz diferente **porque é interativa e o vídeo não é**:

- **HUD persistente** (marca, pilar, contador, progresso, controles). Nas cenas
  claras o bloco da marca vira o painel roxo do canto superior esquerdo do
  vídeo, para haver **um logo só** na tela.
- **A mandala é clicável.** No vídeo ela só passa; aqui cada solução é um alvo
  de toque de 88px que navega até o card.
- **Laço infinito.** Da última cena, "próxima" volta à primeira: a TV roda o
  dia inteiro.
- **Sem apresentadora e sem imagens de banco.** O vídeo usa vídeo de pessoas e
  fotografia licenciada. A página reconstrói os fundos em three.js (partículas,
  anéis, roda, poeira, barras) — sem asset externo, sem rede, sem questão de
  licenciamento de imagem.
