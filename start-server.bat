@echo off
:: ==============================================================================
:: GAV-Enterprise - Script de Inicialização usando http-server (npm)
:: ==============================================================================

echo.
echo =========================================================
echo    GAV-Enterprise - Iniciando Aplicacao (http-server)
echo =========================================================
echo.

:: Verificar permissões de administrador
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo ERRO: Este script precisa ser executado como Administrador!
    echo.
    echo Clique com o botao direito e selecione "Executar como administrador"
    echo.
    pause
    exit /b 1
)

:: ==============================================================================
:: ETAPA 1: Sincronização
:: ==============================================================================

echo ETAPA 1: Sincronizacao de Imagens
echo -------------------------------------------------------
echo.

echo Criando tarefa agendada para sincronizacao a cada 10 minutos...
echo.

:: Caminho completo do script PowerShell
set SCRIPT_PATH=%~dp0scripts\sync-onedrive-images.ps1

echo Script: %SCRIPT_PATH%
echo.

:: Criar tarefa agendada
schtasks /Create /TN "GAV-Enterprise-Sync" /TR "powershell.exe -ExecutionPolicy Bypass -WindowStyle Hidden -File \"%SCRIPT_PATH%\"" /SC MINUTE /MO 10 /F

if %errorlevel% equ 0 (
    echo.
    echo =========================================================
    echo    Tarefa Agendada Criada com Sucesso!
    echo =========================================================
    echo.
    echo Nome da Tarefa: GAV-Enterprise-Sync
    echo Frequencia: A cada 10 minutos
    echo Script: %SCRIPT_PATH%
    echo.
    echo A sincronizacao agora rodara automaticamente em segundo plano!
    echo.
    
    :: Executar uma vez imediatamente
    echo Executando primeira sincronizacao...
    schtasks /Run /TN "GAV-Enterprise-Sync"
    
    echo.
    echo Para remover a tarefa agendada, execute:
    echo   schtasks /Delete /TN "GAV-Enterprise-Sync" /F
    echo.
) else (
    echo.
    echo ERRO ao criar tarefa agendada!
    echo.
)


if %errorlevel% equ 0 (
	echo.
	echo Sincronizacao concluida com sucesso!
	echo.
) else (
	echo.
	echo Sincronizacao falhou...
	echo Continuando com as imagens existentes...
	echo.
)

:: ==============================================================================
:: ETAPA 2: Verificar Node.js
:: ==============================================================================

echo ETAPA 2: Verificando Node.js
echo -------------------------------------------------------
echo.

node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Node.js nao encontrado!
    echo.
    echo Para usar este script, instale o Node.js:
    echo   https://nodejs.org/
    echo.
    pause
    exit /b 1
) else (
    echo Node.js instalado!
    node --version
    echo.
)

:: ==============================================================================
:: ETAPA 3: Iniciar Servidor
:: ==============================================================================

echo ETAPA 3: Iniciando Servidor HTTP
echo -------------------------------------------------------
echo.
echo URL: http://localhost:8080
echo Diretorio: %~dp0frontend
echo.
echo Abrindo navegador automaticamente...
echo.
echo Pressione Ctrl+C para parar o servidor
echo.

:: Abrir navegador após 3 segundos
start "" cmd /c "timeout /t 3 /nobreak >nul && start http://localhost:8080"

:: Iniciar servidor
cd /d "%~dp0frontend"
npx --yes http-server . -p 8080 -c-1 --cors
