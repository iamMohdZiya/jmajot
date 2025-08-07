

const express = require('express');
const router = express.Router();
const User = require('../model/user');

const { 
  handleSignIn, 
  handleLogout, 
  handleSignUp, 
  updateEducation, 
  addEducation, 
  handleEducationUpdate, 
  changeEducation,
  getEducation,
  deleteEducation 
} = require('../controller/userLogin');

const {
  updateProfile,
  getProfile,
  getProfileImage
} = require('../controller/profileController');

const { profileUpload } = require('../middleware/multerConfig');

const { checkForAthenticationCookie } = require('../middleware/auth');

// User Sign Up Route
router.post('/signup', handleSignUp);
// User Sign In Route
router.post('/signin', handleSignIn);   

// User Logout Route
router.get('/logout', handleLogout);

// Education Routes
router.post('/education', checkForAthenticationCookie('token'), addEducation);
router.put('/education', checkForAthenticationCookie('token'), updateEducation);
router.put('/education/update', checkForAthenticationCookie('token'), handleEducationUpdate);
router.put('/education/change', checkForAthenticationCookie('token'), changeEducation);
router.get('/education', checkForAthenticationCookie('token'), getEducation);
router.get('/education/:educationId', checkForAthenticationCookie('token'), getEducation);
router.delete('/education/:educationId', checkForAthenticationCookie('token'), deleteEducation);

// Profile Routes
router.put('/profile', checkForAthenticationCookie('token'), profileUpload.single('profileImage'), updateProfile);
router.get('/profile', checkForAthenticationCookie('token'), getProfile);
router.get('/profile/:userId', getProfile);
router.get('/profile-image/:userId', getProfileImage);

module.exports = router;