# Migração para GAV-Enterprise v3.0 (Sem Backend)

## 🎯 Mudanças Principais

A versão 3.0 do GAV-Enterprise **elimina completamente o backend Node.js**, simplificando drasticamente a arquitetura e manutenção da aplicação.

## ✅ Antes vs Depois

### Antes (v2.x)

```
┌─────────────────────────────────────┐
│         TV/Display Device           │
│  ┌───────────────────────────────┐  │
│  │   Frontend (Vanilla JS)       │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
                  ↕ HTTP API
┌─────────────────────────────────────┐
│   Backend (Node.js + Express)       │
│  - REST API                         │
│  - Sync Scheduler                   │
│  - Cache em memória                 │
└─────────────────────────────────────┘
                  ↕ Filesystem
┌─────────────────────────────────────┐
│   ./images/ + PowerShell Script     │
└─────────────────────────────────────┘
```

**Problemas:**
- ❌ Dependências NPM (85MB+ em node_modules)
- ❌ Backend precisa estar rodando 24/7
- ❌ Mais complexo de manter
- ❌ Mais pontos de falha

### Depois (v3.0)

```
┌─────────────────────────────────────┐
│         TV/Display Device           │
│  ┌───────────────────────────────┐  │
│  │   Frontend (Vanilla JS)       │  │
│  │   - Lê playlist.json local    │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
                  ↕ Filesystem
┌─────────────────────────────────────┐
│   ./images/ + playlist.json         │
│   Gerado por PowerShell Script      │
└─────────────────────────────────────┘
```

**Vantagens:**
- ✅ Zero dependências NPM
- ✅ Sem backend para manter
- ✅ Qualquer servidor HTTP funciona
- ✅ Mais simples, mais confiável
- ✅ Menos recursos (CPU/RAM)

## 📋 Checklist de Migração

### 1. Backup (Opcional)

```powershell
# Fazer backup do diretório atual
Copy-Item -Recurse -Path "gav-enterprise" -Destination "gav-enterprise-backup"
```

### 2. Atualizar Código

```powershell
# Puxar última versão
git pull origin main

# OU clonar de novo
git clone https://github.com/seu-usuario/gav-hakuna.git
cd gav-hakuna
```

### 3. Executar Sincronização

```powershell
# Gerar playlist.json e config.json
.\scripts\sync-onedrive-images.ps1
```

Verifique que foram criados:
- ✅ `frontend/playlist.json`
- ✅ `frontend/config.json`
- ✅ `images/` (com suas imagens)

### 4. Iniciar Novo Servidor

```cmd
# Opção 1: Usar script automático (recomendado)
.\start-server.bat

# Opção 2: Python manual
cd frontend
python -m http.server 3000

# Opção 3: Live Server (VS Code)
# Abrir frontend/index.html e clicar em "Go Live"
```

### 5. Testar

Abra `http://localhost:3000` no navegador.

Deve funcionar imediatamente!

### 6. Limpar Backend Antigo (Opcional)

```powershell
# Pode deletar (não são mais necessários)
Remove-Item -Recurse -Force backend/
Remove-Item -Recurse -Force node_modules/
Remove-Item package.json
Remove-Item package-lock.json

# Manter apenas:
# - frontend/
# - images/
# - scripts/
# - start-server.bat
# - start-server.ps1
# - README.md
```

## 🔄 Mudanças de Arquivos

### Arquivos Novos

- ✅ `frontend/js/playlist-loader.js` - Substitui api-client.js
- ✅ `frontend/playlist.json` - Gerado pelo script PowerShell
- ✅ `frontend/config.json` - Gerado pelo script PowerShell
- ✅ `start-server.bat` - Script de inicialização (Windows)
- ✅ `stop-server.bat` - Script para parar servidor (Windows)

### Arquivos Modificados

- ✅ `scripts/sync-onedrive-images.ps1` - Agora gera JSON
- ✅ `frontend/js/main.js` - Usa PlaylistLoader ao invés de APIClient
- ✅ `frontend/js/carousel.js` - Usa PlaylistLoader
- ✅ `frontend/index.html` - Carrega playlist-loader.js
- ✅ `README.md` - Instruções atualizadas

### Arquivos Removíveis (Deprecated)

- ❌ `backend/` (todo o diretório)
- ❌ `node_modules/`
- ❌ `package.json`
- ❌ `package-lock.json`
- ❌ `frontend/js/api-client.js` (substituído por playlist-loader.js)

## 🔧 Configuração de Tarefa Agendada

Para sincronização automática, configure uma tarefa no Windows:

### Via PowerShell (Administrador)

```powershell
$scriptPath = "C:\caminho\completo\gav-hakuna\scripts\sync-onedrive-images.ps1"
$action = New-ScheduledTaskAction -Execute "PowerShell.exe" -Argument "-ExecutionPolicy Bypass -File `"$scriptPath`""
$trigger = New-ScheduledTaskTrigger -Once -At (Get-Date) -RepetitionInterval (New-TimeSpan -Minutes 10) -RepetitionDuration ([TimeSpan]::MaxValue)
$principal = New-ScheduledTaskPrincipal -UserId "$env:USERDOMAIN\$env:USERNAME" -LogonType S4U
Register-ScheduledTask -TaskName "GAV-Hakuna Sync" -Action $action -Trigger $trigger -Principal $principal -Description "Sincroniza imagens do OneDrive a cada 10 minutos"
```

### Via Agendador de Tarefas (GUI)

1. Abrir **Agendador de Tarefas**
2. **Criar Tarefa Básica**
3. Nome: `GAV-Hakuna Sync`
4. Gatilho: **Ao fazer logon**
5. Ação: **Iniciar um programa**
   - Programa: `PowerShell.exe`
   - Argumentos: `-ExecutionPolicy Bypass -File "C:\caminho\gav-hakuna\scripts\sync-onedrive-images.ps1"`
6. Em **Gatilhos**, editar e marcar:
   - ✅ Repetir tarefa a cada: **10 minutos**
   - ✅ Por um período de: **Indefinidamente**

## 📊 Comparação de Recursos

| Recurso | v2.x (Backend) | v3.0 (Sem Backend) |
|---------|----------------|---------------------|
| Node.js | ✅ Obrigatório | ❌ Não necessário |
| npm install | ✅ Necessário | ❌ Não necessário |
| node_modules | ~85 MB | 0 MB |
| Dependências | 7+ pacotes NPM | 0 |
| Servidor | Node.js/Express | Qualquer HTTP |
| API REST | Sim | Não (JSON local) |
| Cache | Memória (Node) | Browser cache |
| Logs | Winston | PowerShell |
| Complexidade | Alta | Baixa |
| Manutenção | Média | Mínima |

## 🎯 Funcionalidades Mantidas

Todas as funcionalidades principais foram mantidas:

- ✅ Carrossel fullscreen e mosaico 2x2
- ✅ Sincronização com OneDrive
- ✅ Estrutura dinâmica de pastas
- ✅ Refresh automático (via reload do JSON)
- ✅ Ordem alfabética
- ✅ Bordas e estilos customizáveis
- ✅ Cabeçalho com logo
- ✅ Transições suaves

## 🚀 Como o Sistema Funciona Agora

1. **Script PowerShell** (`sync-onedrive-images.ps1`):
   - Copia imagens do OneDrive → `./images/`
   - Varre recursivamente todas as pastas
   - Gera `playlist.json` com estrutura completa
   - Gera `config.json` com configurações

2. **Servidor HTTP** (Python/IIS/Live Server/etc):
   - Serve apenas arquivos estáticos
   - Não precisa processar nada
   - Qualquer servidor HTTP funciona

3. **Frontend JavaScript**:
   - Carrega `playlist.json` via fetch()
   - Renderiza carrossel baseado no JSON
   - Recarrega JSON a cada 10 minutos (refresh automático)
   - Imagens carregadas diretamente do filesystem

## ❓ Perguntas Frequentes

### O backend antigo ainda funciona?

Sim, mas não é mais recomendado. A v3.0 é mais simples e confiável.

### Preciso reinstalar tudo?

Não! Apenas:
1. Puxe o código novo (git pull)
2. Execute o script: `.\scripts\sync-onedrive-images.ps1`
3. Inicie qualquer servidor HTTP: `.\start-server.bat`

### E se eu já tinha o backend rodando?

Pode desligar o backend Node.js. Use o novo método (servidor HTTP estático).

### Posso voltar para a v2.x?

Sim, via git: `git checkout v2.x` (se tiver tag). Mas recomendamos ficar na v3.0.

### Perdi alguma funcionalidade?

Não! Todas as funcionalidades visuais e de negócio foram mantidas. Apenas removemos a complexidade desnecessária do backend.

## 📞 Suporte

Se tiver problemas na migração:

1. Verifique os logs: `logs/sync.log`
2. Execute manualmente: `.\scripts\sync-onedrive-images.ps1`
3. Verifique se `frontend/playlist.json` foi criado
4. Teste em: `http://localhost:3000`

---

**Versão**: 3.0.0  
**Data**: Outubro 2025  
**Status**: ✅ Produção

