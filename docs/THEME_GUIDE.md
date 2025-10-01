# 🎨 Guia do Sistema de Temas - GAV-Hakuna

## 📋 Visão Geral

O GAV-Hakuna agora possui um sistema de temas totalmente configurável baseado em CSS Variables (Custom Properties). A cor principal da empresa (#EB6508) está integrada em todo o design.

## 🎯 Características Principais

### ✨ Design Moderno
- **Glassmorphism**: Efeitos de vidro fosco com backdrop-filter
- **Brand Identity**: Cor corporativa #EB6508 integrada em todos os elementos
- **Animações Suaves**: Transições premium com efeitos de blur e glow
- **Responsivo**: Adapta-se perfeitamente a qualquer tamanho de tela

### 🖼️ Apresentação de Imagens
- **Frames Elegantes**: Bordas com a cor da marca e múltiplas sombras
- **Efeitos de Profundidade**: Sombras e glows que criam hierarquia visual
- **Animações de Entrada**: Transições suaves com blur e scale
- **Corner Accents**: Detalhes decorativos nos cantos dos slides

### 🎭 Efeitos Visuais
- **Glow Effect**: Brilho sutil com a cor da marca
- **3D Transforms**: Animações com perspectiva
- **Gradient Backgrounds**: Gradientes sutis da brand color
- **Backdrop Blur**: Efeitos de desfoque para glassmorphism

## 🔧 Configuração de Cores

### Alterar a Cor Principal

Para alterar a cor base da aplicação, edite o arquivo `frontend/css/theme.css`:

```css
:root {
    /* Cor base da empresa - CONFIGURE AQUI */
    --brand-primary: #EB6508;  /* Sua cor principal */
    --brand-primary-light: #FF7A1A;  /* Versão mais clara */
    --brand-primary-lighter: #FF9147;  /* Ainda mais clara */
    --brand-primary-dark: #C85407;  /* Versão mais escura */
    --brand-primary-darker: #A54606;  /* Ainda mais escura */
}
```

### Variações Automáticas

O sistema usa a cor principal para criar automaticamente:
- Gradientes vibrantes
- Efeitos de glow
- Bordas e sombras
- Estados hover e active
- Backgrounds sutis

## 🎨 Variáveis Disponíveis

### Cores Principais
```css
--brand-primary            /* Cor primária #EB6508 */
--brand-primary-light      /* Versão clara */
--brand-primary-dark       /* Versão escura */
--brand-gradient-main      /* Gradiente principal */
--brand-gradient-vibrant   /* Gradiente vibrante */
```

### Cores de Fundo
```css
--bg-primary              /* Fundo principal escuro */
--bg-secondary            /* Fundo secundário */
--bg-glass                /* Fundo com glassmorphism */
```

### Cores de Borda
```css
--border-primary          /* Borda com brand color */
--border-secondary        /* Borda com transparência */
--border-tertiary         /* Borda sutil */
```

### Espaçamentos
```css
--spacing-xs              /* 4px */
--spacing-sm              /* 8px */
--spacing-md              /* 16px */
--spacing-lg              /* 24px */
--spacing-xl              /* 32px */
```

### Border Radius
```css
--border-radius-sm        /* 8px */
--border-radius-md        /* 12px */
--border-radius-lg        /* 16px */
--border-radius-xl        /* 24px */
```

### Transições
```css
--transition-fast         /* 200ms */
--transition-base         /* 300ms */
--transition-slow         /* 500ms */
--transition-smooth       /* 600ms */
```

### Sombras
```css
--shadow-sm               /* Sombra pequena */
--shadow-md               /* Sombra média */
--shadow-lg               /* Sombra grande */
--shadow-brand            /* Sombra com glow da brand */
```

## 📱 Responsividade

O tema se adapta automaticamente em breakpoints:
- **Desktop**: 1920px+ (design completo)
- **Laptop**: 1280px - 1919px (ajustes médios)
- **Tablet**: 768px - 1279px (ajustes compactos)
- **Mobile**: < 768px (layout otimizado)

## 🎯 Classes Utilitárias

Use estas classes para aplicar estilos rapidamente:

```html
<!-- Gradiente da marca -->
<div class="brand-gradient">Conteúdo</div>

<!-- Texto com cor da marca -->
<span class="brand-text">Texto colorido</span>

<!-- Efeito glass -->
<div class="glass-effect">Conteúdo</div>

<!-- Elevações -->
<div class="elevation-low">Baixa</div>
<div class="elevation-medium">Média</div>
<div class="elevation-high">Alta</div>

<!-- Glow da marca -->
<div class="brand-glow">Com brilho</div>
<div class="brand-glow-strong">Brilho forte</div>
```

## 🎨 Exemplos de Customização

### Exemplo 1: Mudar para cor azul
```css
:root {
    --brand-primary: #0066CC;
    --brand-primary-light: #3399FF;
    --brand-primary-lighter: #66B3FF;
    --brand-primary-dark: #0052A3;
    --brand-primary-darker: #003D7A;
}
```

### Exemplo 2: Mudar para cor verde
```css
:root {
    --brand-primary: #00A86B;
    --brand-primary-light: #00D68F;
    --brand-primary-lighter: #7FFFD4;
    --brand-primary-dark: #008555;
    --brand-primary-darker: #006640;
}
```

### Exemplo 3: Ajustar intensidade das sombras
```css
:root {
    --shadow-brand: 0 0 30px rgba(235, 101, 8, 0.5);  /* Mais intenso */
    --shadow-brand-strong: 0 0 60px rgba(235, 101, 8, 0.7);  /* Muito intenso */
}
```

## 🔄 Arquitetura de Estilos

### Ordem de Carregamento
1. **theme.css** - Define todas as variáveis CSS
2. **styles.css** - Estilos base e layout
3. **header.css** - Cabeçalho
4. **carousel.css** - Carrossel fullscreen
5. **mosaic.css** - Grid mosaico 2x2
6. **borders.css** - Configurações de bordas

### Hierarquia de Prioridade
```
theme.css (variáveis base)
    ↓
styles.css (usa as variáveis)
    ↓
componentes específicos (herdam e podem sobrescrever)
    ↓
borders.css (ajustes finais)
```

## ✨ Novos Recursos Visuais

### 1. Header
- Barra de accent no topo com gradiente
- Logo com glow effect
- Relógio com gradiente animado
- Glassmorphism background

### 2. Imagens Fullscreen
- Corner accents decorativos
- Frame com brand color
- Múltiplas sombras para profundidade
- Animação premium de entrada

### 3. Mosaico 2x2
- Corner accent em cada item
- Animação staggered (em cascata)
- Hover effects pronunciados
- Perspective 3D

### 4. Loading & Errors
- Spinner com glow animado
- Containers com glassmorphism
- Animações de pulse

## 🚀 Performance

- **GPU Acceleration**: Uso de `transform: translateZ(0)`
- **Will-change**: Otimização de propriedades que serão animadas
- **Backdrop-filter**: Hardware accelerated quando disponível
- **CSS Variables**: Mudanças instantâneas de tema

## 📚 Referências de Design

O novo design foi inspirado em:
- Material Design 3.0 (Google)
- Fluent Design System (Microsoft)
- Modern glassmorphism trends
- Premium dashboard interfaces

## 🔍 Troubleshooting

### As cores não mudaram
- Certifique-se de que `theme.css` está sendo carregado primeiro
- Limpe o cache do navegador (Ctrl+Shift+R)
- Verifique o console por erros

### Efeitos de blur não funcionam
- Verifique se o navegador suporta `backdrop-filter`
- Alternativa: use background semi-transparente

### Animações lentas
- Reduza valores em `--transition-*`
- Desabilite `backdrop-filter` em dispositivos antigos

## 📝 Notas

- Todas as cores podem ser alteradas via CSS Variables
- O sistema é 100% responsivo
- Compatível com navegadores modernos (Chrome 88+, Firefox 94+, Safari 15.4+)
- Fallbacks incluídos para navegadores sem suporte

## 🎉 Próximos Passos

- [ ] Adicionar tema claro (light mode)
- [ ] Criar variações de tema pré-definidas
- [ ] Implementar seletor de tema via UI
- [ ] Adicionar mais animações personalizáveis
- [ ] Criar gerador de paleta automático

---

**Desenvolvido com ❤️ para GAV-Hakuna**

