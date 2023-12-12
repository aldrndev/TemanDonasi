const express = require('express');
const userController = require('../controllers/userController');
const { authentication } = require('../midlewares/authentication');
const parser = require('../config/cloudinary');
const router = express.Router();

router.post('/register', parser.single('profileImg'), userController.register);
router.post('/login', userController.login);
router.get('/user/:id', userController.fetchUserById);
router.get('/post', userController.fetchAllPost);
router.get('/post/:id', userController.fetchPostById);
router.post(
  '/post',
  authentication,
  parser.array('postImg', 3),
  userController.addPost
);
router.get('/category', authentication, userController.fetchCategory);
router.get('/donation', authentication, userController.fetchDonationByUserId);
router.post('/donation/:PostId', authentication, userController.donationPost);
router.get('/reward', authentication, userController.fetchAllRewards);
router.get('/reward/:id', authentication, userController.fetchRewardById);
router.get(
  '/reward-category',
  authentication,
  userController.fetchRewardCategory
);
router.patch('/profile/:id', authentication, userController.takeReward);
router.get(
  '/redeemHistory',
  authentication,
  userController.fetchRedeemHistoryById
);
router.patch('/verify/:verificationCode', userController.verifyUser);
router.get('/certificate/:code', userController.fetchCertificate);
module.exports = router;
