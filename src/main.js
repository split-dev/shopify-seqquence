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

  const dropdowns = document.querySelectorAll('.dropdown-toggle');
  const dropdownItems = document.querySelectorAll('.dropdown-items [data-val]');

  if (dropdowns?.length > 0) {
    dropdowns.forEach((dr) => {
      dr.addEventListener('click', (e) => {
        e.currentTarget.classList.toggle('active');
      });
    });
  }
  if (dropdownItems?.length > 0) {
    dropdownItems.forEach((di => {
      di.addEventListener('click', (e) => {
        const item = e.currentTarget;
        const parentDropdown = item.closest('[data-target]');
        const trgButtonSel = parentDropdown ? parentDropdown.getAttribute('data-target') : null;

        parentDropdown.querySelectorAll('[data-val]').forEach((it) => {
          it.classList.remove('active');
        });
        item.classList.add('active');

        if (trgButtonSel) {
          const trgButton = document.querySelector(trgButtonSel);
          const trgLabel = trgButton ? trgButton.querySelector('.dropdown-label') : null;

          trgLabel && (trgLabel.innerHTML = item.innerText);
          trgButton && trgButton.classList.toggle('active');
          trgButton.querySelector('input[type="hidden"]').value = item.getAttribute('data-val');
        }
      })
    }))
  }
});
