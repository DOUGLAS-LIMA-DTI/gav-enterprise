# GAV-Hakuna 🖼️

**Gestão À Vista** - Sistema de exibição de imagens do OneDrive em carrossel para TVs corporativas.

## 📋 Sobre

GAV-Hakuna é uma plataforma **extremamente simples e leve** para exibir imagens de um diretório do OneDrive em formato de carrossel em TVs de andar. Ideal para gestão visual, comunicação corporativa e dashboards visuais.

## ✨ Características

- 🎯 **Ultra Simples**: Apenas HTML + CSS + JavaScript puro
- ⚡ **Extremamente Leve**: Sem backend, sem dependências NPM
- 🔄 **Automático**: Sincronização automática com OneDrive
- 📺 **Fullscreen**: Otimizado para exibição em TVs
- 🔐 **Seguro**: Sincronização via pasta local do OneDrive
- 🎨 **Visual**: Cabeçalho com logo e bordas elegantes nas imagens
- 🧠 **Inteligente**: Estrutura dinâmica de pastas

## 🏗️ Arquitetura Simplificada

```
┌─────────────────────────────────────┐
│         TV/Display Device           │
│  ┌───────────────────────────────┐  │
│  │   Frontend (Vanilla JS)       │  │
│  │   - Carrossel Fullscreen      │  │
│  │   - Mosaico 2x2               │  │
│  │   - Lê playlist.json local    │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
                  ↕ Filesystem Local
┌─────────────────────────────────────┐
│   ./images/ (pasta local)           │
│  - Imagens sincronizadas            │
│  - playlist.json (gerado auto)      │
└─────────────────────────────────────┘
                  ↕ PowerShell Script
┌─────────────────────────────────────┐
│   OneDrive (Cliente Windows)        │
│  - Sincronização automática         │
│  - Pasta local: GAV_Enterprise      │
└─────────────────────────────────────┘
```

**Arquitetura:**
1. **PowerShell** copia imagens do OneDrive local para `./images/` e gera `playlist.json`
2. **Servidor HTTP** serve os arquivos estáticos (Python, IIS, Live Server, etc.)
3. **JavaScript puro** lê `playlist.json` e exibe o carrossel
4. **Zero dependências** - sem Node.js, sem npm, sem build!

## 🚀 Quick Start

### Pré-requisitos

- **OneDrive sincronizado** localmente (cliente Windows)
- **PowerShell** (para sincronização de imagens)
- **Servidor HTTP** simples (qualquer um):
  - Python 3+ (mais simples)
  - IIS (Windows Server)
  - Live Server (VS Code)
  - http-server (npm)

### Instalação

```powershell
# 1. Clone o repositório
git clone https://github.com/seu-usuario/gav-hakuna.git
cd gav-hakuna

# 2. Configure as variáveis de ambiente (opcional)
# Crie um arquivo .env se quiser customizar o caminho do OneDrive
# ONEDRIVE_PATH=C:\Users\SeuUsuario\OneDrive\GAV_Enterprise

# 3. Execute a primeira sincronização
.\scripts\sync-onedrive-images.ps1

# 4. Inicie o servidor HTTP
.\start-server.bat
# ou (se tiver Python)
cd frontend
python -m http.server 3000
```

### Acesse

Abra o navegador em `http://localhost:8080` (ou `http://localhost:3000` se usar Python) e pressione **F11** para fullscreen.

## 🔧 Configuração do OneDrive

### 1. Sincronizar OneDrive

1. Certifique-se de que o **OneDrive** está instalado e sincronizado no Windows
2. Verifique o caminho da sua pasta OneDrive (geralmente `C:\Users\SeuUsuario\OneDrive`)

### 2. Criar Estrutura de Pastas

Crie a estrutura de pastas no seu OneDrive. O sistema é **totalmente dinâmico e recursivo**:

#### Regra Simples:
- **Pastas com "mosaico" no nome** → Exibição em grade 2x2 (até 4 imagens por vez)
- **Outras pastas** → Exibição fullscreen (1 imagem por vez)

#### Exemplo de Estrutura:

```
GAV_Enterprise/
├── 01_Avisos Gerais Enterprise/
│   ├── 01_Capa.png                    → Fullscreen
│   ├── 02_Aviso_1.png                 → Fullscreen
│   └── 03_Aviso_2.png                 → Fullscreen
│
└── 02_Informações Por Conta/
    ├── dsm-Firmenich/
    │   ├── 01_Avisos da Conta/
    │   │   └── Aviso_Firmenich.png    → Fullscreen
    │   └── 02_MOSAICO GAV dos Squads/
    │       ├── Squad_1.png            → Mosaico 2x2
    │       ├── Squad_2.png            → Mosaico 2x2
    │       ├── Squad_3.png            → Mosaico 2x2
    │       └── Squad_4.png            → Mosaico 2x2
    │
    └── VLI Logistica/
        ├── 01_Avisos da Conta/
        │   └── Aviso_VLI.png          → Fullscreen
        └── 02_MOSAICO GAV dos Squads/
            ├── SquadA.png             → Mosaico 2x2
            └── SquadB.png             → Mosaico 2x2
```

**Formatos suportados**: `.jpg`, `.jpeg`, `.png`, `.gif`, `.bmp`, `.webp`

### 3. Configurar Caminho (Opcional)

Se sua pasta OneDrive estiver em um local diferente, crie um arquivo `.env` na raiz do projeto:

```env
ONEDRIVE_PATH=C:\Users\SeuUsuario\OneDrive - SuaEmpresa\GAV_Enterprise
CAROUSEL_INTERVAL_FULLSCREEN=10000
CAROUSEL_INTERVAL_MOSAIC=15000
```

## 🎬 Ordem de Exibição

O carrossel processa as pastas **recursivamente e em ordem alfabética**:

1. **Processa pasta raiz** → Exibe imagens (se houver)
2. **Processa subpastas** (ordem alfabética) → Exibe imagens de cada uma
3. **Recursivamente** para cada subpasta
4. **Loop infinito** (reinicia do início)

### Tipos de Exibição

- **Fullscreen**: 10 segundos por imagem (padrão)
- **Mosaico 2x2**: 15 segundos por grupo de até 4 imagens

## 🔄 Sincronização

### Manual

Execute o script sempre que adicionar/remover imagens:

```powershell
.\scripts\sync-onedrive-images.ps1
```

O script:
1. ✅ Copia imagens do OneDrive para `./images/`
2. ✅ Gera `playlist.json` com estrutura de exibição
3. ✅ Gera `config.json` com configurações
4. ✅ Cria log em `logs/sync.log`

### Automática (Recomendado)

Configure uma **Tarefa Agendada** no Windows para executar o script a cada 10 minutos:

```powershell
# Criar tarefa agendada (executar como Administrador)
$action = New-ScheduledTaskAction -Execute "PowerShell.exe" -Argument "-ExecutionPolicy Bypass -File `"C:\caminho\gav-hakuna\scripts\sync-onedrive-images.ps1`""
$trigger = New-ScheduledTaskTrigger -Once -At (Get-Date) -RepetitionInterval (New-TimeSpan -Minutes 10) -RepetitionDuration ([TimeSpan]::MaxValue)
Register-ScheduledTask -TaskName "GAV-Hakuna Sync" -Action $action -Trigger $trigger -Description "Sincroniza imagens do OneDrive"
```

## 🎨 Personalização

Edite o arquivo `.env` para personalizar:

```env
# Caminho do OneDrive
ONEDRIVE_PATH=C:\Users\SeuUsuario\OneDrive\GAV_Enterprise

# Intervalos de exibição (em milissegundos)
CAROUSEL_INTERVAL_FULLSCREEN=10000  # 10 segundos
CAROUSEL_INTERVAL_MOSAIC=15000      # 15 segundos
```

## 📺 Configurar TV em Modo Kiosk

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

**Nota**: Ajuste a porta conforme o servidor (8080 para http-server, 3000 para Python)

### Dicas
- Configure o dispositivo para **nunca entrar em suspensão**
- Desabilite **proteção de tela**
- Configure **inicialização automática** do navegador em modo kiosk
- O frontend **recarrega automaticamente** a playlist a cada 10 minutos

## 🔍 Troubleshooting

### Erro: "Pasta não encontrada"
- Verifique se a pasta existe no OneDrive local
- Confirme o caminho no `.env` (se usado)
- Execute: `.\scripts\sync-onedrive-images.ps1` e veja os logs

### Imagens não aparecem
- Verifique se o script de sincronização rodou sem erros
- Confirme que existe `frontend/playlist.json`
- Verifique os logs: `logs/sync.log`
- Confirme os formatos de imagem (.jpg, .png, etc.)

### Playlist vazia
- Verifique se há imagens nas pastas do OneDrive
- Execute `.\scripts\sync-onedrive-images.ps1` manualmente
- Veja os logs no console do script

### Servidor não inicia
- **Python não instalado**: Baixe em https://www.python.org/downloads/
- **Porta 3000 ocupada**: Use outra porta: `python -m http.server 8080`
- **Use alternativa**: Live Server (VS Code), IIS, http-server, etc.

## 📝 Logs

Logs de sincronização em `logs/sync.log`:

```powershell
# Ver logs em tempo real
Get-Content logs\sync.log -Tail 50 -Wait
```

## 📦 Estrutura de Arquivos

```
gav-hakuna/
├── frontend/               # Aplicação frontend
│   ├── index.html         # Página principal
│   ├── config.json        # Config (gerado pelo script)
│   ├── playlist.json      # Playlist (gerado pelo script)
│   ├── css/               # Estilos
│   ├── js/                # JavaScript puro
│   │   ├── playlist-loader.js  # Carrega playlist.json
│   │   ├── carousel.js         # Lógica do carrossel
│   │   ├── mosaic.js           # Renderização mosaico
│   │   ├── transitions.js      # Transições
│   │   ├── header.js           # Cabeçalho
│   │   └── main.js             # Entry point
│   └── assets/            # Imagens, logos
│
├── images/                # Imagens sincronizadas (gerado)
│   └── [estrutura copiada do OneDrive]
│
├── scripts/               # Scripts utilitários
│   └── sync-onedrive-images.ps1  # Sincronização
│
├── logs/                  # Logs
├── start-server.bat       # Inicia servidor HTTP (Windows)
├── stop-server.bat        # Para servidor HTTP (Windows)
└── README.md              # Este arquivo
```

## 🔧 Tecnologias

- **Frontend**: HTML5 + CSS3 + JavaScript Vanilla (zero dependências)
- **Sincronização**: PowerShell (cópia de arquivos local)
- **Servidor**: Qualquer servidor HTTP estático (Python, IIS, etc.)

**Nota**: Não precisa de Node.js, npm, build ou dependências!

## 📚 Documentação

- **[INICIO_RAPIDO.md](INICIO_RAPIDO.md)** - Começar em 3 passos
- **[GUIA_USO.md](GUIA_USO.md)** - Guia completo de uso
- **[ARQUITETURA_SISTEMA.md](ARQUITETURA_SISTEMA.md)** - Como funciona tecnicamente
- **[PRINCIPLES.md](PRINCIPLES.md)** - Regras de exibição
- **[docs/THEME_GUIDE.md](docs/THEME_GUIDE.md)** - Personalização visual

---

**Status**: ✅ Produção  
**Versão**: 3.0.0  
**Desenvolvido para**: Ambientes corporativos com TVs para Gestão À Vista
