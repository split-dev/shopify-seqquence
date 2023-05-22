(() => {
    const LS_SEARCH_KEY = 'ai-search';
    const searchForm = document.getElementById('aiSearch');
    const generateNewSearchPrompt = document.querySelector('.js-get-new-prompt');
    const searchViews = document.querySelectorAll('.js-search-view');
    const localSearch = localStorage.getItem(LS_SEARCH_KEY);
    const API_HOST = 'https://lime-filthy-duckling.cyclic.app';
    const S3_HOST = 'https://aipr.s3.amazonaws.com';
    // const LAMBDA_HOST = 'https://q65eekxnmbwkizo3masynrpea40rylba.lambda-url.us-east-1.on.aws'; // us-east-1 - prod
    const LAMBDA_HOST = 'https://r4qlyqjkf4sankpkqcvzdqgm540sozvz.lambda-url.eu-central-1.on.aws'; // eu_central-1 - for testing
    const searchHistory = localSearch ? JSON.parse(localSearch) : {};
    const REQUESTS_LIMIT = 100;
    // const LS_QUEUE_PRINTIFY_PRODUCTS = 'currentCreatingProduct';
    const imagesResult = {};
    const previewsResult = {};
    const allPromptResults = new Map();
    const searchDomTemplate = document.querySelector('.js-search-dom-template');

    let querySearch = new URL(document.location).searchParams.get('search') || '';
    let preventAutoExtend = (new URL(document.location).searchParams.get('preventAutoExtend') === "on");
    let allAvailablePrompts;
    let searchResultDomCarousels = document.querySelectorAll('.js-search-view .search__wrapper');

    console.log('preventAutoExtend :>> ', preventAutoExtend);
    console.log(new URL(document.location).searchParams.get('preventAutoExtend'))
    console.log('new URL(document.location).searchParams :>> ', new URL(document.location).searchParams);
    if (!searchForm || !searchViews.length) return;

    const trackGoogleError = (err) => {
        window.gtag && window.gtag('event', 'error', {
            'event_category': 'Replicate AI ERROR',
            'event_label': 'Images request error',
            'value': err
        });
    };

    const addNewCarousel = () => {
        const newSearchDom = searchDomTemplate.content.cloneNode(true);
        const searchContainer = generateNewSearchPrompt.closest('.js-search-view');

        searchDomTemplate.before(newSearchDom);

        const slider = searchContainer.querySelector('.js-search-swiper:not(.swiper-initialized)');

        if (window.Swiper) {
            new window.Swiper(slider, {
                slidesPerView: 3.5,
                spaceBetween: 30,
                freeMode: true,
                mousewheel: true,
                breakpoints: {
                    767: {
                        slidesPerView: 3.5
                    },
                    320: {
                        slidesPerView: 1.2,
                    }
                },
                navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
                },
            });
        }

        return slider;
    };

    const updateImagesPreviews = (promptResult) => {
        console.log('promptResult', promptResult)
        searchResultDomCarousels = document.querySelectorAll('.js-search-view .search__wrapper');

        promptResult.forEach((result) => {
            if (result.error) {
                trackGoogleError(result.error);
            } else {
                allPromptResults.set(result.prompt, {
                    ...allPromptResults.get(result.prompt),
                    ...result.images,
                });
            }
        });

        const promptSearchesIterator = allPromptResults.keys();
        const uniqueSearches = Array.from(promptSearchesIterator);
        console.log('allPromptResults :>> ', promptSearchesIterator, uniqueSearches);

        uniqueSearches.forEach((search, i) => {
            const imgs = allPromptResults.get(search);
            console.log('imgs', imgs)
            imagesResult[i] = imagesResult[i] || {};
            previewsResult[i] = previewsResult[i] || {};

            Object.keys(imgs).forEach((key) => {
                if (imgs[key] && imgs[key].generatedImg) {
                    previewsResult[i][key] = imgs[key].generatedImg;
                }
            });

            if (!searchResultDomCarousels[i]) {
                addNewCarousel();
                searchResultDomCarousels = document.querySelectorAll('.js-search-view .search__wrapper');
            }

            const slider = searchResultDomCarousels[i].querySelector('.js-search-swiper');
            const searchPrompt = searchResultDomCarousels[i].querySelector('.js-search-prompt');
            const generateMoreBtn = searchResultDomCarousels[i].querySelector('.js-generate-more');
            const mockupImg = slider.getAttribute('data-mockup-src');
            const mockupUrl = slider.getAttribute('data-mockup-url');

            console.log('searchPrompt,search :>> ', searchPrompt, search);
            searchPrompt && (searchPrompt.textContent = search);
            generateMoreBtn && generateMoreBtn.setAttribute('data-prompt', search);

            if (slider) {
                console.log(1)
                Object.keys(previewsResult[i]).forEach((key, j) => {
                    const slide = slider.querySelectorAll('.swiper-slide')[j];
                    console.log(2, key, previewsResult[i][key])
                    if (slide) {
                        const redirectBtn = slide.querySelector('.js-get-product-redirect');
                        slide.querySelector('.preview-image').style.backgroundImage = `url(${previewsResult[i][key]})`;
                        
                        redirectBtn.setAttribute('data-id', `${key}`)
                        redirectBtn.setAttribute('data-handle', `${imgs[key].handle || ''}`);
                        slide.classList.add('customized');
                    } else {
                        slider.swiper.appendSlide(`<div class="swiper-slide customized">
                            <div class="preview-image" style="background-image: url(${previewsResult[i][key]})"></div>
                            <img src="${mockupImg}"/>
                            <button data-mockup="${mockupUrl}" data-id="${key}" data-handle="${imgs[key].handle || ''}" class="btn btn--secondary ${imgs[key].handle ? '' : 'loading'} js-get-product-redirect button button--secondary"><span>${imgs[key].handle ? 'Buy' : 'Wait'}</span></button>
                        </div>`);
                    }

                    if (!imgs[key].handle?.length) {
                        console.error('No product handle found');
                        slide && setBusyBuyButtonState(slide.querySelector('.btn'), true);
                    } else {
                        slide && setBusyBuyButtonState(slide.querySelector('.btn'), false);
                    }
                });

                if (slider.swiper.slides[slider.swiper.slides.length - 1].classList.contains('customized')) {
                    slider.swiper.appendSlide(`<div class="swiper-slide">
                        <div class="preview-image"></div>
                        <img src="${mockupImg}" />
                        <button data-mockup="${mockupUrl}" class="btn btn--secondary js-get-product-redirect button button--secondary"><span>Buy</span></button>
                    </div>`);
                }
                /* slider.swiper.slideTo(slider.swiper.slides.length); */
            }
        });

        console.log('FULL imagesResult :>> ', imagesResult);
    }

    const checkImagesFullLoaded = (length, pendImagesResult, cacheRun) => {
        console.log('checkImagesFullLoaded :>> ', pendImagesResult.length, length, pendImagesResult);
        return (pendImagesResult.length === length) && pendImagesResult.every((result) => {
            return result.images && Object.keys(result.images).length && Object.keys(result.images).every((key) => {
                if (cacheRun) {
                    console.log('cacheRun - setting not ready');
                    result.images[key].handle ||= 'not ready';
                }
                
                return result.images[key].handle;
            });
        });
    }

    let resolvePusher;
    const waitPusher = ms => new Promise(resolve => {
        const timeout = setTimeout(resolve, ms)
        resolvePusher = data => {
            clearTimeout(timeout);
            Array.isArray(data) || (data = [data])
            resolve(data);
        }
    });
    const waitImagesResult = async (ids, cacheRun) => {
        console.time('waitImagesResult');

        let imagesResponse;
        let timeout = cacheRun ? 1 : 4000; // 3s for AI and 1s for crop
        let loadedImages = 0;

        !cacheRun && ids.forEach(function (id) {
            var channel = pusher.subscribe(id);

            channel.bind('1', function (data) {
                // we can handle updates here
                console.log('<< pusher >>', data);
                resolvePusher(data)
            });
        });

        for (let retryCounter = 0; retryCounter < REQUESTS_LIMIT; retryCounter += 1) {
            const data = await waitPusher(timeout); // pusher can send data earlier to us

            if (data?.length) {
                imagesResponse = data;
            } else {
                const imagesRequest = await fetch(`${LAMBDA_HOST}/image?requestId=${ids.join(',')}`, {
                    method: 'GET'
                });
                if (imagesRequest.status !== 200) {
                    console.error(imagesRequest.status, imagesRequest.statusText);

                    trackGoogleError(`Error images request ${JSON.stringify([imagesRequest.status, imagesRequest.statusText])}`);

                    pusher.unsubscribe(ids[0]);

                    return imagesResponse;
                }
                imagesResponse = await imagesRequest.json();
            }

            if (imagesResponse[0].nsfw) {
                document.getElementById('error_message')?.$show();
                break;
            }
    
            if (checkImagesFullLoaded(ids.length, imagesResponse, cacheRun)) {
                console.timeEnd('waitImagesResult');
                console.log('All images ready to buy');
                // removeResultsBusyState();
                removeResultsUnavailableState(); /** can buy */
                break;
            }

            const loadedCount = imagesResponse.reduce((acc, item) => acc + item.images.length)

            if (loadedCount > loadedImages) {
                console.log('updateImagesPreviews :>> ', updateImagesPreviews);
                timeout += 200;
                updateImagesPreviews(imagesResponse);
                removeResultsBusyState(); /** images visible */
                loadedImages = loadedCount;
            }

            console.log(`pending images...next ping in ${(timeout/1000).toFixed(1)} seconds`);

            if (retryCounter) {
                timeout *= 1.03; 
            } else {
                timeout = 400;
            }
        }
        pusher.unsubscribe(ids[0]);

        if (imagesResponse.length === 0) {
            trackGoogleError(`Can't get images. Probably DB connection error`);
        }

        updateImagesPreviews(imagesResponse);

        return imagesResponse;
    };

    const sendPromptRequest = async (prompt, isFullPrompt) => {
        console.time('generateImages with Replicate AI');

        const sendSearch = await fetch(`${LAMBDA_HOST}/prompt`, {
            method: 'POST',
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                preventAutoExtend,
                fullPrompt: isFullPrompt && prompt,
                prompt: querySearch,
                reqDate: Date.now(),
            })
        });

        const response = await sendSearch.json();

        if (![200, 201].includes(sendSearch.status)) {
            console.error(response);
            document.getElementById('error_message')?.$show()

            return false;
        }

        const queuesIds = response.map(r => r.id);
        const queuesPrompts = response.map(r => r.input.prompt);

        queuesPrompts.forEach((pr, i) => {
            searchHistory[querySearch] = searchHistory[querySearch] || {};
            
            if (searchHistory[querySearch]) {
                if (searchHistory[querySearch][pr]) {
                    searchHistory[querySearch][pr].push(queuesIds[i]);
                } else {
                    searchHistory[querySearch][pr] = [queuesIds[i]];
                }
            }
        });
        
        localStorage.setItem(LS_SEARCH_KEY, JSON.stringify(searchHistory));

        console.timeEnd('generateImages with Replicate AI');

        return await waitImagesResult(queuesIds);
    };

    async function createShopifyProduct(imageId) {
        console.time('createShopifyProduct');
        const response = await fetch(`${LAMBDA_HOST}/shopify-product`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                imageId,
                type: 't-shirt',
                prompt: querySearch
            })
        });
        console.log('response :>> ', response.status, response.statusText);
        console.timeEnd('createShopifyProduct');
        const json = await response.json();
        console.log('json :>> ', json);
        return json;
    }
    /*const getPrintifyProduct = async (button, imageId, prompt, number, mockupUrl) => {
        console.time('getPrintifyProduct');

        const queuePrintifyProducts = JSON.parse(localStorage.getItem(LS_QUEUE_PRINTIFY_PRODUCTS) || '{}');
        const newWindow = window.open(`${mockupUrl}?key=${imageId}`, '_blank');
        const request = await fetch(`${API_HOST}/printify-product`, {
            method: 'POST',
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                imageId,
                type: 't-shirt',
                prompt
            })
        });

        const response = await request.json();
        
        setBusyBuyButtonState(button, false);

        console.timeEnd('getPrintifyProduct');

        if (!response.id) {
            console.error(response);
            return false;
        }
        
        console.log('Printify Result: ', response);
        
        const productUrl = `/products/${response.title.toLowerCase().replace(/[^a-z|0-9]+/img, '-')}`;

        queuePrintifyProducts[productUrl] = false;
        newWindow.sessionStorage.setItem(imageId, JSON.stringify(response));
        newWindow.localStorage.setItem(LS_QUEUE_PRINTIFY_PRODUCTS, JSON.stringify(queuePrintifyProducts));
        newWindow.location.reload();
    };*/

    const animations = new Map();
    const ellipsisStart = (label, text, time = 900) => {
        const originalText = label.textContent;
        let step = 0;

        const ellipsis = () => {
            animations.set(label, {
                originalText,
                // timerId: setTimeout(ellipsis, time / 4),
            });
            label.textContent = text + '.'.repeat(step);
            step += step < 3 ? 1 : -3;
        }
        ellipsis();
    }
    const ellipsisEnd = label => {
        const animation = animations.get(label);
        if (!animation) return;
        // clearTimeout(animation.timerId);
        label.textContent = animation.originalText;
        animations.delete(label);
    }

    const setBusyButtonState = (btn, state) => {
        const innerLabel = btn.querySelector('SPAN');

        if (state) {
            btn.classList.add('loading');
            innerLabel && ellipsisStart(innerLabel, 'Loading');
        } else {
            btn.classList.remove('loading');
            // const textContent = btn.classList.contains('js-generate-more')
            //     ? 'Create More of this Style'
            //     : 'Create different styles';
            innerLabel && ellipsisEnd(innerLabel);
        }
    };

    const setBusyBuyButtonState = (btn, state) => {
        const innerLabel = btn.querySelector('SPAN');

        if (state) {
            btn.classList.add('loading');
            innerLabel && (innerLabel.textContent = 'Wait');
        } else {
            btn.classList.remove('loading');
            innerLabel && (innerLabel.textContent = 'Buy');
        }
    };

    const setResultsBusyState = (_carousel) => {
        console.log('setResultsBusyState _carousel :>> ', _carousel);
        _carousel ? _carousel.classList.add('loading') : document.querySelectorAll('.js-search-view .search__wrapper').forEach(carousel => {
            carousel.classList.add('loading');
        });
    };

    const removeResultsBusyState = (_carousel) => {
        console.log('setResultsBusyState _carousel :>> ', _carousel);
        _carousel ? _carousel.classList.remove('loading') : document.querySelectorAll('.js-search-view .search__wrapper').forEach(carousel => {
            carousel.classList.remove('loading');
        });
    };

    const removeResultsUnavailableState = (_carousel) => {
        _carousel ? _carousel.classList.remove('unavailable') : document.querySelectorAll('.js-search-view .search__wrapper').forEach(carousel => {
            carousel.classList.remove('unavailable');
        });
    };

    const setResultsUnavailableState = (_carousel) => {
        _carousel ? _carousel.classList.add('unavailable') : document.querySelectorAll('.js-search-view .search__wrapper').forEach(carousel => {
            carousel.classList.add('unavailable');
        });
    };

    var pusher;

    function pusherInit() {
        if (!window.Pusher) {
            return setTimeout(pusherInit, 100)
        }
        window.Pusher.logToConsole = true;

        pusher = new window.Pusher('19daec24304eedd7aa8a', {
            cluster: 'mt1'
        });
    }

    try {
        pusherInit();
    } catch(e) {
        console.error('pusher error', e)
    }

    if (querySearch.length) {            
        /** PAGE LOAD STARTS HERE! */

        console.log('querySearch :>> ', querySearch);
        
        if (searchHistory[querySearch]) {
            const requestIds = Object.values(searchHistory[querySearch]).reduce((prev, curr) => prev.concat(curr), []);
            console.log('requestIds :>> ', requestIds);
            waitImagesResult(requestIds, true)
                .then((images) => {
                    removeResultsBusyState();
                    console.log('Got images from LS :>> ', images);
                });
        } else {
            setResultsUnavailableState();

            sendPromptRequest(querySearch, false)
                .then(pendimages => pendimages)
                .then(images => {
                    removeResultsBusyState();
                    console.log('Got images from Replicate API :>> ', images);
                });
        }

        document.querySelector('.search').addEventListener('click', async (e) => {
            let btnTarget;

            if (e.target.classList.contains('js-get-product-redirect')) {
                btnTarget = e.target;
            } else if (e.target.tagName.toLowerCase() === 'img') {
                btnTarget = e.target.closest('.swiper-slide').querySelector('.js-get-product-redirect');
            }

            if (!btnTarget || btnTarget.classList.contains('loading')) {
                return false;
            }

            const handle = btnTarget.getAttribute('data-handle');

            if (handle) {
                if (handle.startsWith('not ready')) {
                    const json = await createShopifyProduct(btnTarget.getAttribute('data-id'));
                    btnTarget.setAttribute('data-handle', json.handle);
                }
                window.open(`/products/${btnTarget.getAttribute('data-handle')}`, '_blank')
            } else {
                setBusyBuyButtonState(btnTarget, true);
                
                // getPrintifyProduct(
                //     btnTarget,
                //     btnTarget.getAttribute('data-id'), 
                //     querySearch,
                //     Array.from(btnTarget.closest('.swiper-slide').parentNode.children).indexOf(btnTarget.closest('.swiper-slide')) * document.querySelectorAll('.js-search-swiper').length,
                //     btnTarget.getAttribute('data-mockup')
                // );
            }
        })

        searchViews.forEach((searchView) => {
            searchView.addEventListener('click', (e) => {
                if (e.target.classList.contains('js-generate-more') || e.target.closest('.js-generate-more')) {
                    const btn = e.target.closest('.js-generate-more') ? e.target.closest('.js-generate-more') : e.target;
                    const carousel = btn.closest('.search__wrapper');
                    const slider = btn.closest('.js-search-swiper');
                    const mockupImg = slider.getAttribute('data-mockup-src');
                    const mockupUrl = slider.getAttribute('data-mockup-url');

                    if (btn.classList.contains('loading')) return false;

                    for (let i = 0; i < 2; i++) {
                        slider.swiper.appendSlide(`<div class="swiper-slide">
                            <div class="preview-image"></div>
                            <img src="${mockupImg}" />
                            <button data-mockup="${mockupUrl}" class="btn btn--secondary js-get-product-redirect button button--secondary"><span>Buy</span></button>
                        </div>`);
                    }

                    setResultsBusyState(carousel);
                    setResultsUnavailableState(carousel);
                    setBusyButtonState(btn, true);

                    sendPromptRequest(btn.getAttribute('data-prompt'), true)
                        .then(pendimages => pendimages)
                        .then(images => {
                            removeResultsBusyState(carousel);
                            setBusyButtonState(btn, false);
                            console.log('Got images from Replicate API :>> ', images);
                        });
                }
            });
        });

        if (generateNewSearchPrompt) {
            /** Buttom on the page bottom for generating new search carousels */
            generateNewSearchPrompt.addEventListener('click', async () => {
                if (generateNewSearchPrompt.classList.contains('loading')) return false;

                setBusyButtonState(generateNewSearchPrompt, true);
                /** clone carousel and call swiper */
                /** get all available random prompts */
                /** detect unique prompt which did not used */
                /** sendPromptRequest with new prompt -> will create new item in allPromptResults and update data in new caousel  */
                

                if (!allAvailablePrompts) {
                    const availablePrompts = await fetch(`${API_HOST}/available-prompts?prompt=${querySearch}`, {
                        method: 'GET',
                        headers: {
                            "Access-Control-Allow-Origin": "*",
                            "Content-Type": "application/json",
                        }
                    });
                    
                    allAvailablePrompts = await availablePrompts.json();

                    if (availablePrompts.status !== 200) {
                        console.error(allAvailablePrompts);
                        return false;
                    }                    
                }

                let newUniquePrompt;

                for (let i = 0; i < allAvailablePrompts.length; i += 1) {
                    if (!(allPromptResults.get(allAvailablePrompts[i]))) {
                        newUniquePrompt = allAvailablePrompts[i];
                        
                        break;
                    }
                }

                if (!newUniquePrompt) {
                    const randomKey = Math.floor(Math.random() * allAvailablePrompts.length);

                    newUniquePrompt = allAvailablePrompts[randomKey];
                }

                const addedCarouselWrapper = addNewCarousel().closest('.search__wrapper');

                setResultsBusyState(addedCarouselWrapper);
                setResultsUnavailableState(addedCarouselWrapper);

                sendPromptRequest(newUniquePrompt, true)
                    .then(pendimages => pendimages)
                    .then(images => {
                        setBusyButtonState(generateNewSearchPrompt, false);
                        removeResultsBusyState();
                        console.log('Got images from Replicate API :>> ', images);
                    });
            });
        }
    }

    searchForm.querySelector('input[name="search"]').value = querySearch;
    searchForm.querySelector('input[name="preventAutoExtend"]').checked = preventAutoExtend;
})();
