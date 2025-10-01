# ==============================================================================
# GAV-Hakuna - Script de Inicializacao
# ==============================================================================
# 
# 1. Executa sincronizacao de imagens do OneDrive
# 2. Inicia um servidor HTTP simples para servir a aplicacao
#
# ==============================================================================

param(
    [int]$Port = 3000,
    [switch]$SkipSync
)

Write-Host ""
Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host "   GAV-Hakuna - Iniciando Aplicacao" -ForegroundColor Cyan
Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host ""

# ==============================================================================
# ETAPA 1: Sincronizacao
# ==============================================================================

if (-not $SkipSync) {
    Write-Host "ETAPA 1: Sincronizacao de Imagens" -ForegroundColor Yellow
    Write-Host "-------------------------------------------------------" -ForegroundColor Yellow
    Write-Host ""
    
    $syncScript = Join-Path $PSScriptRoot "scripts\sync-onedrive-images.ps1"
    
    if (Test-Path $syncScript) {
        try {
            & $syncScript
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host ""
                Write-Host "Sincronizacao concluida com sucesso!" -ForegroundColor Green
                Write-Host ""
            } else {
                Write-Host ""
                Write-Host "Sincronizacao falhou, mas continuando..." -ForegroundColor Yellow
                Write-Host ""
            }
        }
        catch {
            Write-Host ""
            Write-Host "Erro na sincronizacao: $_" -ForegroundColor Yellow
            Write-Host "Continuando com as imagens existentes..." -ForegroundColor Yellow
            Write-Host ""
        }
    } else {
        Write-Host "Script de sincronizacao nao encontrado" -ForegroundColor Yellow
        Write-Host "Continuando com as imagens existentes..." -ForegroundColor Yellow
        Write-Host ""
    }
} else {
    Write-Host "Sincronizacao ignorada (parametro -SkipSync)" -ForegroundColor Yellow
    Write-Host ""
}

# ==============================================================================
# ETAPA 2: Iniciar Servidor
# ==============================================================================

Write-Host "ETAPA 2: Iniciando Servidor HTTP" -ForegroundColor Yellow
Write-Host "-------------------------------------------------------" -ForegroundColor Yellow
Write-Host ""

# Verificar se Python esta instalado
$pythonCmd = $null
if (Get-Command python -ErrorAction SilentlyContinue) {
    $pythonCmd = "python"
}
elseif (Get-Command python3 -ErrorAction SilentlyContinue) {
    $pythonCmd = "python3"
}

if ($pythonCmd) {
    Write-Host "Python encontrado! Iniciando servidor..." -ForegroundColor Green
    Write-Host ""
    Write-Host "URL: http://localhost:$Port" -ForegroundColor Cyan
    Write-Host "Diretorio: $PSScriptRoot\frontend" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Pressione Ctrl+C para parar o servidor" -ForegroundColor Yellow
    Write-Host ""
    
    # Iniciar servidor Python
    Set-Location "$PSScriptRoot\frontend"
    & $pythonCmd -m http.server $Port
}
else {
    Write-Host "Python nao encontrado!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Para usar este script, instale o Python:" -ForegroundColor Yellow
    Write-Host "https://www.python.org/downloads/" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Ou use outro servidor HTTP:" -ForegroundColor Yellow
    Write-Host "- Live Server (VS Code)" -ForegroundColor Cyan
    Write-Host "- http-server (npm install -g http-server)" -ForegroundColor Cyan
    Write-Host "- IIS (Windows Server)" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Pressione qualquer tecla para sair..." -ForegroundColor Yellow
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}