/**
 * GAV-Hakuna - Main Entry Point
 * Inicializa a aplicação e gerencia o ciclo de vida
 */

(function() {
    'use strict';

    // Configuração global
    window.GAVConfig = {
        refreshInterval: 600000, // 10 minutos padrão
        retryDelay: 5000, // 5 segundos
        maxRetries: 3
    };

    // Estado da aplicação
    window.GAVState = {
        isInitialized: false,
        playlist: null,
        currentIndex: 0,
        isPlaying: false,
        retryCount: 0
    };

    /**
     * Inicializa a aplicação
     */
    async function init() {
        console.log('🚀 Inicializando GAV-Hakuna...');
        
        try {
            // Mostrar loading
            showLoading();
            
            // Inicializar módulos
            initHeader();
            
            // Carregar configuração
            await loadConfig();
            
            // Carregar playlist
            await loadPlaylist();
            
            // Inicializar carrossel
            initCarousel();
            
            // Configurar sincronização automática
            setupAutoRefresh();
            
            // Esconder loading
            hideLoading();
            
            // Iniciar reprodução
            startPlayback();
            
            window.GAVState.isInitialized = true;
            console.log('✅ GAV-Hakuna inicializado com sucesso!');
            
        } catch (error) {
            console.error('❌ Erro ao inicializar:', error);
            handleInitError(error);
        }
    }

    /**
     * Carrega a configuração
     */
    async function loadConfig() {
        try {
            const config = await PlaylistLoader.loadConfig();
            
            // Atualizar intervalo de refresh se definido
            if (config.sync && config.sync.syncInterval) {
                window.GAVConfig.refreshInterval = config.sync.syncInterval;
                console.log(`⏱️  Intervalo de refresh: ${config.sync.syncInterval / 1000}s`);
            }
            
        } catch (error) {
            console.warn('⚠️  Usando configuração padrão');
        }
    }

    /**
     * Carrega a playlist do arquivo JSON
     */
    async function loadPlaylist() {
        try {
            const playlist = await PlaylistLoader.loadPlaylist();
            
            if (!playlist || !playlist.items || playlist.items.length === 0) {
                throw new Error('Playlist vazia ou inválida');
            }
            
            window.GAVState.playlist = playlist;
            window.GAVState.retryCount = 0;
            
            console.log(`📋 Playlist carregada: ${playlist.items.length} itens`);
            
        } catch (error) {
            throw new Error(`Falha ao carregar playlist: ${error.message}`);
        }
    }

    /**
     * Configura refresh automático
     */
    function setupAutoRefresh() {
        console.log(`⏰ Refresh automático configurado: a cada ${window.GAVConfig.refreshInterval / 1000}s`);
        
        setInterval(async () => {
            console.log('🔄 Recarregando playlist...');
            try {
                const oldPlaylist = window.GAVState.playlist;
                await loadPlaylist();
                
                if (playlistChanged(oldPlaylist, window.GAVState.playlist)) {
                    console.log('🔄 Playlist mudou! Reiniciando carrossel...');
                    Carousel.stop();
                    Carousel.start(window.GAVState.playlist);
                } else {
                    console.log('✅ Playlist atualizada (sem mudanças)');
                }
            } catch (error) {
                console.warn('⚠️  Erro ao atualizar playlist:', error);
            }
        }, window.GAVConfig.refreshInterval);
    }

    /**
     * Verifica se a playlist mudou
     * @param {Object} oldPlaylist - Playlist anterior
     * @param {Object} newPlaylist - Playlist nova
     * @returns {boolean}
     */
    function playlistChanged(oldPlaylist, newPlaylist) {
        if (!oldPlaylist || !newPlaylist) return true;
        if (oldPlaylist.totalItems !== newPlaylist.totalItems) return true;
        if (oldPlaylist.estimatedDuration !== newPlaylist.estimatedDuration) return true;
        
        // Comparar IDs dos items
        if (oldPlaylist.items.length !== newPlaylist.items.length) return true;
        
        for (let i = 0; i < oldPlaylist.items.length; i++) {
            if (oldPlaylist.items[i].id !== newPlaylist.items[i].id) return true;
        }
        
        return false;
    }

    /**
     * Inicia reprodução do carrossel
     */
    function startPlayback() {
        if (!window.GAVState.playlist) {
            console.error('Não é possível iniciar: playlist não carregada');
            return;
        }
        
        console.log('🎬 Iniciando reprodução do carrossel...');
        console.log('📋 Playlist:', window.GAVState.playlist);
        
        window.GAVState.isPlaying = true;
        Carousel.start(window.GAVState.playlist);
        
        console.log('✅ Carrossel iniciado!');
    }

    /**
     * Tratamento de erro na inicialização
     */
    function handleInitError(error) {
        hideLoading();
        showError(error.message);
        
        // Tentar reconectar
        if (window.GAVState.retryCount < window.GAVConfig.maxRetries) {
            window.GAVState.retryCount++;
            console.log(`🔄 Tentativa ${window.GAVState.retryCount}/${window.GAVConfig.maxRetries}...`);
            
            setTimeout(() => {
                init();
            }, window.GAVConfig.retryDelay);
        } else {
            console.error('❌ Número máximo de tentativas excedido');
        }
    }

    /**
     * Helpers de UI
     */
    function showLoading() {
        const loading = document.getElementById('loading');
        if (loading) loading.classList.remove('hidden');
    }

    function hideLoading() {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.classList.add('hidden');
            loading.style.display = 'none';
        }
    }

    function showError(message) {
        const errorEl = document.getElementById('errorMessage');
        if (errorEl) {
            errorEl.querySelector('p').textContent = message;
            errorEl.classList.add('show');
        }
    }

    function hideError() {
        const errorEl = document.getElementById('errorMessage');
        if (errorEl) errorEl.classList.remove('show');
    }

    // Inicializar quando DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expor funções globalmente se necessário
    window.GAV = {
        reload: init,
        pause: () => { window.GAVState.isPlaying = false; },
        resume: () => { window.GAVState.isPlaying = true; startPlayback(); }
    };

})();
