# 🚀 Início Rápido - GAV-Enterprise v3.0

## ⚡ Começar em 3 Passos

### 1️⃣ Sincronizar Imagens

```powershell
.\scripts\sync-onedrive-images.ps1
```

✅ Copia imagens do OneDrive  
✅ Gera `playlist.json`  
✅ Gera `config.json`

### 2️⃣ Iniciar Servidor

```cmd
.\start-server.bat
```

✅ Inicia servidor HTTP  
✅ Porta padrão: 8080 (ou 3000 com Python)

### 3️⃣ Acessar

```
http://localhost:8080
```
ou
```
http://localhost:3000
```
(dependendo do servidor usado)

✅ Pressione **F11** para fullscreen

---

## 📋 Requisitos

- **OneDrive** sincronizado localmente (cliente Windows)
- **PowerShell** (já vem no Windows)
- **Servidor HTTP**: Python 3+, IIS, Live Server ou http-server

---

## ⚙️ Configuração (Opcional)

Crie arquivo `.env` na raiz para personalizar:

```env
# Caminho do OneDrive
ONEDRIVE_PATH=C:\Users\SeuUsuario\OneDrive\GAV_Enterprise

# Intervalos de exibição (milissegundos)
CAROUSEL_INTERVAL_FULLSCREEN=10000  # 10 segundos
CAROUSEL_INTERVAL_MOSAIC=15000      # 15 segundos
```

---

## 🔄 Sincronização Automática (Opcional)

Para sincronizar automaticamente a cada 10 minutos, crie uma Tarefa Agendada no Windows:

```powershell
# PowerShell como Administrador - substitua o caminho!
$scriptPath = "C:\CAMINHO\COMPLETO\gav-enterprise\scripts\sync-onedrive-images.ps1"
$action = New-ScheduledTaskAction -Execute "PowerShell.exe" -Argument "-ExecutionPolicy Bypass -File `"$scriptPath`""
$trigger = New-ScheduledTaskTrigger -Once -At (Get-Date) -RepetitionInterval (New-TimeSpan -Minutes 10) -RepetitionDuration ([TimeSpan]::MaxValue)
Register-ScheduledTask -TaskName "GAV-Enterprise-Sync" -Action $action -Trigger $trigger
```

---

## 📺 Configurar TV (Modo Kiosk)

### Chrome

```bash
chrome --kiosk --app=http://localhost:8080
```

### Edge

```bash
msedge --kiosk http://localhost:8080 --edge-kiosk-type=fullscreen
```

### Firefox

```bash
firefox --kiosk http://localhost:8080
```

**Nota**: Ajuste a porta conforme o servidor usado (8080 para http-server, 3000 para Python)

---

## 📁 Estrutura de Pastas no OneDrive

```
GAV_Enterprise/
├── 01_Avisos Gerais Enterprise/
│   ├── 01_Capa.png              → Fullscreen (10s)
│   └── 02_Aviso.png             → Fullscreen (10s)
│
└── 02_Informações Por Conta/
    ├── Conta A/
    │   ├── 01_Avisos da Conta/
    │   │   └── aviso.png        → Fullscreen (10s)
    │   └── 02_MOSAICO GAV dos Squads/
    │       ├── squad1.png       → Mosaico 2x2 (15s)
    │       ├── squad2.png
    │       ├── squad3.png
    │       └── squad4.png
    └── Conta B/
        └── ...
```

**Regra:**
- Pasta com **"mosaico"** no nome → Grade 2x2 (até 4 imagens, 15s)
- Outras pastas → Fullscreen (1 imagem, 10s)

---

## 🔧 Troubleshooting

### Erro: "Pasta não encontrada"

```powershell
# Verifique o caminho no .env ou no script
Get-Content .env | Select-String "ONEDRIVE_PATH"
```

### Playlist não aparece

```powershell
# Execute manualmente e veja os logs
.\scripts\sync-onedrive-images.ps1

# Verifique se foi criado
Test-Path frontend\playlist.json
```

### Servidor não inicia

```powershell
# Verifique se Python está instalado
python --version

# Se não tiver Python, use Live Server (VS Code)
# Ou outro servidor HTTP
```

---

## 📚 Documentação

- **[README.md](README.md)** - Visão geral completa
- **[GUIA_USO.md](GUIA_USO.md)** - Guia de uso detalhado
- **[ARQUITETURA_SISTEMA.md](ARQUITETURA_SISTEMA.md)** - Como funciona
- **[PRINCIPLES.md](PRINCIPLES.md)** - Regras de exibição

---

## ❓ Perguntas Frequentes

**Como adicionar/remover imagens?**
1. Adicione/remova no OneDrive
2. Execute: `.\scripts\sync-onedrive-images.ps1`

**Como mudar intervalos de exibição?**
Edite `.env` e execute o script de sincronização.

---

## ✅ Checklist

Após configurar, verifique:

- [ ] Script de sincronização rodou sem erros
- [ ] `frontend/playlist.json` existe
- [ ] `frontend/config.json` existe
- [ ] `images/` contém imagens
- [ ] Servidor HTTP está rodando
- [ ] `http://localhost:3000` abre o carrossel
- [ ] Imagens aparecem corretamente
- [ ] Transições funcionam
- [ ] Mosaico 2x2 funciona
- [ ] Fullscreen funciona

---

## 🎯 Pronto!

Sua aplicação está rodando! 🎉

**URL**: `http://localhost:8080` (ou `http://localhost:3000` se usar Python)  
**Fullscreen**: Pressione **F11**  
**Atualizar imagens**: Execute `.\scripts\sync-onedrive-images.ps1`  
**Parar servidor**: Execute `.\stop-server.bat` (como Administrador)

---

**Versão**: 3.0.0  
**Status**: ✅ Produção

