(() => {
    const LS_SEARCH_KEY = 'ai-search';
    const searchForm = document.getElementById('aiSearch');
    const generateMoreBtn = document.querySelectorAll('.js-generate-more');
    const searchViews = document.querySelectorAll('.js-search-view');
    const localSearch = localStorage.getItem(LS_SEARCH_KEY);
    const API_HOST = 'https://awesome-code-nkh8j.cloud.serverless.com';
    const searchHistory = localSearch ? JSON.parse(localSearch) : {};
    const REQUESTS_LIMIT = 270;
    const sleep = ms => new Promise(res => setTimeout(res, ms));
    const imagesResult = {};
    const allPromptResults = new Map();
    let querySearch = new URL(document.location).searchParams.get('search') || '';

    if (!searchForm || !searchViews.length) return;

    const updateImagesPreviews = (promptResult) => {
        promptResult.forEach((result, i) => {
            if (allPromptResults.get(result.prompt)) {
                allPromptResults.set(result.prompt, Object.assign({}, allPromptResults.get(result.prompt), result.images));
            } else {
                allPromptResults.set(result.prompt, result.images);
            }
        });

        const promptSearchesIterator = allPromptResults.keys();
        const uniqueSearches = Array.from(promptSearchesIterator);

        uniqueSearches.forEach((search, i) => {
            const imgs = allPromptResults.get(search);

            Object.keys(imgs).forEach((key) => {
                imagesResult[i] = imagesResult[i] || {};
                imagesResult[i][key] = imgs[key].tShirtResult;
            });

            if (searchViews[i]) {
                const slider = searchViews[i].querySelector('.js-search-swiper');
                const searchPrompt = searchViews[i].querySelector('.js-search-prompt');
                const generateMoreBtn = searchViews[i].querySelector('.js-generate-more');

                searchPrompt && (searchPrompt.textContent = search);
                generateMoreBtn && generateMoreBtn.setAttribute('data-prompt', search);

                if (slider) {
                    Object.keys(imagesResult[i]).forEach((key, j) => {
                        const slide = slider.querySelectorAll('.swiper-slide')[j];
                        
                        if (slide) {
                            slide.querySelector('IMG').setAttribute('src', imagesResult[i][key]);
                            slide.querySelector('A').setAttribute('href', `/products/t-shirt-mockup?key=${key}`);
                        } else {
                            slider.swiper.appendSlide(`<div class="swiper-slide"><a href="/products/t-shirt-mockup?key=${key}" target="_blank"><img src="${imagesResult[i][key]}" /></a></div>`);
                        }
                    });
                }
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

    if (querySearch.length) {            
        if (searchHistory[querySearch]) {
            const requestIds = Object.values(searchHistory[querySearch]).reduce((prev, curr) => prev.concat(curr), []);

            waitImagesResult(requestIds, 1)
                .then((images) => {
                    console.log('Got images from LS :>> ', images);
                });
        } else {
            sendPromptRequest(querySearch)
                .then(pendimages => pendimages)
                .then(images => {
                    console.log('Got images from Replicate API :>> ', images);
                });
        }

        generateMoreBtn.forEach((btn, i) => {
            btn.addEventListener('click', () => {
                sendPromptRequest(btn.getAttribute('data-prompt'), true)
                    .then(pendimages => pendimages)
                    .then(images => {
                        console.log('Got images from Replicate API :>> ', images);
                    });
            });
        });
    }

    searchForm.querySelector('input[name="search"]').value = querySearch;
})();