const preloader = document.getElementById('load');

window.addEventListener('load', () => {
  setTimeout(() => {
    setTimeout(() => {
      parallaxWidthCheck();
    }, 3000);
    preloader.classList.add('done');
  }, 1000);
});
