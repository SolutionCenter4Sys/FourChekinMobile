@echo off
chcp 65001 >nul 2>&1
setlocal EnableDelayedExpansion
title CheckIn Audiencias - Mobile React Responsivo

echo =================================================================
echo  CheckIn Audiencias - Mobile React Responsivo - Foursys
echo  App:         http://localhost:5174
echo  Mock Server: http://localhost:3000
echo =================================================================
echo.

:: ── [1/3] Verificar Node.js ───────────────────────────────────────────────
echo [1/3] Verificando Node.js...
where node >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo.
    echo =================================================================
    echo  ERRO: Node.js nao encontrado no PATH.
    echo  Instale em: https://nodejs.org
    echo =================================================================
    echo.
    goto :FIM_ERRO
)
for /f "delims=" %%v in ('node --version 2^>^&1') do set NODE_VER=%%v
echo [OK] Node.js !NODE_VER!

:: ── [2/3] Mock Server ─────────────────────────────────────────────────────
echo.
echo [2/3] Verificando Mock Server...
set MOCK_DIR=%~dp0..\..\wireframes
if exist "!MOCK_DIR!\mock-server.js" (
    start "CheckIn Mock Server" /MIN cmd /c "cd /d "!MOCK_DIR!" && node mock-server.js"
    timeout /t 2 /nobreak >nul
    echo [OK] Mock Server iniciado em http://localhost:3000
) else (
    echo [AVISO] mock-server.js nao encontrado. Caminho verificado:
    echo         !MOCK_DIR!
    echo         A app vai iniciar mas as chamadas de API podem falhar.
)

:: ── [3/3] npm install ─────────────────────────────────────────────────────
echo.
echo [3/3] Verificando dependencias npm...
set APP_DIR=%~dp0

:: Verificar se leaflet ja esta instalado (nova dependencia)
if exist "!APP_DIR!node_modules" (
    if not exist "!APP_DIR!node_modules\leaflet" (
        echo [INFO] Nova dependencia detectada ^(leaflet^). Reinstalando...
        rmdir /s /q "!APP_DIR!node_modules" >nul 2>&1
    )
)

if not exist "!APP_DIR!node_modules" (
    echo Pasta node_modules nao encontrada.
    echo Executando: npm install
    echo Isso pode demorar varios minutos na primeira vez...
    echo -----------------------------------------------------------------
    cd /d "!APP_DIR!"
    call npm install 2>&1
    set NPM_CODE=!ERRORLEVEL!
    echo -----------------------------------------------------------------
    if !NPM_CODE! neq 0 (
        echo.
        echo =================================================================
        echo  ERRO: npm install falhou ^(codigo: !NPM_CODE!^)
        echo.
        echo  Possiveis causas:
        echo    - Sem acesso a internet
        echo    - Conflito de versao do Node.js
        echo    - Falta de permissao na pasta
        echo.
        echo  Tente rodar manualmente no terminal:
        echo    cd "!APP_DIR!"
        echo    npm install
        echo =================================================================
        echo.
        goto :FIM_ERRO
    )
    echo [OK] Dependencias instaladas.
) else (
    echo [OK] node_modules ja existe.
)

:: ── Iniciar App ───────────────────────────────────────────────────────────
echo.
echo =================================================================
echo  Iniciando: http://localhost:5174
echo  Pressione Ctrl+C para encerrar o servidor de desenvolvimento.
echo =================================================================
echo.

cd /d "!APP_DIR!"
call npm run dev 2>&1
set DEV_CODE=!ERRORLEVEL!

if !DEV_CODE! neq 0 (
    echo.
    echo =================================================================
    echo  ERRO: npm run dev encerrou com codigo: !DEV_CODE!
    echo.
    echo  Possiveis causas:
    echo    - Porta 5174 ja esta em uso
    echo    - Erro de compilacao TypeScript ^(veja acima^)
    echo    - Dependencia ausente ^(delete node_modules e rode novamente^)
    echo =================================================================
    echo.
    goto :FIM_ERRO
)

:FIM_SUCESSO
echo.
echo [OK] Processo encerrado normalmente.
echo.
echo Pressione qualquer tecla para fechar esta janela...
pause >nul
exit /b 0

:FIM_ERRO
echo Pressione qualquer tecla para fechar esta janela...
pause >nul
exit /b 1
