const express = require('express');
const { createPost, getPosts, updatePost, deletePost, searchPosts,  } = require('../controller/postController');
const authMiddleware = require('../middleware/authMidedleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

const router = express.Router();



router.post('/create', authMiddleware, upload.single('image'), createPost);
router.get('/all', authMiddleware, getPosts);
router.put('/update/:id', authMiddleware, updatePost);

router.delete('/delete/:id', authMiddleware, deletePost);

router.get('/search', authMiddleware, searchPosts);




module.exports = router;
