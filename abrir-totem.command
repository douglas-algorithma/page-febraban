#!/usr/bin/env bash
#
#  CPQD · Soluções Inteligentes para o setor Financeiro
#  Clique duplo neste arquivo para abrir a apresentação em tela cheia.
#
#  NÃO precisa de internet, nem de npm, nem de python. Só do navegador.
#
#  Como funciona: o navegador bloqueia ES modules abertos como file:// por
#  padrão ("CORS: origin null"). A flag --allow-file-access-from-files libera
#  isso para arquivos locais. Usamos um PERFIL SEPARADO, então essa permissão
#  não vale para a navegação normal de ninguém.
#
#  Se não achar navegador baseado em Chromium, cai para um servidor local.
set -uo pipefail

RAIZ="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ARQUIVO="file://$RAIZ/index.html"
PERFIL="$HOME/.cpqd-totem-perfil"
SO_TESTE="${1:-}"

echo "╭────────────────────────────────────────────────╮"
echo "│  CPQD · Soluções para o setor Financeiro       │"
echo "╰────────────────────────────────────────────────╯"
echo

achar_navegador () {
  local candidatos=(
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge"
    "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser"
    "/Applications/Chromium.app/Contents/MacOS/Chromium"
  )
  for c in "${candidatos[@]}"; do
    [[ -x "$c" ]] && { echo "$c"; return 0; }
  done
  return 1
}

if NAV="$(achar_navegador)"; then
  echo "→ Navegador: $(basename "$(dirname "$(dirname "$(dirname "$NAV")")")")"
  echo "→ Abrindo direto do arquivo, sem servidor."
  echo
  echo "   Para SAIR: Cmd+Q"
  echo "   Tela cheia: já entra sozinho (ou tecla F)"
  echo

  [[ "$SO_TESTE" == "--nao-abrir" ]] && { echo "(modo teste: não abri)"; exit 0; }

  "$NAV" \
    --user-data-dir="$PERFIL" \
    --allow-file-access-from-files \
    --kiosk \
    --app="$ARQUIVO" \
    --start-fullscreen \
    --disable-session-crashed-bubble \
    --disable-infobars \
    --noerrdialogs \
    --no-first-run \
    --disable-features=Translate,PrivacySandboxSettings4 >/dev/null 2>&1
  exit 0
fi

# ── sem navegador Chromium: cai para servidor local ────────────────────
echo "→ Não achei Chrome, Edge, Brave nem Chromium."
echo "  Tentando servidor local + navegador padrão."
PORTA=4173
URL="http://127.0.0.1:$PORTA"
cd "$RAIZ"

if curl -s -o /dev/null --max-time 1 "$URL"; then
  PID=""
elif command -v python3 >/dev/null 2>&1; then
  python3 -m http.server "$PORTA" --bind 127.0.0.1 >/dev/null 2>&1 & PID=$!
elif command -v node >/dev/null 2>&1; then
  PORT="$PORTA" node scripts/serve.mjs >/dev/null 2>&1 & PID=$!
else
  echo "✗ Sem navegador Chromium e sem python3/node. Não dá para abrir aqui."
  read -r -p "Enter para fechar..."
  exit 1
fi
trap '[[ -n "${PID:-}" ]] && kill "$PID" 2>/dev/null' EXIT INT TERM
for _ in $(seq 1 40); do curl -s -o /dev/null --max-time 1 "$URL" && break; sleep 0.25; done
[[ "$SO_TESTE" == "--nao-abrir" ]] && { echo "(modo teste: servidor de pé em $URL)"; exit 0; }
open "$URL"
echo; read -r -p "Deixe esta janela aberta. Enter encerra o servidor."
