# Princípios do Projeto GAV-Hakuna

```mermaid
flowchart LR
  TV[TV/Display (Browser)] --> FE[Frontend - Carrossel]
  FE --> JSON[playlist.json local]
  JSON --> PS[PowerShell Script]
  PS --> FS[Filesystem Local]
  FS --> OD[OneDrive (sincronizado)]
```

```mermaid
flowchart TB
  start([Início])
  ag["Avisos Gerais Hakuna\nfullscreen - 10s cada"]
  accounts{Para cada Conta (A→Z)}
  squads["GAV dos Squads\nmosaico 2x2 - 15s"]
  avisos{Avisos da Conta existe?}
  avisosYes["Avisos da Conta\nfullscreen - 10s cada"]
  endLoop[[Reinicia ciclo]]

  start --> ag --> accounts
  accounts --> squads --> avisos
  avisos -- Sim --> avisosYes --> accounts
  avisos -- Não --> accounts
  accounts -- Última conta --> endLoop --> ag
```

## Visão Geral
**GAV-Hakuna** é uma plataforma de Gestão À Vista (GAV) focada em exibir imagens em carrossel de um diretório estruturado do OneDrive em uma TV de andar, com suporte a múltiplas contas e modos de exibição diferenciados.

## Princípios Fundamentais

### 1. Simplicidade
- Interface minimalista focada apenas na exibição de imagens
- Configuração simplificada e intuitiva
- Sem funcionalidades desnecessárias que possam distrair do objetivo principal

### 2. Leveza e Performance
- Carregamento rápido das imagens
- Consumo mínimo de recursos (CPU, memória, rede)
- Otimizado para rodar 24/7 em dispositivos conectados a TVs
- Cache inteligente para melhorar performance

### 3. Confiabilidade
- Operação contínua sem intervenção manual
- Recuperação automática de erros de conexão
- Sincronização automática com o diretório do OneDrive
- Logs para monitoramento e troubleshooting

### 4. Experiência Visual
- Transições suaves entre imagens
- Suporte para diferentes formatos de imagem (JPG, PNG, GIF, etc.)
- Adaptação automática a diferentes resoluções de TV
- Design responsivo e profissional
- Cabeçalho fixo com logo da Enterprise Hakuna para identidade visual
- Bordas elegantes nas imagens para acabamento profissional

### 5. Facilidade de Manutenção
- Atualização automática de imagens ao detectar mudanças no OneDrive
- Não requer intervenção técnica para adicionar/remover imagens
- Configuração centralizada e fácil de modificar

## Estrutura de Diretórios do OneDrive

O sistema segue uma hierarquia específica de pastas no OneDrive:

```
📁 Raiz (OneDrive Folder)
│
├── 📁 Avisos Gerais Hakuna
│   ├── 🖼️ evento1.jpg
│   ├── 🖼️ novidade2.png
│   └── 🖼️ info3.jpg
│
└── 📁 Informações por Conta
    │
    ├── 📁 [Conta 1] (dinâmica)
    │   ├── 📁 GAV dos Squads
    │   │   ├── 🖼️ squad1.jpg
    │   │   ├── 🖼️ squad2.png
    │   │   ├── 🖼️ squad3.jpg
    │   │   └── 🖼️ squad4.png
    │   │
    │   └── 📁 Avisos da conta
    │       ├── 🖼️ aviso1.jpg
    │       └── 🖼️ aviso2.png
    │
    ├── 📁 [Conta 2] (dinâmica)
    │   ├── 📁 GAV dos Squads
    │   └── 📁 Avisos da conta
    │
    └── 📁 [Conta N] (dinâmica)
        ├── 📁 GAV dos Squads
        └── 📁 Avisos da conta
```

### Estrutura Explicada:

1. **Avisos Gerais Hakuna**: Imagens relacionadas a eventos, novidades ou informações da Enterprise Hakuna
2. **Informações por Conta**: Contém pastas dinâmicas, uma para cada conta gerenciada pela Enterprise
3. **Dentro de cada conta**:
   - **GAV dos Squads**: Imagens dos squads (exibidas em mosaico 2x2)
   - **Avisos da conta**: Avisos específicos daquela conta (exibidos individualmente)

## Regras de Exibição

### Ordem de Exibição (Sequencial)

O carrossel segue uma ordem específica e predefinida:

```
┌─────────────────────────────────────────────────┐
│ CICLO COMPLETO DO CARROSSEL                     │
├─────────────────────────────────────────────────┤
│                                                 │
│ 1. Avisos Gerais Hakuna (fullscreen)           │
│    └─> Cada imagem exibida individualmente     │
│                                                 │
│ 2. Para cada Conta (em ordem alfabética):      │
│    │                                            │
│    ├─> GAV dos Squads (mosaico 2x2)            │
│    │   └─> Até 4 imagens simultaneamente       │
│    │                                            │
│    └─> Avisos da conta (fullscreen)            │
│        └─> Cada imagem exibida individualmente │
│        └─> (apenas se a pasta existir)         │
│                                                 │
│ [Reinicia do início após última conta]         │
└─────────────────────────────────────────────────┘
```

### Modos de Exibição

| Origem | Modo de Exibição | Layout | Tempo Padrão |
|--------|------------------|--------|--------------|
| **Avisos Gerais Hakuna** | 1 imagem por vez | Tela cheia | 10s |
| **GAV dos Squads** | Até 4 imagens simultâneas | Mosaico 2x2 | 15s |
| **Avisos da Conta** | 1 imagem por vez | Tela cheia | 10s |

### Comportamento do Mosaico 2x2 (GAV dos Squads)

```
┌─────────────────────────────────────────────┐
│  [LOGO HAKUNA]              DD/MM/YYYY HH:MM│ ← Cabeçalho fixo
├─────────────────────────────────────────────┤
│                                             │
│   ┌──────────────┐  ┌──────────────┐       │
│   │   Squad 1    │  │   Squad 2    │       │ ← Bordas nas imagens
│   └──────────────┘  └──────────────┘       │
│                                             │
│   ┌──────────────┐  ┌──────────────┐       │
│   │   Squad 3    │  │   Squad 4    │       │
│   └──────────────┘  └──────────────┘       │
│                                             │
└─────────────────────────────────────────────┘
```

**Regras do Mosaico:**
- ✅ 1-4 imagens: exibe todas no mosaico 2x2 (preenche espaços disponíveis)
- ✅ 5-8 imagens: divide em 2 slides de até 4 imagens cada
- ✅ 9+ imagens: divide em múltiplos slides de 4 imagens
- ✅ Imagens centralizadas e proporcionais no grid

### Algoritmo de Exibição

```python
# Pseudo-código do fluxo
def executar_carrossel():
    while True:
        # 1. Avisos Gerais Hakuna
        imagens_gerais = buscar_imagens("Avisos Gerais Hakuna")
        for imagem in imagens_gerais:
            exibir_fullscreen(imagem, duracao=10s)
        
        # 2. Para cada conta (ordem alfabética)
        contas = listar_contas_dinamicamente("Informações por Conta")
        for conta in sorted(contas):
            
            # 2a. GAV dos Squads (mosaico 2x2)
            imagens_squads = buscar_imagens(f"{conta}/GAV dos Squads")
            slides_mosaico = dividir_em_grupos_de_4(imagens_squads)
            for slide in slides_mosaico:
                exibir_mosaico_2x2(slide, duracao=15s)
            
            # 2b. Avisos da conta (fullscreen, se existir)
            if existe_pasta(f"{conta}/Avisos da conta"):
                imagens_avisos = buscar_imagens(f"{conta}/Avisos da conta")
                for imagem in imagens_avisos:
                    exibir_fullscreen(imagem, duracao=10s)
```

## Restrições e Limitações

### O que o sistema FAZ:
- ✅ Exibe imagens em carrossel seguindo hierarquia específica do OneDrive
- ✅ Suporta múltiplas contas de forma dinâmica
- ✅ Exibe GAV dos Squads em mosaico 2x2 (até 4 imagens simultâneas)
- ✅ Exibe avisos em tela cheia (1 imagem por vez)
- ✅ Atualiza automaticamente quando novas imagens são adicionadas
- ✅ Detecta dinamicamente novas contas/pastas
- ✅ Roda continuamente em modo kiosk/fullscreen

### O que o sistema NÃO FAZ:
- ❌ Edição de imagens
- ❌ Upload de arquivos via interface
- ❌ Múltiplos usuários/permissões complexas
- ❌ Vídeos ou conteúdo multimídia pesado
- ❌ Análises ou dashboards complexos
- ❌ Configuração individual por TV (única TV exibe tudo)

## Stack Tecnológica Recomendada

### Frontend (Interface de Exibição)
- **HTML5 + CSS3 + JavaScript puro** (sem frameworks)
- Leve, sem frameworks pesados
- PWA (Progressive Web App) para instalação simplificada em dispositivos

### Backend (Servidor Local)
- **Node.js (Express)**
- Endpoints simples para buscar lista de imagens do filesystem local
- Sincronização via PowerShell (cópia de arquivos local)

### Infraestrutura
- Hospedagem simples (servidor interno ou cloud leve)
- Configuração via variáveis de ambiente

## Arquitetura Proposta

```
┌─────────────────────────────────────┐
│         TV/Display Device           │
│  ┌───────────────────────────────┐  │
│  │   Frontend (Web Browser)      │  │
│  │   - Carrossel Inteligente     │  │
│  │   - Modo Fullscreen/Mosaico   │  │
│  │   - Auto-refresh periódico    │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
                  ▲
                  │ HTTP
                  ▼
┌─────────────────────────────────────┐
│      Backend API (Servidor)         │
│  ┌───────────────────────────────┐  │
│  │   Endpoints REST              │  │
│  │   - GET /carousel/playlist    │  │
│  │   - GET /images/:path         │  │
│  │   - Lógica de Ordenação       │  │
│  │   - Cache + Sync Logic        │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
                  ▲
                  │ Filesystem Local
                  ▼
┌─────────────────────────────────────┐
│       Filesystem Local (./images)   │
│  ┌───────────────────────────────┐  │
│  │  📁 Avisos Gerais Hakuna      │  │
│  │  📁 Informações por Conta     │  │
│  │     📁 [Conta N]              │  │
│  │        📁 GAV dos Squads      │  │
│  │        📁 Avisos da conta     │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
                  ▲
                  │ PowerShell Sync
                  ▼
┌─────────────────────────────────────┐
│       OneDrive (Microsoft 365)      │
│  - Sincronizado via cliente Windows │
│  - Fonte original das imagens       │
└─────────────────────────────────────┘
```

## Fluxo de Funcionamento

1. **Configuração Inicial**: Administrador configura caminho da pasta OneDrive (opcional, usa padrão)
2. **Sincronização**: Script PowerShell copia imagens do OneDrive local para `./images/`
3. **Montagem da Playlist**: Backend monta a ordem de exibição seguindo as regras:
   - Avisos Gerais Hakuna (fullscreen)
   - Para cada conta (alfabética):
     - GAV dos Squads (mosaico 2x2)
     - Avisos da conta (fullscreen, se existir)
4. **Cache**: Playlist é cacheada em memória para performance
5. **Exibição**: Frontend carrega a playlist e exibe seguindo os modos definidos
6. **Atualização**: Sistema sincroniza periodicamente via PowerShell (intervalo configurável)
7. **Loop**: Ao final da playlist, reinicia do início

## Requisitos Não-Funcionais

### Performance
- Tempo de carregamento inicial: < 3 segundos
- Transição entre imagens: < 500ms
- Intervalo para imagens fullscreen: 10 segundos (configurável)
- Intervalo para mosaico 2x2: 15 segundos (configurável)
- Pré-carregamento de próximas imagens para transições suaves

### Disponibilidade
- Uptime esperado: 99.9%
- Funcionar offline com cache por até 24 horas

### Segurança
- Acesso local ao filesystem (sem autenticação externa)
- Configurações armazenadas em variáveis de ambiente (.env)
- HTTPS recomendado em produção (opcional)

## Configurações Essenciais

```env
# OneDrive
ONEDRIVE_PATH=C:\Users\SeuUsuario\OneDrive - SuaEmpresa\GAV_Enterprise

# Carrossel - Intervalos de Exibição
CAROUSEL_INTERVAL_FULLSCREEN=10000  # 10 segundos para imagens fullscreen
CAROUSEL_INTERVAL_MOSAIC=15000      # 15 segundos para mosaico 2x2
CAROUSEL_TRANSITION=fade            # fade ou slide

# Interface Visual
HEADER_LOGO_URL=/assets/logo-hakuna.png  # Caminho para logo da Enterprise
HEADER_SHOW_DATETIME=true                # Exibir data/hora no cabeçalho
IMAGE_BORDER_WIDTH=8                     # Largura da borda em pixels
IMAGE_BORDER_COLOR=#E0E0E0               # Cor da borda (hexadecimal)
IMAGE_BORDER_RADIUS=12                   # Arredondamento das bordas em pixels

# Sincronização
SYNC_INTERVAL=120000          # 2 minutos - intervalo de sincronização via PowerShell
CACHE_EXPIRATION=86400000     # 24 horas

# Servidor
PORT=3000
HOST=0.0.0.0
NODE_ENV=production
```

## Roadmap Futuro (Opcional)

### Fase 1 - MVP ✅
- Exibição de imagens em carrossel seguindo hierarquia específica
- Sincronização com OneDrive via PowerShell (cópia local)
- Modo fullscreen para avisos
- Modo mosaico 2x2 para GAV dos Squads
- Detecção dinâmica de contas
- Interface fullscreen responsiva
- Sincronização automática periódica
- Cabeçalho fixo com logo da Enterprise e data/hora
- Bordas elegantes nas imagens (configuráveis)

### Fase 2 - Melhorias 🔄
- Configuração via interface web administrativa
- Suporte a vídeos curtos (MP4) nas pastas
- Logs e monitoramento de status
- Dashboard de visualizações (quais imagens foram exibidas)
- Controle remoto básico (pause/resume/skip)

### Fase 3 - Avançado 🔄
- Múltiplas TVs com configurações individuais
- Agendamento de conteúdo por horário/dia da semana
- Analytics detalhados de visualizações
- Aplicativo mobile para controle remoto
- Notificações sobre erros de sincronização
- Editor de transições e efeitos

## Contribuindo

Este projeto prioriza simplicidade e foco. Qualquer nova funcionalidade deve ser avaliada quanto ao impacto na performance e complexidade.

---

**Última atualização**: 29 de setembro de 2025  
**Versão**: 0.3.0 - Adicionado cabeçalho com logo e bordas nas imagens
