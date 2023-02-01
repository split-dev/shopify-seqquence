/**
 * imports
 */
import './css/main.scss';
// import Cookies from 'js-cookie';

document.addEventListener('DOMContentLoaded', function () {
  window.console.log('Hello from main.js 👋.');

  //Close mobile menu 
  let mobileMenu = document.querySelector('#menu-drawer');
  let menuDrawer = document.querySelector('#Details-menu-drawer-container');

  window.onclick = function(event) {
    if (event.target != mobileMenu) {
      menuDrawer.classList.remove('menu-opening');
    }
  }
});
