(() => {
    const LS_SEARCH_KEY = 'ai-search';
    const searchForm = document.getElementById('aiSearch');
    const searchSwiper = document.getElementById('search-swiper');
    const searchPrompt = document.getElementById('search-prompt');
    const generateMoreBtn = document.getElementById('generate-more');
    const localSearch = localStorage.getItem(LS_SEARCH_KEY);
    const API_HOST = 'https://awesome-code-nkh8j.cloud.serverless.com';
    const searchHistory = localSearch ? JSON.parse(localSearch) : {};
    const REQUESTS_LIMIT = 270;
    const sleep = ms => new Promise(res => setTimeout(res, ms));
    const imagesResult = {};
    const fullPrompt = new Set();
    let querySearch = new URL(document.location).searchParams.get('search') || '';

    if (!searchForm || !searchSwiper || !searchPrompt) return;

    const updateImagesPreviews = (images) => {
        images.forEach((image) => {
            fullPrompt.add(image.prompt);

            Object.keys(image.images).forEach((key) => {
                imagesResult[key] = image.images[key].tShirtResult;
            });
        });

        Object.keys(imagesResult).forEach((key, i) => {
            const slide = searchSwiper.querySelectorAll('.swiper-slide')[i];
            
            if (slide) {
                slide.querySelector('IMG').setAttribute('src', imagesResult[key]);
            } else {
                document.getElementById('search-swiper').swiper.appendSlide(`<div class="swiper-slide"><img src="${imagesResult[key]}" /></div>`);
            }
        });

        searchPrompt.textContent = [...fullPrompt].join('; ');
    }

    const waitImagesResult = async (ids, initialTimeout) => {
        let imagesResponse;
        let timeout = initialTimeout || 30000;
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

            console.log('pending images...');

            await sleep(timeout);
            timeout = 1000;
        }

        updateImagesPreviews(imagesResponse);

        return imagesResponse;
    };

    const sendPromptRequest = async (prompt) => {
        const sendSearch = await fetch(`${API_HOST}/prompt`, {
            method: 'POST',
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ prompt })
        });

        const response = await sendSearch.json();

        if (sendSearch.status !== 201) {
            console.error(response);
            return false;
        }

        const queuesIds = response.map(r => r.id);

        if (searchHistory[prompt]) {
            searchHistory[prompt] = searchHistory[prompt].concat(queuesIds);
        } else {
            searchHistory[prompt] = queuesIds;
        }
        
        localStorage.setItem(LS_SEARCH_KEY, JSON.stringify(searchHistory));

        return await waitImagesResult(queuesIds);
    };

    if (querySearch.length) {            
        if (searchHistory[querySearch]) {
            waitImagesResult(searchHistory[querySearch], 1)
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
    }

    generateMoreBtn.addEventListener('click', () => {
        sendPromptRequest(querySearch)
            .then(pendimages => pendimages)
            .then(images => {
                console.log('Got images from Replicate API :>> ', images);
            });
    });

    searchForm.querySelector('input[name="search"]').value = querySearch;
})();