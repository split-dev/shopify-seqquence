(() => {
    const LS_SEARCH_KEY = 'ai-search';
    const searchForm = document.getElementById('aiSearch');
    const generateNewSearchPrompt = document.querySelector('.js-get-new-prompt');
    const searchViews = document.querySelectorAll('.js-search-view');
    const localSearch = localStorage.getItem(LS_SEARCH_KEY);
    const API_HOST = 'https://awesome-code-nkh8j.cloud.serverless.com';
    const searchHistory = localSearch ? JSON.parse(localSearch) : {};
    const REQUESTS_LIMIT = 270;
    const sleep = ms => new Promise(res => setTimeout(res, ms));
    const imagesResult = {};
    const allPromptResults = new Map();
    let querySearch = new URL(document.location).searchParams.get('search') || '';
    let allAvailablePrompts;
    let searchResultDomCarousels = document.querySelectorAll('.js-search-view .search__wrapper');

    if (!searchForm || !searchViews.length) return;

    const trackGoogleError = (err) => {
        window.gtag && window.gtag('event', 'error', {
            'event_category': 'Replicate AI ERROR',
            'event_label': 'Images request error',
            'value': err
        });
    };

    const addNewCarousel = () => {
        const searchDomTemplate = document.querySelector('.js-search-dom-template');
        const newSearchDom = searchDomTemplate.content.cloneNode(true);
        const searchContainer = generateNewSearchPrompt.closest('.js-search-view');

        searchDomTemplate.before(newSearchDom);

        const slider = searchContainer.querySelector('.js-search-swiper:not(.swiper-initialized)');

        new Swiper(slider, {
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
    };

    const updateImagesPreviews = (promptResult) => {
        searchResultDomCarousels = document.querySelectorAll('.js-search-view .search__wrapper');

        promptResult.forEach((result, i) => {
            if (result.error) {
                trackGoogleError(result.error);
            } else {
                if (allPromptResults.get(result.prompt)) {
                    allPromptResults.set(result.prompt, Object.assign({}, allPromptResults.get(result.prompt), result.images));
                } else {
                    allPromptResults.set(result.prompt, result.images);
                }
            }
        });

        const promptSearchesIterator = allPromptResults.keys();
        const uniqueSearches = Array.from(promptSearchesIterator);

        uniqueSearches.forEach((search, i) => {
            const imgs = allPromptResults.get(search);

            imagesResult[i] = imagesResult[i] || {};

            Object.keys(imgs).forEach((key) => {
                if (imgs[key] && imgs[key].tShirtResult) {
                    imagesResult[i][key] = imgs[key].tShirtResult;   
                } else {
                    trackGoogleError(`There is no image result for search query: ${search} and id: ${key}`);
                }
            });

            if (!searchResultDomCarousels[i] && generateNewSearchPrompt) {
                addNewCarousel();
                searchResultDomCarousels = document.querySelectorAll('.js-search-view .search__wrapper');
            }

            const slider = searchResultDomCarousels[i].querySelector('.js-search-swiper');
            const searchPrompt = searchResultDomCarousels[i].querySelector('.js-search-prompt');
            const generateMoreBtn = searchResultDomCarousels[i].querySelector('.js-generate-more');
            const mockupImg = slider.getAttribute('data-mockup-src');
            const mockupUrl = slider.getAttribute('data-mockup-url');

            searchPrompt && (searchPrompt.textContent = search);
            generateMoreBtn && generateMoreBtn.setAttribute('data-prompt', search);

            if (slider) {
                Object.keys(imagesResult[i]).forEach((key, j) => {
                    const slide = slider.querySelectorAll('.swiper-slide')[j];
                    
                    if (slide) {
                        slide.querySelector('IMG').setAttribute('src', imagesResult[i][key]);
                        slide.querySelector('A').setAttribute('href', `${mockupUrl}?key=${key}`);
                        slide.classList.add('customized');
                    } else {
                        slider.swiper.appendSlide(`<div class="swiper-slide customized"><a href="${mockupUrl}?key=${key}" target="_blank"><img src="${imagesResult[i][key]}" /></a></div>`);
                    }
                });
                if (slider.swiper.slides[slider.swiper.slides.length - 1].classList.contains('customized')) {
                    slider.swiper.appendSlide(`<div class="swiper-slide"><a href="${mockupUrl}" target="_blank"><img src="${mockupImg}" /></a></div>`);
                }
                slider.swiper.slideTo(slider.swiper.slides.length);
            }
        });

        console.log('FULL imagesResult :>> ', imagesResult);
    }

    const waitImagesResult = async (ids, initialTimeout) => {
        let imagesResponse;
        let timeout = initialTimeout || 10000;
        let loadedImages = 0;

        for (let i = 0; i < REQUESTS_LIMIT; i += 1) {
            const imagesRequest = await fetch(`${API_HOST}/image?requestId=${ids.join(',')}`, {
                method: 'GET'
            });
    
            imagesResponse = await imagesRequest.json();
    
            if (imagesRequest.status !== 200) {
                console.error(imagesResponse);
                
                return imagesResponse;
            }

            if (imagesResponse.length === ids.length) {
                break;
            }

            if (imagesResponse.length > loadedImages) {
                updateImagesPreviews(imagesResponse);
                loadedImages = imagesResponse.length;
            }

            console.log(`pending images...next ping in ${timeout/1000} seconds`);

            await sleep(timeout);
            timeout = 1000;
        }

        updateImagesPreviews(imagesResponse);

        return imagesResponse;
    };

    const sendPromptRequest = async (prompt, isFullPrompt) => {
        const sendSearch = await fetch(`${API_HOST}/prompt`, {
            method: 'POST',
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ 
                [isFullPrompt ? `fullPrompt` : `prompt`]: prompt
            })
        });

        const response = await sendSearch.json();

        if (sendSearch.status !== 201) {
            console.error(response);
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

        return await waitImagesResult(queuesIds);
    };

    const setBusyButtonState = (btn, state) => {
        const innerLabel = btn.querySelector('SPAN');

        if (state) {
            btn.classList.add('loading');
            innerLabel && (innerLabel.textContent = 'Loading...');
        } else {
            btn.classList.remove('loading');
            innerLabel && (innerLabel.textContent = 'Create more');
        }
    };

    const removeResultsBusyState = () => {
        searchResultDomCarousels.forEach(carousel => {
            carousel.classList.remove('loading');
        });
    };

    if (querySearch.length) {            
        /** PAGE LOAD STARTS HERE! */
        if (searchHistory[querySearch]) {
            const requestIds = Object.values(searchHistory[querySearch]).reduce((prev, curr) => prev.concat(curr), []);

            waitImagesResult(requestIds, 1)
                .then((images) => {
                    removeResultsBusyState();
                    console.log('Got images from LS :>> ', images);
                });
        } else {
            sendPromptRequest(querySearch)
                .then(pendimages => pendimages)
                .then(images => {
                    removeResultsBusyState();
                    console.log('Got images from Replicate API :>> ', images);
                });
        }

        searchViews.forEach((searchView, i) => {
            searchView.addEventListener('click', (e) => {
                if (e.target.classList.contains('js-generate-more')) {
                    const btn = e.target;

                    if (btn.classList.contains('loading')) return false;

                    setBusyButtonState(btn, true);
    
                    sendPromptRequest(btn.getAttribute('data-prompt'), true)
                        .then(pendimages => pendimages)
                        .then(images => {
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

                
                sendPromptRequest(newUniquePrompt, true)
                    .then(pendimages => pendimages)
                    .then(images => {
                        setBusyButtonState(generateNewSearchPrompt, false);
                        console.log('Got images from Replicate API :>> ', images);
                    });
            });
        }
    }

    searchForm.querySelector('input[name="search"]').value = querySearch;
})();