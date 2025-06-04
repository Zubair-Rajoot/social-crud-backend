const express = require('express');
const { register, login, getProfile, uploadAvatar } = require('../controller/authController');
const authMiddleware = require('../middleware/authMidedleware');

const multer = require('multer');
const path = require('path');
const fs = require('fs');

const avatarStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/avatars/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ avatarStorage });

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.get('/profile', authMiddleware, getProfile);
router.post('/avatar', authMiddleware, upload.single('avatar'), uploadAvatar);

module.exports = router;
