/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/css/main.scss":
/*!***************************!*\
  !*** ./src/css/main.scss ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n// extracted by mini-css-extract-plugin\n\n\n//# sourceURL=webpack://shopify-theme-lab/./src/css/main.scss?");

/***/ }),

/***/ "./src/js/ai-generator.js":
/*!********************************!*\
  !*** ./src/js/ai-generator.js ***!
  \********************************/
/***/ (() => {

eval("(() => {\n    const LS_SEARCH_KEY = 'ai-search';\n    const searchForm = document.getElementById('aiSearch');\n    const generateNewSearchPrompt = document.querySelector('.js-get-new-prompt');\n    const searchViews = document.querySelectorAll('.js-search-view');\n    const localSearch = localStorage.getItem(LS_SEARCH_KEY);\n    const API_HOST = 'https://lime-filthy-duckling.cyclic.app';\n    const searchHistory = localSearch ? JSON.parse(localSearch) : {};\n    const REQUESTS_LIMIT = 100;\n    const LS_QUEUE_PRINTIFY_PRODUCTS = 'currentCreatingProduct';\n    const imagesResult = {};\n    const previewsResult = {};\n    const allPromptResults = new Map();\n    const preloadUrl = 'https://cdn.shopify.com/videos/c/vp/21de78cbe14f46cbbc3e8f54adfd86b4/21de78cbe14f46cbbc3e8f54adfd86b4.SD-480p-1.5Mbps-12651580.mp4';\n    let querySearch = new URL(document.location).searchParams.get('search') || '';\n    let preventAutoExtend = (new URL(document.location).searchParams.get('preventAutoExtend') === \"on\");\n    let allAvailablePrompts;\n    let searchResultDomCarousels = document.querySelectorAll('.js-search-view .search__wrapper');\n\n    if (!searchForm || !searchViews.length) return;\n\n    const trackGoogleError = (err) => {\n        window.gtag && window.gtag('event', 'error', {\n            'event_category': 'Replicate AI ERROR',\n            'event_label': 'Images request error',\n            'value': err\n        });\n    };\n\n    const addNewCarousel = () => {\n        const searchDomTemplate = document.querySelector('.js-search-dom-template');\n        const newSearchDom = searchDomTemplate.content.cloneNode(true);\n        const searchContainer = generateNewSearchPrompt.closest('.js-search-view');\n\n        searchDomTemplate.before(newSearchDom);\n\n        const slider = searchContainer.querySelector('.js-search-swiper:not(.swiper-initialized)');\n\n        if (window.Swiper) {\n            new Swiper(slider, {\n                slidesPerView: 3.5,\n                spaceBetween: 30,\n                freeMode: true,\n\n                breakpoints: {\n                    767: {\n                        slidesPerView: 3.5\n                    },\n                    320: {\n                        slidesPerView: 1.2,\n                    }\n                },\n                navigation: {\n                nextEl: '.swiper-button-next',\n                prevEl: '.swiper-button-prev',\n                },\n            });\n        }\n\n        return slider;\n    };\n\n    const updateImagesPreviews = (promptResult) => {\n        searchResultDomCarousels = document.querySelectorAll('.js-search-view .search__wrapper');\n\n        promptResult.forEach((result, i) => {\n            if (result.error) {\n                trackGoogleError(result.error);\n            } else {\n                if (allPromptResults.get(result.prompt)) {\n                    allPromptResults.set(result.prompt, Object.assign({}, allPromptResults.get(result.prompt), result.images));\n                } else {\n                    allPromptResults.set(result.prompt, result.images);\n                }\n            }\n        });\n\n        const promptSearchesIterator = allPromptResults.keys();\n        const uniqueSearches = Array.from(promptSearchesIterator);\n\n        uniqueSearches.forEach((search, i) => {\n            const imgs = allPromptResults.get(search);\n\n            imagesResult[i] = imagesResult[i] || {};\n            previewsResult[i] = previewsResult[i] || {};\n\n            Object.keys(imgs).forEach((key) => {\n                if (imgs[key] && imgs[key].generatedImg) {\n                    console.log('imgs[key]', imgs[key]);\n                    previewsResult[i][key] = imgs[key].generatedImg;\n                }\n            });\n\n            if (!searchResultDomCarousels[i]) {\n                addNewCarousel();\n                searchResultDomCarousels = document.querySelectorAll('.js-search-view .search__wrapper');\n            }\n\n            const slider = searchResultDomCarousels[i].querySelector('.js-search-swiper');\n            const searchPrompt = searchResultDomCarousels[i].querySelector('.js-search-prompt');\n            const generateMoreBtn = searchResultDomCarousels[i].querySelector('.js-generate-more');\n            const mockupImg = slider.getAttribute('data-mockup-src');\n            const mockupUrl = slider.getAttribute('data-mockup-url');\n\n            searchPrompt && (searchPrompt.textContent = search);\n            generateMoreBtn && generateMoreBtn.setAttribute('data-prompt', search);\n\n            if (slider) {\n                Object.keys(previewsResult[i]).forEach((key, j) => {\n                    const slide = slider.querySelectorAll('.swiper-slide')[j];\n                    \n                    if (slide) {\n                        slide.querySelector('.preview-image').style.backgroundImage = `url(${previewsResult[i][key]})`;\n                        slide.querySelector('.js-get-product-redirect').setAttribute('data-id', `${key}`);\n                        slide.classList.add('customized');\n                    } else {\n                        slider.swiper.appendSlide(`<div class=\"swiper-slide customized\">\n                            <div class=\"preview-image\" style=\"background-image: url(${previewsResult[i][key]})\"></div>\n                            <img src=\"${mockupImg}\"/>\n                            <button data-mockup=\"${mockupUrl}\" data-id=\"${key}\" class=\"btn btn--secondary js-get-product-redirect button button--secondary\"><span>Buy</span></button>\n                            <video loop muted autoplay playsinline width=\"210\"><source src=\"${preloadUrl}\" type=\"video/mp4\"/></video>\n                        </div>`);\n                    }\n                });\n\n                if (slider.swiper.slides[slider.swiper.slides.length - 1].classList.contains('customized')) {\n                    slider.swiper.appendSlide(`<div class=\"swiper-slide\">\n                        <div class=\"preview-image\"></div>\n                        <img src=\"${mockupImg}\" />\n                        <button data-mockup=\"${mockupUrl}\" class=\"btn btn--secondary js-get-product-redirect button button--secondary\"><span>Buy</span></button>\n                        <video loop muted autoplay playsinline width=\"210\"><source src=\"${preloadUrl}\" type=\"video/mp4\"/></video>\n                    </div>`);\n                }\n                /* slider.swiper.slideTo(slider.swiper.slides.length); */\n            }\n        });\n\n        console.log('FULL imagesResult :>> ', imagesResult);\n    }\n\n    const checkImagesFullLoaded = (length, pendImagesResult) => {\n        console.log('checkImagesFullLoaded :>> ', pendImagesResult.length, length, pendImagesResult);\n        return (pendImagesResult.length === length) && pendImagesResult.every((result) => {\n            return result.images && Object.keys(result.images).length && Object.keys(result.images).every((key) => {\n                return result.images[key].printifyId;\n            });\n        });\n    }\n\n    let resolver;\n    const sleep = ms => new Promise(resolve => {\n        const timeout = setTimeout(resolve, ms)\n        resolver = data => {\n            clearTimeout(timeout);\n            resolve(data);\n        }\n    });\n    const waitImagesResult = async (ids, cacheRun) => {\n        console.time('waitImagesResult');\n\n        let imagesResponse;\n        let timeout = cacheRun ? 1 : 4000;\n        let loadedImages = 0;\n\n        !cacheRun && ids.forEach(function (id) {\n            var channel = pusher.subscribe(id);\n\n            channel.bind('1', function (data) {\n                // we can handle updates here\n                console.log('<< pusher >>', data);\n                resolver(data)\n            });\n        })\n\n        for (let i = 0; i < REQUESTS_LIMIT; i += 1) {\n            const data = await sleep(timeout); // pusher can send data earlier to us\n\n            if (Object.keys(data?.images || {}).length) {\n                imagesResponse = data;\n            } else {\n                const imagesRequest = await fetch(`${API_HOST}/image?requestId=${ids.join(',')}`, {\n                    method: 'GET'\n                });\n                if (imagesRequest.status !== 200) {\n                    console.error(imagesResponse);\n\n                    trackGoogleError(`Error images request ${JSON.stringify(imagesResponse)}`);\n\n                    pusher.unsubscribe(ids[0]);\n\n                    return imagesResponse;\n                }\n                imagesResponse = await imagesRequest.json();\n            }\n    \n            if (checkImagesFullLoaded(ids.length, imagesResponse)) {\n                console.timeEnd('waitImagesResult');\n                removeResultsBusyState();\n                break;\n            }\n\n            if (imagesResponse.length > loadedImages) {\n                updateImagesPreviews(imagesResponse);\n                loadedImages = imagesResponse.length;\n            }\n\n            console.log(`pending images...next ping in ${(timeout/1000).toFixed(1)} seconds`);\n\n            if (i) {\n                timeout *= 1.03; // 7687s after 100req\n            } else {\n                timeout = 600;\n            }\n        }\n        pusher.unsubscribe(ids[0]);\n\n        if (imagesResponse.length === 0) {\n            trackGoogleError(`Can't get images. Probably DB connection error`);\n        }\n\n        updateImagesPreviews(imagesResponse);\n\n        return imagesResponse;\n    };\n\n    const sendPromptRequest = async (prompt, isFullPrompt) => {\n        console.time('generateImages with Replicate AI');\n\n        const sendSearch = await fetch(`${API_HOST}/prompt`, {\n            method: 'POST',\n            headers: {\n                \"Access-Control-Allow-Origin\": \"*\",\n                \"Content-Type\": \"application/json\",\n            },\n            body: JSON.stringify({\n                preventAutoExtend,\n                [isFullPrompt ? `fullPrompt` : `prompt`]: prompt\n            })\n        });\n\n        const response = await sendSearch.json();\n\n        if (sendSearch.status !== 201) {\n            console.error(response);\n            return false;\n        }\n\n        const queuesIds = response.map(r => r.id);\n        const queuesPrompts = response.map(r => r.input.prompt);\n\n        queuesPrompts.forEach((pr, i) => {\n            searchHistory[querySearch] = searchHistory[querySearch] || {};\n            \n            if (searchHistory[querySearch]) {\n                if (searchHistory[querySearch][pr]) {\n                    searchHistory[querySearch][pr].push(queuesIds[i]);\n                } else {\n                    searchHistory[querySearch][pr] = [queuesIds[i]];\n                }\n            }\n        });\n        \n        localStorage.setItem(LS_SEARCH_KEY, JSON.stringify(searchHistory));\n\n        console.timeEnd('generateImages with Replicate AI');\n\n        return await waitImagesResult(queuesIds);\n    };\n\n    const getPrintifyProduct = async (button, imageId, prompt, number, mockupUrl) => {\n        console.time('getPrintifyProduct');\n\n        const queuePrintifyProducts = JSON.parse(localStorage.getItem(LS_QUEUE_PRINTIFY_PRODUCTS) || '{}');\n        const newWindow = window.open(`${mockupUrl}?key=${imageId}`, '_blank');\n        const request = await fetch(`${API_HOST}/printify-product`, {\n            method: 'POST',\n            headers: {\n                \"Access-Control-Allow-Origin\": \"*\",\n                \"Content-Type\": \"application/json\",\n            },\n            body: JSON.stringify({\n                imageId,\n                type: 't-shirt',\n                prompt\n            })\n        });\n\n        const response = await request.json();\n        \n        setBusyBuyButtonState(button, false);\n\n        console.timeEnd('getPrintifyProduct');\n\n        if (!response.id) {\n            console.error(response);\n            return false;\n        }\n        \n        console.log('Printify Result: ', response);\n        \n        const productUrl = `/products/${response.title.toLowerCase().replace(/[^a-z|0-9]+/img, '-')}`;\n\n        queuePrintifyProducts[productUrl] = false;\n        newWindow.sessionStorage.setItem(imageId, JSON.stringify(response));\n        newWindow.localStorage.setItem(LS_QUEUE_PRINTIFY_PRODUCTS, JSON.stringify(queuePrintifyProducts));\n        newWindow.location.reload();\n    };\n\n    const setBusyButtonState = (btn, state) => {\n        const innerLabel = btn.querySelector('SPAN');\n\n        if (state) {\n            btn.classList.add('loading');\n            innerLabel && (innerLabel.textContent = 'Loading...');\n        } else {\n            btn.classList.remove('loading');\n            innerLabel && (innerLabel.textContent = 'Create More of this Style');\n        }\n    };\n\n    const setBusyBuyButtonState = (btn, state) => {\n        const innerLabel = btn.querySelector('SPAN');\n\n        if (state) {\n            btn.classList.add('loading');\n            innerLabel && (innerLabel.textContent = 'Wait...');\n        } else {\n            btn.classList.remove('loading');\n            innerLabel && (innerLabel.textContent = 'Buy');\n        }\n    };\n\n    const setResultsBusyState = (_carousel) => {\n        _carousel ? _carousel.classList.add('loading') : document.querySelectorAll('.js-search-view .search__wrapper').forEach(carousel => {\n            carousel.classList.add('loading');\n        });\n    };\n\n    const removeResultsBusyState = (_carousel) => {\n        _carousel ? _carousel.classList.remove('loading') : document.querySelectorAll('.js-search-view .search__wrapper').forEach(carousel => {\n            carousel.classList.remove('loading');\n        });\n    };\n\n    var pusher;\n\n    function pusherInit() {\n        Pusher.logToConsole = true;\n\n        pusher = new Pusher('de22d0c16c3acf27abc0', {\n            cluster: 'eu'\n        });\n    }\n\n    try {\n        pusherInit();\n    } catch(e) {\n        console.error('pusher error', e)\n    }\n\n    if (querySearch.length) {            \n        /** PAGE LOAD STARTS HERE! */\n        if (searchHistory[querySearch] && !preventAutoExtend) {\n            const requestIds = Object.values(searchHistory[querySearch]).reduce((prev, curr) => prev.concat(curr), []);\n\n            waitImagesResult(requestIds, true)\n                .then((images) => {\n                    removeResultsBusyState();\n                    console.log('Got images from LS :>> ', images);\n                });\n        } else {\n            sendPromptRequest(querySearch, false, 1)\n                .then(pendimages => pendimages)\n                .then(images => {\n                    removeResultsBusyState();\n                    console.log('Got images from Replicate API :>> ', images);\n                });\n        }\n\n        document.querySelector('.search').addEventListener('click', (e) => {\n            let btnTarget;\n\n            if (e.target.classList.contains('js-get-product-redirect')) {\n                btnTarget = e.target;\n            } else if (e.target.tagName.toLowerCase() === 'img') {\n                btnTarget = e.target.closest('.swiper-slide').querySelector('.js-get-product-redirect');\n            }\n\n            if (!btnTarget || btnTarget.classList.contains('loading')) {\n                return false;\n            }\n\n            setBusyBuyButtonState(btnTarget, true);\n\n            getPrintifyProduct(\n                btnTarget,\n                btnTarget.getAttribute('data-id'), \n                querySearch,\n                Array.from(btnTarget.closest('.swiper-slide').parentNode.children).indexOf(btnTarget.closest('.swiper-slide')) * document.querySelectorAll('.js-search-swiper').length,\n                btnTarget.getAttribute('data-mockup')\n            );\n        })\n\n        searchViews.forEach((searchView, i) => {\n            searchView.addEventListener('click', (e) => {\n                if (e.target.classList.contains('js-generate-more') || e.target.closest('.js-generate-more')) {\n                    const btn = e.target.closest('.js-generate-more') ? e.target.closest('.js-generate-more') : e.target;\n                    const carousel = btn.closest('.search__wrapper');\n\n                    if (btn.classList.contains('loading')) return false;\n\n                    setResultsBusyState(carousel);\n                    setBusyButtonState(btn, true);\n    \n                    sendPromptRequest(btn.getAttribute('data-prompt'), true)\n                        .then(pendimages => pendimages)\n                        .then(images => {\n                            removeResultsBusyState(carousel);\n                            setBusyButtonState(btn, false);\n                            console.log('Got images from Replicate API :>> ', images);\n                        });\n                }\n            });\n        });\n\n        if (generateNewSearchPrompt) {\n            /** Buttom on the page bottom for generating new search carousels */\n            generateNewSearchPrompt.addEventListener('click', async () => {\n                if (generateNewSearchPrompt.classList.contains('loading')) return false;\n\n                setBusyButtonState(generateNewSearchPrompt, true);\n                /** clone carousel and call swiper */\n                /** get all available random prompts */\n                /** detect unique prompt which did not used */\n                /** sendPromptRequest with new prompt -> will create new item in allPromptResults and update data in new caousel  */\n                \n\n                if (!allAvailablePrompts) {\n                    const availablePrompts = await fetch(`${API_HOST}/available-prompts?prompt=${querySearch}`, {\n                        method: 'GET',\n                        headers: {\n                            \"Access-Control-Allow-Origin\": \"*\",\n                            \"Content-Type\": \"application/json\",\n                        }\n                    });\n                    \n                    allAvailablePrompts = await availablePrompts.json();\n\n                    if (availablePrompts.status !== 200) {\n                        console.error(allAvailablePrompts);\n                        return false;\n                    }                    \n                }\n\n                let newUniquePrompt;\n\n                for (let i = 0; i < allAvailablePrompts.length; i += 1) {\n                    if (!(allPromptResults.get(allAvailablePrompts[i]))) {\n                        newUniquePrompt = allAvailablePrompts[i];\n                        \n                        break;\n                    }\n                }\n\n                if (!newUniquePrompt) {\n                    const randomKey = Math.floor(Math.random() * allAvailablePrompts.length);\n\n                    newUniquePrompt = allAvailablePrompts[randomKey];\n                }\n\n                const addedCarousel = addNewCarousel();\n\n                setResultsBusyState(addedCarousel.closest('.search__wrapper'));\n                \n                sendPromptRequest(newUniquePrompt, true)\n                    .then(pendimages => pendimages)\n                    .then(images => {\n                        setBusyButtonState(generateNewSearchPrompt, false);\n                        removeResultsBusyState();\n                        console.log('Got images from Replicate API :>> ', images);\n                    });\n            });\n        }\n    }\n\n    searchForm.querySelector('input[name=\"search\"]').value = querySearch;\n    searchForm.querySelector('input[name=\"preventAutoExtend\"]').checked = preventAutoExtend;\n})();\n\n\n//# sourceURL=webpack://shopify-theme-lab/./src/js/ai-generator.js?");

/***/ }),

/***/ "./src/js/ai-personaliser.js":
/*!***********************************!*\
  !*** ./src/js/ai-personaliser.js ***!
  \***********************************/
/***/ (() => {

eval("(() => {\n    const isProductPage = window.location.pathname.includes('/product') && document.body.classList.contains('template-product');\n    const isCartPage = window.location.pathname.includes('/cart');\n    const REQUESTS_LIMIT = 270;\n    const API_HOST = 'https://lime-filthy-duckling.cyclic.app';\n    const queryPhotoKey = new URL(document.location).searchParams.get('key') || '';\n    const photosData = new Map();\n    const LS_QUEUE_PRINTIFY_PRODUCTS = 'currentCreatingProduct';\n    const cartNotification = document.querySelector('#cart-notification');\n    const mainCartItems = document.querySelector('#main-cart-items');\n    const sleep = ms => new Promise(res => setTimeout(res, ms));\n    const PHOTOS_API_NAMES = ['generatedImg', 'imageFull'];\n    let imageData;\n\n    let queuePrintifyProducts = JSON.parse(localStorage.getItem(LS_QUEUE_PRINTIFY_PRODUCTS) || '{}');\n    let pendingProducts = Object.keys(queuePrintifyProducts).filter((url) => !queuePrintifyProducts[url]);\n\n    const trackGoogleError = (err) => {\n        window.gtag && window.gtag('event', 'error', {\n            'event_category': 'Replicate AI ERROR',\n            'event_label': 'Images request error',\n            'value': err\n        });\n    };\n\n    const updateProductPreviewData = (imgData) => {\n        imgData = imgData || imageData;\n\n        const productPhotoMedia = document.querySelectorAll('.product__modal-opener--image');\n        const tShirtPhoto = imgData.images[queryPhotoKey]?.generatedImg;\n        \n        if (tShirtPhoto) {\n            productPhotoMedia.forEach((img) => {\n                const previewImg = document.createElement('img');\n                previewImg.className = 'preview-image';\n                previewImg.src = tShirtPhoto;\n\n                img.parentNode.insertBefore(previewImg, img);\n            });\n        }\n    };\n\n    const updateCartNotificationPreview = () => {\n        const notificationOptions = cartNotification.querySelectorAll('.product-option');\n        const imageNotification = cartNotification.querySelector('.cart-notification-product__image');\n        const tshirtPhoto = photosData.get('generatedImg');\n\n        notificationOptions.forEach((option) => {\n            const optKey = option.querySelector('dt').textContent;\n\n            if (photosData.get(optKey.replace(':', ''))) {\n                option.classList.add('hidden');\n            }\n        });\n        const previewImg = document.createElement('img');\n\n        previewImg.className = 'preview-image';\n        previewImg.src = tshirtPhoto;\n        imageNotification.parentNode.insertBefore(previewImg, imageNotification);\n    };\n\n    const updateCartView = () => {\n        const cartItems = document.querySelectorAll('.cart-item');\n\n        cartItems.forEach((cartItem) => {\n            const img = cartItem.querySelector('.cart-item__image');\n            const itemPhotos = {};\n    \n            if (itemPhotos.generatedImg) {\n                const previewImg = document.createElement('img');\n                \n                previewImg.src = itemPhotos.generatedImg;\n                previewImg.className = 'preview-image';\n\n                img.parentNode.insertBefore(previewImg, img);\n            }\n        });\n    };\n\n    const getImages = async (key) => {\n        let imagesResponse;\n        let timeout = 1000;\n\n        if (!key) return;\n\n        for (let i = 0; i < REQUESTS_LIMIT; i += 1) {\n            const imagesRequest = await fetch(`${API_HOST}/image?imageId=${key}`, {\n                method: 'GET'\n            });\n    \n            imagesResponse = await imagesRequest.json();\n    \n            if (imagesRequest.status !== 200) {\n                console.error(imagesResponse);\n\n                trackGoogleError(`Error images request ${JSON.stringify(imagesResponse)}`);\n                \n                return imagesResponse;\n            }\n\n            if (imagesResponse.length) {\n                imageData = imagesResponse[0];\n                \n                if (imageData.images) {\n                    break;\n                }\n            }\n\n            if (imageData.images[key].generatedImg) {\n                updateProductPreviewData(imageData);\n            }\n\n            console.log(`pending images...next ping in ${timeout/1000} seconds`);\n\n            await sleep(timeout);\n            timeout = 1000;\n        }\n\n        if (imagesResponse.length === 0) {\n            trackGoogleError(`Can't get images. Probably DB connection error`);\n        }\n\n        updateProductPreviewData(imageData);\n\n        return imageData;\n    };\n\n    if (isProductPage && queryPhotoKey) {        \n        getImages(queryPhotoKey);\n\n        const productInfo = document.querySelector('.product__info-wrapper');\n        const variantRadios = document.querySelector('variant-radios');\n        productInfo.classList.add('loading');\n        \n        const productPrintifyInfo = JSON.parse(window.sessionStorage.getItem(queryPhotoKey) || '{}');\n        const productForm = document.querySelectorAll('.product-form Form');\n\n        let waitIterations = 200;\n\n        const shopifyProductWaiter = (url) => {\n            queuePrintifyProducts = JSON.parse(localStorage.getItem(LS_QUEUE_PRINTIFY_PRODUCTS) || '{}');\n            if (queuePrintifyProducts[url]) {\n                productInfo.classList.remove('loading');\n\n                console.log('Loaded product:', queuePrintifyProducts[url]);\n\n                const variants = queuePrintifyProducts[url].variants;\n\n                variantRadios.variantData = variants; \n                variantRadios.querySelector('[type=\"application/json\"]').textContent = JSON.stringify(variants, null, 2);\n\n                variantRadios.updateOptions();\n                variantRadios.updateMasterId();\n                variantRadios.updateVariantInput();\n                variantRadios.updateURL();\n            } else {\n                setTimeout(() => shopifyProductWaiter(url), 1000);\n                waitIterations = waitIterations - 1;\n            }\n        }\n\n        if (Object.keys(productPrintifyInfo).length) {\n            const productUrl = `/products/${productPrintifyInfo.title.toLowerCase().replace(/[^a-z|0-9]+/img, '-')}`;\n\n            shopifyProductWaiter(productUrl);\n        }\n        \n        document.querySelectorAll('[data-url]').forEach((dUrl) => {\n            const url = new URL(document.location);\n            const keySearch = url.searchParams.get('key');\n    \n            dUrl.setAttribute('data-url', `${url.pathname}?key=${keySearch}`);\n        });\n    }\n    // if (isCartPage) {\n    //     if (mainCartItems) {\n    //         const config = { attributes: true, childList: true, subtree: true };\n    //         const obsCart = new MutationObserver((mutationList, observer) => {\n    //             for (const mutation of mutationList) {\n    //               if (mutation.type === 'childList') {\n    //                 updateCartView();\n    //               }\n    //             }\n    //         });\n\n    //         obsCart.observe(mainCartItems, config);\n    //     }\n\n    //     updateCartView();\n    // }\n\n    let iterations = 300;\n\n    const checkProductCreated = async (productUrl) => {\n        const response = await fetch(`${productUrl}.js`, {method: 'GET'});\n\n        if (response.status === 200) {\n            const productData = await response.json();\n\n            if (productData.available) {\n                console.log('FINALLY got product!!! ', productData);\n\n                queuePrintifyProducts = JSON.parse(localStorage.getItem(LS_QUEUE_PRINTIFY_PRODUCTS) || '{}');\n                queuePrintifyProducts[productUrl] = productData;\n                window.localStorage.setItem(LS_QUEUE_PRINTIFY_PRODUCTS, JSON.stringify(queuePrintifyProducts));\n            } else {\n                if (iterations > 0) {\n                    setTimeout(() => checkProductCreated(productUrl), 1000);\n                } else {\n                    console.error('PRINTIFY BUG: Product creation timed out');\n                }   \n            }\n        } else {\n            if (iterations > 0) {\n                setTimeout(() => checkProductCreated(productUrl), 1000);\n            } else {\n                console.error('PRINTIFY BUG: Product creation timed out');\n            }\n        }\n    };\n\n    if (pendingProducts.length) {\n        pendingProducts.forEach((url) => {\n            checkProductCreated(url);\n        });\n    }\n})();\n\n//# sourceURL=webpack://shopify-theme-lab/./src/js/ai-personaliser.js?");

/***/ }),

/***/ "./src/main.js":
/*!*********************!*\
  !*** ./src/main.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _css_main_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./css/main.scss */ \"./src/css/main.scss\");\n/**\n * imports\n */\n\n// import Cookies from 'js-cookie';\n\ndocument.addEventListener('DOMContentLoaded', function () {\n  window.console.log('Hello from main.js 👋.');\n\n  //Close mobile menu \n  let mobileMenu = document.querySelector('#menu-drawer');\n  let menuDrawer = document.querySelector('#Details-menu-drawer-container');\n\n  window.onclick = function(event) {\n    if (event.target != mobileMenu) {\n      menuDrawer.classList.remove('menu-opening');\n    }\n  }\n});\n\n\n//# sourceURL=webpack://shopify-theme-lab/./src/main.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	__webpack_require__("./src/main.js");
/******/ 	__webpack_require__("./src/js/ai-generator.js");
/******/ 	var __webpack_exports__ = __webpack_require__("./src/js/ai-personaliser.js");
/******/ 	
/******/ })()
;