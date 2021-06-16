'use strict';

history.scrollRestoration = 'manual'; //kills auto scroll after page reload

MyApi.checkBackdropImgSize();
MyApi.checkPosterImgSize();

MyApi.fetchPopularFilmsList();
MyApi.dailyBestMovie();
MyApi.fetchGenres();

// Button UP Logic

btnTop.addEventListener('click', () => {
  scrollToTop();
});

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
}

window.onscroll = () => {
  parallaxCheck();
  handleScroll();
};

function handleScroll() {
  let bodyScrollTop = document.body.scrollTop;
  let elementScrollTop = document.documentElement.scrollTop;

  if (bodyScrollTop > 500 || elementScrollTop > 500) {
    btnTop.style.display = 'block';
  } else {
    btnTop.style.display = 'none';
  }
}

// Modal on Details Page Logic

//modalBtn.addEventListener('click', closeModal);
backdrop.addEventListener('click', onBeckDropCkick); // Close Modal on Backdrop click

function onHandleTrailerError() {
  player.src = `https://www.youtube.com/embed/Zq_zgig9DqQ?autoplay=1`;
}

function openModal(event) {
  event.preventDefault();

  body.classList.add('overflow');
  // youTubeSizes();

  MyApi.fetchVideoById().then(key => {
    player.src = `https://www.youtube.com/embed/${key}?autoplay=1`;
  });

  backdrop.classList.remove('backdrop--hidden');
  window.addEventListener('keydown', onKeybordPress);
}

function closeModal() {
  player.src = '';
  backdrop.classList.add('backdrop--hidden');
  body.classList.remove('overflow');
  window.removeEventListener('keydown', onKeybordPress);
}

// Close Modal by cleck on Btn Escape

function onKeybordPress(event) {
  if (event.code === 'Escape') {
    closeModal();
  }
}
// Close Modal by cleck on Backdrop
function onBeckDropCkick(event) {
  if (event.target.nodeName === 'DIV') {
    closeModal();
  }
}
