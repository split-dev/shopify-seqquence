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
    const sleep = ms => new Promise(res => setTimeout(res, ms));
    const PHOTOS_API_NAMES = ['generatedImg', 'imageFull'];
    let imageData;

    let queuePrintifyProducts = JSON.parse(localStorage.getItem(LS_QUEUE_PRINTIFY_PRODUCTS) || '{}');
    let pendingProducts = Object.keys(queuePrintifyProducts).filter((url) => !queuePrintifyProducts[url]);

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
        const productPhotoGalleryModal = document.querySelectorAll('.product-media-modal__dialog img');
        const tShirtPhoto = imgData.images[queryPhotoKey]?.generatedImg;
        
        if (tShirtPhoto) {
            productPhotoMedia.forEach((img) => {
                const previewImg = document.createElement('img');
                previewImg.className = 'preview-image';
                previewImg.src = tShirtPhoto;

                img.parentNode.insertBefore(previewImg, img);
            });
            productPhotoGalleryModal.forEach((img) => {
                const previewImg = document.createElement('img');
                previewImg.className = 'preview-image';
                previewImg.src = tShirtPhoto;

                img.parentNode.insertBefore(previewImg, img);
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
            const img = cartItem.querySelector('.cart-item__image');
            const itemPhotos = {};
    
            if (itemPhotos.generatedImg) {
                const previewImg = document.createElement('img');
                
                previewImg.src = itemPhotos.generatedImg;
                previewImg.className = 'preview-image';

                img.parentNode.insertBefore(previewImg, img);
            }
        });
    };

    const updateUrlsData = () => {
        document.querySelectorAll('[data-url]').forEach((dUrl) => {
            const url = new URL(document.location);
            const keySearch = url.searchParams.get('key');
    
            dUrl.setAttribute('data-url', `${url.pathname}?key=${keySearch}`);
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

        const productInfo = document.querySelector('.product__info-wrapper');
        const variantRadios = document.querySelector('variant-radios');
        productInfo.classList.add('loading');
        
        const productPrintifyInfo = JSON.parse(window.sessionStorage.getItem(queryPhotoKey) || '{}');
        const productForm = document.querySelectorAll('.product-form Form');

        let waitIterations = 200;

        const shopifyProductWaiter = (url) => {
            queuePrintifyProducts = JSON.parse(localStorage.getItem(LS_QUEUE_PRINTIFY_PRODUCTS) || '{}');
            if (queuePrintifyProducts[url]) {
                productInfo.classList.remove('loading');

                console.log('Loaded product:', queuePrintifyProducts[url]);

                const variants = queuePrintifyProducts[url].variants;

                variantRadios.variantData = variants; 
                variantRadios.querySelector('[type="application/json"]').textContent = JSON.stringify(variants, null, 2);

                variantRadios.updateOptions();
                variantRadios.updateMasterId();
                variantRadios.updateVariantInput();
                updateUrlsData();
                variantRadios.updateURL();
                updateUrlsData();
            } else {
                setTimeout(() => shopifyProductWaiter(url), 1000);
                waitIterations = waitIterations - 1;
            }
        }

        if (Object.keys(productPrintifyInfo).length) {
            const productUrl = `/products/${productPrintifyInfo.title.toLowerCase().replace(/[^a-z|0-9]+/img, '-')}`;

            shopifyProductWaiter(productUrl);
        }
        
        updateUrlsData();
    }

    let iterations = 300;

    const checkProductCreated = async (productUrl) => {
        const response = await fetch(`${productUrl}.js`, {method: 'GET'});

        if (response.status === 200) {
            const productData = await response.json();

            if (productData.available) {
                console.log('FINALLY got product!!! ', productData);

                queuePrintifyProducts = JSON.parse(localStorage.getItem(LS_QUEUE_PRINTIFY_PRODUCTS) || '{}');
                queuePrintifyProducts[productUrl] = productData;
                if (productData.images.length) {
                    console.log('GOT IMAGES!');
                } else {
                    if (iterations > 0) {
                        setTimeout(() => checkProductCreated(productUrl), 1000);
                    } else {
                        console.error('SHOPIFY BUG: Product creation timed out');
                    }  
                }
                window.localStorage.setItem(LS_QUEUE_PRINTIFY_PRODUCTS, JSON.stringify(queuePrintifyProducts));
                
            } else {
                if (iterations > 0) {
                    setTimeout(() => checkProductCreated(productUrl), 1000);
                } else {
                    console.error('SHOPIFY BUG: Product creation timed out');
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
