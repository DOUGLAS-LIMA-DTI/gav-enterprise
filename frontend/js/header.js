/**
 * GAV-Hakuna - Header Module
 * Gerencia o cabeçalho com logo
 */

(function() {
    'use strict';

    /**
     * Inicializa o cabeçalho
     */
    function initHeader() {
        console.log('🎨 Inicializando cabeçalho...');
        
        // Verificar se logo existe
        checkLogo();
    }

    /**
     * Verifica se a logo foi carregada corretamente
     */
    function checkLogo() {
        const logoEl = document.getElementById('headerLogo');
        
        if (!logoEl) {
            console.warn('⚠️  Elemento de logo não encontrado');
            return;
        }
        
        logoEl.addEventListener('error', function() {
            console.warn('⚠️  Erro ao carregar logo, usando fallback');
            // Você pode usar uma logo padrão ou texto como fallback
            this.style.display = 'none';
            
            // Criar texto alternativo
            const fallbackText = document.createElement('div');
            fallbackText.textContent = 'HAKUNA';
            fallbackText.style.cssText = `
                font-size: 32px;
                font-weight: 700;
                color: #4CAF50;
                letter-spacing: 2px;
            `;
            this.parentNode.insertBefore(fallbackText, this);
        });
        
        logoEl.addEventListener('load', function() {
            console.log('✅ Logo carregada com sucesso');
        });
    }

    // Expor função de inicialização globalmente
    window.initHeader = initHeader;

})();
