
/** API Printify */
/**
 * eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIzN2Q0YmQzMDM1ZmUxMWU5YTgwM2FiN2VlYjNjY2M5NyIsImp0aSI6Ijg2YWE1MWM2ZGFjOGYwYWY5OTdhZjE3YWJmZWMyMzBjZGNhNmI1NGI0OTM5MTBiOTA0MWRiMjNlY2FmMDA3ZjEzOWYyNGEwMmE5ZDM2MmU2IiwiaWF0IjoxNjc2MDMwNzU3LjA4NjExLCJuYmYiOjE2NzYwMzA3NTcuMDg2MTEzLCJleHAiOjE3MDc1NjY3NTcuMDM2NzU5LCJzdWIiOiIxMTk1OTcxOCIsInNjb3BlcyI6WyJzaG9wcy5tYW5hZ2UiLCJzaG9wcy5yZWFkIiwiY2F0YWxvZy5yZWFkIiwib3JkZXJzLnJlYWQiLCJvcmRlcnMud3JpdGUiLCJwcm9kdWN0cy5yZWFkIiwicHJvZHVjdHMud3JpdGUiLCJ3ZWJob29rcy5yZWFkIiwid2ViaG9va3Mud3JpdGUiLCJ1cGxvYWRzLnJlYWQiLCJ1cGxvYWRzLndyaXRlIiwicHJpbnRfcHJvdmlkZXJzLnJlYWQiXX0.AdCStZgN0ywpW9qlw7oxe--TL44I3IOU0NbYQfpY-8Ctwe8aWhaY6NJ_YNAS9LfZiMYrnE-4s4R3vDUclYQ
 * 
 * 
 * 
 * 
 * 
 * 
 */

(() => {
    const isProductPage = window.location.pathname.includes('/product') && document.body.classList.contains('template-product');
    const isCartPage = window.location.pathname.includes('/cart');
    const REQUESTS_LIMIT = 270;
    const API_HOST = 'https://awesome-code-nkh8j.cloud.serverless.com';
    const queryPhotoKey = new URL(document.location).searchParams.get('key') || ''; 
    const photosData = new Map();
    const cartNotification = document.querySelector('#cart-notification');
    const mainCartItems = document.querySelector('#main-cart-items');
    const sleep = ms => new Promise(res => setTimeout(res, ms));
    const PHOTOS_API_NAMES = ['tShirtResult', 'imageStandard', 'imageFull'];

    const trackGoogleError = (err) => {
        window.gtag && window.gtag('event', 'error', {
            'event_category': 'Replicate AI ERROR',
            'event_label': 'Images request error',
            'value': err
        });
    };

    const updateProductPreviewData = (imgData) => {
        const productPhotoMedia = document.querySelectorAll('.product-media-modal__content img, .product__media img');
        const productForm = document.querySelectorAll('.product-form Form');
        const tShirtPhoto = imgData.images[queryPhotoKey]?.tShirtResult;

        if (tShirtPhoto) {
            productPhotoMedia.forEach((img) => {
                img.removeAttribute('srcset');
                img.setAttribute('src', tShirtPhoto);
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

        notificationOptions.forEach((option) => {
            const optKey = option.querySelector('dt').textContent;

            if (photosData.get(optKey.replace(':', ''))) {
                option.classList.add('hidden');
            }
        });
        imageNotification.setAttribute('src', photosData.get('tShirtResult'));
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
            itemPhotos.tShirtResult && img.setAttribute('src', itemPhotos.tShirtResult);
        });
    };

    const getImages = async (key) => {
        let imagesResponse;
        let timeout = 1000;
        let imageData;

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
})();