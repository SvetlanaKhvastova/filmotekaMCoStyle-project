var firebaseConfig = {
  apiKey: 'AIzaSyBNIAhHTVSS_FgmrIA50_fMlsJIzrHPLUw',
  authDomain: 'filmgeek-js.firebaseapp.com',
  projectId: 'filmgeek-js',
  storageBucket: 'filmgeek-js.appspot.com',
  messagingSenderId: '759026227062',
  appId: '1:759026227062:web:451d5ef97d20e7288acc57',
  measurementId: 'G-9HJTT3B2GK',
};

const SIGN_UP_SUCCESS = 'Congratulations! You made the right choice!!!';
const SIGN_IN_SUCCESS = 'Perfect! You are on Board!!!';
const SIGN_IN_FAIL = 'Oops!Something went wrong!Try again!!!';
const DEMAND_TO_REGISTER =
  'To be able to use all features of our Magic source, please pass the registration!';
const DEFAULT_SIGN_UP = 'Become a part of our filmgeek club!';
const DEFAULT_SIGN_IN = 'Welcome back! Write your data below!';
firebase.initializeApp(firebaseConfig);
firebase.analytics();

const auth = firebase.auth();

let userStatus;

auth.onAuthStateChanged(user => {
  if (user) {
    btnSignOut.classList.remove('is-hidden');
    btnSignUp.classList.add('is-hidden');

    btnSignIn.classList.add('is-hidden');
    btnSignIn.disabled = true;

    userStatus = true;
  } else {
    btnSignOut.classList.add('is-hidden');
    btnSignUp.classList.remove('is-hidden');

    btnSignIn.classList.remove('is-hidden');
    btnSignIn.disabled = false;

    userStatus = false;
  }
});

function modalClose(params) {
  authBackdrop.classList.add('auth__backdrop--hidden');
  body.classList.remove('overflow');
}
(function modalBtnAddListener(params) {
  const modalExit = document.querySelectorAll('.auth__exit');
  let array = [...modalExit];
  array.forEach(e => {
    e.addEventListener('click', modalClose);
  });
})();

const authBackdrop = document.querySelector('.auth__backdrop');
const authModalSignIn = document.querySelector('.signIn__modal');
const authModalSignUp = document.querySelector('.signUp__modal');
const signUpEmail = document.getElementById('authEmail');
const signUpPassword = document.getElementById('authPassword');
const signUpBtn = document.getElementById('signUp-submit');

const authMessage = document.querySelector('.auth__message');

const signInEmail = document.getElementById('signInEmail');
const signInPassword = document.getElementById('signInPassword');
const signInBtn = document.getElementById('signIn-submit');

const btnSignIn = document.querySelector('.signIn-user');
const btnSignUp = document.querySelector('.signUp-user');
const btnSignOut = document.querySelector('.signOut-user');
btnSignOut.addEventListener('click', () => {
  auth.signOut();
});

btnSignIn.addEventListener('click', () => {
  body.classList.add('overflow');
  authModalSignIn.classList.remove('signIn-hidden');
  authModalSignUp.classList.add('signUp-hidden');
  authBackdrop.classList.remove('auth__backdrop--hidden');
  welcomeTextSignIn.textContent = DEFAULT_SIGN_IN;
});

authMessage.addEventListener('click', () => {
  authModalSignIn.classList.remove('signIn-hidden');
  authModalSignUp.classList.add('signUp-hidden');
  welcomeTextSignIn.textContent = DEFAULT_SIGN_IN;
});

btnSignUp.addEventListener('click', () => {
  body.classList.add('overflow');
  authModalSignUp.classList.remove('signUp-hidden');
  authModalSignIn.classList.add('signIn-hidden');
  authBackdrop.classList.remove('auth__backdrop--hidden');
  welcomeTextSignUp.textContent = DEFAULT_SIGN_UP;
});
signUpBtn.addEventListener('click', signUp);
signInBtn.addEventListener('click', signIn);

function signUp(params) {
  body.classList.remove('overflow');
  const signUpRequest = auth.createUserWithEmailAndPassword(
    signUpEmail.value,
    signUpPassword.value,
  );
  let signUpError = '';
  signUpRequest.catch(e => {
    signUpError = e.message;
  });
  setTimeout(() => {
    if (signUpError) {
      welcomeTextSignUp.textContent = SIGN_IN_FAIL;
    } else {
      welcomeTextSignUp.textContent = SIGN_UP_SUCCESS;
      setTimeout(() => {
        authBackdrop.classList.add('auth__backdrop--hidden');
      }, 2000);
    }
  }, 1000);
}

function signIn(params) {
  body.classList.remove('overflow');
  const signInRequest = auth.signInWithEmailAndPassword(
    signInEmail.value,
    signInPassword.value,
  );
  let signInError = '';
  signInRequest.catch(e => {
    signInError = e.message;
  });
  setTimeout(() => {
    if (signInError) {
      welcomeTextSignIn.textContent = SIGN_IN_FAIL;
    } else {
      welcomeTextSignIn.textContent = SIGN_IN_SUCCESS;
      setTimeout(() => {
        authBackdrop.classList.add('auth__backdrop--hidden');
      }, 2000);
    }
  }, 1000);
}
