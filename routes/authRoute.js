const express = require('express');
const {
  register,
  login,
  getProfile,
  uploadAvatar,
  getAvatar,
} = require('../controller/authController');
const authMiddleware = require('../middleware/authMidedleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const avatarStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = 'uploads/avatars';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: avatarStorage });

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authMiddleware, getProfile);
router.post('/avatar', authMiddleware, upload.single('avatar'), uploadAvatar);
router.get('/avatar', authMiddleware, getAvatar);

// router.get('/avatar', authMiddleware, getProfile);

module.exports = router;
