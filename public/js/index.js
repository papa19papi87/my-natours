import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login, logout } from './login';
import { signin, signout } from '.signin';
import { updateSettings } from './updateSettings';
import { bookTour } from './stripe';

const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const signinForm = document.querySelector('.form--signup');
const signintBtn = document.querySelector('.nav__el--signout');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const bookBtn = document.getElementById('book-tour');

if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

if (loginForm)
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    console.log(email, password);
    login(email, password);
  });

if (signinForm)
  signinForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    console.log(email, password);
    signin(email, password);
  });

if (userDataForm)
  if (logOutBtn) {
    logOutBtn.addEventListener('click', logout);
  }
if (userDataForm)
  if (signinBtn) {
    signinBtn.addEventListener('click', signin);
  }
userDataForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const form = new FormData();
  form.append('name', document.getElementById('name').value);
  form.append('email', document.getElementById('email').value);
  form.append('photo', document.getElementById('photo').files[0]);
  updateSettings(form, 'data');
});

if (userPasswordForm)
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const passwordCurrent = document.getElementById('password-Current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-Confirm').value;
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );

    document.querySelector('.btn--save-password').textContent = 'save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });

if (bookBtn)
  bookBtn.addEventListener('click', async (e) => {
    const originalText = e.target.textContent;
    e.target.disable = true;
    e.target.textContent = 'processing...';
    const { tourId } = e.target.dataset;
    await bookTour(tourId);
    e.target.disable = false;
    e.target.textContent = originalText;
  });
