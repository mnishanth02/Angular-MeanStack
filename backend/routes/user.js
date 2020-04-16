const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const router = express.Router();

router.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then(hash => {
    const user = User({
      email: req.body.email,
      password: hash
    });
    user
      .save()
      .then(result => {
        res.status(201).json({
          message: "User Created",
          result: result
        });
      })
      .catch(err => {
        res.status(500).json({
          error: err
        });
      });
  });
});

router.post("/login", (req, res, next) => {
  let fetchedUser;
  User.findOne({
    email: req.body.email
  }).then(user => {
    if (!user) {
      return res.status(404).json({
        message: "Auth Failed"
      });
    }
    fetchedUser = user;
    bcrypt
      .compare(req.body.password, user.password)
      .then(result => {
        if (!result) {
          return res.status(404).json({
            message: "Auth Failed"
          });
        }

        const token = jwt.sign(
          {
            email: fetchedUser.email,
            userId: fetchedUser._id
          },
          "secret_password_for_development",
          { expiresIn: "1h" }
        );
        res.status(200).json({
          token: token
        });
      })
      .catch(err => {
        return res.status(401).json({
          message: "Auth Failed"
        });
      });
  });
});

module.exports = router;
