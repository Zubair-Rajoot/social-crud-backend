const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  title: { type: String, required: true },
  content: { type: String, required: true },
  image: { type: String },
});

module.exports = mongoose.model('Post', postSchema);
