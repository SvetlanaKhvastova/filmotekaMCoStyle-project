let btnAddQueue = '';
let btnAddWatched = '';
let selectFilm = '';

function monitorButtonStatusText() {
  let arrFilmsQueue = JSON.parse(localStorage.getItem(filmsQueueKey));
  if (arrFilmsQueue === null) {
    btnAddQueue.textContent = 'Add to queue';
  } else {
    if (arrFilmsQueue.find(el => el.id === selectFilm.id)) {
      btnAddQueue.textContent = 'Delete from queue';
    } else {
      btnAddQueue.textContent = 'Add to queue';
    }
  }

  let arrFilmsWatched = JSON.parse(localStorage.getItem(filmsWatchedKey));
  if (arrFilmsWatched === null) {
    btnAddWatched.textContent = 'Add to watched';
  } else {
    if (arrFilmsWatched.find(el => el.id === selectFilm.id)) {
      btnAddWatched.textContent = 'Delete from watched';
    } else {
      btnAddWatched.textContent = 'Add to watched';
    }
  }
}
function toggleToLocal(key) {
  let films = JSON.parse(localStorage.getItem(key));

  if (films === null) {
    films = [];
    addFilm();
  } else {
    if (films.find(el => el.id === selectFilm.id)) {
      deleteFilm(selectFilm.id);
    } else {
      addFilm();
    }
  }

  function addFilm() {
    films.push(selectFilm);
  }
  function deleteFilm(idFilm) {
    films = films.filter(el => el.id != idFilm);
  }
  if (films.length === 0) {
    localStorage.removeItem(key);
  } else {
    localStorage.setItem(key, JSON.stringify(films));
  }
  monitorButtonStatusText();
}
