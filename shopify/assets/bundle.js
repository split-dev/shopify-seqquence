!function(){var e={757:function(e,t,r){e.exports=r(666)},666:function(e){var t=function(e){"use strict";var t,r=Object.prototype,n=r.hasOwnProperty,o="function"==typeof Symbol?Symbol:{},a=o.iterator||"@@iterator",c=o.asyncIterator||"@@asyncIterator",i=o.toStringTag||"@@toStringTag";function s(e,t,r){return Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}),e[t]}try{s({},"")}catch(e){s=function(e,t,r){return e[t]=r}}function u(e,t,r,n){var o=t&&t.prototype instanceof m?t:m,a=Object.create(o.prototype),c=new _(n||[]);return a._invoke=function(e,t,r){var n=f;return function(o,a){if(n===p)throw new Error("Generator is already running");if(n===h){if("throw"===o)throw a;return q()}for(r.method=o,r.arg=a;;){var c=r.delegate;if(c){var i=A(c,r);if(i){if(i===g)continue;return i}}if("next"===r.method)r.sent=r._sent=r.arg;else if("throw"===r.method){if(n===f)throw n=h,r.arg;r.dispatchException(r.arg)}else"return"===r.method&&r.abrupt("return",r.arg);n=p;var s=l(e,t,r);if("normal"===s.type){if(n=r.done?h:d,s.arg===g)continue;return{value:s.arg,done:r.done}}"throw"===s.type&&(n=h,r.method="throw",r.arg=s.arg)}}}(e,r,c),a}function l(e,t,r){try{return{type:"normal",arg:e.call(t,r)}}catch(e){return{type:"throw",arg:e}}}e.wrap=u;var f="suspendedStart",d="suspendedYield",p="executing",h="completed",g={};function m(){}function v(){}function y(){}var w={};s(w,a,(function(){return this}));var b=Object.getPrototypeOf,x=b&&b(b(I([])));x&&x!==r&&n.call(x,a)&&(w=x);var S=y.prototype=m.prototype=Object.create(w);function L(e){["next","throw","return"].forEach((function(t){s(e,t,(function(e){return this._invoke(t,e)}))}))}function k(e,t){function r(o,a,c,i){var s=l(e[o],e,a);if("throw"!==s.type){var u=s.arg,f=u.value;return f&&"object"==typeof f&&n.call(f,"__await")?t.resolve(f.__await).then((function(e){r("next",e,c,i)}),(function(e){r("throw",e,c,i)})):t.resolve(f).then((function(e){u.value=e,c(u)}),(function(e){return r("throw",e,c,i)}))}i(s.arg)}var o;this._invoke=function(e,n){function a(){return new t((function(t,o){r(e,n,t,o)}))}return o=o?o.then(a,a):a()}}function A(e,r){var n=e.iterator[r.method];if(n===t){if(r.delegate=null,"throw"===r.method){if(e.iterator.return&&(r.method="return",r.arg=t,A(e,r),"throw"===r.method))return g;r.method="throw",r.arg=new TypeError("The iterator does not provide a 'throw' method")}return g}var o=l(n,e.iterator,r.arg);if("throw"===o.type)return r.method="throw",r.arg=o.arg,r.delegate=null,g;var a=o.arg;return a?a.done?(r[e.resultName]=a.value,r.next=e.nextLoc,"return"!==r.method&&(r.method="next",r.arg=t),r.delegate=null,g):a:(r.method="throw",r.arg=new TypeError("iterator result is not an object"),r.delegate=null,g)}function E(e){var t={tryLoc:e[0]};1 in e&&(t.catchLoc=e[1]),2 in e&&(t.finallyLoc=e[2],t.afterLoc=e[3]),this.tryEntries.push(t)}function j(e){var t=e.completion||{};t.type="normal",delete t.arg,e.completion=t}function _(e){this.tryEntries=[{tryLoc:"root"}],e.forEach(E,this),this.reset(!0)}function I(e){if(e){var r=e[a];if(r)return r.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var o=-1,c=function r(){for(;++o<e.length;)if(n.call(e,o))return r.value=e[o],r.done=!1,r;return r.value=t,r.done=!0,r};return c.next=c}}return{next:q}}function q(){return{value:t,done:!0}}return v.prototype=y,s(S,"constructor",y),s(y,"constructor",v),v.displayName=s(y,i,"GeneratorFunction"),e.isGeneratorFunction=function(e){var t="function"==typeof e&&e.constructor;return!!t&&(t===v||"GeneratorFunction"===(t.displayName||t.name))},e.mark=function(e){return Object.setPrototypeOf?Object.setPrototypeOf(e,y):(e.__proto__=y,s(e,i,"GeneratorFunction")),e.prototype=Object.create(S),e},e.awrap=function(e){return{__await:e}},L(k.prototype),s(k.prototype,c,(function(){return this})),e.AsyncIterator=k,e.async=function(t,r,n,o,a){void 0===a&&(a=Promise);var c=new k(u(t,r,n,o),a);return e.isGeneratorFunction(r)?c:c.next().then((function(e){return e.done?e.value:c.next()}))},L(S),s(S,i,"Generator"),s(S,a,(function(){return this})),s(S,"toString",(function(){return"[object Generator]"})),e.keys=function(e){var t=[];for(var r in e)t.push(r);return t.reverse(),function r(){for(;t.length;){var n=t.pop();if(n in e)return r.value=n,r.done=!1,r}return r.done=!0,r}},e.values=I,_.prototype={constructor:_,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=t,this.done=!1,this.delegate=null,this.method="next",this.arg=t,this.tryEntries.forEach(j),!e)for(var r in this)"t"===r.charAt(0)&&n.call(this,r)&&!isNaN(+r.slice(1))&&(this[r]=t)},stop:function(){this.done=!0;var e=this.tryEntries[0].completion;if("throw"===e.type)throw e.arg;return this.rval},dispatchException:function(e){if(this.done)throw e;var r=this;function o(n,o){return i.type="throw",i.arg=e,r.next=n,o&&(r.method="next",r.arg=t),!!o}for(var a=this.tryEntries.length-1;a>=0;--a){var c=this.tryEntries[a],i=c.completion;if("root"===c.tryLoc)return o("end");if(c.tryLoc<=this.prev){var s=n.call(c,"catchLoc"),u=n.call(c,"finallyLoc");if(s&&u){if(this.prev<c.catchLoc)return o(c.catchLoc,!0);if(this.prev<c.finallyLoc)return o(c.finallyLoc)}else if(s){if(this.prev<c.catchLoc)return o(c.catchLoc,!0)}else{if(!u)throw new Error("try statement without catch or finally");if(this.prev<c.finallyLoc)return o(c.finallyLoc)}}}},abrupt:function(e,t){for(var r=this.tryEntries.length-1;r>=0;--r){var o=this.tryEntries[r];if(o.tryLoc<=this.prev&&n.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var a=o;break}}a&&("break"===e||"continue"===e)&&a.tryLoc<=t&&t<=a.finallyLoc&&(a=null);var c=a?a.completion:{};return c.type=e,c.arg=t,a?(this.method="next",this.next=a.finallyLoc,g):this.complete(c)},complete:function(e,t){if("throw"===e.type)throw e.arg;return"break"===e.type||"continue"===e.type?this.next=e.arg:"return"===e.type?(this.rval=this.arg=e.arg,this.method="return",this.next="end"):"normal"===e.type&&t&&(this.next=t),g},finish:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var r=this.tryEntries[t];if(r.finallyLoc===e)return this.complete(r.completion,r.afterLoc),j(r),g}},catch:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var r=this.tryEntries[t];if(r.tryLoc===e){var n=r.completion;if("throw"===n.type){var o=n.arg;j(r)}return o}}throw new Error("illegal catch attempt")},delegateYield:function(e,r,n){return this.delegate={iterator:I(e),resultName:r,nextLoc:n},"next"===this.method&&(this.arg=t),g}},e}(e.exports);try{regeneratorRuntime=t}catch(e){"object"==typeof globalThis?globalThis.regeneratorRuntime=t:Function("r","regeneratorRuntime = r")(t)}},861:function(e,t,r){"use strict";function n(e,t,r,n,o,a,c){try{var i=e[a](c),s=i.value}catch(e){return void r(e)}i.done?t(s):Promise.resolve(s).then(n,o)}function o(e){return function(){var t=this,r=arguments;return new Promise((function(o,a){var c=e.apply(t,r);function i(e){n(c,o,a,i,s,"next",e)}function s(e){n(c,o,a,i,s,"throw",e)}i(void 0)}))}}r.d(t,{Z:function(){return o}})}},t={};function r(n){var o=t[n];if(void 0!==o)return o.exports;var a=t[n]={exports:{}};return e[n](a,a.exports,r),a.exports}r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,{a:t}),t},r.d=function(e,t){for(var n in t)r.o(t,n)&&!r.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},function(){"use strict";document.addEventListener("DOMContentLoaded",(function(){window.console.log("Hello from main.js 👋.");var e=document.querySelector("#menu-drawer"),t=document.querySelector("#Details-menu-drawer-container");window.onclick=function(r){r.target!=e&&t.classList.remove("menu-opening")}}))}(),function(){"use strict";var e=r(861);function t(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}function n(e){return function(e){if(Array.isArray(e))return t(e)}(e)||function(e){if("undefined"!=typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}(e)||function(e,r){if(e){if("string"==typeof e)return t(e,r);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?t(e,r):void 0}}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}var o=r(757),a=r.n(o);function c(e,t){var r="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(!r){if(Array.isArray(e)||(r=function(e,t){if(!e)return;if("string"==typeof e)return i(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);"Object"===r&&e.constructor&&(r=e.constructor.name);if("Map"===r||"Set"===r)return Array.from(e);if("Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return i(e,t)}(e))||t&&e&&"number"==typeof e.length){r&&(e=r);var n=0,o=function(){};return{s:o,n:function(){return n>=e.length?{done:!0}:{done:!1,value:e[n++]}},e:function(e){throw e},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var a,c=!0,s=!1;return{s:function(){r=r.call(e)},n:function(){var e=r.next();return c=e.done,e},e:function(e){s=!0,a=e},f:function(){try{c||null==r.return||r.return()}finally{if(s)throw a}}}}function i(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}var s,u,l="ai-search",f="https://r4qlyqjkf4sankpkqcvzdqgm540sozvz.lambda-url.eu-central-1.on.aws",d=new URL(document.location).searchParams.get("search")||"",p="on"===new URL(document.location).searchParams.get("preventAutoExtend"),h=JSON.parse(localStorage.getItem(l)||"{}"),g=new Map,m=document.querySelectorAll(".js-search-view .search__wrapper"),v=document.getElementById("aiSearch"),y=document.querySelectorAll(".js-search-view"),w=document.querySelector(".js-get-new-prompt"),b=document.querySelector(".js-search-dom-template"),x=document.getElementById("error_message");function S(e,t){var r=document.createElement("div");r.innerHTML=t,e.appendChild(r.firstChild)}var L=function(e){window.gtag&&window.gtag("event","error",{event_category:"Replicate AI ERROR",event_label:"Images request error",value:e})},k=function(){var e=b.content.cloneNode(!0),t=w.closest(".js-search-view");return b.before(e),t.querySelector(".search__wrapper:last-of-type .js-search-products")},A=function(e){if(console.log("promptResult",e),m=document.querySelectorAll(".js-search-view .search__wrapper"),e.error)L(e.error);else{var t,r=e.images.map((function(e){return e.id})),o=null===(t=g.get(e.prompt))||void 0===t?void 0:t.filter((function(e){return!r.includes(e.id)}));console.log("allPromptResults.get(result.prompt) :>> ",g.get(e.prompt),o),console.log("result.images :>> ",e.images);var a=[].concat(n(o||[]),n(e.images));g.set(e.prompt,a)}var c=g.keys(),i=Array.from(c);console.log("allPromptResults :>> ",c,i),i.forEach((function(e,t){var r,n=g.get(e);console.log("imgs :>> ",n),n=null===(r=n)||void 0===r?void 0:r.filter((function(e){return e&&e.generatedImg})),console.log("imgs",n),m[t]||(k(),m=document.querySelectorAll(".js-search-view .search__wrapper"));var o=m[t].querySelector(".js-search-products .products-wrapper"),a=m[t].querySelector(".js-search-prompt"),c=m[t].querySelector(".js-generate-more");console.log("Products slider",o);var i=o.parentNode.getAttribute("data-mockup-src");console.log("searchPrompt,search :>> ",a,e),a&&(a.textContent=e),c&&c.setAttribute("data-prompt",e),o&&(console.log(1),n.forEach((function(e,t){var r,n=o.querySelectorAll(".products-item")[t];if(console.log(2,e),n){var a=n.querySelector(".js-get-product-redirect");n.querySelector(".preview-image").style.backgroundImage="url(".concat(e.generatedImg,")"),a.setAttribute("data-id","".concat(e.id)),a.setAttribute("data-handle","".concat(e.handle||"")),e.handle||a.classList.add("loading"),n.classList.add("customized")}else S(o,'<div class="products-item customized">\n                        <div class="preview-image" style="background-image: url('.concat(e.generatedImg,')"></div>\n                        <img src="').concat(i,'"/>\n                        <button data-id="').concat(e.id,'" data-handle="').concat(e.handle||"",'" class="btn btn--secondary ').concat(e.handle?"":"loading",' js-get-product-redirect button button--secondary"><span>').concat(e.handle?"$34.99 Buy Now!":"Wait","</span></button>\n                    </div>"));null!==(r=e.handle)&&void 0!==r&&r.length?n&&J(n.querySelector(".btn"),!1):(console.error("No product handle found"),n&&J(n.querySelector(".btn"),!0))})))}))},E=function(e,t){var r;return console.log("checkImagesFullLoaded :>> ",e),(null==e||null===(r=e.images)||void 0===r?void 0:r.length)&&e.images.every((function(e){return t&&(console.log("cacheRun - setting not ready"),e.handle||(e.handle="not ready")),e.handle}))},j={};function _(e,t){var r;null===(r=j[e])||void 0===r||r.resolve(t),A(t)}var I=function(e,t){return new Promise((function(r){var n=setTimeout(r,t);j[e]={resolve:function(e){clearTimeout(n),Array.isArray(e)||(e=[e]),r(e)}}}))};function q(e,t){return O.apply(this,arguments)}function O(){return(O=(0,e.Z)(a().mark((function e(t,r){var n,o,c,i,s,l,d,p,h;return a().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:console.time("waitImagesResult",t,r),o=r?1:4e3,c=0,i=0;case 4:if(!(i<100)){e.next=41;break}if(r){e.next=12;break}return e.next=8,I(t,o);case 8:n=e.sent,console.log("imagesResponse :>> ",n),e.next=14;break;case 12:r=!1,o=500;case 14:if(n){e.next=26;break}return e.next=17,fetch("".concat(f,"/image?requestId=").concat(t),{method:"GET"});case 17:if(200===(p=e.sent).status){e.next=23;break}return console.error(p.status,p.statusText),L("Error images request ".concat(JSON.stringify([p.status,p.statusText]))),u.unsubscribe(t),e.abrupt("return",n);case 23:return e.next=25,p.json();case 25:n=e.sent;case 26:if(null===(s=n)||void 0===s||!s.nsfw){e.next=29;break}return null==x||x.$show(),e.abrupt("break",41);case 29:if(!E(n,r)){e.next=34;break}return console.timeEnd("waitImagesResult"),console.log("All images ready to buy"),B(),e.abrupt("break",41);case 34:(h=(null===(l=n)||void 0===l||null===(d=l.images)||void 0===d?void 0:d.filter((function(e){return e.generatedImg})).length)||0)>c&&(console.log("updateImagesPreviews :>> ",A),o+=1e3,A(n),$(),c=h),console.log("pending images...next ping in ".concat((o/1e3).toFixed(1)," seconds")),i?o*=1.03:o=400;case 38:i+=1,e.next=4;break;case 41:return u.unsubscribe(t),n.images&&0===n.images.length&&L("Can't get images. Probably DB connection error"),A(n),e.abrupt("return",n);case 45:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function P(e,t){return N.apply(this,arguments)}function N(){return(N=(0,e.Z)(a().mark((function e(t,r){var n,o,c;return a().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return console.time("generateImages with Replicate AI"),n=Date.now(),u.subscribe(String(n)).bind("1",(function(e){console.log("<< pusher >>",e),_(e.requestId,e)})),e.next=6,fetch("".concat(f,"/prompt"),{method:"POST",headers:{"Access-Control-Allow-Origin":"*","Content-Type":"application/json"},body:JSON.stringify({preventAutoExtend:p,fullPrompt:r&&t,prompt:d,reqDate:n,count:3})});case 6:return o=e.sent,e.next=9,o.json();case 9:if(c=e.sent,[200,201].includes(o.status)&&!c.error){e.next=14;break}return console.error(c),null==x||x.$show(),e.abrupt("return",!1);case 14:return console.log("response :>> ",c),c.forEach((function(e){var t,r;h[d]||(h[d]={}),(t=h[d])[r=e.input.prompt]||(t[r]=[]),h[d][e.input.prompt].push(e.id),e.result&&_(e.id,e.result)})),localStorage.setItem(l,JSON.stringify(h)),console.timeEnd("generateImages with Replicate AI"),e.abrupt("return",Promise.all(c.map((function(e){return q(e.id)}))));case 19:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function T(e){return R.apply(this,arguments)}function R(){return(R=(0,e.Z)(a().mark((function e(t){var r,n;return a().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return console.time("createShopifyProduct"),e.next=3,fetch("".concat(f,"/shopify-product"),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({imageId:t,type:"t-shirt",prompt:d})});case 3:return r=e.sent,console.log("response :>> ",r.status,r.statusText),console.timeEnd("createShopifyProduct"),e.next=8,r.json();case 8:return n=e.sent,console.log("json :>> ",n),e.abrupt("return",n);case 11:case"end":return e.stop()}}),e)})))).apply(this,arguments)}var C=new Map,G=function(e,t){var r,n,o,a,c=e.querySelector("SPAN");t?(e.classList.add("loading"),c&&(n="Loading",o=(r=c).textContent,a=0,C.set(r,{originalText:o}),r.textContent=n+".".repeat(a),a+=a<3?1:-3)):(e.classList.remove("loading"),c&&function(e){var t=C.get(e);t&&(e.textContent=t.originalText,C.delete(e))}(c))},J=function(e,t){var r=e.querySelector("SPAN");t?(e.classList.add("loading"),r&&(r.textContent="Wait")):(e.classList.remove("loading"),r&&(r.textContent="$34.99 Buy Now!"))},M=function(e){e?e.classList.add("loading"):document.querySelectorAll(".js-search-view .search__wrapper").forEach((function(e){e.classList.add("loading")}))},$=function(e){e?e.classList.remove("loading"):document.querySelectorAll(".js-search-view .search__wrapper").forEach((function(e){e.classList.remove("loading")}))},B=function(e){e?e.classList.remove("unavailable"):document.querySelectorAll(".js-search-view .search__wrapper").forEach((function(e){e.classList.remove("unavailable")}))};function F(e){e?e.classList.add("unavailable"):document.querySelectorAll(".js-search-view .search__wrapper").forEach((function(e){e.classList.add("unavailable")}))}function Z(e){return D.apply(this,arguments)}function D(){return(D=(0,e.Z)(a().mark((function e(t){var r,n,o;return a().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(t.target.classList.contains("js-get-product-redirect")?r=t.target:"img"===t.target.tagName.toLowerCase()&&(r=t.target.closest(".products-item").querySelector(".js-get-product-redirect")),r&&!r.classList.contains("loading")){e.next=3;break}return e.abrupt("return",!1);case 3:if(!(n=r.getAttribute("data-handle"))){e.next=13;break}if(!n.startsWith("not ready")){e.next=10;break}return e.next=8,T(r.getAttribute("data-id"));case 8:o=e.sent,r.setAttribute("data-handle",o.handle);case 10:window.open("/products/".concat(r.getAttribute("data-handle")),"_blank"),e.next=14;break;case 13:J(r,!0);case 14:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function U(){return z.apply(this,arguments)}function z(){return(z=(0,e.Z)(a().mark((function e(){var t,r;return a().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch("".concat(f,"/available-prompts?prompt=").concat(d),{method:"GET",headers:{"Access-Control-Allow-Origin":"*","Content-Type":"application/json"}});case 2:return t=e.sent,e.next=5,t.json();case 5:if(r=e.sent,200===t.status){e.next=9;break}return console.error(r),e.abrupt("return",!1);case 9:return e.abrupt("return",r);case 10:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function W(){return Y.apply(this,arguments)}function Y(){return(Y=(0,e.Z)(a().mark((function e(){var t,r,n,o,i,u;return a().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!w.classList.contains("loading")){e.next=2;break}return e.abrupt("return",!1);case 2:if(G(w,!0),s){e.next=7;break}return e.next=6,U();case 6:s=e.sent;case 7:r=c(s),e.prev=8,r.s();case 10:if((n=r.n()).done){e.next=17;break}if(o=n.value,g.get(o)){e.next=15;break}return t=o,e.abrupt("break",17);case 15:e.next=10;break;case 17:e.next=22;break;case 19:e.prev=19,e.t0=e.catch(8),r.e(e.t0);case 22:return e.prev=22,r.f(),e.finish(22);case 25:t||(i=Math.floor(Math.random()*s.length),t=s[i]),u=k().closest(".search__wrapper"),M(u),F(u),P(t,!0).then((function(e){G(w,!1),$(),console.log("Got images from Replicate API :>> ",e)}));case 30:case"end":return e.stop()}}),e,null,[[8,19,22,25]])})))).apply(this,arguments)}function H(e){var t=e.target.classList.contains("js-generate-more")?e.target:e.target.closest(".js-generate-more");if(t){var r=t.closest(".search__wrapper"),n=r.querySelector(".js-search-products .products-wrapper"),o=n.parentNode.getAttribute("data-mockup-src");if(t.classList.contains("loading"))return!1;for(var a=0;a<3;a++)S(n,'<div class="products-item">\n                    <div class="preview-image"></div>\n                    <img src="'.concat(o,'" />\n                    <button class="btn btn--secondary js-get-product-redirect button button--secondary"><span>$34.99 Buy Now!</span></button>\n                </div>'));M(r),F(r),G(t,!0),P(t.getAttribute("data-prompt"),!0).then((function(e){$(r),G(t,!1),console.log("Got images from Replicate API :>> ",e)}))}}function V(){if(!window.Pusher)return setTimeout(V,33);window.Pusher.logToConsole=!0,u=new window.Pusher("19daec24304eedd7aa8a",{cluster:"mt1"})}!function(){if(v&&y.length){v.querySelector('input[name="search"]').value=d,v.querySelector('input[name="preventAutoExtend"]').checked=p,U().then((function(e){s=e})).catch(console.error);try{V()}catch(e){console.error("pusher error",e)}if(d.length)if(h[d]){var e=Object.values(h[d]).reduce((function(e,t){return e.concat(t)}),[]);Promise.all(e.map((function(e){return q(e,!0)}))).then((function(e){var t;$(),(t=console).log.apply(t,["Got images from LS :>> "].concat(n(e)))})).catch(console.error)}else F(),P(d,!1).then((function(e){$(),console.log("Got images from Replicate API :>> ",e)})).catch(console.error);var t;null===(t=document.querySelector(".search"))||void 0===t||t.addEventListener("click",Z),null==w||w.addEventListener("click",W),null==y||y.forEach((function(e){e.addEventListener("click",H)}))}}()}(),function(){"use strict";var e=r(861),t=r(757),n=r.n(t);!function(){var t,r=window.location.pathname.includes("/product")&&document.body.classList.contains("template-product"),o=new URL(document.location).searchParams.get("key")||"",a=(new Map,"currentCreatingProduct"),c=(document.querySelector("#cart-notification"),function(e){return new Promise((function(t){return setTimeout(t,e)}))}),i=JSON.parse(localStorage.getItem(a)||"{}"),s=Object.keys(i).filter((function(e){return!i[e]})),u=function(e){window.gtag&&window.gtag("event","error",{event_category:"Replicate AI ERROR",event_label:"Images request error",value:e})},l=function(e){var r;e=e||t;var n=document.querySelectorAll(".product__modal-opener--image"),a=document.querySelectorAll(".product-media-modal__dialog img"),c=null===(r=e.images[o])||void 0===r?void 0:r.generatedImg;c&&(n.forEach((function(e){var t=document.createElement("img");t.className="preview-image",t.src=c,e.parentNode.insertBefore(t,e)})),a.forEach((function(e){var t=document.createElement("img");t.className="preview-image",t.src=c,e.parentNode.insertBefore(t,e)})))},f=function(){document.querySelectorAll("[data-url]").forEach((function(e){var t=new URL(document.location),r=t.searchParams.get("key");e.setAttribute("data-url","".concat(t.pathname,"?key=").concat(r))}))},d=function(){var r=(0,e.Z)(n().mark((function e(r){var o,a,i,s;return n().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(a=1e3,r){e.next=3;break}return e.abrupt("return");case 3:i=0;case 4:if(!(i<270)){e.next=27;break}return e.next=7,fetch("".concat("https://lime-filthy-duckling.cyclic.app","/image?imageId=").concat(r),{method:"GET"});case 7:return s=e.sent,e.next=10,s.json();case 10:if(o=e.sent,200===s.status){e.next=15;break}return console.error(o),u("Error images request ".concat(JSON.stringify(o))),e.abrupt("return",o);case 15:if(!o.length){e.next=19;break}if(!(t=o[0]).images){e.next=19;break}return e.abrupt("break",27);case 19:return t.images[r].generatedImg&&l(t),console.log("pending images...next ping in ".concat(a/1e3," seconds")),e.next=23,c(a);case 23:a=1e3;case 24:i+=1,e.next=4;break;case 27:return 0===o.length&&u("Can't get images. Probably DB connection error"),l(t),e.abrupt("return",t);case 30:case"end":return e.stop()}}),e)})));return function(e){return r.apply(this,arguments)}}();if(r&&o){d(o);var p=document.querySelector(".product__info-wrapper"),h=document.querySelector("variant-radios");p.classList.add("loading");var g=JSON.parse(window.sessionStorage.getItem(o)||"{}");if(Object.keys(g).length)!function e(t){if((i=JSON.parse(localStorage.getItem(a)||"{}"))[t]){p.classList.remove("loading"),console.log("Loaded product:",i[t]);var r=i[t].variants;h.variantData=r,h.querySelector('[type="application/json"]').textContent=JSON.stringify(r,null,2),h.updateOptions(),h.updateMasterId(),h.updateVariantInput(),f(),h.updateURL(),f()}else setTimeout((function(){return e(t)}),1e3),1}("/products/".concat(g.title.toLowerCase().replace(/[^a-z|0-9]+/gim,"-")));f()}var m=function(){var t=(0,e.Z)(n().mark((function e(t){var r,o;return n().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch("".concat(t,".js"),{method:"GET"});case 2:if(200!==(r=e.sent).status){e.next=10;break}return e.next=6,r.json();case 6:(o=e.sent).available?(console.log("FINALLY got product!!! ",o),(i=JSON.parse(localStorage.getItem(a)||"{}"))[t]=o,o.images.length?console.log("GOT IMAGES!"):setTimeout((function(){return m(t)}),1e3),window.localStorage.setItem(a,JSON.stringify(i))):setTimeout((function(){return m(t)}),1e3),e.next=11;break;case 10:setTimeout((function(){return m(t)}),1e3);case 11:case"end":return e.stop()}}),e)})));return function(e){return t.apply(this,arguments)}}();s.length&&s.forEach((function(e){m(e)}))}()}(),document.querySelectorAll(".popup").forEach((function(e){e.$open=function(){e.classList.add("show")},e.$show=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:2500;e.$open(),setTimeout((function(){return e.$close()}),t)},e.$close=function(){e.classList.remove("show")}}))}();