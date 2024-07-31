const express = require("express");
const fs = require("fs");
const Router = express.Router();
const { login, signup } = require("../Controllers/auth");
const {uploadSingleFileController,uploadMultipleFilesController} = require("../Controllers/uploadFileController");
const multer = require("multer");
const AuthCheck = require("../Middlewere/AuthCheck");
const getFileController = require("../Controllers/getFileController");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    fs.mkdir("./uploads/" + req?.headers?._id, { recursive: true }, () => {
      return cb(null, "./uploads/" + req?.headers?._id);
    });
  },
  filename: function (req, file, cb) {
    console.log(file.originalname)
    return cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });
Router.post("/upload",AuthCheck, upload.single("file"), uploadSingleFileController);
Router.post("/upload/multiFiles",AuthCheck, upload.array("multiFiles",10),uploadMultipleFilesController);
Router.post("/auth/login", login);
Router.post("/auth/signup", signup);
Router.get("/uploads/:uid/:filename",getFileController)
module.exports = Router;
