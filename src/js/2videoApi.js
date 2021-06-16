class MovieApi {
  constructor(key, paginationWrapper, cardWrapper, sliderWrapper) {
    this.API_KEY = key;
    this.BASE_URL = 'https://api.themoviedb.org/3/';
    this.IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/';

    this.DEFAULT_IMAGE = './images/default_backdrop2.jpg';
    this.DEFAULT_POSTER = './images/default_poster.jpg';

    this.VIDEO_BASE_URL = 'https://api.themoviedb.org/3/movie/';
    this.movieID = 0;
    this.searchMode = 'popular';

    this.popularFilmItem = [];
    this.watchedList = [];
    this.queueList = [];
    this.genres = [];
    this.actors = [];
    this.actorsId = [];
    this.dailyBestArr = [];

    this.currentPage = 1;

    this.params = {
      generalSearchUrl: 'search/movie?',
      searchActorUrl: 'search/person?',
      popularSearchUrl: 'movie/popular?',
      genreSearchUrl: 'genre/movie/list?',
      byGenreSearchUrl: 'discover/movie?',
      query: '',
      _page: 1,
      lastPage: '',
    };
    this.pagination = {
      window: 5,
      cardContainer: cardWrapper,
      paginationContainer: paginationWrapper,
      sliderContainer: sliderWrapper,
    };
    this.imgCards = {
      defaultBackdropImg: '',
      defaultPosterImg: '',
      currentSizes: {
        backdropSize: '',
        posterSize: '',
      },
      backdropSizes: {
        mobile: 'w500',
        tablet: 'w500',
        desktop: 'w500',
      },
      posterSizes: {
        mobile: 'w342',
        tablet: 'w500',
        desktop: 'w780',
      },
    };
  }
  activeLoader() {
    this.pagination.paginationContainer.classList.add('is-hidden');
    const loaderArr = [...loaderPartOne, ...loaderPartTwo];
    loaderArr.map(part => {
      part.classList.remove('is-hidden');
    });
  }
  hideSlider() {
    this.pagination.paginationContainer.classList.remove('is-hidden');
    const heroContainer = document.querySelector(['.hero']);
    heroContainer.classList.add('is-hidden');
  }
  showSlider() {
    this.pagination.paginationContainer.classList.remove('is-hidden');
    const heroContainer = document.querySelector(['.hero']);
    heroContainer.classList.remove('is-hidden');
  }

  hideLoader() {
    this.pagination.paginationContainer.classList.remove('is-hidden');
    const loaderArr = [...loaderPartOne, ...loaderPartTwo];
    loaderArr.map(part => {
      part.classList.add('is-hidden');
    });
  }
  fetchVideoById() {
    return fetch(
      `${this.VIDEO_BASE_URL}${this.movieID}/videos?api_key=${this.API_KEY}`,
    )
      .then(response => response.json())
      .then(resp => {
        return resp;
      })
      .then(({ results }) => {
        if (results.length === 0) onHandleTrailerError();
        return results[0];
      })
      .then(({ key }) => key);
  }
  dailyBestMovie() {
    return fetch(
      `https://api.themoviedb.org/3/trending/movie/day?api_key=${this.API_KEY}`,
    )
      .then(response => response.json())
      .then(({ results }) => {
        this.dailyBestArr = results;
        return results;
      })
      .then(col => {
        return col.map(el => {
          return this.createSliderCard(el, 'daily');
        });
      })
      .then(arr => {
        this.pagination.sliderContainer.append(...arr);

        const slider = tns({
          container: '.my-slider',
          items: 3,
          slideBy: 'page',
          autoplay: true,
        });
        return slider();
      });
  }

  fetchPopularFilmsList() {
    this.searchMode = 'popular';
    this.resetGalleryCard();
    return fetch(
      `${this.BASE_URL}${this.params.popularSearchUrl}api_key=${this.API_KEY}&language=en-US&page=${this.params._page}`,
    )
      .then(response => response.json())
      .then(resp => {
        this.setRatioButtons(resp);
        return resp;
      })
      .then(({ results }) => {
        this.popularFilmItem = results;
        return results;
      })
      .then(collection =>
        collection.map(el => {
          return this.createCardFunc(el);
        }),
      )
      .then(item => {
        this.pagination.cardContainer.append(...item);
      })
      .finally(() => {
        this.pagination.cardContainer.classList.remove('is-hidden');
        this.hideLoader();
      });
  }

  fetchFilmsListByGenre(val) {
    this.searchMode = 'popular';
    this.resetGalleryCard();
    return fetch(
      `${this.BASE_URL}${this.params.byGenreSearchUrl}api_key=${this.API_KEY}&language=en-US&page=${this.params._page}&with_genres=${val}`,
    )
      .then(response => response.json())
      .then(resp => {
        this.setRatioButtons(resp);
        return resp;
      })
      .then(({ results }) => {
        this.popularFilmItem = results;
        return results;
      })
      .then(collection =>
        collection.map(el => {
          return this.createCardFunc(el);
        }),
      )
      .then(item => MyApi.pagination.cardContainer.append(...item))
      .finally(() => {
        this.pagination.cardContainer.classList.remove('is-hidden');
      });
  }
  fetchGenres() {
    return fetch(
      `${this.BASE_URL}${this.params.genreSearchUrl}api_key=${this.API_KEY}`,
    )
      .then(response => response.json())
      .then(data => {
        this.setRatioButtons(data);
        return data;
      })
      .then(({ genres }) => {
        return (this.genres = genres);
      })
      .finally(() => {
        this.pagination.cardContainer.classList.remove('is-hidden');
      });
  }
  fetchReviews() {
    return fetch(
      `${this.VIDEO_BASE_URL}${this.movieID}/reviews?api_key=${this.API_KEY}`,
    )
      .then(response => response.json())
      .then(data => {
        return data;
      })
      .then(({ results }) => {
        this.reviews = results
          .map(author => {
            return [author.author_details.name, author.content];
          })
          .slice(0, 5);
        return this.reviews;
      });
  }

  fetchActors() {
    return fetch(
      `${this.BASE_URL}movie/${this.movieID}/credits?api_key=${this.API_KEY}`,
    )
      .then(response => response.json())
      .then(resp => {
        return resp;
      })
      .then(({ cast }) => {
        return cast;
      })
      .then(cast => {
        cast.forEach(el => {
          this.actors.push(el.name);
          return this.actors;
        });
      });
  }

  movieSearch() {
    this.searchMode = 'default';
    return fetch(
      `${this.BASE_URL}${this.params.generalSearchUrl}api_key=${this.API_KEY}&language=en-US&query=${this.params.query}&page=${this.params._page}`,
    )
      .then(data => data.json())
      .then(data => {
        this.setRatioButtons(data);
        return data;
      })
      .then(resp => {
        if (resp.results.length === 0) {
          this.fetchPopularFilmsList();
          throw Error('Sorry we dont watch this kind of movies!');
        }
        this.resetGalleryCard();
        this.setRatioButtons(resp);
        return resp;
      })
      .then(({ results }) => {
        this.popularFilmItem = results;
        return results;
      })
      .then(collection =>
        collection.map(el => {
          return this.createCardFunc(el);
        }),
      )
      .then(item => MyApi.pagination.cardContainer.append(...item))
      .catch(error => this.handlErrors(error))
      .finally(() => {
        this.pagination.cardContainer.classList.remove('is-hidden');
        this.hideLoader();
      });
  }

  fetchActorsId(name) {
    return fetch(
      `https://api.themoviedb.org/3/search/person?api_key=${this.API_KEY}&language=en-US&query=${name}`,
    )
      .then(response => response.json())
      .then(resp => {
        return resp;
      })
      .then(resp => {
        if (resp.results.length === 0) {
          this.fetchPopularFilmsList();
          throw Error('Sorry we dont know this actor!');
        }
        this.resetGalleryCard();
        this.setRatioButtons(resp);
        return resp;
      })
      .then(({ results }) => {
        return results;
      })
      .then(results => {
        const castList = results
          .reduce((acc, el) => {
            acc.push(el.id);
            return acc;
          }, [])
          .slice(0, 1);
        MyApi.movieSearchByActors(castList);
      })
      .catch(error => this.handlErrors(error))
      .finally(() => {
        this.hideLoader();
      });
  }

  movieSearchByActors(value) {
    this.searchMode = 'popular';
    return fetch(
      `${this.BASE_URL}discover/movie?api_key=${this.API_KEY}&language=en-US&query=${this.params.query}&page=${this.params._page}&with_cast=${value}`,
    )
      .then(data => data.json())
      .then(data => {
        this.setRatioButtons(data);
        return data;
      })
      .then(resp => {
        if (resp.results.length === 0) {
          this.fetchPopularFilmsList();
          throw Error('Sorry we dont know this actor!');
        }
        this.resetGalleryCard();
        this.setRatioButtons(resp);
        return resp;
      })
      .then(({ results }) => {
        this.popularFilmItem = results;
        return results;
      })
      .then(collection =>
        collection.map(el => {
          return this.createCardFunc(el);
        }),
      )
      .then(item => MyApi.pagination.cardContainer.append(...item))
      .catch(error => this.handlErrors(error))
      .finally(() => {
        this.pagination.cardContainer.classList.remove('is-hidden');
        this.hideLoader();
      });
  }

  handlErrors(text) {
    errorNotification.classList.remove('is-hidden');
    errorNotification.textContent = text.message || text;
    setTimeout(() => {
      errorNotification.classList.add('is-hidden');
    }, 3000);
  }

  resetGalleryCard() {
    this.pagination.cardContainer.innerHTML = '';
    reviewCard.innerHTML = '';
  }
  createSliderCard(data, siteSection) {
    const id = data.id;
    const sliderDiv = document.createElement('div');
    const sliderTitle = document.createElement('h2');
    sliderTitle.textContent = data.title;
    sliderTitle.classList.add('slider__item-title');
    sliderDiv.append(sliderTitle);
    sliderDiv.classList.add('slider__item');
    sliderDiv.style.backgroundImage = `url('${MyApi.IMAGE_BASE_URL}${MyApi.imgCards.currentSizes.backdropSize}${data.poster_path}')`;
    sliderDiv.addEventListener('click', () => {
      this.movieID = id;
      this.pagination.cardContainer.classList.add('is-hidden');
      this.hideSlider();
      this.activeLoader();
      window.scrollTo(0, document.body.children[7].offsetTop);
      setTimeout(() => {
        main.classList.add('is-hidden');
        this.activeDetailsPage(id, siteSection);
      }, 2000);
      this.fetchActors(this.movieID);
    });
    return sliderDiv;
  }

  createCardFunc(itemData, siteSection) {
    main.classList.remove('is-hidden');

    const { backdrop_path, title, id, vote_average, release_date } = itemData;
    const imgCardSize = backdrop_path
      ? `${MyApi.IMAGE_BASE_URL}${MyApi.imgCards.currentSizes.backdropSize}${backdrop_path}`
      : MyApi.imgCards.defaultBackdropImg;

    const yearOfRelease = release_date ? `(${release_date.slice(0, 4)})` : '';

    const cardImg = document.createElement('img');
    cardImg.setAttribute('src', imgCardSize);
    cardImg.classList.add('gallery__item-image');
    cardImg.setAttribute('alt', title);

    const imgContainer = document.createElement('div');
    imgContainer.classList.add('movie__image');
    imgContainer.append(cardImg);

    const filmTitle = document.createElement('p');
    filmTitle.classList.add('movie__title');
    filmTitle.textContent = `${title} ${yearOfRelease}`;

    const spanRating = document.createElement('span');
    spanRating.classList.add('movie__genre');
    spanRating.textContent = `☆  ` + `${vote_average}`;

    const cardContainer = document.createElement('div');
    cardContainer.classList.add('gallery__card-movie');
    cardContainer.append(imgContainer, filmTitle, spanRating);

    const item = document.createElement('li');
    item.classList.add('gallery__list-item');
    item.append(cardContainer);

    item.addEventListener('click', () => {
      this.movieID = id;
      messageTitle.innerHTML = '';
      this.pagination.cardContainer.classList.add('is-hidden');
      this.hideSlider();
      this.activeLoader();
      //Скролит вверх
      window.scrollTo(0, document.body.children[7].offsetTop);
      setTimeout(() => {
        this.activeDetailsPage(id, siteSection);
      }, 2000);
      this.fetchActors(this.movieID);
    });
    return item;
  }

  activeDetailsPage(id, libraryIndicator) {
    form.classList.add('is-hidden');
    btnTop.classList.add('is-hidden');
    main.classList.add('is-hidden');
    detailsSection.classList.remove('is-hidden');

    this.movieID = id;
    let collectionItems = [];
    if (libraryIndicator === 'Queue') {
      collectionItems = this.queueList;
    } else if (libraryIndicator === 'Watched') {
      collectionItems = this.watchedList;
    } else if (!libraryIndicator) {
      collectionItems = this.popularFilmItem;
    } else if (libraryIndicator === 'daily') {
      collectionItems = this.dailyBestArr;
    }

    const array = collectionItems.filter(item => {
      if (item.id === id) return item;
    });
    const item = array[0];
    const genresArray = [];

    const itemGenres = item.genre_ids;
    itemGenres.filter(item => {
      for (let key of this.genres) {
        if (item === key.id) return genresArray.push(key.name);
      }
    });
    const genresText = genresArray.join(', ');

    const tdGenre = document.createElement('td');
    tdGenre.textContent = 'genre';
    const tdGenreName = document.createElement('td');
    tdGenreName.textContent = genresText;
    const trGenre = document.createElement('tr');
    trGenre.append(tdGenre, tdGenreName);
    trGenre.classList.add('details-page__rows');

    let mainActors = this.actors.slice(0, 5).join(', ');

    const tdActors = document.createElement('td');
    tdActors.textContent = 'actors';
    const tdActorsName = document.createElement('td');
    tdActorsName.textContent = mainActors;
    const trActors = document.createElement('tr');
    trActors.append(tdActors, tdActorsName);
    trActors.classList.add('details-page__rows');

    const tdTitle = document.createElement('td');
    tdTitle.textContent = 'original title';
    const tdTitleName = document.createElement('td');
    tdTitleName.textContent = item.original_title;
    const trTitle = document.createElement('tr');
    trTitle.classList.add('details-page__rows');
    trTitle.append(tdTitle, tdTitleName);

    const tdPopularity = document.createElement('td');
    tdPopularity.textContent = 'popularity';
    const tdPopularityName = document.createElement('td');
    tdPopularityName.textContent = item.popularity;
    const trPopularity = document.createElement('tr');
    trPopularity.classList.add('details-page__rows');
    trPopularity.append(tdPopularity, tdPopularityName);

    const tdVote = document.createElement('td');
    tdVote.textContent = 'vote / votes';
    const spanVote = document.createElement('span');
    spanVote.classList.add('rows__vote');
    spanVote.textContent = item.vote_average;

    const tdVoteName = document.createElement('td');
    tdVoteName.textContent = `/ ${item.vote_count}`;
    spanVote.appendChild(tdVoteName);

    const trVotes = document.createElement('tr');
    trVotes.classList.add('details-page__rows');
    trVotes.append(tdVote, spanVote);

    const table = document.createElement('table');
    table.classList.add('details-page__table');

    table.append(trVotes, trPopularity, trTitle, trGenre, trActors);

    const title = document.createElement('h2');
    title.classList.add('details-page__title');
    title.textContent = item.title;

    const div = document.createElement('div');
    div.append(title, table);

    const divPage = document.createElement('div');
    divPage.classList.add('details-page__about');
    const titleText = document.createElement('h3');
    titleText.classList.add('details-page__title', 'second');
    titleText.textContent = 'About';

    const spanAbout = document.createElement('span');
    spanAbout.classList.add('material-icons', 'span-about');
    spanAbout.textContent = 'info';
    titleText.append(spanAbout);

    const textAbout = document.createElement('p');
    textAbout.classList.add('details-page__text');
    textAbout.textContent = item.overview;

    const reviewsTitle = document.createElement('h3');
    reviewsTitle.classList.add(
      'details-page__title',
      'second',
      'reviews-title',
    );
    reviewsTitle.textContent = 'Reviews';
    const spanInput = document.createElement('span');
    spanInput.classList.add('material-icons', 'span-input');
    spanInput.textContent = 'input';
    reviewsTitle.append(spanInput);

    this.fetchReviews();

    reviewsTitle.addEventListener('click', () => {
      if (this.reviews.length === 0) {
        reviewsTitle.textContent = 'Sorry, we do not have any review yet!';
        return;
      }

      if (!userStatus) {
        askingToMakeAuthorization();
        return;
      }

      window.scrollTo({
        top: document.body.children[6].offsetTop,
        behavior: 'smooth',
      });

      detailsSection.classList.add('is-hidden');

      const btnClose = document.createElement('button');
      btnClose.classList.add('button__add', 'button-close', 'btn-reviews');
      btnClose.textContent = 'X';

      btnClose.addEventListener('click', () => {
        detailsSection.classList.remove('is-hidden');
        reviewCard.innerHTML = '';
        messageTitle.innerHTML = '';
      });

      reviewCard.append(btnClose);

      this.reviews.map(el => {
        if (el[0] === '') {
          el[0] = 'anonym';
        }

        const reviewsAutor = document.createElement('h3');
        reviewsAutor.classList.add('reviews-autor');
        const autorFace = document.createElement('span');
        autorFace.classList.add('material-icons', 'icons-face');
        autorFace.textContent = 'face';
        const reviewsText = document.createElement('p');
        reviewsText.classList.add('reviews-text');
        reviewsAutor.textContent = el[0];
        reviewsText.textContent =
          el[1].split(' ').slice(0, 100).join(' ') + '...';

        reviewCard.append(autorFace, reviewsAutor, reviewsText);
        reviewsText.addEventListener('click', () => {
          reviewsText.textContent = el[1];
        });
      });
    });
    divPage.append(titleText, textAbout, reviewsTitle);

    const buttonFirst = document.createElement('button');
    buttonFirst.classList.add('button__add', 'first');
    buttonFirst.setAttribute('type', 'submite');
    buttonFirst.textContent = 'add to watched';
    buttonFirst.addEventListener('click', () => {
      if (!userStatus) {
        askingToMakeAuthorization();
      } else {
        this.onWatchedClick();
      }
    });

    const buttonSecond = document.createElement('button');
    buttonSecond.classList.add('button__add');
    buttonSecond.setAttribute('type', 'submite');
    buttonSecond.textContent = 'add to queue';
    buttonSecond.addEventListener('click', () => {
      if (!userStatus) {
        askingToMakeAuthorization();
      } else {
        this.onQueueClick();
      }
    });

    const buttonTrailer = document.createElement('button');
    buttonTrailer.classList.add('button__add');
    buttonTrailer.setAttribute('type', 'submite');
    buttonTrailer.textContent = 'watch the trailer';

    buttonTrailer.addEventListener('click', () => {
      if (!userStatus) {
        askingToMakeAuthorization();
      } else {
        this.onTrailerClick();
      }
    });

    const divBtn = document.createElement('div');
    divBtn.classList.add('details-page__button');
    divBtn.append(buttonFirst, buttonSecond, buttonTrailer);

    const detailsPageDecr = document.createElement('div');
    detailsPageDecr.classList.add('details-page__description');
    detailsPageDecr.append(div, divPage, divBtn);

    const img = document.createElement('img');
    const posterImage = item.poster_path
      ? `${MyApi.IMAGE_BASE_URL}${MyApi.imgCards.currentSizes.posterSize}${item.poster_path}`
      : MyApi.DEFAULT_POSTER;

    img.setAttribute('src', posterImage);
    img.setAttribute('alt', img.title);
    img.setAttribute('width', '100%');
    img.setAttribute('data', 'poster');

    const aImg = document.createElement('a');
    aImg.setAttribute('href', '#');
    aImg.appendChild(img);

    const btnClose = document.createElement('button');
    btnClose.classList.add('button__add', 'button-close');
    btnClose.textContent = 'X';

    const divImage = document.createElement('div');
    divImage.classList.add('details-page__foto');
    divImage.append(aImg, btnClose);

    const container = document.createElement('div');
    container.classList.add('container', 'details-page__film');
    container.append(divImage, detailsPageDecr);
    detailsSection.appendChild(container);

    this.hideLoader();

    btnAddWatched = buttonFirst;
    btnAddQueue = buttonSecond;
    selectFilm = item;

    monitorButtonStatusText();

    btnClose.addEventListener('click', () => {
      detailsSection.classList.add('is-hidden');
      detailsSection.innerHTML = '';
      reviewCard.innerHTML = '';
      main.classList.remove('is-hidden');

      if (!libraryIndicator || libraryIndicator === 'daily') {
        form.classList.remove('is-hidden');
        this.pagination.paginationContainer.classList.remove('is-hidden');
        this.pagination.cardContainer.classList.remove('is-hidden');
        btnTop.classList.remove('is-hidden');
        this.showSlider();
        this.actors = [];
      } else if (libraryIndicator === 'Queue') {
        libraryFilrt.classList.remove('is-hidden');
        drawQueueFilmList();
      } else if (libraryIndicator === 'Watched') {
        libraryFilrt.classList.remove('is-hidden');
        drawWatchedFilmList();
      }
    });
  }

  onTrailerClick() {
    openModal(event);
  }
  onWatchedClick() {
    toggleToLocal(filmsWatchedKey);
  }
  onQueueClick() {
    toggleToLocal(filmsQueueKey);
  }

  setPrevNextButtons(data) {
    const prevBtn = document.createElement('button');
    const nextBtn = document.createElement('button');

    const lastBtn = document.createElement('button');
    const firsBtn = document.createElement('button');
    lastBtn.textContent = '>>';
    firsBtn.textContent = '<<';
    lastBtn.classList.add('pagination__turning-btn');
    firsBtn.classList.add('pagination__turning-btn');

    prevBtn.textContent = '<';
    prevBtn.classList.add('pagination__turning-btn');
    nextBtn.textContent = '>';
    nextBtn.classList.add('pagination__turning-btn');
    if (this.page === 1) {
      prevBtn.classList.add('is-hidden');
      firsBtn.classList.add('is-hidden');
      firsBtn.disabled = true;
    }

    if (this.page === data.total_pages) {
      nextBtn.classList.add('is-hidden');
      lastBtn.classList.add('is-hidden');
    }
    if (window.innerWidth < 400) {
      if (this.page < 3) {
        firsBtn.classList.add('is-hidden');
      }
    }
    if (this.page < 4) {
      firsBtn.classList.add('is-hidden');
    }
    if (data.total_pages < 6) {
      firsBtn.classList.add('is-hidden');
      lastBtn.classList.add('is-hidden');
      nextBtn.classList.add('is-hidden');
    }

    prevBtn.addEventListener('click', () => {
      this.pagesScroll();
      this.decrementPage();
    });
    nextBtn.addEventListener('click', () => {
      this.incrementPage();
      this.pagesScroll();
    });

    firsBtn.addEventListener('click', () => {
      this.resetPage();
      this.pagesScroll();
    });

    lastBtn.addEventListener('click', () => {
      this.pagesScroll();
      this.params._page = this.params.lastPage;
    });

    this.pagination.paginationContainer.prepend(firsBtn, prevBtn);
    this.pagination.paginationContainer.append(nextBtn, lastBtn);
  }
  pagesScroll() {
    this.activeLoader();
    this.resetGalleryCard();
    window.scrollTo(0, document.body.children[7].offsetTop);
    this.searchMode === 'popular'
      ? setTimeout(() => {
          this.fetchPopularFilmsList();
        }, 2000)
      : setTimeout(() => {
          this.movieSearch();
        }, 2000);
  }

  setRatioButtons(data) {
    if (window.innerWidth < 400) {
      this.pagination.window = 3;
    }
    let maxLeft = this.params._page - Math.floor(this.pagination.window / 2);
    let maxRight = this.params._page + Math.floor(this.pagination.window / 2);
    this.params.lastPage = data.total_pages;
    this.pagination.paginationContainer.innerHTML = '';
    if (maxLeft < 1) {
      maxLeft = 1;
      maxRight = this.pagination.window;
    }
    if (maxRight > data.total_pages) {
      maxLeft = this.params._page - (this.pagination.window - 1);
      maxRight = data.total_pages;
      if (maxLeft < 1) maxLeft = 1;
    }

    let btnArray = [];
    for (let i = maxLeft; i <= maxRight; i++) {
      const button = document.createElement('button');
      button.textContent = i;
      button.classList.add('pagination__btn'); // добавляет класс для стилей

      if (+button.textContent === this.params._page)
        button.classList.add('active');
      button.addEventListener('click', e => {
        this.activeLoader();
        window.scrollTo(0, document.body.children[7].clientHeight);
        this.page = +e.target.textContent;
        this.currentPage = this.page;
        this.pagination.cardContainer.innerHTML = '';
        this.searchMode === 'popular'
          ? setTimeout(() => {
              this.fetchPopularFilmsList();
            }, 2000)
          : setTimeout(() => {
              this.movieSearch();
            }, 2000);
      });
      btnArray.push(button);
    }

    this.pagination.paginationContainer.append(...btnArray);
    if (this.loaderStatus === 'active') {
      button.classList.add('is-hidden');
    }
    this.setPrevNextButtons(data);
  }
  get page() {
    return this.params._page;
  }

  set page(value) {
    return (this.params._page = value);
  }

  incrementPage() {
    return (this.params._page += 1);
  }

  decrementPage() {
    return (this.params._page -= 1);
  }

  resetPage() {
    return (this.params._page = 1);
  }

  checkBackdropImgSize() {
    if (window.innerWidth >= 1024) {
      this.imgCards.currentSizes.backdropSize = this.imgCards.backdropSizes.desktop;
      this.imgCards.defaultBackdropImg = this.DEFAULT_IMAGE;
      return;
    }
    if (window.innerWidth < 1024) {
      this.imgCards.currentSizes.backdropSize = this.imgCards.backdropSizes.tablet;
      this.imgCards.defaultBackdropImg = this.DEFAULT_IMAGE;
      return;
    }
  }

  checkPosterImgSize() {
    if (window.innerWidth >= 1200) {
      this.imgCards.currentSizes.posterSize = this.imgCards.posterSizes.desktop;
      this.imgCards.defaultPosterImg = '../images/default_poster.jpg';
    }
    if (window.innerWidth >= 768 && window.innerWidth < 1200) {
      this.imgCards.currentSizes.posterSize = this.imgCards.posterSizes.tablet;
      this.imgCards.defaultPosterImg = '../images/default_poster.jpg';
    }
    if (window.innerWidth < 768) {
      this.imgCards.currentSizes.posterSize = this.imgCards.posterSizes.mobile;
      this.imgCards.defaultPosterImg = '../images/default_poster.jpg';
    }
  }
}

const API_KEY = '91085a172e1ffb2047d72641d0a91356';
const MyApi = new MovieApi(
  API_KEY,
  paginationWrapper,
  ulForCards,
  sliderContainer,
);
