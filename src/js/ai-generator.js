// CONSTANTS
// const S3_HOST = 'https://aipr.s3.amazonaws.com';
// const LAMBDA_HOST = 'https://q65eekxnmbwkizo3masynrpea40rylba.lambda-url.us-east-1.on.aws'; // us-east-1 - prod
const LAMBDA_HOST = 'https://r4qlyqjkf4sankpkqcvzdqgm540sozvz.lambda-url.eu-central-1.on.aws'; // eu_central-1 - for testing
const PUSHER_ID = '19daec24304eedd7aa8a';
const GENERATION_COUNT = 3;
const DEFAULT_QUERY_SEARCH = 'Panda jumping';

const searchParams = new URL(document.location).searchParams;

const querySearch = searchParams.get('search') || DEFAULT_QUERY_SEARCH;
const queryProductType = searchParams.get('productType') || 'UCTS';
const preventAutoExtend = (searchParams.get('preventAutoExtend') === "on");
const DEFAULT_T_SHIRT = 'UCTS';
const SKU_CASE = 'CASE';
const DEFAULT_COLOR = 'White';

const LS_SEARCH_KEY = 'ai-search';

const WAIT_AI_FIRST = 4000;
const WAIT_AI_CACHE = 500;
const WAIT_AI_NEXT = 2000;

const REQUESTS_LIMIT = 30;
const WAIT_AI_FIRST_RETRY = 667;
const WAIT_AI_RETRY_INCREASE = 1.08;

console.time('init');
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

function actualisePreviewMockups(reqProductType, changeColors) {
    reqProductType = reqProductType || getSelectedProductType();

    const requestedPreviewMockup = window.productImages[reqProductType] || window.productImages.UCTS;
    const productColorSel = document.querySelectorAll('.product_color_filter .product_radiobutton input:checked');

    document.querySelectorAll('.preview-mockup').forEach((_mock) => {
        const selectedColor = productColorSel.length > 0 ? productColorSel[0].value : null;
        const availableColors = Object.keys(requestedPreviewMockup);
        const randColor = availableColors[Math.floor(Math.random() * availableColors.length)] || DEFAULT_COLOR;
        let currColor = _mock.parentNode.querySelector('.preview-image').getAttribute('data-preview-color')
        if (!availableColors.includes(currColor)) {
            currColor = null;
        }
        const newColor = !changeColors && currColor || randColor;
        const _color = requestedPreviewMockup[selectedColor] ? selectedColor : newColor;

        if (reqProductType === SKU_CASE) {
            _mock.parentNode.classList.add('downscaled');
            _mock.classList.add('case-frame')
            // return;
        } else {
            _mock.parentNode.classList.remove('downscaled');
            _mock.classList.remove('case-frame')
        }
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
    window.onpopstate = function (event) {
        console.warn(`location: ${document.location}, state: ${JSON.stringify(event.state)}`)
    }
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
        const url = new URL(window.location.href);
        url.searchParams.set('productType', reqProductType);
        history.replaceState && history.replaceState({ reqProductType }, null, url.href)
        
        actualisePreviewMockups(reqProductType, true);
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
    console.timeLog('init', 'init  start');

    // searchForm.querySelector('input[name="search"]').value = querySearch;
    // searchForm.querySelector('input[name="preventAutoExtend"]').checked = preventAutoExtend;

    if (queryProductType && queryProductType.length) {
        const selectedTypeCheckbox = searchForm.querySelector('input[name="productType"][value="'+queryProductType+'"]');

        selectedTypeCheckbox.checked = true;
        productTypeLabel && (productTypeLabel.innerHTML = searchForm.querySelector('input[name="productType"][value="'+queryProductType+'"]').closest('LABEL').innerText);
    }
    // actualisePreviewMockups(getSelectedProductType())

    Promise.resolve(getPromptComplitions())
        .then(json => {
            allAvailablePrompts = json;
            console.log(json)
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
                        console.timeLog('init', 'updateImagesPreviews');

                        
                    } else {
                        return waitImagesResult(r.id, true)
                    }
                }))
            })).then(() => {
                removeResultsBusyState();
                actualisePreviewMockups(getSelectedProductType());
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
    console.timeEnd('init')
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
                    img.handle ||= 'not ready';
                    redirectBtn.setAttribute('data-id', `${img.id}`)
                    // redirectBtn.setAttribute('data-handle', `${img.handle || ''}`);
                    // img.handle || redirectBtn.classList.add('loading');
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

                slide && setBusyBuyButtonState(slide.querySelector('.btn'), false);
            });

            actualisePreviewMockups(reqProductType);
        }
    });
}

function checkImagesFullLoaded (pendImagesResult, cacheRun) {
    const loaded = pendImagesResult?.images?.length;
    return (cacheRun ? loaded === 3 : loaded) && pendImagesResult.images.every(image => {
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

async function createShopifyProduct(imageId, type, color) {
    console.time('createShopifyProduct', color);
    const response = await fetch(`${LAMBDA_HOST}/shopify-product`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            imageId,
            type,
            productVariant: color,
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
    // const handle = btnTarget.getAttribute('data-handle');

    const params = {
        imageId: btnTarget.getAttribute('data-id'),
        type: getSelectedProductType(),
        color: colorElem.getAttribute('data-preview-color') || getSelectedProductColor() || DEFAULT_COLOR
    }
    const json = await createShopifyProduct(params.imageId, params.type, params.color);
    setBusyBuyButtonState(btnTarget, false)
    const href = `/products/${json.handle}`;
    const handle = window.open(href, Object.values(params).join('-'))
    if (!handle) {
        window.location.href = href;
    }
}

// eslint-disable-next-line no-unused-vars
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
        // allAvailablePrompts = await getAvailablePrompts();
        allAvailablePrompts = getPromptComplitions();
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

    console.log('newUniquePrompt', newUniquePrompt)

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

// eslint-disable-next-line no-unused-vars
function compressText(text) {
    const nonWordRegex = /[^\w\d]+/g
    const wordRegex = /[\w\d]+/g
    let dictionary = {};

    // save all worlds and their count
    text.split(nonWordRegex).forEach(item => { dictionary[item] ||= 0; dictionary[item]++ });

    // create DESC sorted worlds array
    dictionary = Object
        .entries(dictionary)
        // .filter(kv => kv[1] > 1)
        .sort((kv1, kv2) => kv2[1] - kv1[1])
        .map(kv => kv[0])

    const compressedText = text.replace(wordRegex, (word) => dictionary.indexOf(word).toString(8))

    return {
        dictionary,
        compressedText
    }
}

function decompressText({
    dictionary,
    compressedText
}) {
    const wordRegex = /[\w\d]+/g;
    return compressedText.replace(wordRegex, (hash) => dictionary[parseInt(hash, 36)])
}

function getPromptComplitions(prompt = querySearch) {
    const d = 'detailed,details,by,intricate,highly,vibrant,breathtaking,ultra,fine,good,proportions,colorful,art,painting,and,artstation,unreal,engine,style,cinematic,color,render,concept,Greg,4k,volumetric,octane,on,8k,sharp,digital,of,masterpiece,detail,illustration,lighting,centered,,Rutkowski,inspired,extreme,HQ,trending,pastel,anime,environment,rossdraws,greg,rutkowski,full,key,visual,panoramic,Carne,Griffiths,Conrad,Roset,Makoto,Shinkai,cosmicwonder,photography,high,24mm,realistic,fantasy,elegant,focus,Hyperrealism,totem,Ivan,5,60,Dustin,Nguyen,Akihiko,Yoshida,Tocchini,Cliff,Chiang,resolution,Dishonored,bravely,default,but,dreary,red,black,white,scheme,epic,long,shot,dark,mood,strong,backlighting,lights,smoke,volutes,renderer,8K,3d,ultradetailed,devianart,cgsociety,clean,ghibli,breath,the,wild,tim,okamura,victor,nizovtsev,noah,bradley,graffiti,paint,hyperrealistic,focused,Pixar,photorealistic,hdr,definition,symmetrical,face,photo,DSLR,quality,fps,not,cropped,painted,smooth,gaston,bussiere,alphonse,mucha,marble,jade,sculpture,fog,cyber,background,stunning,wide,angle,pen,ink,line,drawings,craig,mullins,ruan,jia,kentaro,miura,loundraw,aztek,greeble,tribal,fanart,ornate,heartstone,ankama,gta5,cover,official,behance,hd,Jesper,Ejsing,RHADS,Lois,van,baarle,ilya,kuvshinov,radiating,a,glowing,aura,matte,WLOP,Artgerm,Alphonse,Mucha,poster,hill,precise,lineart,Gustav,Klimt,Pablo,Picasso,Banksy,Arthur,Adams,Eileen,Agar,Yaacov,Agam,Jacques,Laurent,Agasse,Aivazovsky,David,Aja,Rafael,Albuquerque,Chiho,Aoshima,Hirohiko,Araki,Alexander,Archipenko,El,Anatsui,Karol,Bak,Christopher,Balaskas,Carl,Barks,Cicely,Mary,Barker,Jean,Michel,Basquiat,Romare,Bearden,Aubrey,Beardsley,Bilibin,Xu,Bing,Robert,Bissell,Anna,Bocek,Richard,Parkes,Bonington,Franklin,Booth,Susan,Seddon,Boulet,Frank,Bramley,Georges,Braque,Mark,Briscoe,Stasia,Burrington,Pascale,Campion,Camilla,dErrico,Michael,DeForge';
    const compressedText = `[
        "detailed,details,by,intricate,highly,vibrant,breathtaking,ultra,fine,good,proportions,colorful,art,painting,and,artstation,unreal,engine,style,cinematic,color,render,concept,Greg,4k,volumetric,octane,on,8k,sharp,digital,of,masterpiece,detail,illustration,lighting,centered,,Rutkowski,inspired,extreme,HQ,trending,pastel,anime,environment,rossdraws,greg,rutkowski,full,key,visual,panoramic,Carne,Griffiths,Conrad,Roset,Makoto,Shinkai,cosmicwonder,photography,high,24mm,realistic,fantasy,elegant,focus,Hyperrealism,totem,Ivan,5,60,Dustin,Nguyen,Akihiko,Yoshida,Tocchini,Cliff,Chiang,resolution,Dishonored,bravely,default,but,dreary,red,black,white,scheme,epic,long,shot,dark,mood,strong,backlighting,lights,smoke,volutes,renderer,8K,3d,ultradetailed,devianart,cgsociety,clean,ghibli,breath,the,wild,tim,okamura,victor,nizovtsev,noah,bradley,graffiti,paint,hyperrealistic,focused,Pixar,photorealistic,hdr,definition,symmetrical,face,photo,DSLR,quality,fps,not,cropped,painted,smooth,gaston,bussiere,alphonse,mucha,marble,jade,sculpture,fog,cyber,background,stunning,wide,angle,pen,ink,line,drawings,craig,mullins,ruan,jia,kentaro,miura,loundraw,aztek,greeble,tribal,fanart,ornate,heartstone,ankama,gta5,cover,official,behance,hd,Jesper,Ejsing,RHADS,Lois,van,baarle,ilya,kuvshinov,radiating,a,glowing,aura,matte,WLOP,Artgerm,Alphonse,Mucha,poster,hill,precise,lineart,Gustav,Klimt,Pablo,Picasso,Banksy,Arthur,Adams,Eileen,Agar,Yaacov,Agam,Jacques,Laurent,Agasse,Aivazovsky,David,Aja,Rafael,Albuquerque,Chiho,Aoshima,Hirohiko,Araki,Alexander,Archipenko,El,Anatsui,Karol,Bak,Christopher,Balaskas,Carl,Barks,Cicely,Mary,Barker,Jean,Michel,Basquiat,Romare,Bearden,Aubrey,Beardsley,Bilibin,Xu,Bing,Robert,Bissell,Anna,Bocek,Richard,Parkes,Bonington,Franklin,Booth,Susan,Seddon,Boulet,Frank,Bramley,Georges,Braque,Mark,Briscoe,Stasia,Burrington,Pascale,Campion,Camilla,dErrico,Michael,DeForge",
        "4 0, 2 20 21, 22 23, n 24, n 12, 25 26, o 27, 28 13, 29 2a 13, 5 2b 2c 2d, 2e e 2f k 2g, 2h 14 2i 2j, 2k 2l e 2m 2n, p 2o, 2p 2q, f 15, g h, q 2r, 15, 2s",
        "2t l, g h, 2u, 16 r f, 2v, 2w, m c, s, l",
        "17, 18 i, 2x t u c, 19 m c, 2 1a, 2y, 2z v 30 31, 1b 1c",
        "2 32 33, 34 35, 36 37, 16 r f, s, w, 38 39, 8 x, 1d v k, 3 x, y",
        "0, 3, 1d v k, j z, 3a, 3b, 14 1, g h 1y, j, w",
        "10 , 0, 18 i, 1e 1f ,3 x, 4 0, 6, 5, 1g, j, 1h 1i, 1j 1k, 1l 1m",
        "3c i,o, s, g h, q l 3d 2 1n, 3e, 1o 2 1n, 1p 3f, 3g 3h, p z, 3i, q l, 1q, o, 1q, 3j, 1p 3k, 1z 3l, 7 1r",
        "10, 3m 3n, 3o, 1s, 3, 1t, 4 0, u d, f, m c, 3p, t 1u, y, c 2 3q 3r e 3s 3t",
        "4 0 3u e 3v 3w, p 3x, 1v, 6, 7 1r, g h, 7 0, 3y 3z, 1v, j z, 4 0, 6 , 1o, 40 19, 41-42",
        "43 e 44, 3 45 46, 2 47 48, 49 4a, 4b 4c, 1b 1c, 4d",
        "1w 4e 4f 4g i 4h 4i 1s 4j 4k 4l 4m i 4n 4o 4p f 2 4q 4r, 2 4s, 1l 1m e 4t 4u 4v, 4w 4x, 1a 1w k 17 5 4y 4z 50 51 3, 1t, t 1u, y, u d, m c, 52, c 2 53 e 54 e n 12 e 55 56, w",
        "57, r 58, 10, 1e 1f, 3, 4 0, 6, 59 5a, 5, 1g, j, 1h 1i,1j 1k",
        "d 2 5b 5c, 3 1, 8 1, 9 a, 4 0, 6, 5, b, 7 0",
        "d 2 5d 5e, 3 1, 8 1, 9 a, 4 0, 6, 5, b, 7 0",
        "d 2 5f, 3 1, 8 1, 9 a, 4 0, 6, 5, b, 7 0",
        "d 2 5g 5h, 3 1, 8 1, 9 a, 4 0, 6, 5, b, 7 0",
        "d 2 5i 5j, 3 1, 8 1, 9 a, 4 0, 6, 5, b, 7 0",
        "d 2 5k 5l, 3 1, 8 1, 9 a, 4 0, 6, 5, b, 7 0",
        "d 2 5m-5n 5o, 3 1, 8 1, 9 a, 4 0, 6, 5, b, 7 0",
        "d 2 1x 5p, 3 1, 8 1, 9 a, 4 0, 6, 5, b, 7 0",
        "d 2 5q 5r, 3 1, 8 1, 9 a, 4 0, 6, 5, b, 7 0",
        "d 2 5s 5t, 3 1, 8 1, 9 a, 4 0, 6, 5, b, 7 0",
        "d 2 5u 5v, 3 1, 8 1, 9 a, 4 0, 6, 5, b, 7 0",
        "d 2 5w 5x, 3 1, 8 1, 9 a, 4 0, 6, 5, b, 7 0",
        "d 2 5y 5z, 3 1, 8 1, 9 a, 4 0, 6, 5, b, 7 0",
        "d 2 60 61, 3 1, 8 1, 9 a, 4 0, 6, 5, b, 7 0",
        "d 2 62 63, 3 1, 8 1, 9 a, 4 0, 6, 5, b, 7 0",
        "d 2 64 65, 3 1, 8 1, 9 a, 4 0, 6, 5, b, 7 0",
        "d 2 66 67, 3 1, 8 1, 9 a, 4 0, 6, 5, b, 7 0",
        "d 2 68 69 6a, 3 1, 8 1, 9 a, 4 0, 6, 5, b, 7 0",
        "c 2 6b-6c 6d, 3 1, 8 1, 9 a, 4 0, 6, 5, b, 7 0",
        "c 2 6e 6f, 3 1, 8 1, 9 a, 4 0, 6, 5, b, 7 0",
        "c 2 6g 6h, 3 1, 8 1, 9 a, 4 0, 6, 5, b, 7 0",
        "c 2 1x 6i, 3 1, 8 1, 9 a, 4 0, 6, 5, b, 7 0",
        "c 2 6j 6k, 3 1, 8 1, 9 a, 4 0, 6, 5, b, 7 0",
        "c 2 6l 6m, 3 1, 8 1, 9 a, 4 0, 6, 5, b, 7 0",
        "c 2 6n 6o, 3 1, 8 1, 9 a, 4 0, 6, 5, b, 7 0",
        "c 2 6p 6q 6r, 3 1, 8 1, 9 a, 4 0, 6, 5, b, 7 0",
        "c 2 6s 6t, 3 1, 8 1, 9 a, 4 0, 6, 5, b, 7 0",
        "c 2 6u 6v 6w, 3 1, 8 1, 9 a, 4 0, 6, 5, b, 7 0",
        "c 2 6x 6y, 3 1, 8 1, 9 a, 4 0, 6, 5, b, 7 0",
        "c 2 6z 70, 3 1, 8 1, 9 a, 4 0, 6, 5, b, 7 0",
        "c 2 71 72, 3 1, 8 1, 9 a, 4 0, 6, 5, b, 7 0",
        "c 2 73 74, 3 1, 8 1, 9 a, 4 0, 6, 5, b, 7 0",
        "c 2 75 76, 3 1, 8 1, 9 a, 4 0, 6, 5, b, 7 0",
        "c 2 77 78, 3 1, 8 1, 9 a, 4 0, 6, 5, b, 7 0",
        "c 2 79 7a, 3 1, 8 1, 9 a, 4 0, 6, 5, b, 7 0"
    ]`;
    const complitions = JSON.parse(decompressText({
        dictionary: d.split(','),
        compressedText
    }));
    
    return complitions
        .map(completion => `${prompt}, ${completion}`)
        .sort(() => Math.random() - 0.5);
}
