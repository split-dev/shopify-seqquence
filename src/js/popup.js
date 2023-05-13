document.querySelectorAll('.popup').forEach((p) => {
  p.$open = () => {
    p.classList.add('show');
  };
  p.$show = (ms = 2500) => {
    p.$open();
    setTimeout(() => p.$close(), ms);
  }
  p.$close = () => {
    p.classList.remove('show');
  };
})
