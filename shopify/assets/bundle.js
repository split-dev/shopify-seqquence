!function(){var e={757:function(e,t,r){e.exports=r(666)},666:function(e){var t=function(e){"use strict";var t,r=Object.prototype,n=r.hasOwnProperty,o="function"==typeof Symbol?Symbol:{},a=o.iterator||"@@iterator",c=o.asyncIterator||"@@asyncIterator",i=o.toStringTag||"@@toStringTag";function s(e,t,r){return Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}),e[t]}try{s({},"")}catch(e){s=function(e,t,r){return e[t]=r}}function u(e,t,r,n){var o=t&&t.prototype instanceof m?t:m,a=Object.create(o.prototype),c=new _(n||[]);return a._invoke=function(e,t,r){var n=f;return function(o,a){if(n===d)throw new Error("Generator is already running");if(n===h){if("throw"===o)throw a;return P()}for(r.method=o,r.arg=a;;){var c=r.delegate;if(c){var i=k(c,r);if(i){if(i===g)continue;return i}}if("next"===r.method)r.sent=r._sent=r.arg;else if("throw"===r.method){if(n===f)throw n=h,r.arg;r.dispatchException(r.arg)}else"return"===r.method&&r.abrupt("return",r.arg);n=d;var s=l(e,t,r);if("normal"===s.type){if(n=r.done?h:p,s.arg===g)continue;return{value:s.arg,done:r.done}}"throw"===s.type&&(n=h,r.method="throw",r.arg=s.arg)}}}(e,r,c),a}function l(e,t,r){try{return{type:"normal",arg:e.call(t,r)}}catch(e){return{type:"throw",arg:e}}}e.wrap=u;var f="suspendedStart",p="suspendedYield",d="executing",h="completed",g={};function m(){}function v(){}function y(){}var w={};s(w,a,(function(){return this}));var b=Object.getPrototypeOf,x=b&&b(b(A([])));x&&x!==r&&n.call(x,a)&&(w=x);var S=y.prototype=m.prototype=Object.create(w);function j(e){["next","throw","return"].forEach((function(t){s(e,t,(function(e){return this._invoke(t,e)}))}))}function L(e,t){function r(o,a,c,i){var s=l(e[o],e,a);if("throw"!==s.type){var u=s.arg,f=u.value;return f&&"object"==typeof f&&n.call(f,"__await")?t.resolve(f.__await).then((function(e){r("next",e,c,i)}),(function(e){r("throw",e,c,i)})):t.resolve(f).then((function(e){u.value=e,c(u)}),(function(e){return r("throw",e,c,i)}))}i(s.arg)}var o;this._invoke=function(e,n){function a(){return new t((function(t,o){r(e,n,t,o)}))}return o=o?o.then(a,a):a()}}function k(e,r){var n=e.iterator[r.method];if(n===t){if(r.delegate=null,"throw"===r.method){if(e.iterator.return&&(r.method="return",r.arg=t,k(e,r),"throw"===r.method))return g;r.method="throw",r.arg=new TypeError("The iterator does not provide a 'throw' method")}return g}var o=l(n,e.iterator,r.arg);if("throw"===o.type)return r.method="throw",r.arg=o.arg,r.delegate=null,g;var a=o.arg;return a?a.done?(r[e.resultName]=a.value,r.next=e.nextLoc,"return"!==r.method&&(r.method="next",r.arg=t),r.delegate=null,g):a:(r.method="throw",r.arg=new TypeError("iterator result is not an object"),r.delegate=null,g)}function E(e){var t={tryLoc:e[0]};1 in e&&(t.catchLoc=e[1]),2 in e&&(t.finallyLoc=e[2],t.afterLoc=e[3]),this.tryEntries.push(t)}function O(e){var t=e.completion||{};t.type="normal",delete t.arg,e.completion=t}function _(e){this.tryEntries=[{tryLoc:"root"}],e.forEach(E,this),this.reset(!0)}function A(e){if(e){var r=e[a];if(r)return r.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var o=-1,c=function r(){for(;++o<e.length;)if(n.call(e,o))return r.value=e[o],r.done=!1,r;return r.value=t,r.done=!0,r};return c.next=c}}return{next:P}}function P(){return{value:t,done:!0}}return v.prototype=y,s(S,"constructor",y),s(y,"constructor",v),v.displayName=s(y,i,"GeneratorFunction"),e.isGeneratorFunction=function(e){var t="function"==typeof e&&e.constructor;return!!t&&(t===v||"GeneratorFunction"===(t.displayName||t.name))},e.mark=function(e){return Object.setPrototypeOf?Object.setPrototypeOf(e,y):(e.__proto__=y,s(e,i,"GeneratorFunction")),e.prototype=Object.create(S),e},e.awrap=function(e){return{__await:e}},j(L.prototype),s(L.prototype,c,(function(){return this})),e.AsyncIterator=L,e.async=function(t,r,n,o,a){void 0===a&&(a=Promise);var c=new L(u(t,r,n,o),a);return e.isGeneratorFunction(r)?c:c.next().then((function(e){return e.done?e.value:c.next()}))},j(S),s(S,i,"Generator"),s(S,a,(function(){return this})),s(S,"toString",(function(){return"[object Generator]"})),e.keys=function(e){var t=[];for(var r in e)t.push(r);return t.reverse(),function r(){for(;t.length;){var n=t.pop();if(n in e)return r.value=n,r.done=!1,r}return r.done=!0,r}},e.values=A,_.prototype={constructor:_,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=t,this.done=!1,this.delegate=null,this.method="next",this.arg=t,this.tryEntries.forEach(O),!e)for(var r in this)"t"===r.charAt(0)&&n.call(this,r)&&!isNaN(+r.slice(1))&&(this[r]=t)},stop:function(){this.done=!0;var e=this.tryEntries[0].completion;if("throw"===e.type)throw e.arg;return this.rval},dispatchException:function(e){if(this.done)throw e;var r=this;function o(n,o){return i.type="throw",i.arg=e,r.next=n,o&&(r.method="next",r.arg=t),!!o}for(var a=this.tryEntries.length-1;a>=0;--a){var c=this.tryEntries[a],i=c.completion;if("root"===c.tryLoc)return o("end");if(c.tryLoc<=this.prev){var s=n.call(c,"catchLoc"),u=n.call(c,"finallyLoc");if(s&&u){if(this.prev<c.catchLoc)return o(c.catchLoc,!0);if(this.prev<c.finallyLoc)return o(c.finallyLoc)}else if(s){if(this.prev<c.catchLoc)return o(c.catchLoc,!0)}else{if(!u)throw new Error("try statement without catch or finally");if(this.prev<c.finallyLoc)return o(c.finallyLoc)}}}},abrupt:function(e,t){for(var r=this.tryEntries.length-1;r>=0;--r){var o=this.tryEntries[r];if(o.tryLoc<=this.prev&&n.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var a=o;break}}a&&("break"===e||"continue"===e)&&a.tryLoc<=t&&t<=a.finallyLoc&&(a=null);var c=a?a.completion:{};return c.type=e,c.arg=t,a?(this.method="next",this.next=a.finallyLoc,g):this.complete(c)},complete:function(e,t){if("throw"===e.type)throw e.arg;return"break"===e.type||"continue"===e.type?this.next=e.arg:"return"===e.type?(this.rval=this.arg=e.arg,this.method="return",this.next="end"):"normal"===e.type&&t&&(this.next=t),g},finish:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var r=this.tryEntries[t];if(r.finallyLoc===e)return this.complete(r.completion,r.afterLoc),O(r),g}},catch:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var r=this.tryEntries[t];if(r.tryLoc===e){var n=r.completion;if("throw"===n.type){var o=n.arg;O(r)}return o}}throw new Error("illegal catch attempt")},delegateYield:function(e,r,n){return this.delegate={iterator:A(e),resultName:r,nextLoc:n},"next"===this.method&&(this.arg=t),g}},e}(e.exports);try{regeneratorRuntime=t}catch(e){"object"==typeof globalThis?globalThis.regeneratorRuntime=t:Function("r","regeneratorRuntime = r")(t)}},861:function(e,t,r){"use strict";function n(e,t,r,n,o,a,c){try{var i=e[a](c),s=i.value}catch(e){return void r(e)}i.done?t(s):Promise.resolve(s).then(n,o)}function o(e){return function(){var t=this,r=arguments;return new Promise((function(o,a){var c=e.apply(t,r);function i(e){n(c,o,a,i,s,"next",e)}function s(e){n(c,o,a,i,s,"throw",e)}i(void 0)}))}}r.d(t,{Z:function(){return o}})}},t={};function r(n){var o=t[n];if(void 0!==o)return o.exports;var a=t[n]={exports:{}};return e[n](a,a.exports,r),a.exports}r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,{a:t}),t},r.d=function(e,t){for(var n in t)r.o(t,n)&&!r.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},function(){"use strict";document.addEventListener("DOMContentLoaded",(function(){window.console.log("Hello from main.js 👋.");var e=document.querySelector("#menu-drawer"),t=document.querySelector("#Details-menu-drawer-container");window.onclick=function(r){r.target!=e&&t.classList.remove("menu-opening")}}))}(),function(){"use strict";var e=r(861);function t(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}var n=r(757),o=r.n(n);function a(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function c(e){for(var r=1;r<arguments.length;r++){var n=null!=arguments[r]?arguments[r]:{};r%2?a(Object(n),!0).forEach((function(r){t(e,r,n[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}!function(){var t,r="ai-search",n=document.getElementById("aiSearch"),a=document.querySelector(".js-get-new-prompt"),i=document.querySelectorAll(".js-search-view"),s=localStorage.getItem(r),u="https://lime-filthy-duckling.cyclic.app",l=s?JSON.parse(s):{},f={},p={},d=new Map,h=new URL(document.location).searchParams.get("search")||"",g="on"===new URL(document.location).searchParams.get("preventAutoExtend"),m=document.querySelectorAll(".js-search-view .search__wrapper");if(n&&i.length){var v,y,w=function(e){window.gtag&&window.gtag("event","error",{event_category:"Replicate AI ERROR",event_label:"Images request error",value:e})},b=function(){var e=document.querySelector(".js-search-dom-template"),t=e.content.cloneNode(!0),r=a.closest(".js-search-view");e.before(t);var n=r.querySelector(".js-search-swiper:not(.swiper-initialized)");return window.Swiper&&new window.Swiper(n,{slidesPerView:3.5,spaceBetween:30,freeMode:!0,mousewheel:!0,breakpoints:{767:{slidesPerView:3.5},320:{slidesPerView:1.2}},navigation:{nextEl:".swiper-button-next",prevEl:".swiper-button-prev"}}),n},x=function(e){console.log("promptResult",e),m=document.querySelectorAll(".js-search-view .search__wrapper"),e.forEach((function(e){e.error?w(e.error):d.set(e.prompt,c(c({},d.get(e.prompt)),e.images))}));var t=d.keys();Array.from(t).forEach((function(e,t){var r=d.get(e);console.log("imgs",r),f[t]=f[t]||{},p[t]=p[t]||{},Object.keys(r).forEach((function(e){r[e]&&r[e].generatedImg&&(console.log("imgs[key]",r[e]),p[t][e]=r[e].generatedImg)})),m[t]||(b(),m=document.querySelectorAll(".js-search-view .search__wrapper"));var n=m[t].querySelector(".js-search-swiper"),o=m[t].querySelector(".js-search-prompt"),a=m[t].querySelector(".js-generate-more"),c=n.getAttribute("data-mockup-src"),i=n.getAttribute("data-mockup-url");o&&(o.textContent=e),a&&a.setAttribute("data-prompt",e),n&&(Object.keys(p[t]).forEach((function(e,o){var a,s=n.querySelectorAll(".swiper-slide")[o];if(s){var u=s.querySelector(".js-get-product-redirect");s.querySelector(".preview-image").style.backgroundImage="url(".concat(p[t][e],")"),u.setAttribute("data-id","".concat(e)),u.setAttribute("data-handle","".concat(r[e].handle||"")),s.classList.add("customized")}else n.swiper.appendSlide('<div class="swiper-slide customized">\n                            <div class="preview-image" style="background-image: url('.concat(p[t][e],')"></div>\n                            <img src="').concat(c,'"/>\n                            <button data-mockup="').concat(i,'" data-id="').concat(e,'" data-handle="').concat(r[e].handle||"",'" class="btn btn--secondary ').concat(r[e].handle?"":"loading",' js-get-product-redirect button button--secondary"><span>').concat(r[e].handle?"Buy":"Wait..","</span></button>\n                        </div>"));null!==(a=r[e].handle)&&void 0!==a&&a.length?s&&E(s.querySelector(".btn"),!1):(console.error("No product handle found"),s&&E(s.querySelector(".btn"),!0))})),n.swiper.slides[n.swiper.slides.length-1].classList.contains("customized")&&n.swiper.appendSlide('<div class="swiper-slide">\n                        <div class="preview-image"></div>\n                        <img src="'.concat(c,'" />\n                        <button data-mockup="').concat(i,'" class="btn btn--secondary js-get-product-redirect button button--secondary"><span>Buy</span></button>\n                    </div>')))})),console.log("FULL imagesResult :>> ",f)},S=function(e){return new Promise((function(t){var r=setTimeout(t,e);v=function(e){clearTimeout(r),t(e)}}))},j=function(){var t=(0,e.Z)(o().mark((function e(t,r){var n,a,c,i,s,l;return o().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:console.time("waitImagesResult"),a=r?1:4e3,c=0,!r&&t.forEach((function(e){y.subscribe(e).bind("1",(function(e){console.log("<< pusher >>",e),v(e)}))})),i=0;case 5:if(!(i<100)){e.next=35;break}return e.next=8,S(a);case 8:if(s=e.sent,!Object.keys((null==s?void 0:s.images)||{}).length){e.next=13;break}n=s,e.next=24;break;case 13:return e.next=15,fetch("".concat(u,"/image?requestId=").concat(t.join(",")),{method:"GET"});case 15:if(200===(l=e.sent).status){e.next=21;break}return console.error(n),w("Error images request ".concat(JSON.stringify(n))),y.unsubscribe(t[0]),e.abrupt("return",n);case 21:return e.next=23,l.json();case 23:n=e.sent;case 24:if(o=t.length,f=n,console.log("checkImagesFullLoaded :>> ",f.length,o,f),f.length!==o||!f.every((function(e){return e.images&&Object.keys(e.images).length&&Object.keys(e.images).every((function(t){return e.images[t].handle}))}))){e.next=29;break}return console.timeEnd("waitImagesResult"),console.log("All images ready to buy"),A(),e.abrupt("break",35);case 29:n.length>c&&(x(n),_(),c=n.length),console.log("pending images...next ping in ".concat((a/1e3).toFixed(1)," seconds")),i?a*=1.03:a=600;case 32:i+=1,e.next=5;break;case 35:return y.unsubscribe(t[0]),0===n.length&&w("Can't get images. Probably DB connection error"),x(n),e.abrupt("return",n);case 39:case"end":return e.stop()}var o,f}),e)})));return function(e,r){return t.apply(this,arguments)}}(),L=function(){var t=(0,e.Z)(o().mark((function e(t,n){var a,c,i;return o().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return console.time("generateImages with Replicate AI"),e.next=3,fetch("".concat(u,"/prompt"),{method:"POST",headers:{"Access-Control-Allow-Origin":"*","Content-Type":"application/json"},body:JSON.stringify({preventAutoExtend:g,fullPrompt:n&&t,prompt:h})});case 3:return a=e.sent,e.next=6,a.json();case 6:if(c=e.sent,201===a.status){e.next=10;break}return console.error(c),e.abrupt("return",!1);case 10:return i=c.map((function(e){return e.id})),c.map((function(e){return e.input.prompt})).forEach((function(e,t){l[h]=l[h]||{},l[h]&&(l[h][e]?l[h][e].push(i[t]):l[h][e]=[i[t]])})),localStorage.setItem(r,JSON.stringify(l)),console.timeEnd("generateImages with Replicate AI"),e.next=17,j(i);case 17:return e.abrupt("return",e.sent);case 18:case"end":return e.stop()}}),e)})));return function(e,r){return t.apply(this,arguments)}}(),k=function(e,t){var r=e.querySelector("SPAN");t?(e.classList.add("loading"),r&&(r.textContent="Loading...")):(e.classList.remove("loading"),r&&(r.textContent="Create More of this Style"))},E=function(e,t){var r=e.querySelector("SPAN");t?(e.classList.add("loading"),r&&(r.textContent="Wait...")):(e.classList.remove("loading"),r&&(r.textContent="Buy"))},O=function(e){console.log("setResultsBusyState _carousel :>> ",e),e?e.classList.add("loading"):document.querySelectorAll(".js-search-view .search__wrapper").forEach((function(e){e.classList.add("loading")}))},_=function(e){console.log("setResultsBusyState _carousel :>> ",e),e?e.classList.remove("loading"):document.querySelectorAll(".js-search-view .search__wrapper").forEach((function(e){e.classList.remove("loading")}))},A=function(e){e?e.classList.remove("unavailable"):document.querySelectorAll(".js-search-view .search__wrapper").forEach((function(e){e.classList.remove("unavailable")}))},P=function(e){e?e.classList.add("unavailable"):document.querySelectorAll(".js-search-view .search__wrapper").forEach((function(e){e.classList.add("unavailable")}))};try{!function e(){if(!window.Pusher)return setTimeout(e,100);window.Pusher.logToConsole=!0,y=new window.Pusher("de22d0c16c3acf27abc0",{cluster:"eu"})}()}catch(e){console.error("pusher error",e)}if(h.length){if(l[h]&&!g){var q=Object.values(l[h]).reduce((function(e,t){return e.concat(t)}),[]);j(q,!0).then((function(e){_(),console.log("Got images from LS :>> ",e)}))}else P(),L(h,!1).then((function(e){return e})).then((function(e){_(),console.log("Got images from Replicate API :>> ",e)}));document.querySelector(".search").addEventListener("click",(function(e){var t;if(e.target.classList.contains("js-get-product-redirect")?t=e.target:"img"===e.target.tagName.toLowerCase()&&(t=e.target.closest(".swiper-slide").querySelector(".js-get-product-redirect")),!t||t.classList.contains("loading"))return!1;var r=t.getAttribute("data-handle");r&&r.length?window.open("/products/".concat(t.getAttribute("data-handle")),"_blank"):E(t,!0)})),i.forEach((function(e){e.addEventListener("click",(function(e){if(e.target.classList.contains("js-generate-more")||e.target.closest(".js-generate-more")){var t=e.target.closest(".js-generate-more")?e.target.closest(".js-generate-more"):e.target,r=t.closest(".search__wrapper"),n=t.closest(".js-search-swiper"),o=n.getAttribute("data-mockup-src"),a=n.getAttribute("data-mockup-url");if(t.classList.contains("loading"))return!1;for(var c=0;c<2;c++)n.swiper.appendSlide('<div class="swiper-slide">\n                            <div class="preview-image"></div>\n                            <img src="'.concat(o,'" />\n                            <button data-mockup="').concat(a,'" class="btn btn--secondary js-get-product-redirect button button--secondary"><span>Buy</span></button>\n                        </div>'));O(r),P(r),k(t,!0),L(t.getAttribute("data-prompt"),!0).then((function(e){return e})).then((function(e){_(r),k(t,!1),console.log("Got images from Replicate API :>> ",e)}))}}))})),a&&a.addEventListener("click",(0,e.Z)(o().mark((function e(){var r,n,c,i,s;return o().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!a.classList.contains("loading")){e.next=2;break}return e.abrupt("return",!1);case 2:if(k(a,!0),t){e.next=13;break}return e.next=6,fetch("".concat(u,"/available-prompts?prompt=").concat(h),{method:"GET",headers:{"Access-Control-Allow-Origin":"*","Content-Type":"application/json"}});case 6:return r=e.sent,e.next=9,r.json();case 9:if(t=e.sent,200===r.status){e.next=13;break}return console.error(t),e.abrupt("return",!1);case 13:c=0;case 14:if(!(c<t.length)){e.next=21;break}if(d.get(t[c])){e.next=18;break}return n=t[c],e.abrupt("break",21);case 18:c+=1,e.next=14;break;case 21:n||(i=Math.floor(Math.random()*t.length),n=t[i]),s=b(),O(s.closest(".search__wrapper")),P(s.closest(".search__wrapper")),L(n,!0).then((function(e){return e})).then((function(e){k(a,!1),_(),console.log("Got images from Replicate API :>> ",e)}));case 26:case"end":return e.stop()}}),e)}))))}n.querySelector('input[name="search"]').value=h,n.querySelector('input[name="preventAutoExtend"]').checked=g}}()}(),function(){"use strict";var e=r(861),t=r(757),n=r.n(t);!function(){var t,r=window.location.pathname.includes("/product")&&document.body.classList.contains("template-product"),o=new URL(document.location).searchParams.get("key")||"",a=(new Map,"currentCreatingProduct"),c=(document.querySelector("#cart-notification"),function(e){return new Promise((function(t){return setTimeout(t,e)}))}),i=JSON.parse(localStorage.getItem(a)||"{}"),s=Object.keys(i).filter((function(e){return!i[e]})),u=function(e){window.gtag&&window.gtag("event","error",{event_category:"Replicate AI ERROR",event_label:"Images request error",value:e})},l=function(e){var r;e=e||t;var n=document.querySelectorAll(".product__modal-opener--image"),a=document.querySelectorAll(".product-media-modal__dialog img"),c=null===(r=e.images[o])||void 0===r?void 0:r.generatedImg;c&&(n.forEach((function(e){var t=document.createElement("img");t.className="preview-image",t.src=c,e.parentNode.insertBefore(t,e)})),a.forEach((function(e){var t=document.createElement("img");t.className="preview-image",t.src=c,e.parentNode.insertBefore(t,e)})))},f=function(){document.querySelectorAll("[data-url]").forEach((function(e){var t=new URL(document.location),r=t.searchParams.get("key");e.setAttribute("data-url","".concat(t.pathname,"?key=").concat(r))}))},p=function(){var r=(0,e.Z)(n().mark((function e(r){var o,a,i,s;return n().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(a=1e3,r){e.next=3;break}return e.abrupt("return");case 3:i=0;case 4:if(!(i<270)){e.next=27;break}return e.next=7,fetch("".concat("https://lime-filthy-duckling.cyclic.app","/image?imageId=").concat(r),{method:"GET"});case 7:return s=e.sent,e.next=10,s.json();case 10:if(o=e.sent,200===s.status){e.next=15;break}return console.error(o),u("Error images request ".concat(JSON.stringify(o))),e.abrupt("return",o);case 15:if(!o.length){e.next=19;break}if(!(t=o[0]).images){e.next=19;break}return e.abrupt("break",27);case 19:return t.images[r].generatedImg&&l(t),console.log("pending images...next ping in ".concat(a/1e3," seconds")),e.next=23,c(a);case 23:a=1e3;case 24:i+=1,e.next=4;break;case 27:return 0===o.length&&u("Can't get images. Probably DB connection error"),l(t),e.abrupt("return",t);case 30:case"end":return e.stop()}}),e)})));return function(e){return r.apply(this,arguments)}}();if(r&&o){p(o);var d=document.querySelector(".product__info-wrapper"),h=document.querySelector("variant-radios");d.classList.add("loading");var g=JSON.parse(window.sessionStorage.getItem(o)||"{}");if(Object.keys(g).length)!function e(t){if((i=JSON.parse(localStorage.getItem(a)||"{}"))[t]){d.classList.remove("loading"),console.log("Loaded product:",i[t]);var r=i[t].variants;h.variantData=r,h.querySelector('[type="application/json"]').textContent=JSON.stringify(r,null,2),h.updateOptions(),h.updateMasterId(),h.updateVariantInput(),f(),h.updateURL(),f()}else setTimeout((function(){return e(t)}),1e3),1}("/products/".concat(g.title.toLowerCase().replace(/[^a-z|0-9]+/gim,"-")));f()}var m=function(){var t=(0,e.Z)(n().mark((function e(t){var r,o;return n().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch("".concat(t,".js"),{method:"GET"});case 2:if(200!==(r=e.sent).status){e.next=10;break}return e.next=6,r.json();case 6:(o=e.sent).available?(console.log("FINALLY got product!!! ",o),(i=JSON.parse(localStorage.getItem(a)||"{}"))[t]=o,o.images.length?console.log("GOT IMAGES!"):setTimeout((function(){return m(t)}),1e3),window.localStorage.setItem(a,JSON.stringify(i))):setTimeout((function(){return m(t)}),1e3),e.next=11;break;case 10:setTimeout((function(){return m(t)}),1e3);case 11:case"end":return e.stop()}}),e)})));return function(e){return t.apply(this,arguments)}}();s.length&&s.forEach((function(e){m(e)}))}()}()}();