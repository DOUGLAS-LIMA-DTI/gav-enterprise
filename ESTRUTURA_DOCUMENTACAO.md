# 📚 Estrutura da Documentação - GAV-Enterprise v3.0

## 📁 Documentação Principal (Raiz)

```
gav-enterprise/
├── README.md                    # Visão geral e quick start
├── INICIO_RAPIDO.md             # Guia rápido (3 passos)
├── GUIA_USO.md                  # Guia completo de uso
├── ARQUITETURA_SISTEMA.md       # Como funciona tecnicamente
├── PRINCIPLES.md                # Regras de exibição do carrossel
└── .gitignore                   # Arquivos ignorados pelo Git
```

## 📁 Documentação Adicional

```
docs/
├── THEME_GUIDE.md              # Guia de personalização visual
└── archive/                    # Histórico e migração (não essencial)
    ├── MIGRACAO_V3.md
    ├── CHANGELOG_V3.md
    ├── RESUMO_SIMPLIFICACAO.md
    ├── REVISAO_DOCUMENTACAO.md
    ├── RESUMO_LIMPEZA.md
    └── [outros arquivos de debug antigos]

scripts/
└── README.md                   # Documentação do script PowerShell
```

---

## 🎯 Ordem de Leitura Recomendada

### Para Começar

1. **README.md** - Leia primeiro!
   - O que é o sistema
   - Como instalar
   - Configuração básica

2. **INICIO_RAPIDO.md** - 3 passos rápidos
   - Sincronizar
   - Iniciar servidor
   - Acessar

### Para Usar

3. **GUIA_USO.md** - Guia completo
   - Scripts disponíveis
   - Sincronização automática
   - Troubleshooting

### Para Entender

4. **ARQUITETURA_SISTEMA.md** - Como funciona
   - Arquitetura do sistema
   - Fluxo de dados
   - Comandos principais

5. **PRINCIPLES.md** - Regras de negócio
   - Estrutura de pastas do OneDrive
   - Ordem de exibição
   - Tipos de slides

### Para Personalizar

6. **docs/THEME_GUIDE.md** - Customização
   - Cores e temas
   - CSS Variables
   - Personalização visual

---

## 🧹 Limpeza Realizada

### Removido da Raiz

Estes arquivos foram movidos para `docs/archive/`:
- ❌ `MIGRACAO_V3.md` - Migração da v2.x
- ❌ `CHANGELOG_V3.md` - Log de mudanças
- ❌ `RESUMO_SIMPLIFICACAO.md` - Resumo de migração
- ❌ `REVISAO_DOCUMENTACAO.md` - Histórico de revisão

**Motivo**: Informações sobre versões antigas não são relevantes para novos usuários.

### Simplificado

Todos os arquivos principais foram simplificados:
- ✅ Removidas comparações v2.x vs v3.0
- ✅ Removidas seções sobre "por que mudamos"
- ✅ Foco apenas no funcionamento atual
- ✅ Documentação mais concisa e prática

---

## 📊 Resumo

### Antes
- 8 arquivos .md na raiz
- Muita informação sobre migração
- Comparações entre versões
- Documentação extensa e redundante

### Depois
- 5 arquivos .md essenciais na raiz
- Foco no funcionamento atual
- Sem comparações desnecessárias
- Documentação concisa e prática
- Histórico preservado em `docs/archive/`

---

**Versão**: 3.0.0  
**Status**: ✅ Documentação limpa e organizada

