// CONSTANTS
const LS_SEARCH_KEY = 'ai-search';
// const API_HOST = 'https://lime-filthy-duckling.cyclic.app';
// const S3_HOST = 'https://aipr.s3.amazonaws.com';
const LAMBDA_HOST = 'https://q65eekxnmbwkizo3masynrpea40rylba.lambda-url.us-east-1.on.aws'; // us-east-1 - prod
// const LAMBDA_HOST = 'https://r4qlyqjkf4sankpkqcvzdqgm540sozvz.lambda-url.eu-central-1.on.aws'; // eu_central-1 - for testing
const PUSHER_ID = '19daec24304eedd7aa8a';
const GENERATION_COUNT = 3;
const REQUESTS_LIMIT = 100;
const querySearch = new URL(document.location).searchParams.get('search') || '';
const queryProductType = new URL(document.location).searchParams.get('productType') || '';
const preventAutoExtend = (new URL(document.location).searchParams.get('preventAutoExtend') === "on");

// VARIABLES
const searchHistory = JSON.parse(localStorage.getItem(LS_SEARCH_KEY) || '{}');
const allPromptResults = new Map();

let allAvailablePrompts;
let searchResultDomCarousels = document.querySelectorAll('.js-search-view .search__wrapper');
let pusher;

// BIND ELEMENTS CONTROLS
const searchForm = document.getElementById('aiSearch');
const searchInput = searchForm.querySelector('input[name="search"]');
const searchViews = document.querySelectorAll('.js-search-view');
const productTypeLabel = document.querySelector('.product_type_label span');
/** Buttom on the page bottom for generating new search carousels */
const generateNewSearchPrompt = document.querySelector('.js-get-new-prompt');
const searchDomTemplate = document.querySelector('.js-search-dom-template');
const errorMessagePopup = document.getElementById('error_message')

// BIND HANDLERS
function bindHanlers() {
    document.querySelector('.search')?.addEventListener('click', handleOpenProduct);
    generateNewSearchPrompt?.addEventListener('click', handleGenerateNewStyle);
    searchViews?.forEach((searchView) => {
        searchView.addEventListener('click', handleGenerateMore);
    });
    searchInput.addEventListener('input', () => {
        if (searchInput.value.length === 0) {
            searchInput.value = searchInput.placeholder;
        }
    })
}

function appendItem(parentElement, itemHtml) {
    const tempContainer = document.createElement('div');

    tempContainer.innerHTML = itemHtml;
    parentElement.appendChild(tempContainer.firstChild);
}

function init() {
    if (!searchForm || !searchViews.length) return;

    searchForm.querySelector('input[name="search"]').value = querySearch;
    searchForm.querySelector('input[name="preventAutoExtend"]').checked = preventAutoExtend;
    searchForm.querySelector('input[name="productType"][value="'+queryProductType+'"]').checked = true;
    productTypeLabel.innerHTML = searchForm.querySelector('input[name="productType"][value="'+queryProductType+'"]').closest('LABEL').innerText;

    getAvailablePrompts()
        .then(json => {
            allAvailablePrompts = json;
        })
        .catch(console.error)

    try {
        pusherInit();
    } catch (e) {
        console.error('pusher error', e)
    }

    if (querySearch.length) {
        // GET CACHED
        if (searchHistory[querySearch]) {
            const requestIds = Object.values(searchHistory[querySearch])
                .reduce((prev, curr) => prev.concat(curr), []);

            Promise.all(requestIds.map(id => waitImagesResult(id, true)))
                .then((images) => {
                    removeResultsBusyState();
                    console.log('Got images from LS :>> ', ...images);
                })
                .catch(console.error);
            
        // GENERATE
        } else {
            setResultsUnavailableState();
            sendPromptRequest(querySearch, false)
                .then(images => {
                    removeResultsBusyState();
                    console.log('Got images from Replicate API :>> ', images);
                })
                .catch(console.error);
        }
    }

    bindHanlers();
}

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

    const newProductsList = searchContainer.querySelector('.search__wrapper:last-of-type .js-search-products');

    return newProductsList;
};

const updateImagesPreviews = (promptResult) => {
    console.log('promptResult', promptResult)
    searchResultDomCarousels = document.querySelectorAll('.js-search-view .search__wrapper');

    if (promptResult.error) {
        trackGoogleError(promptResult.error);
    } else {
        const ids = promptResult.images.map(img => img.id)
        const prevResults = allPromptResults.get(promptResult.prompt)?.filter(result => {
            return !ids.includes(result.id)
        });
        console.log('allPromptResults.get(result.prompt) :>> ', allPromptResults.get(promptResult.prompt), prevResults);
        console.log('result.images :>> ', promptResult.images);
        const imgs = [
            ...prevResults || [],
            ...promptResult.images,
        ];
        allPromptResults.set(promptResult.prompt, imgs);
    }

    const promptSearchesIterator = allPromptResults.keys();
    const uniqueSearches = Array.from(promptSearchesIterator);
    console.log('allPromptResults :>> ', promptSearchesIterator, uniqueSearches);

    uniqueSearches.forEach((search, i) => {
        let imgs = allPromptResults.get(search);

        console.log('imgs :>> ', imgs);

        imgs = imgs?.filter(img => img && img.generatedImg);

        console.log('imgs', imgs)

        if (!searchResultDomCarousels[i]) {
            addNewCarousel();
            searchResultDomCarousels = document.querySelectorAll('.js-search-view .search__wrapper');
        }

        const slider = searchResultDomCarousels[i].querySelector('.js-search-products .products-wrapper');
        const searchPrompt = searchResultDomCarousels[i].querySelector('.js-search-prompt');
        const generateMoreBtn = searchResultDomCarousels[i].querySelector('.js-generate-more');
        console.log('Products slider', slider);
        const mockupImg = slider.parentNode.getAttribute('data-mockup-src');

        console.log('searchPrompt,search :>> ', searchPrompt, search);
        searchPrompt && (searchPrompt.textContent = search);
        generateMoreBtn && generateMoreBtn.setAttribute('data-prompt', search);

        if (slider) {
            console.log(1)
            imgs.forEach((img, j) => {
                const slide = slider.querySelectorAll('.products-item')[j];
                console.log(2, img)
                if (slide) {
                    const redirectBtn = slide.querySelector('.js-get-product-redirect');
                    slide.querySelector('.preview-image').style.backgroundImage = `url(${img.generatedImg})`;
                    
                    redirectBtn.setAttribute('data-id', `${img.id}`)
                    redirectBtn.setAttribute('data-handle', `${img.handle || ''}`);
                    img.handle || redirectBtn.classList.add('loading');
                    slide.classList.add('customized');
                } else {
                    appendItem(slider, `<div class="products-item customized">
                        <div class="preview-image" style="background-image: url(${img.generatedImg})"></div>
                        <img src="${mockupImg}"/>
                        <button data-id="${img.id}" data-handle="${img.handle || ''}" class="btn btn--secondary ${img.handle ? '' : 'loading'} js-get-product-redirect button button--secondary"><span>${img.handle ? '$34.99 Buy Now!' : 'Wait'}</span></button>
                    </div>`);
                }

                if (!img.handle?.length) {
                    console.error('No product handle found');
                    slide && setBusyBuyButtonState(slide.querySelector('.btn'), true);
                } else {
                    slide && setBusyBuyButtonState(slide.querySelector('.btn'), false);
                }
            });
        }
    });
}

const checkImagesFullLoaded = (pendImagesResult, cacheRun) => {
    console.log('checkImagesFullLoaded :>> ', pendImagesResult);
    return pendImagesResult?.images?.length && pendImagesResult.images.every(image => {
        if (cacheRun) {
            console.log('cacheRun - setting not ready');
            image.handle ||= 'not ready';
        }
        
        return image.handle;
    });
    // return pendImagesResult.every(result => {
    // });
}

const timeouts = {};
function resolvePusher(id, data) {
    timeouts[id]?.resolve(data);
    updateImagesPreviews(data);
}
const waitPusher = (id, ms) => new Promise(resolve => {
    const timeout = setTimeout(resolve, ms);

    timeouts[id] = {
        resolve(data) {
            clearTimeout(timeout);
            Array.isArray(data) || (data = [data])
            resolve(data);
        }
    }
});
async function waitImagesResult (id, cacheRun) {
    console.time('waitImagesResult', id, cacheRun);

    let imagesResponse;
    let timeout = cacheRun ? 1 : 4000; // 3s for AI and 1s for crop
    let loadedImages = 0;

    // if (!cacheRun) {
    //     const channel = pusher.subscribe(id);

    //     channel.bind('1', function (data) {
    //         // we can handle updates here
    //         console.log('<< pusher >>', data);
    //         resolvePusher(id, data)
    //     });
    // }

    for (let retryCounter = 0; retryCounter < REQUESTS_LIMIT; retryCounter += 1) {
        if (!cacheRun) {
            imagesResponse = await waitPusher(id, timeout); // pusher can send data earlier to us
            console.log('imagesResponse :>> ', imagesResponse);
        } else {
            cacheRun = false;
            timeout = 500;
        }
        
        if (!imagesResponse) {
            const imagesRequest = await fetch(`${LAMBDA_HOST}/image?requestId=${id}`, {
                method: 'GET'
            });
            if (imagesRequest.status !== 200) {
                console.error(imagesRequest.status, imagesRequest.statusText);

                trackGoogleError(`Error images request ${JSON.stringify([imagesRequest.status, imagesRequest.statusText])}`);

                pusher.unsubscribe(id);

                return imagesResponse;
            }
            imagesResponse = await imagesRequest.json();
        }

        if (imagesResponse?.nsfw) {
            errorMessagePopup?.$show();
            break;
        }

        if (checkImagesFullLoaded(imagesResponse, cacheRun)) {
            console.timeEnd('waitImagesResult');
            console.log('All images ready to buy');
            // removeResultsBusyState();
            removeResultsUnavailableState(); /** can buy */
            setBusyButtonState(generateNewSearchPrompt, false);
            break;
        }

        const loadedCount = imagesResponse?.images?.filter(item => item.generatedImg).length || 0;

        if (loadedCount > loadedImages) {
            console.log('updateImagesPreviews :>> ', updateImagesPreviews);
            timeout += 1000;
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
    pusher.unsubscribe(id);

    if (imagesResponse.images && imagesResponse.images.length === 0) {
        trackGoogleError(`Can't get images. Probably DB connection error`);
    }

    updateImagesPreviews(imagesResponse);

    return imagesResponse;
}

async function sendPromptRequest(prompt, isFullPrompt) {
    console.time('generateImages with Replicate AI');
    const reqDate = Date.now();

    const channel = pusher.subscribe(String(reqDate));

    channel.bind('1', function (data) {
        // we can handle updates here
        console.log('<< pusher >>', data);
        resolvePusher(data.requestId, data)
    });

    const sendSearch = await fetch(`${LAMBDA_HOST}/prompt`, {
        method: 'POST',
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            preventAutoExtend,
            productType: queryProductType,
            fullPrompt: isFullPrompt && prompt,
            prompt: querySearch,
            reqDate,
            count: GENERATION_COUNT,
        })
    });

    const response = await sendSearch.json();

    if (![200, 201].includes(sendSearch.status) || response.error) {
        console.error(response);
        errorMessagePopup?.$show()

        return false;
    }

    console.log('response :>> ', response);

    response.forEach(r => {
        searchHistory[querySearch] ||= {};
        searchHistory[querySearch][r.input.prompt] ||= [];
        searchHistory[querySearch][r.input.prompt].push(r.id);
        if (r.result) {
            resolvePusher(r.id, r.result);
        }
    })
    
    localStorage.setItem(LS_SEARCH_KEY, JSON.stringify(searchHistory));

    console.timeEnd('generateImages with Replicate AI');

    return Promise.all(response.map(r => waitImagesResult(r.id)))
}

async function createShopifyProduct(imageId) {
    console.time('createShopifyProduct');
    const response = await fetch(`${LAMBDA_HOST}/shopify-product`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            imageId,
            type: queryProductType, /* t-shirt ? */
            prompt: querySearch
        })
    });
    console.log('response :>> ', response.status, response.statusText);
    console.timeEnd('createShopifyProduct');
    const json = await response.json();
    console.log('json :>> ', json);
    return json;
}

const animations = new Map();
const ellipsisStart = (label, text) => {
    const originalText = label.textContent;
    let step = 0;

    const ellipsis = () => {
        animations.set(label, {
            originalText,
        });
        label.textContent = text + '.'.repeat(step);
        step += step < 3 ? 1 : -3;
    }
    ellipsis();
}
const ellipsisEnd = label => {
    const animation = animations.get(label);
    if (!animation) return;
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
        innerLabel && (innerLabel.textContent = '$34.99 Buy Now!');
    }
};

const setResultsBusyState = (_carousel) => {
    _carousel
        ? _carousel.classList.add('loading')
            : document.querySelectorAll('.js-search-view .search__wrapper').forEach(carousel => {
            carousel.classList.add('loading');
        });
};

const removeResultsBusyState = (_carousel) => {
    _carousel
        ? _carousel.classList.remove('loading')
        : document.querySelectorAll('.js-search-view .search__wrapper').forEach(carousel => {
            carousel.classList.remove('loading');
        });
};

const removeResultsUnavailableState = (_carousel) => {
    _carousel
        ? _carousel.classList.remove('unavailable')
        : document.querySelectorAll('.js-search-view .search__wrapper').forEach(carousel => {
            carousel.classList.remove('unavailable');
        });
};

function setResultsUnavailableState (_carousel) {
    _carousel
        ? _carousel.classList.add('unavailable')
        : document.querySelectorAll('.js-search-view .search__wrapper').forEach(carousel => {
            carousel.classList.add('unavailable');
        });
}

async function handleOpenProduct(event) {
    let btnTarget;

    if (event.target.classList.contains('js-get-product-redirect')) {
        btnTarget = event.target;
    } else if (event.target.tagName.toLowerCase() === 'img') {
        btnTarget = event.target.closest('.products-item').querySelector('.js-get-product-redirect');
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
    }
}

async function getAvailablePrompts() {
    const availablePrompts = await fetch(`${LAMBDA_HOST}/available-prompts?prompt=${querySearch}`, {
        method: 'GET',
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
        }
    });

    const jsonResponse = await availablePrompts.json();

    if (availablePrompts.status !== 200) {
        console.error(jsonResponse);
        return false;
    }

    return jsonResponse;
}

async function handleGenerateNewStyle() {
    if (generateNewSearchPrompt.classList.contains('loading')) return false;

    setBusyButtonState(generateNewSearchPrompt, true);
    /** clone carousel and call swiper */
    /** get all available random prompts */
    /** detect unique prompt which did not used */
    /** sendPromptRequest with new prompt -> will create new item in allPromptResults and update data in new carousel  */


    if (!allAvailablePrompts) {
        allAvailablePrompts = await getAvailablePrompts();
    }

    let newUniquePrompt;

    for (const element of allAvailablePrompts) {
        if (!allPromptResults.get(element)) {
            newUniquePrompt = element;

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
        .then(images => {
            setBusyButtonState(generateNewSearchPrompt, false);
            removeResultsBusyState();
            console.log('Got images from Replicate API :>> ', images);
        });
}

function handleGenerateMore(event) {
    const moreBtn = event.target.classList.contains('js-generate-more')
        ? event.target
        : event.target.closest('.js-generate-more');

    if (!moreBtn) return;

    const carousel = moreBtn.closest('.search__wrapper');
    const slider = carousel.querySelector('.js-search-products .products-wrapper');
    const mockupImg = slider.parentNode.getAttribute('data-mockup-src');

    if (moreBtn.classList.contains('loading')) return false;

    for (let i = 0; i < GENERATION_COUNT; i++) {
        appendItem(slider, `<div class="products-item">
                    <div class="preview-image"></div>
                    <img src="${mockupImg}" />
                    <button class="btn btn--secondary js-get-product-redirect button button--secondary"><span>$34.99 Buy Now!</span></button>
                </div>`);
    }

    setResultsBusyState(carousel);
    setResultsUnavailableState(carousel);
    setBusyButtonState(moreBtn, true);

    sendPromptRequest(moreBtn.getAttribute('data-prompt'), true)
        .then(images => {
            removeResultsBusyState(carousel);
            setBusyButtonState(moreBtn, false);
            console.log('Got images from Replicate API :>> ', images);
        });
}

function pusherInit() {
    if (!window.Pusher) {
        return setTimeout(pusherInit, 33)
    }
    window.Pusher.logToConsole = true;

    pusher = new window.Pusher(PUSHER_ID, {
        cluster: 'mt1'
    });
}

// INIT PAGE LOAD PROCESSING - FIRST PROMPT
init();
