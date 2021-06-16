searchByActor.addEventListener('click', () => {
  input.placeholder = 'Which actor you wish?';
  searchByMovie.classList.remove('selected-option');
  searchByActor.classList.add('selected-option');
});

searchByMovie.addEventListener('click', () => {
  input.placeholder = 'What movie you wish?';
  searchByMovie.classList.add('selected-option');
  searchByActor.classList.remove('selected-option');
});

clearInputBtn.addEventListener('click', () => {
  input.value = '';
});

form.addEventListener('submit', e => {
  e.preventDefault();
  let emptyError = 'There is no nameless movies!';
  let inputValue = e.target.elements.query.value;
  if (inputValue.trim() === '') {
    return MyApi.handlErrors(emptyError);
  } else {
    MyApi.resetGalleryCard();
    MyApi.activeLoader();
    MyApi.resetPage();
    MyApi.searchMode = 'default';
    MyApi.params.query = inputValue;
    setTimeout(() => {
      if (searchByActor.classList.contains('selected-option')) {
        MyApi.fetchActorsId(inputValue);
      } else {
        MyApi.movieSearch();
      }
    }, 3000);
  }
});
