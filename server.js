const express = require('express');
const cors = require('cors');
const multer = require('multer');
const mongoose = require('mongoose');
const path = require('path');
const authRoute = require('./routes/authRoute');
const postRoute = require('./routes/postRoute');
const app = express();
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();

const port = 3000;
app.use(cors());
app.use(express.json());

const postStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const uploadsDir = './uploads';
const avatarsDir = './uploads/avatars';

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
if (!fs.existsSync(avatarsDir)) {
  fs.mkdirSync(avatarsDir, { recursive: true });
}

const avatarStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, avatarsDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const dir = './uploads';
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

app.use('/api/auth', authRoute);
app.use('/api/post', postRoute);

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
