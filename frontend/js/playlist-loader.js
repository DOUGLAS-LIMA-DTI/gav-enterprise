/**
 * GAV-Hakuna - Playlist Loader
 * Carrega playlist e configurações do arquivo JSON local
 */

(function() {
    'use strict';

    const PlaylistLoader = {
        config: null,
        playlist: null,

        /**
         * Carrega a configuração do arquivo config.json
         * @returns {Promise<Object>} Configurações
         */
        async loadConfig() {
            try {
                const response = await fetch('./config.json?t=' + Date.now());
                
                if (!response.ok) {
                    throw new Error(`Erro ao carregar config.json: ${response.status}`);
                }
                
                this.config = await response.json();
                console.log('✅ Configuração carregada:', this.config);
                
                return this.config;
                
            } catch (error) {
                console.error('❌ Erro ao carregar configuração:', error);
                
                // Configurações padrão em caso de erro
                this.config = {
                    carousel: {
                        intervalFullscreen: 10000,
                        intervalMosaic: 15000,
                        transition: 'fade'
                    },
                    sync: {
                        syncInterval: 600000
                    }
                };
                
                return this.config;
            }
        },

        /**
         * Carrega a playlist do arquivo playlist.json
         * @returns {Promise<Object>} Playlist com itens ordenados
         */
        async loadPlaylist() {
            try {
                // Adicionar timestamp para evitar cache
                const response = await fetch('./playlist.json?t=' + Date.now());
                
                if (!response.ok) {
                    throw new Error(`Erro ao carregar playlist.json: ${response.status}`);
                }
                
                this.playlist = await response.json();
                
                console.log(`✅ Playlist carregada: ${this.playlist.totalItems} itens`);
                console.log(`⏱️  Duração estimada: ${this.playlist.estimatedDuration}ms`);
                
                return this.playlist;
                
            } catch (error) {
                console.error('❌ Erro ao carregar playlist:', error);
                throw error;
            }
        },

        /**
         * Recarrega a playlist (útil para sincronização)
         * @returns {Promise<Object>} Nova playlist
         */
        async reloadPlaylist() {
            console.log('🔄 Recarregando playlist...');
            return await this.loadPlaylist();
        },

        /**
         * Pré-carrega uma imagem
         * @param {string} imageUrl - URL da imagem
         * @returns {Promise<HTMLImageElement>} Imagem carregada
         */
        preloadImage(imageUrl) {
            return new Promise((resolve, reject) => {
                const img = new Image();
                
                img.onload = () => {
                    console.log(`✅ Imagem pré-carregada: ${imageUrl}`);
                    resolve(img);
                };
                
                img.onerror = () => {
                    console.error(`❌ Erro ao pré-carregar: ${imageUrl}`);
                    reject(new Error(`Falha ao carregar imagem: ${imageUrl}`));
                };
                
                img.src = imageUrl;
            });
        },

        /**
         * Pré-carrega múltiplas imagens em paralelo
         * @param {string[]} imageUrls - Array de URLs
         * @returns {Promise<HTMLImageElement[]>} Array de imagens carregadas
         */
        async preloadImages(imageUrls) {
            try {
                const promises = imageUrls.map(url => this.preloadImage(url));
                const images = await Promise.allSettled(promises);
                
                const loaded = images.filter(result => result.status === 'fulfilled');
                console.log(`✅ ${loaded.length}/${imageUrls.length} imagens pré-carregadas`);
                
                return loaded.map(result => result.value);
                
            } catch (error) {
                console.error('❌ Erro ao pré-carregar imagens:', error);
                throw error;
            }
        }
    };

    // Expor globalmente
    window.PlaylistLoader = PlaylistLoader;

})();

