// CONSTANTS
// const S3_HOST = 'https://aipr.s3.amazonaws.com';
// const LAMBDA_HOST = 'https://q65eekxnmbwkizo3masynrpea40rylba.lambda-url.us-east-1.on.aws'; // us-east-1 - prod
const LAMBDA_HOST = 'https://r4qlyqjkf4sankpkqcvzdqgm540sozvz.lambda-url.eu-central-1.on.aws'; // eu_central-1 - for testing
const PUSHER_ID = '19daec24304eedd7aa8a';
const GENERATION_COUNT = 3;
const DEFAULT_QUERY_SEARCH = 'Panda jumping';

const querySearch = new URL(document.location).searchParams.get('search') || DEFAULT_QUERY_SEARCH;
const queryProductType = new URL(document.location).searchParams.get('productType') || 'UCTS';
const preventAutoExtend = (new URL(document.location).searchParams.get('preventAutoExtend') === "on");
const DEFAULT_T_SHIRT = 'UCTS';
const DEFAULT_COLOR = 'White';

const LS_SEARCH_KEY = 'ai-search';

const WAIT_AI_FIRST = 4000;
const WAIT_AI_CACHE = 500;
const WAIT_AI_NEXT = 2000;

const REQUESTS_LIMIT = 30;
const WAIT_AI_FIRST_RETRY = 667;
const WAIT_AI_RETRY_INCREASE = 1.08;

// VARIABLES
let searchHistory = JSON.parse(localStorage.getItem(LS_SEARCH_KEY) || '{}');

const allPromptResults = new Map();

let allAvailablePrompts;
let searchResultDomCarousels = document.querySelectorAll('.js-search-view .search__wrapper');
let pusher;
const animations = new Map();

// BIND ELEMENTS CONTROLS
const searchForm = document.getElementById('aiSearch');
const searchViews = document.querySelectorAll('.js-search-view');
const productTypeLabel = document.querySelector('.product_type_label span');
/** Buttom on the page bottom for generating new search carousels */
const generateNewSearchPrompt = document.querySelector('.js-get-new-prompt');
const searchDomTemplate = document.querySelector('.js-search-dom-template');
const errorMessagePopup = document.getElementById('error_message')

// INIT PAGE LOAD PROCESSING - FIRST PROMPT
init();

function actualisePreviewMockups(reqProductType) {
    reqProductType = reqProductType || getSelectedProductType();

    const requestedPreviewMockup = window.productImages[reqProductType] || window.productImages.UCTS;
    const productColorSel = document.querySelectorAll('.product_color_filter .product_radiobutton input:checked');
  
    document.querySelectorAll('.preview-mockup').forEach((_mock) => {
      const selectedColor = productColorSel.length > 0 ? productColorSel[0].value : null;
      const availableColors = Object.keys(requestedPreviewMockup);
      const randColor = availableColors[Math.floor(Math.random() * availableColors.length)] || DEFAULT_COLOR;
      const _color = requestedPreviewMockup[selectedColor] ? selectedColor : randColor;

      _mock.src = requestedPreviewMockup[_color];
      _mock.parentNode.querySelector('.preview-image').setAttribute('data-preview-format', reqProductType);
      _mock.parentNode.querySelector('.preview-image').setAttribute('data-preview-color', _color);
    });
  
    document.querySelectorAll('.product_color_filter .product_radiobutton').forEach((rdbtn) => {
      rdbtn.classList.remove('hidden');
      if (!requestedPreviewMockup[rdbtn.getAttribute('data-val')]) {
        rdbtn.classList.add('hidden');
      }
    });
}

// BIND HANDLERS
function bindHanlers() {
    document.querySelector('.search')?.addEventListener('click', handleOpenProduct);
    generateNewSearchPrompt?.addEventListener('click', handleGenerateNewStyle);
    searchViews?.forEach((searchView) => {
        searchView.addEventListener('click', handleGenerateMore);
    });
    
    const searchInput = searchForm.querySelector('input[name="search"]');

    searchInput.addEventListener('blur', () => {
        if (searchInput.value.length === 0) {
            searchInput.value = searchInput.placeholder;
        }
    });

    const productTypeRadio = searchForm.querySelector('radiogroup.product_type_filter');
    const productColorRadio = document.querySelector('radiogroup.product_color_filter');

    productTypeRadio.addEventListener('change', (e) => {
        const reqProductType = e.target.value;
        
        actualisePreviewMockups(reqProductType);
    });   
    productColorRadio.addEventListener('change', () => {
        actualisePreviewMockups();
    });    

    window.addEventListener("storage", function (e) {
        console.log('storage event :>> ', e);
        if (e.key === LS_SEARCH_KEY) {
            searchHistory = JSON.parse(e.newValue)
            if (querySearch.length && searchHistory[querySearch]) {
                Object.entries(searchHistory[querySearch]).forEach(([prompt, requestData]) => {
                    if (typeof requestData[0] === 'string') {
                        requestData = requestData.map(id => ({ id }))
                        prompt = prompt.slice(querySearch.length)
                        searchHistory[querySearch][prompt] = requestData;
                        delete searchHistory[querySearch][querySearch + prompt]
                    }
                })
            }
        }
    });
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

    if (queryProductType && queryProductType.length) {
        const selectedTypeCheckbox = searchForm.querySelector('input[name="productType"][value="'+queryProductType+'"]');

        selectedTypeCheckbox.checked = true;
        productTypeLabel && (productTypeLabel.innerHTML = searchForm.querySelector('input[name="productType"][value="'+queryProductType+'"]').closest('LABEL').innerText);
    }

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
            Promise.all(Object.entries(searchHistory[querySearch]).map(([prompt, requestData]) => {
                if (typeof requestData[0] === 'string') {
                    requestData = requestData.map(id => ({ id }))
                    prompt = prompt.slice(querySearch.length)
                    searchHistory[querySearch][prompt] = requestData;
                    delete searchHistory[querySearch][querySearch + prompt]
                }
                console.log('requestData :>> ', requestData);
                return Promise.all(requestData.map(r => {
                    if (r.images) {
                        updateImagesPreviews({
                            prompt: querySearch + prompt,
                            images: r.images
                        })
                    } else {
                        return waitImagesResult(r.id, true)
                    }
                }))
            })).then(() => {
                removeResultsBusyState();
            }).catch(console.error);
            // const requestIds = Object.values(searchHistory[querySearch])
            //     .reduce((prev, curr) => prev.concat(curr), []);

            // Promise.all(requestIds.map(id => waitImagesResult(id, true)))
            //     .then((images) => {
            //         removeResultsBusyState();
            //     })
            //     .catch(console.error);
            
        // GENERATE
        } else {
            setResultsUnavailableState();
            sendPromptRequest(querySearch, false)
                .then(() => {
                    removeResultsBusyState();
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

function getSelectedProductType() {
    const selectedTypeCheckbox = searchForm.querySelector('input[name="productType"]:checked');

    return selectedTypeCheckbox?.value || queryProductType || DEFAULT_T_SHIRT;
}

function getSelectedProductColor() {
    const selectedColorCheckbox = searchForm.querySelector('input[name="productColor"]:checked');

    return selectedColorCheckbox?.value || DEFAULT_COLOR;
}

function addNewCarousel () {
    const newSearchDom = searchDomTemplate.content.cloneNode(true);
    const searchContainer = generateNewSearchPrompt.closest('.js-search-view');

    searchDomTemplate.before(newSearchDom);

    const newProductsList = searchContainer.querySelector('.search__wrapper:last-of-type .js-search-products');

    return newProductsList;
}

function updateImagesPreviews (promptResult) {
    searchResultDomCarousels = document.querySelectorAll('.js-search-view .search__wrapper');

    if (promptResult.error) {
        trackGoogleError(promptResult.error);
    } else {
        const ids = promptResult.images.map(img => img.id)
        const prevResults = allPromptResults.get(promptResult.prompt)?.filter(result => {
            return !ids.includes(result.id)
        });
        
        const imgs = [
            ...prevResults || [],
            ...promptResult.images,
        ];
        allPromptResults.set(promptResult.prompt, imgs);
    }

    const promptSearchesIterator = allPromptResults.keys();
    const uniqueSearches = Array.from(promptSearchesIterator);

    uniqueSearches.forEach((search, i) => {
        let imgs = allPromptResults.get(search);

        imgs = imgs?.filter(img => img && img.generatedImg);

        if (!searchResultDomCarousels[i]) {
            addNewCarousel();
            searchResultDomCarousels = document.querySelectorAll('.js-search-view .search__wrapper');
        }

        const slider = searchResultDomCarousels[i].querySelector('.js-search-products .products-wrapper');
        const searchPrompt = searchResultDomCarousels[i].querySelector('.js-search-prompt');
        const generateMoreBtn = searchResultDomCarousels[i].querySelector('.js-generate-more');
        const reqProductType = getSelectedProductType();

        searchPrompt && (searchPrompt.textContent = search);
        generateMoreBtn && generateMoreBtn.setAttribute('data-prompt', search);

        if (slider) {
            imgs.forEach((img, j) => {
                const slide = slider.querySelectorAll('.products-item')[j];
                if (slide) {
                    const redirectBtn = slide.querySelector('.js-get-product-redirect');
                    slide.querySelector('.preview-image').style.backgroundImage = `url(${img.generatedImg})`;
                    
                    redirectBtn.setAttribute('data-id', `${img.id}`)
                    redirectBtn.setAttribute('data-handle', `${img.handle || ''}`);
                    img.handle || redirectBtn.classList.add('loading');
                    slide.classList.add('customized');
                } else {
                    appendItem(slider, `<div class="products-item customized">
                        <div class="preview-container">
                            <div class="preview-image" data-preview-format="${reqProductType}" style="background-image: url(${img.generatedImg})"></div>
                            <img class="preview-mockup"/>
                        </div>
                        <button data-id="${img.id}" data-handle="${img.handle || ''}" class="btn btn--secondary ${img.handle ? '' : 'loading'} js-get-product-redirect button button--secondary"><span>${img.handle ? 'Buy Now!' : 'Wait'}</span></button>
                    </div>`);
                }

                if (!img.handle?.length) {
                    console.warn('No product handle found');
                    slide && setBusyBuyButtonState(slide.querySelector('.btn'), true);
                } else {
                    slide && setBusyBuyButtonState(slide.querySelector('.btn'), false);
                }
            });

            actualisePreviewMockups(reqProductType);
        }
    });
}

function checkImagesFullLoaded (pendImagesResult, cacheRun) {
    return pendImagesResult?.images?.length && pendImagesResult.images.every(image => {
        if (cacheRun) {
            image.handle ||= 'not ready';
        }
        
        return image.handle;
    });
}

const timeouts = {};
function resolvePusher(id, data) {
    timeouts[id]?.resolve(data);
    updateImagesPreviews(data);
}
function waitPusher (id, ms) {
    return new Promise(resolve => {
        const timeout = setTimeout(resolve, ms);

        timeouts[id] = {
            resolve(data) {
                clearTimeout(timeout);
                Array.isArray(data) || (data = [data])
                resolve(data);
            }
        }
    });
}

async function waitImagesResult (id, cacheRun) {
    console.time('waitImagesResult', id, cacheRun);

    let imagesResponse;
    let timeout = cacheRun ? 1 : WAIT_AI_FIRST; // 3s for AI and 1s for crop
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
        if (cacheRun) {
            cacheRun = false;
            timeout = WAIT_AI_CACHE;
        } else {
            imagesResponse = await waitPusher(id, timeout); // pusher can send data earlier to us
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
        const loadedCount = imagesResponse?.images?.filter(item => item.generatedImg).length || 0;
        
        if (checkImagesFullLoaded(imagesResponse, cacheRun)) {
            const extendedPrompt = imagesResponse.prompt.slice(querySearch.length);
            
            const item = searchHistory[querySearch][extendedPrompt].find(item => item.id === imagesResponse.requestId)
            item.images = imagesResponse.images.map(({ id, handle, generatedImg }) => {
                return {
                    id, handle, generatedImg
                }
            })
            localStorage.setItem(LS_SEARCH_KEY, JSON.stringify(searchHistory))
            console.timeEnd('waitImagesResult');
            // removeResultsBusyState();
            removeResultsUnavailableState(); /** can buy */
            setBusyButtonState(generateNewSearchPrompt, false);
            document.querySelectorAll('.js-generate-more').forEach((moreBtn) => {
                setBusyButtonState(moreBtn, false);
            });
            break;
        }

        if (loadedCount > loadedImages) {
            timeout = WAIT_AI_NEXT;
            updateImagesPreviews(imagesResponse);
            removeResultsBusyState(); /** images visible */
            loadedImages = loadedCount;
        }

        if (retryCounter === 0) {
            timeout = WAIT_AI_FIRST_RETRY;
        } else {
            timeout *= WAIT_AI_RETRY_INCREASE; 
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
            productType: getSelectedProductType(),
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


    response.forEach(r => {
        searchHistory[querySearch] ||= {};
        const extendedPrompt = r.input.prompt.slice(querySearch.length)

        searchHistory[querySearch][extendedPrompt] ||= [];
        searchHistory[querySearch][extendedPrompt].push({ id: r.id });
        if (r.result) {
            resolvePusher(r.id, r.result);
        }
    })
    
    localStorage.setItem(LS_SEARCH_KEY, JSON.stringify(searchHistory));

    console.timeEnd('generateImages with Replicate AI');

    return Promise.all(response.map(r => waitImagesResult(r.id)))
}

async function createShopifyProduct(imageId, color) {
    console.time('createShopifyProduct', color || getSelectedProductColor());
    const response = await fetch(`${LAMBDA_HOST}/shopify-product`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            imageId,
            type: getSelectedProductType(),
            productVariant: color || getSelectedProductColor(),
            prompt: querySearch
        })
    });
    console.timeEnd('createShopifyProduct');
    const json = await response.json();

    return json;
}

function ellipsisStart (label, text) {
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
function ellipsisEnd (label) {
    const animation = animations.get(label);
    if (!animation) return;
    label.textContent = animation.originalText;
    animations.delete(label);
}

function setBusyButtonState (btn, state) {
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
}

function setBusyBuyButtonState (btn, state) {
    const innerLabel = btn.querySelector('SPAN');

    if (state) {
        btn.classList.add('loading');
        innerLabel && (innerLabel.textContent = 'Wait');
    } else {
        btn.classList.remove('loading');
        innerLabel && (innerLabel.textContent = 'Buy Now!');
    }
}

function setResultsBusyState (_carousel) {
    _carousel
        ? _carousel.classList.add('loading')
            : document.querySelectorAll('.js-search-view .search__wrapper').forEach(carousel => {
            carousel.classList.add('loading');
        });
}

function removeResultsBusyState (_carousel) {
    _carousel
        ? _carousel.classList.remove('loading')
        : document.querySelectorAll('.js-search-view .search__wrapper').forEach(carousel => {
            carousel.classList.remove('loading');
        });
}

function removeResultsUnavailableState (_carousel) {
    _carousel
        ? _carousel.classList.remove('unavailable')
        : document.querySelectorAll('.js-search-view .search__wrapper').forEach(carousel => {
            carousel.classList.remove('unavailable');
        });
}

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

    setBusyBuyButtonState(btnTarget, true);
    
    const colorElem = btnTarget.closest('.products-item').querySelector('[data-preview-color]');
    const handle = btnTarget.getAttribute('data-handle');

    if (handle) {
        if (handle.startsWith('not ready')) {
            const json = await createShopifyProduct(btnTarget.getAttribute('data-id'), colorElem?.getAttribute('data-preview-color') || DEFAULT_COLOR);

            btnTarget.setAttribute('data-handle', json.handle);
        }
        setBusyBuyButtonState(btnTarget, false);
        window.open(`/products/${btnTarget.getAttribute('data-handle')}`, '_blank')
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
    actualisePreviewMockups();

    sendPromptRequest(newUniquePrompt, true)
        .then(() => {
            setBusyButtonState(generateNewSearchPrompt, false);
            removeResultsBusyState();
        });
}

function handleGenerateMore(event) {
    const moreBtn = event.target.classList.contains('js-generate-more')
        ? event.target
        : event.target.closest('.js-generate-more');

    if (!moreBtn) return;

    const carousel = moreBtn.closest('.search__wrapper');
    const slider = carousel.querySelector('.js-search-products .products-wrapper');
    const reqProductType = getSelectedProductType();

    if (moreBtn.classList.contains('loading')) return false;

    for (let i = 0; i < GENERATION_COUNT; i++) {
        appendItem(slider, `<div class="products-item">
                    <div class="preview-container">
                        <div class="preview-image" data-preview-format="${reqProductType}"></div>
                        <img class="preview-mockup"/>
                    </div>
                    <button class="btn btn--secondary js-get-product-redirect button button--secondary"><span>Buy Now!</span></button>
                </div>`);
    }

    actualisePreviewMockups(reqProductType);
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