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

eval("(() => {\n    const LS_SEARCH_KEY = 'ai-search';\n    const searchForm = document.getElementById('aiSearch');\n    const generateMoreBtn = document.querySelectorAll('.js-generate-more');\n    const searchViews = document.querySelectorAll('.js-search-view');\n    const localSearch = localStorage.getItem(LS_SEARCH_KEY);\n    const API_HOST = 'https://awesome-code-nkh8j.cloud.serverless.com';\n    const searchHistory = localSearch ? JSON.parse(localSearch) : {};\n    const REQUESTS_LIMIT = 270;\n    const sleep = ms => new Promise(res => setTimeout(res, ms));\n    const imagesResult = {};\n    const allPromptResults = new Map();\n    let querySearch = new URL(document.location).searchParams.get('search') || '';\n\n    if (!searchForm || !searchViews.length) return;\n\n    const updateImagesPreviews = (promptResult) => {\n        promptResult.forEach((result, i) => {\n            if (allPromptResults.get(result.prompt)) {\n                allPromptResults.set(result.prompt, Object.assign({}, allPromptResults.get(result.prompt), result.images));\n            } else {\n                allPromptResults.set(result.prompt, result.images);\n            }\n        });\n\n        const promptSearchesIterator = allPromptResults.keys();\n        const uniqueSearches = Array.from(promptSearchesIterator);\n\n        uniqueSearches.forEach((search, i) => {\n            const imgs = allPromptResults.get(search);\n\n            Object.keys(imgs).forEach((key) => {\n                imagesResult[i] = imagesResult[i] || {};\n                imagesResult[i][key] = imgs[key].tShirtResult;\n            });\n\n            if (searchViews[i]) {\n                const slider = searchViews[i].querySelector('.js-search-swiper');\n                const searchPrompt = searchViews[i].querySelector('.js-search-prompt');\n                const generateMoreBtn = searchViews[i].querySelector('.js-generate-more');\n                const mockupImg = slider.getAttribute('data-mockup-src');\n                const mockupUrl = slider.getAttribute('data-mockup-url');\n\n                searchPrompt && (searchPrompt.textContent = search);\n                generateMoreBtn && generateMoreBtn.setAttribute('data-prompt', search);\n\n                if (slider) {\n                    Object.keys(imagesResult[i]).forEach((key, j) => {\n                        const slide = slider.querySelectorAll('.swiper-slide')[j];\n                        \n                        if (slide) {\n                            slide.querySelector('IMG').setAttribute('src', imagesResult[i][key]);\n                            slide.querySelector('A').setAttribute('href', `/products/t-shirt-mockup?key=${key}`);\n                        } else {\n                            slider.swiper.appendSlide(`<div class=\"swiper-slide\"><a href=\"${mockupUrl}? key=${key}\" target=\"_blank\"><img src=\"${imagesResult[i][key]}\" /></a></div>`);\n                        }\n                    });\n                }\n            }\n        });\n\n        console.log('FULL imagesResult :>> ', imagesResult);\n    }\n\n    const waitImagesResult = async (ids, initialTimeout) => {\n        let imagesResponse;\n        let timeout = initialTimeout || 10000;\n        let loadedImages = 0;\n\n        for (let i = 0; i < REQUESTS_LIMIT; i += 1) {\n            const imagesRequest = await fetch(`${API_HOST}/image?requestId=${ids.join(',')}`, {\n                method: 'GET'\n            });\n    \n            imagesResponse = await imagesRequest.json();\n    \n            if (imagesRequest.status !== 200) {\n                console.error(imagesResponse);\n                \n                return imagesResponse;\n            }\n\n            if (imagesResponse.length === ids.length) {\n                break;\n            }\n\n            if (imagesResponse.length > loadedImages) {\n                updateImagesPreviews(imagesResponse);\n                loadedImages = imagesResponse.length;\n            }\n\n            console.log(`pending images...next ping in ${timeout/1000} seconds`);\n\n            await sleep(timeout);\n            timeout = 1000;\n        }\n\n        updateImagesPreviews(imagesResponse);\n\n        return imagesResponse;\n    };\n\n    const sendPromptRequest = async (prompt, isFullPrompt) => {\n        const sendSearch = await fetch(`${API_HOST}/prompt`, {\n            method: 'POST',\n            headers: {\n                \"Access-Control-Allow-Origin\": \"*\",\n                \"Content-Type\": \"application/json\",\n            },\n            body: JSON.stringify({ \n                [isFullPrompt ? `fullPrompt` : `prompt`]: prompt\n            })\n        });\n\n        const response = await sendSearch.json();\n\n        if (sendSearch.status !== 201) {\n            console.error(response);\n            return false;\n        }\n\n        const queuesIds = response.map(r => r.id);\n        const queuesPrompts = response.map(r => r.input.prompt);\n\n        queuesPrompts.forEach((pr, i) => {\n            searchHistory[querySearch] = searchHistory[querySearch] || {};\n            \n            if (searchHistory[querySearch]) {\n                if (searchHistory[querySearch][pr]) {\n                    searchHistory[querySearch][pr].push(queuesIds[i]);\n                } else {\n                    searchHistory[querySearch][pr] = [queuesIds[i]];\n                }\n            }\n        });\n        \n        localStorage.setItem(LS_SEARCH_KEY, JSON.stringify(searchHistory));\n\n        return await waitImagesResult(queuesIds);\n    };\n\n    if (querySearch.length) {            \n        if (searchHistory[querySearch]) {\n            const requestIds = Object.values(searchHistory[querySearch]).reduce((prev, curr) => prev.concat(curr), []);\n\n            waitImagesResult(requestIds, 1)\n                .then((images) => {\n                    console.log('Got images from LS :>> ', images);\n                });\n        } else {\n            sendPromptRequest(querySearch)\n                .then(pendimages => pendimages)\n                .then(images => {\n                    console.log('Got images from Replicate API :>> ', images);\n                });\n        }\n\n        generateMoreBtn.forEach((btn, i) => {\n            btn.addEventListener('click', () => {\n                sendPromptRequest(btn.getAttribute('data-prompt'), true)\n                    .then(pendimages => pendimages)\n                    .then(images => {\n                        console.log('Got images from Replicate API :>> ', images);\n                    });\n            });\n        });\n    }\n\n    searchForm.querySelector('input[name=\"search\"]').value = querySearch;\n})();\n\n//# sourceURL=webpack://shopify-theme-lab/./src/js/ai-generator.js?");

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
/******/ 	var __webpack_exports__ = __webpack_require__("./src/js/ai-generator.js");
/******/ 	
/******/ })()
;