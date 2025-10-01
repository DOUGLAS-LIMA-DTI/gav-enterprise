@echo off
:: ==============================================================================
:: GAV-Enterprise - Script de Inicialização (Windows)
:: ==============================================================================
:: 
:: 1. Executa sincronização de imagens do OneDrive
:: 2. Inicia um servidor HTTP simples para servir a aplicação
::
:: ==============================================================================

echo.
echo =========================================================
echo    GAV-Enterprise - Iniciando Aplicacao
echo =========================================================
echo.

:: ==============================================================================
:: ETAPA 1: Sincronização
:: ==============================================================================

echo ETAPA 1: Sincronizacao de Imagens
echo -------------------------------------------------------
echo.

if exist "%~dp0scripts\sync-onedrive-images.ps1" (
    powershell -ExecutionPolicy Bypass -File "%~dp0scripts\sync-onedrive-images.ps1"
    if %errorlevel% equ 0 (
        echo.
        echo Sincronizacao concluida com sucesso!
        echo.
    ) else (
        echo.
        echo Sincronizacao falhou, mas continuando...
        echo.
    )
) else (
    echo Script de sincronizacao nao encontrado
    echo Continuando com as imagens existentes...
    echo.
)

:: ==============================================================================
:: ETAPA 2: Iniciar Servidor
:: ==============================================================================

echo ETAPA 2: Iniciando Servidor HTTP
echo -------------------------------------------------------
echo.

:: Verificar se Python está instalado
python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo Python encontrado! Iniciando servidor...
    echo.
    echo URL: http://localhost:3000
    echo Diretorio: %~dp0frontend
    echo.
    echo Pressione Ctrl+C para parar o servidor
    echo.
    cd /d "%~dp0frontend"
    python -m http.server 3000
) else (
    echo Python nao encontrado!
    echo.
    echo Para usar este script, instale o Python:
    echo   https://www.python.org/downloads/
    echo.
    echo Ou use outro servidor HTTP:
    echo   - Live Server (VS Code)
    echo   - http-server (npm install -g http-server)
    echo   - IIS (Windows Server)
    echo.
    pause
)

