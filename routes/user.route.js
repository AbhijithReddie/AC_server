const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authController = require('../controllers/auth.controller');

router.post('/login', authController.login);
router.post('/signup', authController.signup);
router.get('/profile', userController.getProfile);
router.post('/profile', userController.updateProfile);
router.post('/interests', userController.addInterest);
router.post('/interests', userController.getInterests);


module.exports = router;
