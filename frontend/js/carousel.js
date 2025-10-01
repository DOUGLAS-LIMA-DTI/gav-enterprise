/**
 * GAV-Hakuna - Carousel Module
 * Gerencia a lógica principal do carrossel
 */

(function() {
    'use strict';

    const Carousel = {
        playlist: null,
        currentIndex: 0,
        isPlaying: false,
        currentTimer: null,
        fullscreenSlide: null,
        mosaicSlide: null,

        /**
         * Inicializa o carrossel
         */
        init() {
            this.fullscreenSlide = document.getElementById('fullscreenSlide');
            this.mosaicSlide = document.getElementById('mosaicSlide');
            
            if (!this.fullscreenSlide || !this.mosaicSlide) {
                throw new Error('Elementos de slide não encontrados');
            }
            
            console.log('🎠 Carrossel inicializado');
        },

        /**
         * Inicia a reprodução da playlist
         * @param {Object} playlist - Playlist do backend
         */
        start(playlist) {
            if (!playlist || !playlist.items || playlist.items.length === 0) {
                console.error('❌ Playlist inválida');
                return;
            }

            this.playlist = playlist;
            this.currentIndex = 0;
            this.isPlaying = true;

            console.log(`▶️  Iniciando carrossel com ${playlist.items.length} itens`);
            
            // Inicializar módulos
            this.init();
            
            // Pré-carregar primeiras imagens
            this.preloadNextImages();
            
            // Exibir primeiro item
            this.showItem(0);
        },

        /**
         * Para a reprodução
         */
        stop() {
            this.isPlaying = false;
            if (this.currentTimer) {
                clearTimeout(this.currentTimer);
                this.currentTimer = null;
            }
            console.log('⏸️  Carrossel pausado');
        },

        /**
         * Exibe um item específico da playlist
         * @param {number} index - Índice do item
         */
        async showItem(index) {
            if (!this.isPlaying) return;

            const item = this.playlist.items[index];
            
            if (!item) {
                console.warn(`⚠️  Item ${index} não encontrado, reiniciando playlist`);
                this.currentIndex = 0;
                this.showItem(0);
                return;
            }

            console.log(`📺 Exibindo item ${index + 1}/${this.playlist.items.length} (${item.type})`);

            try {
                // Determinar slide correto
                const currentSlide = this.getCurrentVisibleSlide();
                let nextSlide;

                if (item.type === 'fullscreen') {
                    nextSlide = this.fullscreenSlide;
                    await this.renderFullscreen(item);
                } else if (item.type === 'mosaic') {
                    nextSlide = this.mosaicSlide;
                    await this.renderMosaic(item);
                }

                // Transição entre slides
                if (currentSlide !== nextSlide) {
                    await Transitions.transition(currentSlide, nextSlide);
                } else if (!currentSlide) {
                    // Primeiro item - ativar diretamente
                    console.log('🎬 Ativando primeiro slide');
                    nextSlide.classList.add('active');
                }

                // Agendar próximo item
                const duration = item.duration || 10000;
                this.currentTimer = setTimeout(() => {
                    this.next();
                }, duration);

            } catch (error) {
                console.error(`❌ Erro ao exibir item ${index}:`, error);
                // Tentar próximo item
                this.next();
            }
        },

        /**
         * Renderiza slide fullscreen
         * @param {Object} item - Item da playlist
         */
        async renderFullscreen(item) {
            const imgElement = this.fullscreenSlide.querySelector('.carousel-image');
            
            if (!imgElement) {
                throw new Error('Elemento de imagem fullscreen não encontrado');
            }

            if (item.images && item.images.length > 0) {
                const imageUrl = item.images[0].url;
                
                console.log(`🖼️  Carregando imagem fullscreen: ${imageUrl}`);
                
                // Adicionar classe de loading
                imgElement.classList.add('loading');
                
                // Carregar imagem
                await PlaylistLoader.preloadImage(imageUrl);
                
                // Atualizar src
                imgElement.src = imageUrl;
                imgElement.alt = item.images[0].name || 'Imagem';
                
                console.log(`✅ Imagem carregada: ${imgElement.src}`);
                
                // Remover loading
                imgElement.classList.remove('loading');
            }
        },

        /**
         * Renderiza slide mosaico
         * @param {Object} item - Item da playlist
         */
        async renderMosaic(item) {
            console.log('🎨 CAROUSEL: renderMosaic chamado', {
                item,
                mosaicSlide: this.mosaicSlide,
                images: item.images,
                imagesCount: item.images?.length
            });
            
            if (!item.images || item.images.length === 0) {
                console.error('❌ CAROUSEL: Nenhuma imagem no item mosaico!');
                return;
            }
            
            await Mosaic.render(this.mosaicSlide, item.images);
            
            console.log('✅ CAROUSEL: Mosaico renderizado');
            
            // DEBUG: Verificar estado do slide após renderizar
            const computedStyles = window.getComputedStyle(this.mosaicSlide);
            console.log('🔍 Estado do mosaicSlide após render:', {
                hasActiveClass: this.mosaicSlide.classList.contains('active'),
                display: computedStyles.display,
                opacity: computedStyles.opacity,
                visibility: computedStyles.visibility,
                zIndex: computedStyles.zIndex
            });
        },

        /**
         * Avança para o próximo item
         */
        next() {
            if (!this.isPlaying) return;

            this.currentIndex++;
            
            if (this.currentIndex >= this.playlist.items.length) {
                console.log('🔄 Fim da playlist, reiniciando...');
                
                // Apenas reiniciar playlist (sincronização roda em loop no backend)
                this.currentIndex = 0;
            }

            this.showItem(this.currentIndex);
        },

        /**
         * Volta para o item anterior
         */
        previous() {
            if (!this.isPlaying) return;

            this.currentIndex--;
            
            if (this.currentIndex < 0) {
                this.currentIndex = this.playlist.items.length - 1;
            }

            this.showItem(this.currentIndex);
        },

        /**
         * Pega o slide atualmente visível
         * @returns {HTMLElement|null} Slide ativo
         */
        getCurrentVisibleSlide() {
            if (this.fullscreenSlide && this.fullscreenSlide.classList.contains('active')) {
                return this.fullscreenSlide;
            }
            if (this.mosaicSlide && this.mosaicSlide.classList.contains('active')) {
                return this.mosaicSlide;
            }
            return null;
        },

        /**
         * Pré-carrega as próximas 3 imagens
         */
        async preloadNextImages() {
            try {
                const imagesToPreload = [];
                
                for (let i = 1; i <= 3; i++) {
                    const nextIndex = (this.currentIndex + i) % this.playlist.items.length;
                    const item = this.playlist.items[nextIndex];
                    
                    if (item && item.images) {
                        item.images.forEach(img => {
                            if (img.url) imagesToPreload.push(img.url);
                        });
                    }
                }
                
                if (imagesToPreload.length > 0) {
                    await PlaylistLoader.preloadImages(imagesToPreload);
                }
                
            } catch (error) {
                console.warn('⚠️  Erro ao pré-carregar imagens:', error);
            }
        }
    };

    // Expor globalmente
    window.Carousel = Carousel;

    // Inicializar módulo de carrossel
    window.initCarousel = function() {
        try {
            Carousel.init();
            console.log('✅ Módulo de carrossel pronto');
        } catch (error) {
            console.error('❌ Erro ao inicializar carrossel:', error);
            throw error;
        }
    };

})();
