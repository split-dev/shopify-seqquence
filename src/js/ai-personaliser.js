(() => {
    const isProductPage = window.location.pathname.includes('/product') && document.body.classList.contains('template-product');
    const isCartPage = window.location.pathname.includes('/cart');
    const REQUESTS_LIMIT = 270;
    const API_HOST = 'https://lime-filthy-duckling.cyclic.app';
    const queryPhotoKey = new URL(document.location).searchParams.get('key') || ''; 
    const productUrl = window.sessionStorage.getItem('currentCreatingProduct');
    const photosData = new Map();
    const cartNotification = document.querySelector('#cart-notification');
    const mainCartItems = document.querySelector('#main-cart-items');
    const productCards = document.querySelectorAll('.product-card-wrapper img[src*="mockup"]');
    const sleep = ms => new Promise(res => setTimeout(res, ms));
    const PHOTOS_API_NAMES = ['tShirtResult', 'tShirtBlackResult', 'imageStandard', 'imageFull'];
    let imageData;

    const trackGoogleError = (err) => {
        window.gtag && window.gtag('event', 'error', {
            'event_category': 'Replicate AI ERROR',
            'event_label': 'Images request error',
            'value': err
        });
    };

    const updateProductPreviewData = (imgData) => {
        imgData = imgData || imageData;

        const productPhotoMedia = document.querySelectorAll('.product-media-modal__content img, .product__media img');
        const productForm = document.querySelectorAll('.product-form Form');
        const selectedBlack = (document.querySelector('.product [name="Color"]:checked').value === 'Black');
        const tShirtPhoto = imgData.images[queryPhotoKey]?.tShirtResult;
        const tShirtBlackPhoto = imgData.images[queryPhotoKey]?.tShirtBlackResult;

        if (tShirtPhoto) {
            productPhotoMedia.forEach((img) => {
                img.removeAttribute('srcset');
                img.setAttribute('src', selectedBlack ? tShirtBlackPhoto || tShirtPhoto : tShirtPhoto);
            });
            productForm.forEach((frm) => {
                Object.keys(imgData.images[queryPhotoKey]).forEach((imageName) => {
                    const inp = document.createElement('input');

                    photosData.set(imageName, imgData.images[queryPhotoKey][imageName]);
                    inp.setAttribute('type', 'hidden');
                    inp.setAttribute('name', `properties[${imageName}]`);
                    inp.setAttribute('value', imgData.images[queryPhotoKey][imageName]);
                    
                    frm.prepend(inp);
                });
            });
        }
    };

    const updateCartNotificationPreview = () => {
        const notificationOptions = cartNotification.querySelectorAll('.product-option');
        const imageNotification = cartNotification.querySelector('.cart-notification-product__image img');
        const selectedBlack = (document.querySelector('.product [name="Color"]:checked').value === 'Black');
        const whiteTshirtPhoto = photosData.get('tShirtResult');
        const blackTshirtPhoto = photosData.get('tShirtBlackResult');

        notificationOptions.forEach((option) => {
            const optKey = option.querySelector('dt').textContent;

            if (photosData.get(optKey.replace(':', ''))) {
                option.classList.add('hidden');
            }
        });
        imageNotification.setAttribute('src', selectedBlack ? blackTshirtPhoto || whiteTshirtPhoto : whiteTshirtPhoto);
    };

    const updateCartView = () => {
        const cartItems = document.querySelectorAll('.cart-item');

        cartItems.forEach((cartItem) => {
            const options = cartItem.querySelectorAll('.product-option');
            const img = cartItem.querySelector('.cart-item__image');
            const itemPhotos = {};
            let blackTshirtSelected = false;
    
            options.forEach((option) => {
                if (!option.querySelector('dd')) return;

                const optKey = option.querySelector('dt').textContent.trim();
                const optVal = option.querySelector('dd').textContent.trim();
                const name = optKey.replace(':', '');

                if (name === 'Color') {
                    blackTshirtSelected = (optVal === 'Black');
                }

                if (PHOTOS_API_NAMES.indexOf(name) > -1) {
                    option.classList.add('hidden');
                    itemPhotos[name] = optVal;
                }
            });
            itemPhotos.tShirtResult && img.setAttribute('src', blackTshirtSelected ? itemPhotos.tShirtBlackResult || itemPhotos.tShirtResult : itemPhotos.tShirtResult);
        });
    };

    const getImages = async (key) => {
        let imagesResponse;
        let timeout = 1000;

        if (!key) return;

        for (let i = 0; i < REQUESTS_LIMIT; i += 1) {
            const imagesRequest = await fetch(`${API_HOST}/image?imageId=${key}`, {
                method: 'GET'
            });
    
            imagesResponse = await imagesRequest.json();
    
            if (imagesRequest.status !== 200) {
                console.error(imagesResponse);

                trackGoogleError(`Error images request ${JSON.stringify(imagesResponse)}`);
                
                return imagesResponse;
            }

            if (imagesResponse.length) {
                imageData = imagesResponse[0];
                if (imageData.images && imageData.images[key].imageFull) {
                    break;
                }
            }

            if (imageData.images[key].tShirtResult) {
                updateProductPreviewData(imageData);
            }

            console.log(`pending images...next ping in ${timeout/1000} seconds`);

            await sleep(timeout);
            timeout = 1000;
        }

        if (imagesResponse.length === 0) {
            trackGoogleError(`Can't get images. Probably DB connection error`);
        }

        updateProductPreviewData(imageData);

        return imageData;
    };

    const getRandomImages = async () => {
        const length = 10;
        const imagesRequest = await fetch(`${API_HOST}/last-images?length=${length}`, {
            method: 'GET'
        });
        

        const imagesResponse = await imagesRequest.json();

        if (imagesRequest.status !== 200) {
            console.error(imagesResponse);

            trackGoogleError(`Error images request ${JSON.stringify(imagesResponse)}`);
        }

        return imagesResponse;
    };

    const fillProductCards = async () => {
        const randomImages = await getRandomImages();

        productCards.forEach((card, i) => {
            const randomKey = Math.floor(Math.random() * i);
            const randomImagesArr = Object.values(randomImages[randomKey].images);
            const randomKeysArr = Object.keys(randomImages[randomKey].images);
            const links = card.closest('.product-card-wrapper').querySelectorAll('a');

            card.removeAttribute('srcset');
            card.setAttribute('src', randomImagesArr[0].tShirtResult);
            
            links.forEach((link) => {
                const href = link.getAttribute('href');

                link.setAttribute('href', `${href}?key=${randomKeysArr[0]}`);
            });
        })
    };

    if (isProductPage && queryPhotoKey) {        
        getImages(queryPhotoKey);

        if (productUrl) {
            const productInfo = document.querySelector('.product__info-wrapper');

            console.time('Creating real product');
            
            let iterations = 100;

            productInfo.classList.add('loading');

            const checkProductCreated = async () => {
                const response = await fetch(`${productUrl}.js`, {method: 'GET'});
    
                if (response.status === 200) {
                    const productData = await response.json();
    
                    if (productData.available && productData.images.length) {
                        console.timeEnd('Creating real product');
                        console.log('FINALLY got product!!! ', productData);

                        window.sessionStorage.removeItem('currentCreatingProduct');

                        productInfo.classList.remove('loading');
                        document.location.href = productData.url;
                    } else {
                        if (iterations > 0) {
                            setTimeout(checkProductCreated, 1000);
                        } else {
                            console.error('PRINTIFY BUG: Product creation timed out');
                        }   
                    }
                } else {
                    if (iterations > 0) {
                        setTimeout(checkProductCreated, 1000);
                    } else {
                        console.error('PRINTIFY BUG: Product creation timed out');
                    }
                }
            };
    
            checkProductCreated();
        } else {
            if (cartNotification) {
                const config = { attributes: true, childList: true, subtree: true };
                const obs = new MutationObserver((mutationList, observer) => {
                    for (const mutation of mutationList) {
                      if (mutation.type === 'childList') {
                        updateCartNotificationPreview();
                      }
                    }
                });
    
                obs.observe(cartNotification, config);
            }
            
            document.querySelectorAll('[data-url]').forEach((dUrl) => {
                const url = new URL(document.location);
                const keySearch = url.searchParams.get('key');
        
                dUrl.setAttribute('data-url', `${url.pathname}?key=${keySearch}`);
            });
    
            const selectColor = document.querySelectorAll('.product [name="Color"]');
    
            selectColor.forEach((select) => {
                select.addEventListener('change', () => {
                    console.log(select.value);
                    updateProductPreviewData();
                });
            });
        }
    }
    if (isCartPage) {
        if (mainCartItems) {
            const config = { attributes: true, childList: true, subtree: true };
            const obsCart = new MutationObserver((mutationList, observer) => {
                for (const mutation of mutationList) {
                  if (mutation.type === 'childList') {
                    updateCartView();
                  }
                }
            });

            obsCart.observe(mainCartItems, config);
        }

        updateCartView();
    }

    if (productCards) {
        /** need to fill product previews */
        fillProductCards();
    }
})();