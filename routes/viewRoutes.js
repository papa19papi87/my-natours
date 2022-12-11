const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');
const cookieParser = require('cookie-parser');

const router = express.Router();

router.use(cookieParser());

router.get(
  '/',
  bookingController.createBookingCheckout,
  authController.isLoggedIn,
  viewsController.getOverview
);
router.get('/', authController.isLoggedIn, viewsController.getOverview);
router.get('/tour/:slug', authController.isLoggedIn, viewsController.getTour);
router.get('/me', authController.protect, viewsController.getAccount);
router.get('/login', viewsController.getLoginForm);
router.get('/signin', viewsController.getSigninForm);
router.patch(
  '/submit-user-data',
  authController.protect,
  viewsController.updateUserData
);
router.get('my-tours', authController.protect, viewsController.getAccount);

module.exports = router;
