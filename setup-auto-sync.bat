@echo off
:: ==============================================================================
:: GAV-Enterprise - Configurar Sincronização Automática (Tarefa Agendada)
:: ==============================================================================

echo.
echo =========================================================
echo    GAV-Enterprise - Configurar Sincronizacao Automatica
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



