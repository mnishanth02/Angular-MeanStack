const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const Post = require("./models/post");

mongoose.set("debug", true);

const url =
  "mongodb+srv://Nishanth:NHM0HCllSrkulfF9@cluster0-vphfn.mongodb.net/node-angular?retryWrites=true&w=majority";
mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected Success");
  })
  .catch(() => {
    console.log("Connected failed");
  });

const app = express();

app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-Width, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.post("/api/posts", (req, res, next) => {
  const post = new Post({
    postTitle: req.body.postTitle,
    postContent: req.body.postContent
  });
  post.save().then(createdPost => {
    res.status(201).json({
      message: "Post Send successfully",
      postId: createdPost._id
    });
  });
  
});

app.get("/api/posts", (req, res, next) => {
  Post.find().then(docs => {
    console.log(docs);

    res.status(200).json({
      message: "post get successful",
      posts: docs
    });
  });
});

app.delete("/api/posts/:id", (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then(result => {
    console.log("response : " + result);
    res.status(200).json({ message: "Post Deleted" });
  });
});

module.exports = app;
