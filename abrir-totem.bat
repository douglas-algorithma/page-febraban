@echo off
REM  CPQD - Solucoes Inteligentes para o setor Financeiro
REM  Clique duplo para abrir a apresentacao em tela cheia.
REM
REM  NAO precisa de internet, nem de npm, nem de python. So do navegador.
REM
REM  O navegador bloqueia ES modules em file:// por padrao ("CORS: origin
REM  null"). A flag --allow-file-access-from-files libera isso para arquivos
REM  locais. Usamos um PERFIL SEPARADO, entao essa permissao nao vale para a
REM  navegacao normal de ninguem.
setlocal
set "RAIZ=%~dp0"
set "ARQUIVO=file:///%RAIZ:\=/%index.html"
set "PERFIL=%LOCALAPPDATA%\cpqd-totem-perfil"

echo.
echo   CPQD - Solucoes para o setor Financeiro
echo.

set "NAV="
if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" set "NAV=%ProgramFiles%\Google\Chrome\Application\chrome.exe"
if not defined NAV if exist "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" set "NAV=%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"
if not defined NAV if exist "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" set "NAV=%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe"
if not defined NAV if exist "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" set "NAV=%ProgramFiles%\Microsoft\Edge\Application\msedge.exe"

if not defined NAV (
  echo   Nao achei Chrome nem Edge nos caminhos padrao.
  echo   Abra o navegador na mao com estas opcoes:
  echo.
  echo     --user-data-dir="%PERFIL%" --allow-file-access-from-files --kiosk --app="%ARQUIVO%"
  echo.
  pause
  exit /b 1
)

echo   Navegador: %NAV%
echo   Abrindo direto do arquivo, sem servidor.
echo.
echo   Para SAIR: Alt+F4
echo.

start "" "%NAV%" --user-data-dir="%PERFIL%" --allow-file-access-from-files --kiosk --app="%ARQUIVO%" --start-fullscreen --disable-session-crashed-bubble --disable-infobars --noerrdialogs --no-first-run
exit /b 0
