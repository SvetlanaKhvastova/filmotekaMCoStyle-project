function classToggle() {
  if (document.body.clientWidth <= 320) {
    logoText.classList.add('is-hidden');
  } else {
    logoText.classList.remove('is-hidden');
  }
}

classToggle();

window.addEventListener('resize', () => {
  if (document.body.clientWidth <= 320) {
    logoText.classList.add('is-hidden');
  } else {
    logoText.classList.remove('is-hidden');
  }
});
