# 🏗️ Arquitetura do Sistema GAV-Enterprise

**Versão**: 3.0.0

## 📋 Visão Geral

GAV-Enterprise é um sistema **ultra simplificado** de carrossel de imagens para TVs corporativas.

```
┌─────────────────────────────────────────────────────┐
│                    FRONTEND                         │
│        (JavaScript Vanilla Puro)                    │
│  • HTML5 + CSS3 + JavaScript ES6+                   │
│  • Roda no navegador da TV                          │
│  • ZERO dependências NPM                            │
│  • Lê playlist.json local                           │
└─────────────────────────────────────────────────────┘
                        ↕ HTTP
┌─────────────────────────────────────────────────────┐
│            SERVIDOR HTTP ESTÁTICO                   │
│        (Python/IIS/Live Server/http-server)         │
│  • Serve apenas arquivos estáticos                  │
│  • SEM backend, SEM API, SEM lógica                 │
│  • Qualquer servidor HTTP funciona                  │
└─────────────────────────────────────────────────────┘
                        ↕ Filesystem
┌─────────────────────────────────────────────────────┐
│                 FILESYSTEM LOCAL                    │
│              ./images/ + playlist.json              │
│  • Imagens copiadas do OneDrive                     │
│  • playlist.json gerado pelo script PowerShell      │
└─────────────────────────────────────────────────────┘
                        ↕ PowerShell
┌─────────────────────────────────────────────────────┐
│               ONEDRIVE (Microsoft 365)              │
│         • Fonte original das imagens                │
│         • Sincronizado pelo cliente Windows         │
│         • Script PowerShell copia para ./images/    │
└─────────────────────────────────────────────────────┘
```

---

## 🎯 Arquitetura Detalhada

### 1️⃣ Frontend (Navegador da TV)

**Localização**: `./frontend/`

```
frontend/
├── index.html              # Página principal
├── playlist.json           # 🆕 Gerado pelo PowerShell (estrutura do carrossel)
├── config.json             # 🆕 Gerado pelo PowerShell (configurações)
├── css/
│   ├── styles.css         # Estilos base
│   ├── carousel.css       # Estilos do carrossel fullscreen
│   ├── mosaic.css         # Estilos do mosaico 2x2
│   ├── header.css         # Cabeçalho
│   ├── theme.css          # Variáveis CSS
│   └── borders.css        # Bordas das imagens
└── js/
    ├── main.js            # Inicialização
    ├── playlist-loader.js # 🆕 Carrega playlist.json e config.json
    ├── carousel.js        # Lógica do carrossel
    ├── mosaic.js          # Renderização do mosaico
    ├── transitions.js     # Transições entre slides
    └── header.js          # Cabeçalho com logo/data
```

**Tecnologias**: HTML5 + CSS3 + JavaScript ES6+ (nativo do navegador)

**Dependências**: ZERO! JavaScript Vanilla puro.

### 2️⃣ Servidor HTTP (Qualquer um)

**Não há código custom de backend!**

Você pode usar qualquer servidor HTTP estático:

**Opção 1: Python** (mais simples)
```bash
cd frontend
python -m http.server 3000
```

**Opção 2: Script fornecido**
```cmd
.\start-server.bat   # Windows (inicia automaticamente)
```

**Opção 3: Live Server** (VS Code)
- Instalar extensão "Live Server"
- Abrir `frontend/index.html`
- Clicar em "Go Live"

**Opção 4: http-server** (npm global)
```bash
npx http-server frontend -p 3000
```

**Opção 5: IIS** (Windows Server)
- Criar site apontando para `./frontend/`
- Configurar porta

### 3️⃣ Script de Sincronização (PowerShell)

**Localização**: `./scripts/sync-onedrive-images.ps1`

**O que faz:**
1. ✅ Lê pasta do OneDrive local (já sincronizada pelo cliente Windows)
2. ✅ Copia recursivamente todas as imagens para `./images/`
3. ✅ **Gera `frontend/playlist.json`** com estrutura completa:
   - Lista todas as imagens
   - Define tipo (fullscreen ou mosaico)
   - Define duração de cada item
   - Ordem alfabética recursiva
4. ✅ **Gera `frontend/config.json`** com configurações:
   - Intervalos de exibição
   - Configurações do carrossel
5. ✅ Cria `./images/last-sync.txt` com timestamp
6. ✅ Logs em `./logs/sync.log`

**Execução:**
```powershell
.\scripts\sync-onedrive-images.ps1
```

**Configuração (opcional via `.env`):**
```env
ONEDRIVE_PATH=C:\Users\Usuario\OneDrive\GAV_Enterprise
CAROUSEL_INTERVAL_FULLSCREEN=10000
CAROUSEL_INTERVAL_MOSAIC=15000
```

### 4️⃣ Filesystem Local (Imagens + JSON)

**Localização**: `./images/` e `./frontend/`

```
images/
├── 01_Avisos Gerais Enterprise/
│   ├── 01_Capa.png
│   └── 02_Aviso_1.png
└── 02_Informações Por Conta/
    ├── dsm-Firmenich/
    │   ├── 01_Avisos da Conta/
    │   └── 02_MOSAICO GAV dos Squads/
    └── VLI Logistica/
        ├── 01_Avisos da Conta/
        └── 02_MOSAICO GAV dos Squads/

frontend/
├── playlist.json          # Gerado automaticamente
└── config.json            # Gerado automaticamente
```

---

## 🔄 Fluxo de Funcionamento

### 1. Sincronização (PowerShell)

```powershell
.\scripts\sync-onedrive-images.ps1
```

**O que acontece:**
1. Script lê pasta OneDrive local
2. Copia imagens para `./images/`
3. **Varre recursivamente** todas as pastas
4. **Gera `playlist.json`** com estrutura completa
5. **Gera `config.json`** com configurações
6. Cria logs em `./logs/sync.log`

**Resultado**: 
- ✅ `./images/` contém todas as imagens
- ✅ `./frontend/playlist.json` contém estrutura do carrossel
- ✅ `./frontend/config.json` contém configurações

### 2. Inicialização do Servidor

```powershell
.\start-server.bat
```

**O que acontece:**
1. Script detecta se Python está instalado
2. Inicia servidor HTTP simples na porta 3000
3. Serve arquivos estáticos de `./frontend/`
4. Pronto! Sem lógica, sem API, apenas arquivos

### 3. Acesso na TV

```
Browser da TV → http://servidor:3000
```

**O que acontece:**
1. Navegador requisita `GET /index.html`
2. Servidor responde com arquivo estático
3. Navegador carrega CSS e JS
4. **JavaScript faz `fetch('./playlist.json')`** (arquivo local!)
5. **JavaScript faz `fetch('./config.json')`** (arquivo local!)
6. Frontend monta carrossel baseado no JSON
7. Frontend exibe imagens diretamente de `./images/`

### 4. Refresh Automático

**Frontend recarrega JSON a cada 10 minutos:**

```javascript
// main.js
setInterval(async () => {
    const newPlaylist = await fetch('./playlist.json?t=' + Date.now());
    if (playlistChanged) {
        Carousel.restart(newPlaylist);
    }
}, 600000); // 10 minutos
```

**Para atualizar imagens:**
1. Adicione/remova imagens no OneDrive
2. Execute: `.\scripts\sync-onedrive-images.ps1`
3. Script gera novo `playlist.json`
4. Frontend detecta mudança e recarrega automaticamente

---

## 📁 Estrutura Completa do Projeto v3.0

```
gav-enterprise/
│
├── frontend/              # 🌐 APLICAÇÃO (HTML + CSS + JS)
│   ├── index.html        #    Página principal
│   ├── playlist.json     #    🆕 Gerado pelo PowerShell
│   ├── config.json       #    🆕 Gerado pelo PowerShell
│   ├── css/              #    Estilos
│   ├── js/               #    JavaScript Vanilla puro
│   └── assets/           #    Logo, imagens estáticas
│
├── images/                # 📂 IMAGENS SINCRONIZADAS
│   └── [estrutura de pastas do OneDrive]
│
├── scripts/               # 🔧 SCRIPT DE SINCRONIZAÇÃO
│   └── sync-onedrive-images.ps1  # PowerShell
│
├── logs/                  # 📝 LOGS
│   └── sync.log          #    Logs de sincronização
│
├── start-server.bat       # 🚀 Inicia servidor HTTP (Windows)
├── stop-server.bat        # 🛑 Para servidor HTTP (Windows)
├── .env                   # 🔐 Configuração (opcional, não incluído)
└── README.md              # 📚 Documentação
```

---

## 🚀 Como Funciona na Prática (v3.0)

### Cenário: Ligar a TV e exibir o carrossel

```
1. SINCRONIZAÇÃO (PowerShell) - Executar sempre que adicionar imagens
   └─> .\scripts\sync-onedrive-images.ps1
   └─> Copia imagens do OneDrive → ./images/
   └─> Gera frontend/playlist.json
   └─> Gera frontend/config.json

2. SERVIDOR (Python/IIS/Live Server) - Apenas serve arquivos
   └─> cd frontend
   └─> python -m http.server 3000
   └─> Serve arquivos estáticos (SEM lógica)

3. TV (Navegador Chrome)
   └─> Abrir http://servidor:3000
   └─> Baixa index.html
   └─> Baixa CSS/JS
   └─> JavaScript faz: fetch('./playlist.json')
   └─> JavaScript faz: fetch('./config.json')
   └─> Frontend monta e exibe carrossel

4. LOOP INFINITO
   └─> Carrossel exibe imagens de ./images/
   └─> A cada 10 minutos: recarrega playlist.json
   └─> Se playlist mudou: reinicia carrossel
```

---

## 🛠️ Comandos Principais

### Sincronizar Imagens (PowerShell)
```powershell
.\scripts\sync-onedrive-images.ps1
# Copia imagens + gera JSON
```

### Iniciar Servidor (Qualquer opção)
```powershell
# Opção 1: Script automático
.\start-server.bat

# Opção 2: Python manual
cd frontend
python -m http.server 3000

# Opção 3: Live Server (VS Code)
# Abrir frontend/index.html e "Go Live"
```

### Acessar na TV (Navegador)
```
http://localhost:3000
# Ou http://IP-DO-SERVIDOR:3000
```

### Configurar Sincronização Automática (Tarefa Agendada)
```powershell
# Executar como Administrador
$scriptPath = "C:\caminho\gav-enterprise\scripts\sync-onedrive-images.ps1"
$action = New-ScheduledTaskAction -Execute "PowerShell.exe" -Argument "-ExecutionPolicy Bypass -File `"$scriptPath`""
$trigger = New-ScheduledTaskTrigger -Once -At (Get-Date) -RepetitionInterval (New-TimeSpan -Minutes 10) -RepetitionDuration ([TimeSpan]::MaxValue)
Register-ScheduledTask -TaskName "GAV-Enterprise Sync" -Action $action -Trigger $trigger
```

---

## ❓ FAQ

### Preciso de Node.js?

Não. O sistema funciona com qualquer servidor HTTP estático (Python, IIS, Live Server, etc).

### Como funciona a sincronização?

Script PowerShell copia imagens do OneDrive local para `./images/` e gera `playlist.json`.

### Qual servidor HTTP usar?

Qualquer um! Python (http.server), IIS, Live Server (VS Code), http-server (npm), nginx, Apache.

### Como fazer deploy?

1. Copie as pastas `frontend/` e `images/` para o servidor
2. Configure um servidor HTTP para servir `frontend/`
3. Configure tarefa agendada para sincronização automática

---

## 📚 Tecnologias e Suas Funções

| Tecnologia | Camada | Função |
|-----------|--------|--------|
| **HTML5/CSS3/JS** | Frontend | Interface visual no navegador |
| **Python/IIS/etc** | Servidor | Apenas serve arquivos estáticos |
| **PowerShell** | Scripts | Cópia de arquivos + geração de JSON |
| **OneDrive** | Storage | Cliente Windows sincroniza automaticamente |
| **JSON** | Dados | playlist.json e config.json |

---

## ✅ Resumo

GAV-Enterprise é um sistema simples e confiável:

- ✅ **JavaScript Vanilla** puro (sem dependências)
- ✅ **PowerShell** gera playlist automaticamente
- ✅ **Qualquer servidor HTTP** funciona
- ✅ **Sincronização automática** via tarefa agendada

### Arquitetura:

```
TV (Browser)     →  JavaScript Vanilla (lê JSON local)
     ↕ HTTP
Servidor HTTP    →  Python/IIS/qualquer (serve estáticos)
     ↕ Filesystem
Imagens + JSON   →  ./images/ + playlist.json (gerado por PowerShell)
     ↕ PowerShell
OneDrive         →  Microsoft 365 (fonte original)
```

---

**Versão**: 3.0.0
