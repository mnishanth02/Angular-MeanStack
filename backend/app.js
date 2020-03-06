const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");

const postsRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");

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
// reqiest is forwarded to backend images
app.use("/images", express.static(path.join("backend/images")));
//app.use(multer({dest:'./backend/images/'}).single('image'));
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-Width, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, PUT, OPTIONS"
  );
 // res.setHeader("Content-Type", "multipart/form-data");
  //res.setHeader("Accept", "application/json");

  res.set({
    "Content-Type": "multipart/form-data",
    "Accept": "application/json"
  });

  next();
});

app.use("/api/posts", postsRoutes);
app.use("/api/user", userRoutes);

module.exports = app;
