const signupModel = require("../Models/signupModel");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const env = require("dotenv");
env.config();
const login = async (req, res) => {
  const { email, password } = req?.body;
  console.log(email,password)
  try {
    let authToken = null;
    let user = await signupModel.findOne({
      username: email,
    });
    if (user === null) {
      user = await signupModel.findOne({
        email: email,
      });
    }
    if (user === null) {
      await res?.status(404).send("User not found");
    }
    if (user != null) {
      let hashedPassword = user?.password;
      let passwordCompare = await bcryptjs.compare(password, hashedPassword);
      console.log(user)
      if (passwordCompare === true) {
        authToken = jwt.sign(
          {
            _id : user?._id,
            username: email,
            password: hashedPassword,
          },
          process.env.SECRET_KEY
        );
      }
      if (passwordCompare === false) {
        res?.status(401).send("Incorrect Password");
      }

      if (passwordCompare === true && user != null) {
        res?.status(200).send({
          user:{
            _id : user?._id,
            username : user?.username,
            email : user?.email,
          },
          authToken: authToken,
        });
      }
    }
  } catch (e) {
    console.log(e);
  }
};
const signup = async (req, res) => {
  const { username, email, password } = req?.body;
  console.log(username,email,password)

  if (
    email === undefined ||
    username === undefined ||
    password === undefined
  ) {
    res?.status(400).send("Email Id , Username , Password required");
  } else if (email === undefined) {
    res?.status(400).send("Email Id Required");
  } else if (username === undefined) {
    res?.status(400).send("Username Required");
  } else if (password === undefined) {
    res?.status(400).send("Password Required");
  } else {
    let hashedPasswordPromise = bcryptjs.hash(
      password,
      parseInt(process.env.SALT)
    );
    let hp = await hashedPasswordPromise.then((result) => {
      return result;
    });
    let authToken = jwt.sign(
      {
        username: username,
        email: email,
        password: hp,
      },
      process.env.SECRET_KEY
    );
    try {
      let user = await signupModel.findOne({
        username: username,
      });
      if (user === null) {
        user = await signupModel.findOne({
          email: email,
        });
      }

      if (user === null) {
        const user = new signupModel({
          username: username,
          email: email,
          password: hp,
        }).save();
        res?.status(200).send({
          user:{
            _id : user?._id,
            username : user?.username,
            email : user?.email,
          },
          authToken: authToken,
        });
      } else {
        res
          ?.status(409)
          .send("user already register With this username or email");
      }
    } catch (e) {
      console.log(e);
    }
  }
};

module.exports = auth = {
  login,
  signup,
};
