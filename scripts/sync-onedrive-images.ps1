# ==============================================================================
# GAV-Hakuna - Script Simplificado de Sincronização
# ==============================================================================
# 
# Copia imagens de uma pasta do OneDrive local para ./images
# Gera playlist.json com a estrutura de pastas e imagens
#
# ==============================================================================

param(
    [string]$ConfigFile = ".env"
)

# ==============================================================================
# CONFIGURAÇÃO
# ==============================================================================

# Caminho da pasta do OneDrive (pode ser definido no .env ou usar o padrão)
$defaultOneDrivePath = "C:\Users\dti-\OneDrive - dti digital crafters\GAV_Enterprise"

# Diretórios de destino
$imageDirectory = Join-Path $PSScriptRoot "..\frontend\images"
$playlistFile = Join-Path $PSScriptRoot "..\frontend\playlist.json"
$configFile = Join-Path $PSScriptRoot "..\frontend\config.json"
$logFile = Join-Path $PSScriptRoot "..\logs\sync.log"

# Configurações padrão (podem ser sobrescritas pelo .env)
$intervalFullscreen = 10000
$intervalMosaic = 15000

# ==============================================================================
# FUNÇÕES
# ==============================================================================

function Write-Log {
    param(
        [string]$Message,
        [string]$Level = "INFO"
    )
    
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logMessage = "[$timestamp] [$Level] $Message"
    
    # Log para arquivo
    $logDir = Split-Path $logFile -Parent
    if (-not (Test-Path $logDir)) {
        New-Item -ItemType Directory -Path $logDir -Force | Out-Null
    }
    Add-Content -Path $logFile -Value $logMessage -ErrorAction SilentlyContinue
    
    # Output colorido no console
    switch ($Level) {
        "ERROR"   { Write-Host $Message -ForegroundColor Red }
        "WARN"    { Write-Host $Message -ForegroundColor Yellow }
        "SUCCESS" { Write-Host $Message -ForegroundColor Green }
        "INFO"    { Write-Host $Message -ForegroundColor Cyan }
        default   { Write-Host $Message }
    }
}

function Generate-Playlist {
    param(
        [string]$RootPath
    )
    
    Write-Log "Gerando playlist.json..." "INFO"
    
    # Timestamp para cache-busting (força navegador a recarregar imagens)
    $script:cacheTimestamp = [int][double]::Parse((Get-Date -UFormat %s))
    
    $script:playlistItems = @()
    
    # Processar recursivamente todas as pastas
    function Process-Directory {
        param(
            [string]$Path,
            [string]$RelativePath = ""
        )
        
        # Listar imagens na pasta atual
        $imageExtensions = @("*.jpg", "*.jpeg", "*.png", "*.gif", "*.bmp", "*.webp")
        $images = @()
        
        foreach ($ext in $imageExtensions) {
            $foundImages = Get-ChildItem -Path $Path -Filter $ext -File -ErrorAction SilentlyContinue
            $images += $foundImages
        }
        
        # Ordenar alfabeticamente
        $images = $images | Sort-Object Name
        
        # Se tem imagens, criar items
        if ($images.Count -gt 0) {
            $folderName = Split-Path $Path -Leaf
            $isMosaic = $folderName -like "*mosaico*" -or $folderName -like "*MOSAICO*"
            
            if ($isMosaic) {
                # Dividir em grupos de 4 (mosaico 2x2)
                for ($i = 0; $i -lt $images.Count; $i += 4) {
                    $endIdx = [Math]::Min($i + 3, $images.Count - 1)
                    $group = $images[$i..$endIdx]
                    
                    $imageObjects = @()
                    foreach ($img in $group) {
                        $relPath = if ($RelativePath) { "$RelativePath/$($img.Name)" } else { $img.Name }
                        $imageObjects += @{
                            url = "./images/$($relPath -replace '\\', '/')?v=$script:cacheTimestamp"
                            name = $img.Name
                            fileId = $relPath -replace '\\', '/'
                        }
                    }
                    
                    $script:playlistItems += @{
                        id = "mosaic-$RelativePath-$($script:playlistItems.Count)"
                        type = "mosaic"
                        duration = $script:intervalMosaic
                        images = $imageObjects
                        metadata = @{
                            source = if ($RelativePath) { $RelativePath } else { "root" }
                            path = $RelativePath
                        }
                    }
                }
                
                Write-Log "  $($images.Count) imagens mosaico em: $RelativePath" "INFO"
            }
            else {
                # Fullscreen - uma imagem por item
                foreach ($img in $images) {
                    $relPath = if ($RelativePath) { "$RelativePath/$($img.Name)" } else { $img.Name }
                    
                    $script:playlistItems += @{
                        id = "fullscreen-$RelativePath-$($img.Name)"
                        type = "fullscreen"
                        duration = $script:intervalFullscreen
                        images = @(
                            @{
                                url = "./images/$($relPath -replace '\\', '/')?v=$script:cacheTimestamp"
                                name = $img.Name
                                fileId = $relPath -replace '\\', '/'
                            }
                        )
                        metadata = @{
                            source = if ($RelativePath) { $RelativePath } else { "root" }
                            path = $RelativePath
                        }
                    }
                }
                
                Write-Log "  $($images.Count) imagens fullscreen em: $RelativePath" "INFO"
            }
        }
        
        # Processar subpastas recursivamente (ordem alfabética)
        $subfolders = Get-ChildItem -Path $Path -Directory -ErrorAction SilentlyContinue | Sort-Object Name
        
        foreach ($subfolder in $subfolders) {
            $newRelPath = if ($RelativePath) { "$RelativePath/$($subfolder.Name)" } else { $subfolder.Name }
            Process-Directory -Path $subfolder.FullName -RelativePath $newRelPath
        }
    }
    
    # Processar a partir da raiz
    Process-Directory -Path $RootPath
    
    # Calcular duração total
    $totalDuration = 0
    foreach ($item in $script:playlistItems) {
        $totalDuration += $item.duration
    }
    
    # Criar objeto de playlist
    $playlist = @{
        items = $script:playlistItems
        totalItems = $script:playlistItems.Count
        estimatedDuration = $totalDuration
        generatedAt = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
    }
    
    # Converter para JSON e salvar
    $json = $playlist | ConvertTo-Json -Depth 10 -Compress
    $json | Out-File -FilePath $playlistFile -Encoding UTF8 -NoNewline
    
    Write-Log "OK: playlist.json gerado ($($script:playlistItems.Count) items)" "SUCCESS"
}

function Generate-Config {
    Write-Log "Gerando config.json..." "INFO"
    
    $config = @{
        carousel = @{
            intervalFullscreen = $script:intervalFullscreen
            intervalMosaic = $script:intervalMosaic
            transition = "fade"
        }
        sync = @{
            syncInterval = 30000
        }
    }
    
    $json = $config | ConvertTo-Json -Depth 10 -Compress
    $json | Out-File -FilePath $configFile -Encoding UTF8 -NoNewline
    
    Write-Log "OK: config.json gerado" "SUCCESS"
}

# ==============================================================================
# SCRIPT PRINCIPAL
# ==============================================================================

Write-Host ""
Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host "   GAV-Hakuna - Sincronizacao OneDrive" -ForegroundColor Cyan
Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host ""

$startTime = Get-Date

# Tentar carregar configurações do .env
$sourcePath = $defaultOneDrivePath
if (Test-Path $ConfigFile) {
    Get-Content $ConfigFile | ForEach-Object {
        if ($_ -match '^\s*ONEDRIVE_PATH\s*=\s*(.+)$') {
            $sourcePath = $matches[1].Trim()
        }
        elseif ($_ -match '^\s*CAROUSEL_INTERVAL_FULLSCREEN\s*=\s*(\d+)$') {
            $intervalFullscreen = [int]$matches[1]
        }
        elseif ($_ -match '^\s*CAROUSEL_INTERVAL_MOSAIC\s*=\s*(\d+)$') {
            $intervalMosaic = [int]$matches[1]
        }
    }
}

Write-Log "Fonte: $sourcePath" "INFO"
Write-Log "Destino: $imageDirectory" "INFO"
Write-Host ""

# Verificar se a pasta de origem existe
if (-not (Test-Path $sourcePath)) {
    Write-Log "ERRO: Pasta nao encontrada: $sourcePath" "ERROR"
    Write-Log "" "ERROR"
    Write-Log "Verifique se:" "WARN"
    Write-Log "  1. O OneDrive esta sincronizado" "WARN"
    Write-Log "  2. A pasta GAV_Enterprise existe" "WARN"
    Write-Log "  3. O caminho esta correto no script" "WARN"
    exit 1
}

Write-Log "OK: Pasta de origem encontrada" "SUCCESS"

# Limpar diretório de destino
Write-Log "Limpando diretorio de destino..." "INFO"
if (Test-Path $imageDirectory) {
    Get-ChildItem -Path $imageDirectory -Recurse -ErrorAction SilentlyContinue | Remove-Item -Force -Recurse -ErrorAction SilentlyContinue
} else {
    New-Item -ItemType Directory -Path $imageDirectory -Force | Out-Null
}
Write-Log "OK: Diretorio limpo" "SUCCESS"
Write-Host ""

# Copiar imagens recursivamente
Write-Log "Copiando imagens..." "INFO"
Write-Host ""

$imageExtensions = @("*.jpg", "*.jpeg", "*.png", "*.gif", "*.bmp", "*.webp")
$totalCopied = 0

try {
    # Copiar cada tipo de imagem
    foreach ($ext in $imageExtensions) {
        $images = Get-ChildItem -Path $sourcePath -Filter $ext -File -Recurse -ErrorAction SilentlyContinue
        
        foreach ($image in $images) {
            # Calcular caminho relativo
            $relativePath = $image.FullName.Substring($sourcePath.Length + 1)
            $destFile = Join-Path $imageDirectory $relativePath
            $destDir = Split-Path $destFile -Parent
            
            # Criar diretório se não existir
            if (-not (Test-Path $destDir)) {
                New-Item -ItemType Directory -Path $destDir -Force | Out-Null
            }
            
            # Copiar arquivo
            Copy-Item -Path $image.FullName -Destination $destFile -Force
            
            $sizeKB = [math]::Round($image.Length / 1024, 1)
            Write-Log "  OK: $relativePath ($sizeKB KB)"
            $totalCopied++
        }
    }
    
    # Criar arquivo de timestamp
    $timestampFile = Join-Path $imageDirectory "last-sync.txt"
    $endTime = Get-Date
    $endTime.ToString("yyyy-MM-dd HH:mm:ss") | Out-File -FilePath $timestampFile -Encoding UTF8
    
    # Gerar arquivos JSON
    Write-Host ""
    Write-Log "Gerando arquivos de configuracao..." "INFO"
    Generate-Config
    Generate-Playlist -RootPath $imageDirectory
    
    $endTime = Get-Date
    $duration = ($endTime - $startTime).TotalSeconds
    
    # Resultado
    Write-Host ""
    Write-Host "=========================================================" -ForegroundColor Green
    Write-Host "   Sincronizacao Concluida!" -ForegroundColor Green
    Write-Host "=========================================================" -ForegroundColor Green
    Write-Host ""
    Write-Log "Total de imagens copiadas: $totalCopied" "SUCCESS"
    Write-Log "Arquivos gerados: playlist.json, config.json" "SUCCESS"
    Write-Log "Tempo decorrido: $([math]::Round($duration, 2))s" "SUCCESS"
    Write-Host ""
    
    if ($totalCopied -eq 0) {
        Write-Log "ATENCAO: Nenhuma imagem foi encontrada!" "WARN"
        Write-Log "Verifique se ha imagens de formato jpg, png, etc. na pasta de origem" "WARN"
    }
    
    exit 0
}
catch {
    Write-Log "ERRO durante a sincronizacao: $_" "ERROR"
    exit 1
}
