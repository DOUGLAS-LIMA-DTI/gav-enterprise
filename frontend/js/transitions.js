/**
 * GAV-Hakuna - Transitions Module
 * Gerencia transições entre slides
 */

(function() {
    'use strict';

    const Transitions = {
        currentTransition: 'fade', // 'fade' ou 'slide'
        transitionDuration: 600, // milliseconds - transição mais suave

        /**
         * Configura o tipo de transição
         * @param {string} type - 'fade' ou 'slide'
         */
        setType(type) {
            if (['fade', 'slide'].includes(type)) {
                this.currentTransition = type;
                console.log(`🎬 Transição configurada: ${type}`);
            }
        },

        /**
         * Transição entre slides
         * @param {HTMLElement} currentSlide - Slide atual (a esconder)
         * @param {HTMLElement} nextSlide - Próximo slide (a mostrar)
         * @returns {Promise} Promise que resolve quando transição terminar
         */
        async transition(currentSlide, nextSlide) {
            if (!nextSlide) {
                console.warn('⚠️  Próximo slide não definido');
                return;
            }

            if (this.currentTransition === 'fade') {
                return this.fadeTransition(currentSlide, nextSlide);
            } else {
                return this.slideTransition(currentSlide, nextSlide);
            }
        },

        /**
         * Transição tipo Fade
         */
        async fadeTransition(currentSlide, nextSlide) {
            return new Promise((resolve) => {
                console.log('🎬 Iniciando fade transition', { currentSlide, nextSlide });
                
                // LIMPAR todos os estilos inline do próximo slide primeiro
                nextSlide.style.cssText = '';
                
                // Preparar próximo slide
                nextSlide.style.opacity = '0';
                nextSlide.style.visibility = 'visible';
                nextSlide.style.zIndex = '9';
                nextSlide.style.display = 'flex';
                
                // Forçar reflow
                nextSlide.offsetHeight;
                
                // Fade in do próximo
                nextSlide.classList.add('active');
                
                // Usar requestAnimationFrame para garantir que a transição ocorre
                requestAnimationFrame(() => {
                    nextSlide.style.opacity = '1';
                });
                
                // Fade out do atual (se existir)
                if (currentSlide) {
                    currentSlide.classList.remove('active');
                    currentSlide.style.opacity = '0';
                }
                
                console.log('✅ Next slide ativado', {
                    className: nextSlide.className,
                    id: nextSlide.id,
                    opacity: nextSlide.style.opacity,
                    visibility: nextSlide.style.visibility,
                    display: nextSlide.style.display
                });
                
                // Aguardar transição completar
                setTimeout(() => {
                    if (currentSlide) {
                        currentSlide.style.visibility = 'hidden';
                        currentSlide.style.zIndex = '1';
                    }
                    nextSlide.style.zIndex = '10';
                    
                    // NÃO remover os estilos - manter forçado para garantir visibilidade
                    nextSlide.style.opacity = '1';
                    nextSlide.style.visibility = 'visible';
                    nextSlide.style.display = 'flex';
                    
                    console.log('✅ Transition completa', {
                        nextSlideId: nextSlide.id,
                        hasActive: nextSlide.classList.contains('active'),
                        finalOpacity: nextSlide.style.opacity,
                        finalVisibility: nextSlide.style.visibility,
                        finalDisplay: nextSlide.style.display
                    });
                    resolve();
                }, this.transitionDuration);
            });
        },

        /**
         * Transição tipo Slide
         */
        async slideTransition(currentSlide, nextSlide) {
            return new Promise((resolve) => {
                // Preparar próximo slide (começa fora da tela à direita)
                nextSlide.style.transform = 'translateX(100%)';
                nextSlide.style.visibility = 'visible';
                nextSlide.style.opacity = '1';
                nextSlide.style.zIndex = '10';
                
                // Forçar reflow
                nextSlide.offsetHeight;
                
                // Adicionar classes de transição
                nextSlide.classList.add('transition-slide', 'active');
                
                if (currentSlide) {
                    currentSlide.classList.add('transition-slide');
                    
                    // Mover ambos
                    currentSlide.style.transform = 'translateX(-100%)';
                }
                
                nextSlide.style.transform = 'translateX(0)';
                
                // Aguardar transição completar
                setTimeout(() => {
                    if (currentSlide) {
                        currentSlide.classList.remove('active', 'transition-slide');
                        currentSlide.style.visibility = 'hidden';
                        currentSlide.style.transform = '';
                        currentSlide.style.zIndex = '1';
                    }
                    
                    nextSlide.classList.remove('transition-slide');
                    resolve();
                }, this.transitionDuration);
            });
        },

        /**
         * Crossfade entre duas imagens dentro do mesmo slide
         * @param {HTMLImageElement} oldImg - Imagem atual
         * @param {HTMLImageElement} newImg - Nova imagem
         */
        async crossfadeImages(oldImg, newImg) {
            return new Promise((resolve) => {
                newImg.style.opacity = '0';
                newImg.style.transition = `opacity ${this.transitionDuration}ms ease-in-out`;
                
                // Forçar reflow
                newImg.offsetHeight;
                
                // Fade
                oldImg.style.opacity = '0';
                newImg.style.opacity = '1';
                
                setTimeout(resolve, this.transitionDuration);
            });
        }
    };

    // Expor globalmente
    window.Transitions = Transitions;

})();
