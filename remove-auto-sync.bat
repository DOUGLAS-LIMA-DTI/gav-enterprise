@echo off
:: ==============================================================================
:: GAV-Hakuna - Remover Sincronização Automática
:: ==============================================================================

echo.
echo =========================================================
echo    GAV-Hakuna - Remover Sincronizacao Automatica
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

