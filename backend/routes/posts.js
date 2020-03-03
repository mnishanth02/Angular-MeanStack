const express = require("express");
const multer = require("multer");

const Post = require("../models/post");
const router = express.Router();

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg"
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("file: " + file);
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid Mime Type");
    if (isValid) {
      error = null;
    }
    console.log("error : " + error);
    //cb(error, "backend/images/");
    cb(error, "backend/images/");
  },
  filename: (req, file, cb) => {
    const name = file.originalname
      .toLowerCase()
      .split(" ")
      .join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  }
});

var uploading = multer({ storage: storage }).single("image");

router.post("", uploading, (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const post = new Post({
    postTitle: req.body.postTitle,
    postContent: req.body.postContent,
    imagePath: url + "/images/" + req.file.filename
  });
  post.save().then(createdPost => {
    res.status(201).json({
      message: "Post Send successfully",
      post: {
        id: createdPost._id,
        postTitle: createdPost.postTitle,
        postContent: createdPost.postContent,
        imagePath: createdPost.imagePath
      }
    });
  });
});

router.get("", (req, res, next) => {
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPost;
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }

  postQuery
    .then(doc => {
      fetchedPost = doc;
      return Post.count();
    })
    .then(count => {
      res.status(200).json({
        message: "post get successful",
        posts: fetchedPost,
        maxPosts: count
      });
    });
});

router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "Post not Fount" });
    }
  });
});

router.put("/:id", uploading, (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }
  const post = new Post({
    _id: req.body.id,
    postTitle: req.body.postTitle,
    postContent: req.body.postContent,
    imagePath: imagePath
  });
  Post.updateOne({ _id: req.params.id }, post).then(result => {
    res.status(200).json({ message: "update Successfull" });
  });
});

router.delete("/:id", (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then(result => {
    console.log("response : " + result);
    res.status(200).json({ message: "Post Deleted" });
  });
});

module.exports = router;
