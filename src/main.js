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
    console.log('dropdowns :>> ', dropdowns);
    dropdowns.forEach((dr) => {
      dr.addEventListener('click', (e) => {
        e.currentTarget.classList.toggle('active');
        if (window.innerWidth < 768) {
          document.body.classList.add('no-scroll');
          document.body.parentElement.classList.add('no-scroll');
        }
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

        document.body.classList.remove('no-scroll');
        document.body.parentElement.classList.remove('no-scroll');

        if (trgButtonSel) {
          const trgButton = document.querySelector(trgButtonSel);
          const trgLabel = trgButton ? trgButton.querySelector('.dropdown-label') : null;

          trgLabel && (trgLabel.innerHTML = item.innerText);
          trgButton && trgButton.classList.toggle('active', false);
          const hiddenVal = trgButton.querySelector('input[type="hidden"]');
          hiddenVal && (hiddenVal.value = item.getAttribute('data-val'));
        }
      })
    }))
  }
  document.body.addEventListener('click', (e) => {
    const trg = e.target;

    if (!(trg.classList.contains('dropdown-items') || trg.closest('.dropdown-items') || 
        trg.classList.contains('dropdown-toggle') || trg.closest('.dropdown-toggle'))) {
      const activeDropdowns = document.querySelectorAll('.dropdown-toggle.active');

      activeDropdowns.forEach((dropdown) => {
        dropdown.classList.remove('active');
      });
      document.body.classList.remove('no-scroll');
      document.body.parentElement.classList.remove('no-scroll');
    }
  })
});
