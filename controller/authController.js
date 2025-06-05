const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../model/authModel');
const Post = require('../model/postModel');

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).send('User already exists');

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();
    res.status(201).json({ message: 'User registered' });
  } catch (error) {
    res.status(500).send('Internal Server error');
  }
};

const JWT_SECRET = 'zubair123';
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    console.log(user);

    if (!user) return res.status(400).send('Username or password is wrong');

    const comparePass = await bcrypt.compare(password, user.password);

    if (!comparePass) return res.status(400).send('Invalid user password');

    const token = jwt.sign(
      {
        _id: user._id,
        email: user.email,
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      userId: user._id,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server error');
  }
};

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log('userId', userId);

    const user = await User.findById(userId).select('-password');
    const posts = await Post.find({ userId });

    res.status(200).json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        posts: posts,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to load profile',
      error: error.message,
    });
  }
};

exports.uploadAvatar = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const avatar = req.file.filename;
    const user = await User.findByIdAndUpdate(userId, { avatar }, { new: true }).select(
      '-password'
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAvatar = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select('avatar');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      avatar: user.avatar,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to load avatar',
      error: error.message,
    });
  }
};
