#!/usr/bin/env bash
#
# Extrai de um MP4 o material que alimenta o ritmo do manifesto.
# Uso: ./scripts/ingest-video.sh <caminho-do-mp4>
#
# Aceita caminho local e NAO copia o arquivo: cria um symlink em .ingest/fonte.mp4.
# Gera em .ingest/:
#   scenes/       um frame por corte de cena detectado
#   frames/       um frame a cada 2s
#   audio/        a faixa de audio, se houver
#   scores.txt    energia de mudanca por frame (filtro scdet)
#   ritmo.txt     janelas de repouso — daqui saem os durationMs
#   probe.json    metadados do container
#
# Por que scdet e nao deteccao de corte: este video e motion graphics com
# dissolves. Corte seco acha 4 eventos em 4 minutos. A energia por frame
# mostra o ritmo real — ~5,0s de repouso por card, ~2,5s de transicao.
set -euo pipefail

FONTE="${1:-}"
if [[ -z "$FONTE" || ! -f "$FONTE" ]]; then
  echo "uso: $0 <caminho-do-mp4>" >&2
  exit 1
fi
command -v ffmpeg >/dev/null || { echo "ffmpeg nao encontrado (brew install ffmpeg)" >&2; exit 1; }

RAIZ="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT="$RAIZ/.ingest"
mkdir -p "$OUT"/{scenes,frames,audio}

ln -sf "$(cd "$(dirname "$FONTE")" && pwd)/$(basename "$FONTE")" "$OUT/fonte.mp4"
V="$OUT/fonte.mp4"

echo "==> probe"
ffprobe -v error -show_entries format=duration,size,bit_rate,format_name \
  -show_entries stream=index,codec_type,codec_name,width,height,r_frame_rate,duration,channels,sample_rate \
  -of json "$V" > "$OUT/probe.json"

echo "==> cortes de cena (limiar 0.08)"
ffmpeg -hide_banner -nostdin -loglevel info -i "$V" \
  -vf "select='gt(scene,0.08)',showinfo,scale=1280:-2" \
  -vsync vfr -q:v 3 "$OUT/scenes/scene_%04d.jpg" 2> "$OUT/scenes.log"
grep -o 'pts_time:[0-9.]*' "$OUT/scenes.log" | cut -d: -f2 > "$OUT/scene_times.txt" || true

echo "==> frames a cada 2s"
ffmpeg -hide_banner -nostdin -loglevel error -i "$V" \
  -vf "fps=1/2,scale=1280:-2" -q:v 3 "$OUT/frames/f_%04d.jpg"

echo "==> audio"
if ffprobe -v error -select_streams a -show_entries stream=index -of csv=p=0 "$V" | grep -q .; then
  ffmpeg -hide_banner -nostdin -loglevel error -i "$V" -vn -ac 1 -ar 16000 -q:a 4 "$OUT/audio/narracao.mp3"
  ffmpeg -hide_banner -nostdin -i "$OUT/audio/narracao.mp3" -af volumedetect -f null - 2>&1 \
    | grep -E 'mean_volume|max_volume' > "$OUT/audio/volume.txt" || true
  echo "    $(cat "$OUT/audio/volume.txt" 2>/dev/null | tr '\n' ' ')"
else
  echo "    sem faixa de audio"
fi

echo "==> energia de mudanca por frame"
ffmpeg -hide_banner -nostdin -loglevel error -i "$V" \
  -vf "scdet=threshold=0,metadata=print:file=$OUT/scd.txt" -an -f null - 2>/dev/null
awk '/pts_time/{split($0,a,"pts_time:"); t=a[2]+0} /scd.score/{split($0,b,"="); print t, b[2]+0}' \
  "$OUT/scd.txt" > "$OUT/scores.txt"

echo "==> janelas de repouso (bins de 0,5s, energia < 0,05, minimo 2s)"
awk '{s[int($1*2)]+=$2} END{
  for(i=0;i<1200;i++){ q=((s[i]+0)<0.05)
    if(q && !inq){ st=i; inq=1 }
    else if(!q && inq){ if((i-st)>=4) printf "REPOUSO %7.1fs -> %7.1fs  (%.1fs)\n", st/2, i/2, (i-st)/2; inq=0 } }
}' "$OUT/scores.txt" > "$OUT/ritmo.txt"

echo "==> paleta dominante"
ffmpeg -hide_banner -nostdin -loglevel error -i "$V" \
  -vf "fps=1/10,scale=200:-2,palettegen=max_colors=16" -y "$OUT/paleta.png" 2>/dev/null || true

echo
echo "pronto em $OUT"
echo "  cortes  : $(wc -l < "$OUT/scene_times.txt" 2>/dev/null || echo 0)"
echo "  frames  : $(ls "$OUT/frames" | wc -l | tr -d ' ')"
echo "  repousos: $(wc -l < "$OUT/ritmo.txt" | tr -d ' ')"
