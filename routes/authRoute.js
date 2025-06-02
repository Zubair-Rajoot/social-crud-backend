const express = require('express');
const { register, login, getProfile } = require('../controller/authController');
const authMiddleware = require('../middleware/authMidedleware');


const router = express.Router();


router.post('/register', register);
router.post("/login", login);

router.get('/profile', authMiddleware, getProfile);




module.exports = router