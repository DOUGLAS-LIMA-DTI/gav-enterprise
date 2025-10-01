# 🔍 Guia de Debug do Mosaico

## 📋 Problema
As imagens do mosaico não estão aparecendo na tela.

## 🛠️ Diagnóstico

### Passo 1: Abrir o Console do Navegador
1. Pressione **F12** para abrir as ferramentas do desenvolvedor
2. Vá na aba **Console**
3. Recarregue a página (**Ctrl + Shift + R**)

### Passo 2: Verificar os Logs

Procure pelos seguintes logs quando o mosaico aparecer:

#### ✅ **Logs Esperados (Se estiver funcionando)**
```
🎨 Mosaic.render() chamado
📊 Grid encontrado: [object HTMLDivElement]
📊 Items encontrados: 4
🖼️  Item 0: { item: ..., imgElement: ..., hasImage: true, imageData: {...} }
✅ Imagem 0 configurada: /images/...
✅ Imagem 0 carregada com sucesso
✅ Imagem 1 carregada com sucesso
...
✅ Mosaico renderizado com 4 imagens
```

#### ❌ **Logs de Erro (Se houver problema)**
```
❌ Elemento de mosaico não encontrado
❌ Nenhuma imagem fornecida para o mosaico
❌ Erro ao carregar imagem 0: /images/...
```

### Passo 3: Verificar os Elementos HTML

No console do navegador, execute:

```javascript
// Verificar se o slide do mosaico existe
document.querySelector('.mosaic-slide')

// Verificar se o grid existe
document.querySelector('.mosaic-grid')

// Verificar quantos items existem
document.querySelectorAll('.mosaic-item').length  // Deve retornar 4

// Verificar imagens
document.querySelectorAll('.mosaic-image').forEach((img, i) => {
    console.log(`Imagem ${i}:`, {
        src: img.src,
        complete: img.complete,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        display: window.getComputedStyle(img).display,
        visibility: window.getComputedStyle(img).visibility,
        opacity: window.getComputedStyle(img).opacity
    });
});

// Verificar se o mosaico está ativo
document.querySelector('.mosaic-slide').classList.contains('active')

// Verificar estilo computado do item
let item = document.querySelector('.mosaic-item');
console.log('Item styles:', {
    display: window.getComputedStyle(item).display,
    width: window.getComputedStyle(item).width,
    height: window.getComputedStyle(item).height,
    opacity: window.getComputedStyle(item).opacity
});
```

## 🔧 Possíveis Problemas e Soluções

### Problema 1: Imagens não estão sendo carregadas
**Sintoma**: Logs mostram "Erro ao carregar imagem"

**Solução**: Verifique se as URLs das imagens estão corretas
```javascript
// Ver as URLs que estão sendo carregadas
document.querySelectorAll('.mosaic-image').forEach(img => {
    console.log('URL:', img.src);
});
```

### Problema 2: Slide do mosaico não está ativo
**Sintoma**: `.mosaic-slide` não tem a classe `active`

**Solução**: O carrossel pode não estar alternando para o mosaico
```javascript
// Forçar ativação do mosaico para teste
document.querySelector('.fullscreen-slide').classList.remove('active');
document.querySelector('.mosaic-slide').classList.add('active');
```

### Problema 3: Items estão com `display: none`
**Sintoma**: Items têm a classe `empty`

**Solução**: As imagens não estão sendo passadas corretamente
```javascript
// Verificar classes dos items
document.querySelectorAll('.mosaic-item').forEach((item, i) => {
    console.log(`Item ${i} classes:`, item.classList.toString());
});
```

### Problema 4: Animação está escondendo os items
**Sintoma**: Items têm `opacity: 0` ou `transform` estranho

**Solução**: Desabilitar animações temporariamente
```css
/* Adicionar no console ou direto no DevTools > Elements > Styles */
.mosaic-slide.active .mosaic-item {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
}
```

### Problema 5: Z-index ou overlay
**Sintoma**: Items existem mas estão atrás de outro elemento

**Solução**: Verificar z-index
```javascript
let slide = document.querySelector('.mosaic-slide');
console.log('Z-index:', window.getComputedStyle(slide).zIndex);
console.log('Position:', window.getComputedStyle(slide).position);
```

## 📸 Inspeção Visual

### No DevTools (F12)
1. Vá em **Elements** (ou **Elementos**)
2. Encontre `.mosaic-slide`
3. Expanda para ver `.mosaic-grid` e `.mosaic-item`
4. Clique em cada `.mosaic-item` e veja no painel direito:
   - **Styles**: Verificar se os estilos estão sendo aplicados
   - **Computed**: Ver valores calculados finais
   - **Layout**: Ver dimensões (width, height)

### Verificar se as imagens têm tamanho
```javascript
document.querySelectorAll('.mosaic-image').forEach((img, i) => {
    let bounds = img.getBoundingClientRect();
    console.log(`Imagem ${i}:`, {
        width: bounds.width,
        height: bounds.height,
        top: bounds.top,
        left: bounds.left
    });
});
```

## 🚨 Solução de Emergência

Se nada funcionar, tente este CSS de força bruta no console:

```javascript
// Criar stylesheet de debug
let style = document.createElement('style');
style.textContent = `
    .mosaic-slide {
        display: flex !important;
        opacity: 1 !important;
        visibility: visible !important;
    }
    
    .mosaic-grid {
        display: grid !important;
        grid-template-columns: 1fr 1fr !important;
        grid-template-rows: 1fr 1fr !important;
        gap: 20px !important;
        width: 100% !important;
        height: 100% !important;
    }
    
    .mosaic-item {
        display: flex !important;
        background: red !important; /* Para ver os containers */
        opacity: 1 !important;
    }
    
    .mosaic-image {
        width: 100% !important;
        height: 100% !important;
        object-fit: contain !important;
        border: 5px solid yellow !important; /* Para ver as imagens */
        opacity: 1 !important;
    }
    
    .mosaic-item.empty {
        display: flex !important; /* Mostrar até os vazios */
        background: blue !important;
    }
`;
document.head.appendChild(style);

// Forçar ativação
document.querySelector('.mosaic-slide').classList.add('active');
```

## 📊 Relatório para Mim

Após executar os comandos acima, me envie:

1. **Console logs** do carregamento do mosaico
2. **Resultado dos comandos** de verificação
3. **Screenshot** do DevTools mostrando os elementos
4. **Quais problemas** foram identificados

Com essas informações conseguirei identificar exatamente o que está errado! 🎯

---

**Última atualização**: 30/09/2025  
**Versão**: 1.0 - Debug detalhado

