# Scripts de Sincronização

## 📄 sync-onedrive-images.ps1

Script PowerShell para sincronizar imagens do OneDrive para o diretório local.

### Requisitos

- PowerShell 5.1+ (já incluído no Windows)
- OneDrive sincronizado localmente

### Configuração

O script lê as configurações do arquivo `.env` na raiz do projeto (opcional):

```env
ONEDRIVE_PATH=C:\Users\SeuUsuario\OneDrive - SuaEmpresa\GAV_Enterprise
```

Se não configurado, usa o caminho padrão: `C:\Users\dti-\OneDrive - dti digital crafters\GAV_Enterprise`

### Uso

```powershell
# Executar sincronização
.\scripts\sync-onedrive-images.ps1

# Com parâmetro customizado para .env
.\scripts\sync-onedrive-images.ps1 -ConfigFile ".env.production"
```

### O que o Script Faz

1. **Lê** o caminho da pasta OneDrive local (do `.env` ou usa padrão)
2. **Limpa** o diretório de destino `./images/`
3. **Copia** todas as imagens da pasta OneDrive para `./images/` (mantendo estrutura de pastas)
4. **Cria** arquivo `last-sync.txt` com timestamp da sincronização
5. **Registra** logs em `./logs/sync.log`

### Estrutura de Pastas

O script mantém a mesma estrutura de pastas do OneDrive:

```
OneDrive: GAV_Enterprise/
          └── Avisos Gerais Hakuna/
              └── aviso1.jpg

Local:    images/
          └── Avisos Gerais Hakuna/
              └── aviso1.jpg
```

### Saída do Script

```
=== GAV-Hakuna - Sincronizacao OneDrive ===
Fonte: C:\Users\dti-\OneDrive - dti digital crafters\GAV_Enterprise
Destino: C:\path\to\gav-hakuna\images

OK: Pasta de origem encontrada
Limpando diretorio de destino...
OK: Diretorio limpo

Copiando imagens...
  OK: Avisos Gerais Hakuna\aviso1.jpg (1234.5 KB)
  OK: Avisos Gerais Hakuna\aviso2.png (2345.6 KB)
  OK: Informações Por Conta\VLI\GAV dos Squads\squad1.jpg (3456.7 KB)
  ...

=== Sincronização Concluída ===
  Total de imagens baixadas: 25
  Tempo decorrido: 5.43 segundos
  Diretório local: C:\path\to\gav-hakuna\images
```

### Logs

Os logs são salvos em dois locais:

1. **Console**: Saída colorida em tempo real
2. **Arquivo**: `logs/sync.log` (permanente)

Exemplo de log:
```
[2025-09-30 15:30:00] [INFO] Fonte: C:\Users\...\OneDrive\GAV_Enterprise
[2025-09-30 15:30:01] [SUCCESS] OK: Pasta de origem encontrada
[2025-09-30 15:30:02] [SUCCESS] OK: Diretorio limpo
[2025-09-30 15:30:15] [SUCCESS] Total de imagens copiadas: 25
```

### Tratamento de Erros

O script trata os seguintes erros:

| Erro | Causa | Código de Saída |
|------|-------|----------------|
| Pasta não encontrada | Pasta OneDrive não existe ou não está sincronizada | 1 |
| Erro de cópia | Falha ao copiar arquivo | Continua |
| Erro de permissão | Sem permissão para ler/escrever | 1 |

### Automação

#### Via Task Scheduler (Recomendado)

Para garantir que as imagens estejam sempre atualizadas, agende o script:

```powershell
# Criar tarefa agendada (executar a cada 1 hora)
$action = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-ExecutionPolicy Bypass -File C:\path\to\scripts\sync-onedrive-images.ps1"
$trigger = New-ScheduledTaskTrigger -Once -At (Get-Date) -RepetitionInterval (New-TimeSpan -Hours 1) -RepetitionDuration ([TimeSpan]::MaxValue)
Register-ScheduledTask -Action $action -Trigger $trigger -TaskName "GAV-Hakuna-Sync" -Description "Sincronizar imagens do OneDrive"
```

### Troubleshooting

#### Erro: "Pasta não encontrada"

1. Certifique-se de que o OneDrive está instalado e sincronizado
2. Verifique se a pasta `GAV_Enterprise` existe no seu OneDrive
3. Confirme o caminho no `.env` ou ajuste o caminho padrão no script
4. Verifique se todas as pastas estão sincronizadas (ícone verde no OneDrive)

#### OneDrive não sincroniza

1. Clique com botão direito no ícone do OneDrive na bandeja do sistema
2. Selecione "Configurações" → "Conta" → "Escolher pastas"
3. Certifique-se de que a pasta GAV_Enterprise está marcada para sincronização

#### Script lento

- **Causa**: Muitas imagens grandes
- **Solução**: Comprima as imagens antes de colocar no OneDrive

### Performance

- **Cópia local**: Muito rápido (~1-2 segundos para 20-30 imagens)
- **Sincronizações subsequentes**: Mesmo tempo (sempre limpa e copia tudo)
- **Consumo**: Apenas I/O de disco local (sem uso de banda/internet)

### Segurança

- ✅ Apenas cópia local de arquivos
- ✅ Não requer credenciais ou autenticação
- ✅ Depende da segurança do OneDrive (já autenticado no Windows)

---

**Autor**: GAV-Hakuna Team  
**Versão**: 2.0.0  
**Última atualização**: 30/09/2025

