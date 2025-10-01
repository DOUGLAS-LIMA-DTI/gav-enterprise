/**
 * GAV-Hakuna - Mosaic Module
 * Gerencia a exibição em mosaico 2x2
 */

(function() {
    'use strict';

    const Mosaic = {
        /**
         * Renderiza mosaico 2x2
         * @param {HTMLElement} mosaicSlide - Elemento do slide mosaico
         * @param {Array} images - Array de imagens (até 4)
         */
        async render(mosaicSlide, images) {
            console.log('🎨 Mosaic.render() chamado', { mosaicSlide, images });
            
            if (!mosaicSlide) {
                console.error('❌ Elemento de mosaico não encontrado');
                throw new Error('Elemento de mosaico não encontrado');
            }

            if (!images || images.length === 0) {
                console.error('❌ Nenhuma imagem fornecida para o mosaico');
                throw new Error('Nenhuma imagem fornecida para o mosaico');
            }

            const grid = mosaicSlide.querySelector('.mosaic-grid');
            const items = grid.querySelectorAll('.mosaic-item');
            
            console.log(`📊 Grid encontrado:`, grid);
            console.log(`📊 Items encontrados: ${items.length}`);
            
            // Debug: verificar estilos computados do mosaicSlide
            const slideStyles = window.getComputedStyle(mosaicSlide);
            console.log('🔍 Estilos do mosaicSlide:', {
                display: slideStyles.display,
                opacity: slideStyles.opacity,
                visibility: slideStyles.visibility,
                zIndex: slideStyles.zIndex
            });

            // Limpar classes especiais
            grid.classList.remove('single', 'two-items', 'three-items');

            // Aplicar classe baseada no número de imagens
            if (images.length === 1) {
                grid.classList.add('single');
            } else if (images.length === 2) {
                grid.classList.add('two-items');
            } else if (images.length === 3) {
                grid.classList.add('three-items');
            }

            // Pré-carregar todas as imagens do mosaico
            const imageUrls = images.slice(0, 4).map(img => img.url);
            await PlaylistLoader.preloadImages(imageUrls);

            // Atualizar cada item do mosaico
            items.forEach((item, index) => {
                const imgElement = item.querySelector('.mosaic-image');
                
                console.log(`🖼️  Item ${index}:`, {
                    item,
                    imgElement,
                    hasImage: index < images.length && images[index],
                    imageData: images[index]
                });
                
                if (index < images.length && images[index]) {
                    // Mostrar item com imagem
                    item.classList.remove('empty');
                    
                    // Forçar visibilidade do item
                    item.style.display = 'flex';
                    item.style.opacity = '1';
                    item.style.visibility = 'visible';
                    
                    imgElement.classList.add('loading');
                    imgElement.src = images[index].url;
                    imgElement.alt = images[index].name || `Squad ${index + 1}`;
                    
                    console.log(`✅ Imagem ${index} configurada: ${images[index].url}`);
                    
                    // Remover loading quando carregar
                    imgElement.onload = () => {
                        console.log(`✅ Imagem ${index} carregada com sucesso`, {
                            naturalWidth: imgElement.naturalWidth,
                            naturalHeight: imgElement.naturalHeight,
                            complete: imgElement.complete
                        });
                        imgElement.classList.remove('loading');
                        
                        // Debug: verificar estilos da imagem carregada
                        const imgStyles = window.getComputedStyle(imgElement);
                        console.log(`🔍 Estilos da imagem ${index}:`, {
                            display: imgStyles.display,
                            opacity: imgStyles.opacity,
                            visibility: imgStyles.visibility,
                            width: imgStyles.width,
                            height: imgStyles.height
                        });
                    };
                    
                    imgElement.onerror = () => {
                        console.error(`❌ Erro ao carregar imagem ${index}: ${images[index].url}`);
                    };
                } else {
                    // Esconder item vazio
                    item.classList.add('empty');
                    imgElement.src = '';
                    imgElement.alt = '';
                    console.log(`⏭️  Item ${index} está vazio`);
                }
            });

            console.log(`✅ Mosaico renderizado com ${images.length} imagens`);
            
            // Verificação final de sanidade
            setTimeout(() => {
                const visibleItems = Array.from(items).filter(item => !item.classList.contains('empty'));
                console.log(`🔍 Verificação final: ${visibleItems.length} items visíveis de ${images.length} imagens`);
                
                visibleItems.forEach((item, idx) => {
                    const itemStyles = window.getComputedStyle(item);
                    const img = item.querySelector('.mosaic-image');
                    const imgStyles = window.getComputedStyle(img);
                    
                    console.log(`🔍 Item ${idx} final:`, {
                        itemDisplay: itemStyles.display,
                        itemOpacity: itemStyles.opacity,
                        imgSrc: img.src,
                        imgDisplay: imgStyles.display,
                        imgOpacity: imgStyles.opacity,
                        imgWidth: imgStyles.width,
                        imgHeight: imgStyles.height
                    });
                });
            }, 100);
        },

        /**
         * Divide um array de imagens em grupos de 4 (para slides múltiplos)
         * @param {Array} images - Array de imagens
         * @returns {Array} Array de grupos de até 4 imagens
         */
        splitIntoGroups(images) {
            const groups = [];
            const groupSize = 4;

            for (let i = 0; i < images.length; i += groupSize) {
                groups.push(images.slice(i, i + groupSize));
            }

            return groups;
        },

        /**
         * Calcula layout otimizado baseado no número de imagens
         * @param {number} count - Número de imagens
         * @returns {Object} Configuração de layout
         */
        calculateLayout(count) {
            const layouts = {
                1: { rows: 1, cols: 1, class: 'single' },
                2: { rows: 1, cols: 2, class: 'two-items' },
                3: { rows: 2, cols: 2, class: 'three-items' },
                4: { rows: 2, cols: 2, class: 'four-items' }
            };

            return layouts[Math.min(count, 4)] || layouts[4];
        }
    };

    // Expor globalmente
    window.Mosaic = Mosaic;

})();
