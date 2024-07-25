const express = require("express");
const fs = require("fs");
const Router = express.Router();
const { login, signup } = require("../Controllers/auth");
const uploadFileController = require("../Controllers/uploadFileController");
const multer = require("multer");

let date = Date.now();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    fs.mkdir("./uploads/" + req?.headers?._id, { recursive: true }, () => {
      return cb(null, "./uploads/" + req?.headers?._id);
    });
  },
  filename: function (req, file, cb) {
    return cb(null, `${date}-${file.originalname}`);
  },
});

const upload = multer({ storage });
Router.post("/upload", upload.single("file"), uploadFileController);
Router.post("/upload/multiFiles", upload.array("files"), uploadFileController);
Router.post("/auth/login", login);
Router.post("/auth/signup", signup);
module.exports = Router;
