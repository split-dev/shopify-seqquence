!function(){var t={757:function(t,e,r){t.exports=r(666)},666:function(t){var e=function(t){"use strict";var e,r=Object.prototype,n=r.hasOwnProperty,o="function"==typeof Symbol?Symbol:{},i=o.iterator||"@@iterator",a=o.asyncIterator||"@@asyncIterator",c=o.toStringTag||"@@toStringTag";function u(t,e,r){return Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{u({},"")}catch(t){u=function(t,e,r){return t[e]=r}}function s(t,e,r,n){var o=e&&e.prototype instanceof m?e:m,i=Object.create(o.prototype),a=new _(n||[]);return i._invoke=function(t,e,r){var n=l;return function(o,i){if(n===p)throw new Error("Generator is already running");if(n===y){if("throw"===o)throw i;return A()}for(r.method=o,r.arg=i;;){var a=r.delegate;if(a){var c=k(a,r);if(c){if(c===d)continue;return c}}if("next"===r.method)r.sent=r._sent=r.arg;else if("throw"===r.method){if(n===l)throw n=y,r.arg;r.dispatchException(r.arg)}else"return"===r.method&&r.abrupt("return",r.arg);n=p;var u=f(t,e,r);if("normal"===u.type){if(n=r.done?y:h,u.arg===d)continue;return{value:u.arg,done:r.done}}"throw"===u.type&&(n=y,r.method="throw",r.arg=u.arg)}}}(t,r,a),i}function f(t,e,r){try{return{type:"normal",arg:t.call(e,r)}}catch(t){return{type:"throw",arg:t}}}t.wrap=s;var l="suspendedStart",h="suspendedYield",p="executing",y="completed",d={};function m(){}function v(){}function g(){}var w={};u(w,i,(function(){return this}));var b=Object.getPrototypeOf,x=b&&b(b(P([])));x&&x!==r&&n.call(x,i)&&(w=x);var L=g.prototype=m.prototype=Object.create(w);function E(t){["next","throw","return"].forEach((function(e){u(t,e,(function(t){return this._invoke(e,t)}))}))}function j(t,e){function r(o,i,a,c){var u=f(t[o],t,i);if("throw"!==u.type){var s=u.arg,l=s.value;return l&&"object"==typeof l&&n.call(l,"__await")?e.resolve(l.__await).then((function(t){r("next",t,a,c)}),(function(t){r("throw",t,a,c)})):e.resolve(l).then((function(t){s.value=t,a(s)}),(function(t){return r("throw",t,a,c)}))}c(u.arg)}var o;this._invoke=function(t,n){function i(){return new e((function(e,o){r(t,n,e,o)}))}return o=o?o.then(i,i):i()}}function k(t,r){var n=t.iterator[r.method];if(n===e){if(r.delegate=null,"throw"===r.method){if(t.iterator.return&&(r.method="return",r.arg=e,k(t,r),"throw"===r.method))return d;r.method="throw",r.arg=new TypeError("The iterator does not provide a 'throw' method")}return d}var o=f(n,t.iterator,r.arg);if("throw"===o.type)return r.method="throw",r.arg=o.arg,r.delegate=null,d;var i=o.arg;return i?i.done?(r[t.resultName]=i.value,r.next=t.nextLoc,"return"!==r.method&&(r.method="next",r.arg=e),r.delegate=null,d):i:(r.method="throw",r.arg=new TypeError("iterator result is not an object"),r.delegate=null,d)}function S(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function O(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function _(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(S,this),this.reset(!0)}function P(t){if(t){var r=t[i];if(r)return r.call(t);if("function"==typeof t.next)return t;if(!isNaN(t.length)){var o=-1,a=function r(){for(;++o<t.length;)if(n.call(t,o))return r.value=t[o],r.done=!1,r;return r.value=e,r.done=!0,r};return a.next=a}}return{next:A}}function A(){return{value:e,done:!0}}return v.prototype=g,u(L,"constructor",g),u(g,"constructor",v),v.displayName=u(g,c,"GeneratorFunction"),t.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===v||"GeneratorFunction"===(e.displayName||e.name))},t.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,g):(t.__proto__=g,u(t,c,"GeneratorFunction")),t.prototype=Object.create(L),t},t.awrap=function(t){return{__await:t}},E(j.prototype),u(j.prototype,a,(function(){return this})),t.AsyncIterator=j,t.async=function(e,r,n,o,i){void 0===i&&(i=Promise);var a=new j(s(e,r,n,o),i);return t.isGeneratorFunction(r)?a:a.next().then((function(t){return t.done?t.value:a.next()}))},E(L),u(L,c,"Generator"),u(L,i,(function(){return this})),u(L,"toString",(function(){return"[object Generator]"})),t.keys=function(t){var e=[];for(var r in t)e.push(r);return e.reverse(),function r(){for(;e.length;){var n=e.pop();if(n in t)return r.value=n,r.done=!1,r}return r.done=!0,r}},t.values=P,_.prototype={constructor:_,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=e,this.done=!1,this.delegate=null,this.method="next",this.arg=e,this.tryEntries.forEach(O),!t)for(var r in this)"t"===r.charAt(0)&&n.call(this,r)&&!isNaN(+r.slice(1))&&(this[r]=e)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var r=this;function o(n,o){return c.type="throw",c.arg=t,r.next=n,o&&(r.method="next",r.arg=e),!!o}for(var i=this.tryEntries.length-1;i>=0;--i){var a=this.tryEntries[i],c=a.completion;if("root"===a.tryLoc)return o("end");if(a.tryLoc<=this.prev){var u=n.call(a,"catchLoc"),s=n.call(a,"finallyLoc");if(u&&s){if(this.prev<a.catchLoc)return o(a.catchLoc,!0);if(this.prev<a.finallyLoc)return o(a.finallyLoc)}else if(u){if(this.prev<a.catchLoc)return o(a.catchLoc,!0)}else{if(!s)throw new Error("try statement without catch or finally");if(this.prev<a.finallyLoc)return o(a.finallyLoc)}}}},abrupt:function(t,e){for(var r=this.tryEntries.length-1;r>=0;--r){var o=this.tryEntries[r];if(o.tryLoc<=this.prev&&n.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var i=o;break}}i&&("break"===t||"continue"===t)&&i.tryLoc<=e&&e<=i.finallyLoc&&(i=null);var a=i?i.completion:{};return a.type=t,a.arg=e,i?(this.method="next",this.next=i.finallyLoc,d):this.complete(a)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),d},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.finallyLoc===t)return this.complete(r.completion,r.afterLoc),O(r),d}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.tryLoc===t){var n=r.completion;if("throw"===n.type){var o=n.arg;O(r)}return o}}throw new Error("illegal catch attempt")},delegateYield:function(t,r,n){return this.delegate={iterator:P(t),resultName:r,nextLoc:n},"next"===this.method&&(this.arg=e),d}},t}(t.exports);try{regeneratorRuntime=e}catch(t){"object"==typeof globalThis?globalThis.regeneratorRuntime=e:Function("r","regeneratorRuntime = r")(e)}}},e={};function r(n){var o=e[n];if(void 0!==o)return o.exports;var i=e[n]={exports:{}};return t[n](i,i.exports,r),i.exports}r.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(e,{a:e}),e},r.d=function(t,e){for(var n in e)r.o(e,n)&&!r.o(t,n)&&Object.defineProperty(t,n,{enumerable:!0,get:e[n]})},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},function(){"use strict";document.addEventListener("DOMContentLoaded",(function(){window.console.log("Hello from main.js 👋.");var t=document.querySelector("#menu-drawer"),e=document.querySelector("#Details-menu-drawer-container");window.onclick=function(r){r.target!=t&&e.classList.remove("menu-opening")}}))}(),function(){"use strict";function t(t,e,r,n,o,i,a){try{var c=t[i](a),u=c.value}catch(t){return void r(t)}c.done?e(u):Promise.resolve(u).then(n,o)}function e(e){return function(){var r=this,n=arguments;return new Promise((function(o,i){var a=e.apply(r,n);function c(e){t(a,o,i,c,u,"next",e)}function u(e){t(a,o,i,c,u,"throw",e)}c(void 0)}))}}var n=r(757),o=r.n(n);!function(){var t="ai-search",r=document.getElementById("aiSearch"),n=document.querySelectorAll(".js-generate-more"),i=document.querySelectorAll(".js-search-view"),a=localStorage.getItem(t),c="https://awesome-code-nkh8j.cloud.serverless.com",u=a?JSON.parse(a):{},s=function(t){return new Promise((function(e){return setTimeout(e,t)}))},f={},l=new Map,h=new URL(document.location).searchParams.get("search")||"";if(r&&i.length){var p=function(t){t.forEach((function(t,e){l.get(t.prompt)?l.set(t.prompt,Object.assign({},l.get(t.prompt),t.images)):l.set(t.prompt,t.images)}));var e=l.keys();Array.from(e).forEach((function(t,e){var r=l.get(t);if(Object.keys(r).forEach((function(t){f[e]=f[e]||{},f[e][t]=r[t].tShirtResult})),i[e]){var n=i[e].querySelector(".js-search-swiper"),o=i[e].querySelector(".js-search-prompt"),a=i[e].querySelector(".js-generate-more");o&&(o.textContent=t),a&&a.setAttribute("data-prompt",t),n&&Object.keys(f[e]).forEach((function(t,r){var o=n.querySelectorAll(".swiper-slide")[r];o?(o.querySelector("IMG").setAttribute("src",f[e][t]),o.querySelector("A").setAttribute("href","/products/t-shirt-mockup?key=".concat(t))):n.swiper.appendSlide('<div class="swiper-slide"><a href="/products/t-shirt-mockup?key='.concat(t,'" target="_blank"><img src="').concat(f[e][t],'" /></a></div>'))}))}})),console.log("FULL imagesResult :>> ",f)},y=function(){var t=e(o().mark((function t(e,r){var n,i,a,u,f;return o().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:i=r||1e4,a=0,u=0;case 3:if(!(u<270)){t.next=23;break}return t.next=6,fetch("".concat(c,"/image?requestId=").concat(e.join(",")),{method:"GET"});case 6:return f=t.sent,t.next=9,f.json();case 9:if(n=t.sent,200===f.status){t.next=13;break}return console.error(n),t.abrupt("return",n);case 13:if(n.length!==e.length){t.next=15;break}return t.abrupt("break",23);case 15:return n.length>a&&(p(n),a=n.length),console.log("pending images...next ping in ".concat(i/1e3," seconds")),t.next=19,s(i);case 19:i=1e3;case 20:u+=1,t.next=3;break;case 23:return p(n),t.abrupt("return",n);case 25:case"end":return t.stop()}}),t)})));return function(e,r){return t.apply(this,arguments)}}(),d=function(){var r=e(o().mark((function e(r,n){var i,a,s;return o().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch("".concat(c,"/prompt"),{method:"POST",headers:{"Access-Control-Allow-Origin":"*","Content-Type":"application/json"},body:JSON.stringify((o={},f=n?"fullPrompt":"prompt",l=r,f in o?Object.defineProperty(o,f,{value:l,enumerable:!0,configurable:!0,writable:!0}):o[f]=l,o))});case 2:return i=e.sent,e.next=5,i.json();case 5:if(a=e.sent,201===i.status){e.next=9;break}return console.error(a),e.abrupt("return",!1);case 9:return s=a.map((function(t){return t.id})),a.map((function(t){return t.input.prompt})).forEach((function(t,e){u[h]=u[h]||{},u[h]&&(u[h][t]?u[h][t].push(s[e]):u[h][t]=[s[e]])})),localStorage.setItem(t,JSON.stringify(u)),e.next=15,y(s);case 15:return e.abrupt("return",e.sent);case 16:case"end":return e.stop()}var o,f,l}),e)})));return function(t,e){return r.apply(this,arguments)}}();if(h.length){if(u[h]){var m=Object.values(u[h]).reduce((function(t,e){return t.concat(e)}),[]);y(m,1).then((function(t){console.log("Got images from LS :>> ",t)}))}else d(h).then((function(t){return t})).then((function(t){console.log("Got images from Replicate API :>> ",t)}));n.forEach((function(t,e){t.addEventListener("click",(function(){d(t.getAttribute("data-prompt"),!0).then((function(t){return t})).then((function(t){console.log("Got images from Replicate API :>> ",t)}))}))}))}r.querySelector('input[name="search"]').value=h}}()}()}();