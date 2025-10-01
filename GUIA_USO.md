# GAV-Enterprise - Guia de Uso

## 📋 Scripts Disponíveis

### 🚀 Iniciar Aplicação

```cmd
.\start-server.bat
```

**O que faz:**
1. Verifica se Node.js ou Python está instalado
2. Inicia servidor HTTP na porta 8080 (Node.js) ou 3000 (Python)
3. Abre automaticamente o navegador no endereço correto

**Porta padrão**: 8080 (http-server via Node.js) ou 3000 (Python)

---

### 🛑 Parar Aplicação

```cmd
.\stop-server.bat
```

**⚠️ EXECUTAR COMO ADMINISTRADOR** (botão direito → "Executar como administrador")

**O que faz:**
1. Para todos os processos Node.js (http-server)
2. Remove a tarefa agendada de sincronização automática
3. Libera a porta 8080

**Nota**: Este script também remove a sincronização automática configurada.

---

### 🔄 Sincronização Manual

```cmd
powershell -ExecutionPolicy Bypass -File .\scripts\sync-onedrive-images.ps1
```

**O que faz:**
1. Copia imagens do OneDrive local → `./images/`
2. Gera `frontend/playlist.json` automaticamente
3. Gera `frontend/config.json` com configurações
4. Cria `images/last-sync.txt` com timestamp
5. Registra logs em `logs/sync.log`

**Quando usar:**
- Após adicionar/remover imagens no OneDrive
- Para testar sincronização
- Primeira execução do projeto

---

### ⚙️ Configurar Sincronização Automática

Para configurar sincronização automática, crie uma Tarefa Agendada do Windows manualmente:

**PowerShell (executar como Administrador):**

```powershell
$scriptPath = "C:\CAMINHO\COMPLETO\gav-enterprise\scripts\sync-onedrive-images.ps1"
$action = New-ScheduledTaskAction -Execute "PowerShell.exe" -Argument "-ExecutionPolicy Bypass -File `"$scriptPath`""
$trigger = New-ScheduledTaskTrigger -Once -At (Get-Date) -RepetitionInterval (New-TimeSpan -Minutes 10) -RepetitionDuration ([TimeSpan]::MaxValue)
Register-ScheduledTask -TaskName "GAV-Enterprise-Sync" -Action $action -Trigger $trigger -Description "Sincroniza imagens a cada 10 minutos"
```

**⚠️ IMPORTANTE:** Substitua `C:\CAMINHO\COMPLETO\` pelo caminho real do projeto!

**O que faz:**
- Cria tarefa que roda a cada 10 minutos
- Sincroniza automaticamente em segundo plano
- Funciona mesmo com a aplicação fechada

---

### 🗑️ Remover Sincronização Automática

**Via stop-server.bat** (já remove automaticamente ao parar)

**OU manualmente via PowerShell:**

```cmd
schtasks /Delete /TN "GAV-Enterprise-Sync" /F
```

**O que faz:**
- Remove a tarefa agendada
- Desabilita sincronização automática

---

## 🎯 Fluxo de Uso Recomendado

### Primeira Vez (Configuração)

1. **Execute a primeira sincronização:**
   ```cmd
   powershell -ExecutionPolicy Bypass -File .\scripts\sync-onedrive-images.ps1
   ```

2. **Configure sincronização automática (opcional):**
   - Execute o comando PowerShell mostrado acima (seção ⚙️)
   - Substitua o caminho pelo caminho real do projeto

3. **Inicie a aplicação:**
   ```cmd
   .\start-server.bat
   ```

### Uso Diário

- **Iniciar:** `.\start-server.bat`
- **Parar:** `.\stop-server.bat` (como Administrador)
- **Sincronizar manualmente:** `.\scripts\sync-onedrive-images.ps1`

**Dica:** Se configurou sincronização automática, as imagens serão atualizadas a cada 10 minutos automaticamente! ✅

---

## 🔧 Como Funciona

### Arquitetura do Sistema

```
┌─────────────────────────────────────────────────────────────┐
│  1. Script PowerShell (Manual ou Tarefa Agendada)           │
│     - Copia imagens: OneDrive → ./images/                   │
│     - Gera: frontend/playlist.json                           │
│     - Gera: frontend/config.json                             │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  2. Servidor HTTP (Python/Node.js http-server/Live Server)  │
│     - Serve arquivos estáticos de ./frontend/               │
│     - SEM backend, SEM API, SEM lógica                       │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  3. Frontend JavaScript (Navegador da TV)                    │
│     - Lê playlist.json via fetch()                           │
│     - Renderiza carrossel baseado no JSON                    │
│     - Recarrega playlist.json a cada 10 minutos              │
└─────────────────────────────────────────────────────────────┘
```

**Importante:** 
- ❌ **Sem backend** Node.js com lógica
- ✅ **Servidor HTTP simples** apenas serve arquivos
- ✅ **PowerShell** gera todo o JSON necessário
- ✅ **Frontend** lê JSON local (sem API REST)

---

## 📂 Estrutura de Pastas

```
OneDrive (Origem)
└── GAV_Enterprise/
    ├── 01_Avisos Gerais Enterprise/       (fullscreen)
    └── 02_Informações Por Conta/
        └── [Nome da Conta]/
            ├── 01_Avisos da Conta/        (fullscreen)
            └── 02_MOSAICO GAV dos Squads/ (mosaico 2x2)

↓ PowerShell copia ↓

Projeto (Destino)
└── images/
    ├── 01_Avisos Gerais Enterprise/
    └── 02_Informações Por Conta/
        └── [Nome da Conta]/
            ├── 01_Avisos da Conta/
            └── 02_MOSAICO GAV dos Squads/
```

**Nota**: As imagens são copiadas para `./images/` (na raiz do projeto), não `frontend/images/`

---

## ⏱️ Intervalos de Exibição

- **Fullscreen:** 10 segundos (configurável em `.env` → `CAROUSEL_INTERVAL_FULLSCREEN`)
- **Mosaico:** 15 segundos (configurável em `.env` → `CAROUSEL_INTERVAL_MOSAIC`)
- **Refresh Playlist:** 10 minutos (configurável em `frontend/config.json`)
- **Sincronização OneDrive:** 10 minutos (configurável na Tarefa Agendada)

---

## 🆘 Solução de Problemas

### As imagens não estão atualizando

1. **Execute sincronização manual:**
   ```cmd
   powershell -ExecutionPolicy Bypass -File .\scripts\sync-onedrive-images.ps1
   ```

2. **Verifique se a sincronização automática está ativa:**
   ```cmd
   schtasks /Query /TN "GAV-Enterprise-Sync"
   ```

3. **Se não estiver configurada, configure manualmente:**
   - Ver seção ⚙️ acima para criar tarefa agendada

### Servidor não inicia (Porta 8080 ocupada)

1. **Pare processos existentes:**
   ```cmd
   .\stop-server.bat
   ```

2. **Tente iniciar novamente:**
   ```cmd
   .\start-server.bat
   ```

### Imagens não aparecem no carrossel

1. **Verifique se as imagens estão em:**
   ```
   ./images/
   ```

2. **Verifique se o playlist.json foi gerado:**
   ```
   ./frontend/playlist.json
   ```

3. **Execute sincronização:**
   ```cmd
   powershell -ExecutionPolicy Bypass -File .\scripts\sync-onedrive-images.ps1
   ```

4. **Verifique os logs:**
   ```
   ./logs/sync.log
   ```

5. **Recarregue o navegador:** Pressione F5 ou Ctrl+Shift+R

---

## 📝 Logs

Verifique os logs em caso de problemas:
- **Sincronização**: `logs/sync.log`
- **Frontend**: Console do navegador (F12)

```powershell
# Ver logs em tempo real
Get-Content logs\sync.log -Tail 50 -Wait
```

---

## 🎨 Configuração

Crie/edite o arquivo `.env` na raiz do projeto:

```env
# Caminho do OneDrive
ONEDRIVE_PATH=C:\Users\SeuUsuario\OneDrive\GAV_Enterprise

# Intervalos de exibição (milissegundos)
CAROUSEL_INTERVAL_FULLSCREEN=10000
CAROUSEL_INTERVAL_MOSAIC=15000
```

