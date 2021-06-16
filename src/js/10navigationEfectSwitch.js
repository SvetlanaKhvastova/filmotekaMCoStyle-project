(() => {
  const refs = {
    homePage: document.querySelector('[data-home]'),
    libraryPage: document.querySelector('[data-library]'),
    iconButton: document.querySelector('[data-icon]'),
  };
  const { homePage, libraryPage, iconButton } = refs;

  homePage.addEventListener('click', homeEfect);
  iconButton.addEventListener('click', homeEfect);
  libraryPage.addEventListener('click', libraryEfect);

  function homeEfect() {
    if (!homePage.classList.contains('current')) {
      homePage.classList.add('current');
      if (libraryPage.classList.contains('current')) {
        libraryPage.classList.remove('current');
      }
    }
  }

  function libraryEfect() {
    if (!libraryPage.classList.contains('current')) {
      libraryPage.classList.add('current');
      if (homePage.classList.contains('current')) {
        homePage.classList.remove('current');
      }
    }
  }
})();

   
