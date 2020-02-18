const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const url = 'mongodb+srv://Nishanth:NHM0HCllSrkulfF9@cluster0-vphfn.mongodb.net/node-angular?retryWrites=true&w=majority';
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected Success');
  }).catch(() => {
    console.log('Connected failed');
  });

const Post = require('./models/post');

const app = express();

app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-Width, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Method", "GET, POST, PATCH, DELETE, OPTIONS");
  next();
});

app.post("/api/posts", (req, res, next) => {
  const post = new Post({
    postTitle: req.body.postTitle,
    postContent: req.body.postContent
  });
  post.save();
  console.log(post);
  res.status(200).json({
    message: 'Post Send successfully'
  });
});

app.get("/api/posts", (req, res, next) => {

  Post.find().then(doc => {

    console.log(doc);
    res.status(200).json({
      message: 'post send successfun',
      posts: doc
    });
  });

});

app.delete("/api/posts/:id", (req, res, next) => {
  //Post.deleteOne

  console.log(req.params.id);
res.status(200).json({})
});

module.exports = app;
