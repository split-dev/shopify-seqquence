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
/***/ (() => {

eval("throw new Error(\"Module build failed (from ./node_modules/mini-css-extract-plugin/dist/loader.js):\\nHookWebpackError: Module build failed (from ./node_modules/sass-loader/dist/cjs.js):\\nSassError: expected \\\"{\\\".\\n   ╷\\n17 │             border: 1px solid re;d\\n   │                                   ^\\n   ╵\\n  src/css/sections/home-collection.scss 17:35  @import\\n  src/css/main.scss 64:9                       root stylesheet\\n    at tryRunOrWebpackError (/Users/vika/Documents/GitHub/shopify-seqquence/node_modules/webpack/lib/HookWebpackError.js:88:9)\\n    at __webpack_require_module__ (/Users/vika/Documents/GitHub/shopify-seqquence/node_modules/webpack/lib/Compilation.js:5051:12)\\n    at __webpack_require__ (/Users/vika/Documents/GitHub/shopify-seqquence/node_modules/webpack/lib/Compilation.js:5008:18)\\n    at /Users/vika/Documents/GitHub/shopify-seqquence/node_modules/webpack/lib/Compilation.js:5079:20\\n    at symbolIterator (/Users/vika/Documents/GitHub/shopify-seqquence/node_modules/neo-async/async.js:3485:9)\\n    at done (/Users/vika/Documents/GitHub/shopify-seqquence/node_modules/neo-async/async.js:3527:9)\\n    at Hook.eval [as callAsync] (eval at create (/Users/vika/Documents/GitHub/shopify-seqquence/node_modules/tapable/lib/HookCodeFactory.js:33:10), <anonymous>:15:1)\\n    at Hook.CALL_ASYNC_DELEGATE [as _callAsync] (/Users/vika/Documents/GitHub/shopify-seqquence/node_modules/tapable/lib/Hook.js:18:14)\\n    at /Users/vika/Documents/GitHub/shopify-seqquence/node_modules/webpack/lib/Compilation.js:4986:43\\n    at symbolIterator (/Users/vika/Documents/GitHub/shopify-seqquence/node_modules/neo-async/async.js:3482:9)\\n-- inner error --\\nError: Module build failed (from ./node_modules/sass-loader/dist/cjs.js):\\nSassError: expected \\\"{\\\".\\n   ╷\\n17 │             border: 1px solid re;d\\n   │                                   ^\\n   ╵\\n  src/css/sections/home-collection.scss 17:35  @import\\n  src/css/main.scss 64:9                       root stylesheet\\n    at Object.<anonymous> (/Users/vika/Documents/GitHub/shopify-seqquence/node_modules/css-loader/dist/cjs.js!/Users/vika/Documents/GitHub/shopify-seqquence/node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!/Users/vika/Documents/GitHub/shopify-seqquence/node_modules/sass-loader/dist/cjs.js!/Users/vika/Documents/GitHub/shopify-seqquence/src/css/main.scss:1:7)\\n    at /Users/vika/Documents/GitHub/shopify-seqquence/node_modules/webpack/lib/javascript/JavascriptModulesPlugin.js:441:11\\n    at Hook.eval [as call] (eval at create (/Users/vika/Documents/GitHub/shopify-seqquence/node_modules/tapable/lib/HookCodeFactory.js:19:10), <anonymous>:7:1)\\n    at Hook.CALL_DELEGATE [as _call] (/Users/vika/Documents/GitHub/shopify-seqquence/node_modules/tapable/lib/Hook.js:14:14)\\n    at /Users/vika/Documents/GitHub/shopify-seqquence/node_modules/webpack/lib/Compilation.js:5053:39\\n    at tryRunOrWebpackError (/Users/vika/Documents/GitHub/shopify-seqquence/node_modules/webpack/lib/HookWebpackError.js:83:7)\\n    at __webpack_require_module__ (/Users/vika/Documents/GitHub/shopify-seqquence/node_modules/webpack/lib/Compilation.js:5051:12)\\n    at __webpack_require__ (/Users/vika/Documents/GitHub/shopify-seqquence/node_modules/webpack/lib/Compilation.js:5008:18)\\n    at /Users/vika/Documents/GitHub/shopify-seqquence/node_modules/webpack/lib/Compilation.js:5079:20\\n    at symbolIterator (/Users/vika/Documents/GitHub/shopify-seqquence/node_modules/neo-async/async.js:3485:9)\\n\\nGenerated code for /Users/vika/Documents/GitHub/shopify-seqquence/node_modules/css-loader/dist/cjs.js!/Users/vika/Documents/GitHub/shopify-seqquence/node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[2].use[2]!/Users/vika/Documents/GitHub/shopify-seqquence/node_modules/sass-loader/dist/cjs.js!/Users/vika/Documents/GitHub/shopify-seqquence/src/css/main.scss\\n1 | throw new Error(\\\"Module build failed (from ./node_modules/sass-loader/dist/cjs.js):\\\\nSassError: expected \\\\\\\"{\\\\\\\".\\\\n   ╷\\\\n17 │             border: 1px solid re;d\\\\n   │                                   ^\\\\n   ╵\\\\n  src/css/sections/home-collection.scss 17:35  @import\\\\n  src/css/main.scss 64:9                       root stylesheet\\\");\");\n\n//# sourceURL=webpack://shopify-theme-lab/./src/css/main.scss?");

/***/ }),

/***/ "./src/main.js":
/*!*********************!*\
  !*** ./src/main.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _css_main_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./css/main.scss */ \"./src/css/main.scss\");\n/**\n * imports\n */\n\n// import Cookies from 'js-cookie';\n\ndocument.addEventListener('DOMContentLoaded', function () {\n  window.console.log('Hello from main.js 👋.');\n});\n\n\n//# sourceURL=webpack://shopify-theme-lab/./src/main.js?");

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
/******/ 	var __webpack_exports__ = __webpack_require__("./src/main.js");
/******/ 	
/******/ })()
;