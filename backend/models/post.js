const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  postTitle: { type: String, required: true },
  postContent: { type: String, required: true }
});

module.exports = mongoose.model('Post', postSchema);
