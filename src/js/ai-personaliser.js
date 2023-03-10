(() => {
    const isProductPage = window.location.pathname.includes('/product') && document.body.classList.contains('template-product');
    const isCartPage = window.location.pathname.includes('/cart');
    const REQUESTS_LIMIT = 270;
    const API_HOST = 'https://lime-filthy-duckling.cyclic.app';
    const queryPhotoKey = new URL(document.location).searchParams.get('key') || '';
    const photosData = new Map();
    const LS_QUEUE_PRINTIFY_PRODUCTS = 'currentCreatingProduct';
    const cartNotification = document.querySelector('#cart-notification');
    const mainCartItems = document.querySelector('#main-cart-items');
    const productCards = document.querySelectorAll('.product-card-wrapper img[src*="mockup"]');
    const sleep = ms => new Promise(res => setTimeout(res, ms));
    const PHOTOS_API_NAMES = ['generatedImg', 'imageFull'];
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

        const productPhotoMedia = document.querySelectorAll('.product__modal-opener--image');
        const productForm = document.querySelectorAll('.product-form Form');
        const tShirtPhoto = imgData.images[queryPhotoKey]?.generatedImg;
        const productInfo = document.querySelector('.product__info-wrapper');

        if (tShirtPhoto) {
            productInfo.classList.remove('loading');

            productPhotoMedia.forEach((img) => {
                const previewImg = document.createElement('img');
                previewImg.className = 'preview-image';
                previewImg.src = tShirtPhoto;

                img.parentNode.insertBefore(previewImg, img);
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
        const imageNotification = cartNotification.querySelector('.cart-notification-product__image');
        const tshirtPhoto = photosData.get('generatedImg');

        notificationOptions.forEach((option) => {
            const optKey = option.querySelector('dt').textContent;

            if (photosData.get(optKey.replace(':', ''))) {
                option.classList.add('hidden');
            }
        });
        const previewImg = document.createElement('img');
        
        previewImg.className = 'preview-image';
        previewImg.src = tshirtPhoto;
        imageNotification.parentNode.insertBefore(previewImg, imageNotification);
    };

    const updateCartView = () => {
        const cartItems = document.querySelectorAll('.cart-item');

        cartItems.forEach((cartItem) => {
            const options = cartItem.querySelectorAll('.product-option');
            const img = cartItem.querySelector('.cart-item__image');
            const itemPhotos = {};
    
            options.forEach((option) => {
                if (!option.querySelector('dd')) return;

                const optKey = option.querySelector('dt').textContent.trim();
                const optVal = option.querySelector('dd').textContent.trim();
                const name = optKey.replace(':', '');

                if (PHOTOS_API_NAMES.indexOf(name) > -1) {
                    option.classList.add('hidden');
                    itemPhotos[name] = optVal;
                }
            });
            if (itemPhotos.generatedImg) {
                const previewImg = document.createElement('img');
                
                previewImg.src = itemPhotos.generatedImg;
                previewImg.className = 'preview-image';

                img.parentNode.insertBefore(previewImg, img);
            }
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
                
                if (imageData.images) {
                    break;
                }
            }

            if (imageData.images[key].generatedImg) {
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

    if (isProductPage && queryPhotoKey) {        
        getImages(queryPhotoKey);

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

    let iterations = 300;

    let queuePrintifyProducts = JSON.parse(localStorage.getItem(LS_QUEUE_PRINTIFY_PRODUCTS) || '{}');
    let pendingProducts = Object.keys(queuePrintifyProducts).filter((url) => !queuePrintifyProducts[url]);

    const checkProductCreated = async (productUrl) => {
        const response = await fetch(`${productUrl}.js`, {method: 'GET'});

        if (response.status === 200) {
            const productData = await response.json();

            if (productData.available) {
                console.log('FINALLY got product!!! ', productData);

                queuePrintifyProducts = JSON.parse(localStorage.getItem(LS_QUEUE_PRINTIFY_PRODUCTS) || '{}');
                queuePrintifyProducts[productUrl] = true;
                newWindow.localStorage.setItem(LS_QUEUE_PRINTIFY_PRODUCTS, JSON.stringify(queuePrintifyProducts));
            } else {
                if (iterations > 0) {
                    setTimeout(() => checkProductCreated(productUrl), 1000);
                } else {
                    console.error('PRINTIFY BUG: Product creation timed out');
                }   
            }
        } else {
            if (iterations > 0) {
                setTimeout(() => checkProductCreated(productUrl), 1000);
            } else {
                console.error('PRINTIFY BUG: Product creation timed out');
            }
        }
    };

    if (pendingProducts.length) {
        pendingProducts.forEach((url) => {
            checkProductCreated(url);
        });
    }
})();