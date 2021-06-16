btnQueue.addEventListener('click', drawQueueFilmList);
btnWatched.addEventListener('click', drawWatchedFilmList);

const queue = `You do not have to queue movies to watch. Add them.`;
const watch = `You do not have watched movies. Add them.`;
const filmsQueueKey = 'filmsQueue';
const filmsWatchedKey = 'filmsWatched';

function drawQueueFilmList(key) {
  const filmsQueueLocalStorage = localStorage.getItem(filmsQueueKey, key);
  const parsedFilmsQueue = JSON.parse(filmsQueueLocalStorage);
  MyApi.pagination.cardContainer.classList.remove('is-hidden');
  MyApi.queueList = parsedFilmsQueue;

  MyApi.resetGalleryCard();
  btnQueue.classList.add('active');
  btnWatched.classList.remove('active');
  btnWatched.disabled = false;
  btnQueue.disabled = true;
  const INDICATOR_QUEUE = 'Queue';

  if (parsedFilmsQueue === null || parsedFilmsQueue.length === 0) {
    createPlugTitle(queue, filmsLibrary);
  } else {
    messageTitle.innerHTML = '';
    createParseFilms(parsedFilmsQueue, filmsLibrary, INDICATOR_QUEUE);
  }
}

function drawWatchedFilmList(key) {
  const filmsWatchedLocalStorage = localStorage.getItem(filmsWatchedKey, key);
  const parsedFilmsWatched = JSON.parse(filmsWatchedLocalStorage);

  MyApi.pagination.cardContainer.classList.remove('is-hidden');
  MyApi.watchedList = parsedFilmsWatched;

  MyApi.resetGalleryCard();
  btnQueue.classList.remove('active');
  btnWatched.classList.add('active');
  btnWatched.disabled = true;
  btnQueue.disabled = false;
  const INDICATOR_WATCHED = 'Watched';

  if (parsedFilmsWatched === null || parsedFilmsWatched.length === 0) {
    createPlugTitle(watch, filmsLibrary);
  } else {
    messageTitle.innerHTML = '';
    createParseFilms(parsedFilmsWatched, filmsLibrary, INDICATOR_WATCHED);
  }
}

function createParseFilms(film, library, siteSection) {
  film.forEach(el => {
    const LibraryCard = MyApi.createCardFunc(el, siteSection);
    library.append(LibraryCard);
    return library;
  });
}

let messageTitle = document.getElementsByClassName('message-title');
function createPlugTitle(title, library) {
  if (messageTitle.length === 0) {
    messageTitle = document.createElement('h2');
    messageTitle.textContent = title;
    messageTitle.classList.add('message-title');
    library.insertAdjacentElement('beforebegin', messageTitle);
  } else {
    messageTitle.textContent = title;
  }
  return library;
}

btnMyLibrary.addEventListener('click', handleUserStatusForLibrary);

function openLibrary() {
  window.scrollTo({
    top: document.body.children[6].offsetTop,
    behavior: 'smooth',
  });
  MyApi.hideSlider();
  MyApi.resetGalleryCard();
  btnQueue.disabled = false;
  btnWatched.disabled = false;
  btnWatched.classList.remove('active');
  btnQueue.classList.remove('active');
  detailsSection.innerHTML = '';
  paginationWrapper.innerHTML = '';
  form.classList.add('is-hidden');
  form.style.display = 'none';
  libraryFilrt.classList.remove('is-hidden');
  main.classList.remove('is-hidden');
}

btnHome.addEventListener('click', goHome);
iconButton.addEventListener('click', goHome);

function goHome() {
  window.scrollTo({
    top: document.body.children[7].offsetTop,
    behavior: 'smooth',
  });
  MyApi.showSlider();
  MyApi.resetGalleryCard();
  btnQueue.disabled = true;
  btnWatched.disabled = true;
  messageTitle.innerHTML = '';
  detailsSection.innerHTML = '';
  paginationWrapper.innerHTML = '';
  libraryFilrt.classList.add('is-hidden');
  main.classList.remove('is-hidden');
  form.classList.remove('is-hidden');
  form.style.display = 'block';
  MyApi.fetchPopularFilmsList();
}

function askingToMakeAuthorization() {
  welcomeTextSignUp.textContent = DEMAND_TO_REGISTER;
  authModalSignUp.classList.remove('signUp-hidden');
  authModalSignIn.classList.add('signIn-hidden');
  authBackdrop.classList.remove('auth__backdrop--hidden');
}
function handleUserStatusForLibrary() {
  if (!userStatus) {
    askingToMakeAuthorization();
  } else {
    openLibrary();
  }
}
