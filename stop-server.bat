@echo off
:: ==============================================================================
:: GAV-Hakuna - Script para Parar o Servidor
:: ==============================================================================

echo.
echo =========================================================
echo    GAV-Hakuna - Parando Servidor
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

:: Parar todos os processos Node.js (http-server)
echo Parando servidor HTTP...
powershell -Command "Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force"

if %errorlevel% equ 0 (
    echo.
    echo ✓ Servidor parado com sucesso!
    echo.
) else (
    echo.
    echo ✓ Nenhum servidor em execucao.
    echo.
)

:: Verificar se a porta está livre
echo Verificando porta 8080...
powershell -Command "$result = Test-NetConnection -ComputerName localhost -Port 8080 -InformationLevel Quiet -WarningAction SilentlyContinue; if (-not $result) { Write-Host '✓ Porta 8080 livre' } else { Write-Host '✗ Porta 8080 ainda em uso' }"

echo.
echo =========================================================
echo    Aplicacao Parada!
echo =========================================================
echo.



echo.
echo Removendo tarefa agendada...
echo.

schtasks /Delete /TN "GAV-Enterprise-Sync" /F

if %errorlevel% equ 0 (
    echo.
    echo =========================================================
    echo    Tarefa Agendada Removida com Sucesso!
    echo =========================================================
    echo.
    echo A sincronizacao automatica foi desabilitada.
    echo.
    echo Voce ainda pode executar a sincronizacao manualmente com:
    echo   .\scripts\sync-onedrive-images.ps1
    echo.
) else (
    echo.
    echo Tarefa "GAV-Enterprise-Sync" nao encontrada.
    echo A sincronizacao automatica ja estava desabilitada.
    echo.
)


pause

