const express = require('express');
const adminController = require('../controllers/adminController');
const { adminAuthentication } = require('../midlewares/authentication');
const parser = require('../config/cloudinary');

const router = express.Router();
router.post('/register', parser.single('profileImg'), adminController.register);
router.post('/login', adminController.login);
router.get('/user', adminAuthentication, adminController.fetchAllUser);
router.get('/user/:id', adminAuthentication, adminController.fetchUserById);
router.get('/post', adminAuthentication, adminController.fetchAllPost);
router.get('/post/:id', adminAuthentication, adminController.fetchPostById);
router.delete('/post/:id', adminAuthentication, adminController.deletePost);
router.get('/donation', adminAuthentication, adminController.fetchAllDonation);
router.get(
  '/donation/:id',
  adminAuthentication,
  adminController.fetchDonationById
);
router.patch(
  '/donation/:id',
  adminAuthentication,
  parser.single('verifyProofImg'),
  adminController.verifiedDonation
);
router.get('/reward', adminAuthentication, adminController.fetchAllRewards);
router.post('/reward', adminAuthentication, adminController.addReward);
router.get('/reward/:id', adminAuthentication, adminController.fetchRewardById);
router.delete('/reward/:id', adminAuthentication, adminController.deleteReward);
router.get(
  '/redeemHistory',
  adminAuthentication,
  adminController.fetchAllRedeemHistory
);
router.get(
  '/redeemHistory/:id',
  adminAuthentication,
  adminController.fetchRedeemHistoryById
);
router.get('/category', adminAuthentication, adminController.fetchCategory);
router.get(
  '/reward-category',
  adminAuthentication,
  adminController.fetchRewardCategory
);
router.delete('/user/:id', adminAuthentication, adminController.deleteUser);
module.exports = router;
