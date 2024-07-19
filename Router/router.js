const express = require("express");
const Router = express.Router();
const { login, signup } = require("../Controllers/auth");
const { nlp } = require("../Controllers/NLP/nlp");
Router.get("/nlp",nlp);
Router.post("/nlp",nlp);
Router.post("/auth/login", login);
Router.post("/auth/signup", signup);
module.exports = Router;
