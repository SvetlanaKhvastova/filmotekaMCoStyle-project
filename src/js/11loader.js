const load = document.querySelector('.loader');

function loaderShow() {
  load.classList.remove('is-hidden');
}

function loaderHide() {
  load.classList.add('is-hidden');
}
