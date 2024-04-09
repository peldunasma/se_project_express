const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const User = require("../models/user");
const {
  INVALID_DATA_ERROR,
  NOTFOUND_ERROR,
  DEFAULT_ERROR,
  UNAUTHORIZED_ERROR,
  HTTP_USER_DUPLICATED
} = require("../utils/errors");

// returns all users

const updateUser = (req, res) => {
  const { _id } = req.user;
  const { name, avatar } = req.body;
  User.findByIdAndUpdate(
    _id,
    {name, avatar},
    { new: true, runValidators: true },
    )
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res
            .status(NOTFOUND_ERROR)
            .send({ message: err.message });
      } if (err.name === "CastError") {
        return res.status(INVALID_DATA_ERROR).send({ message: "Invalid data" });
      }
      return res.status(DEFAULT_ERROR).send({message: "An error has occurred on the server"});
    });
  };

// creates a new user

const createUser = (req, res) => {
  const { name, avatar, email, password} = req.body;

  if (!email) {
    res.status(INVALID_DATA_ERROR).send({ message: "Invalid data" });
    return;
  }

  User.findOne({ email })
    .select("+password")
    .then((user) => {

      if (user) {
        const error = new Error("Duplicate user")
        error.statusCode =  HTTP_USER_DUPLICATED;
        throw error;
      }

      return bcrypt.hash(password, 10);
    })
    .then((hash) =>
    User.create({
      name,
      avatar,
      email,
      password: hash
    }),

    )
    .then((user) =>
    res.status(201).send({
      name: user.name,
      avatar: user.avatar,
      email: user.email,
    }),
  )
    .catch((err) => {
      console.error(err);
      if (err.statusCode === HTTP_USER_DUPLICATED) {
        return res
          .status(HTTP_USER_DUPLICATED)
          .send({ message: "Duplicate Error" });
      }
      if (err.name === "ValidationError") {
      return res.status(INVALID_DATA_ERROR).send({message: "Invalid data"});
      }
      return res
      .status(DEFAULT_ERROR)
      .send({message: "An error has occurred on the server"});
    });
};

// user login

const loginUser = (req,res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(INVALID_DATA_ERROR).send({ message: "Invalid credentials" });
    return;
  }

  User.findUserByCredentials(email, password)
  .then((user) => {
        // we get the user object if the email and password match
        const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
          expiresIn: "7d",
        });
        res.status(200).send({ token });
  })
  .catch(err => {
        // otherwise, we get an error
        console.error(err);
      if (err.name === "ValidationError") {
      return res.status(INVALID_DATA_ERROR).send({message: "Invalid credentials"});
      }
      if (err.message === "Incorrect email or password") {
        return res
          .status(UNAUTHORIZED_ERROR)
          .send({ message: "Unauthorized data." });
      }
      return res.status(DEFAULT_ERROR).send({message: "An error has occurred on the server"});
    });
}

// returns all users by _Id

const getCurrentUser = (req,res) => {
  const { _id } = req.user;
  User.findById(_id)
  .orFail()
  .then((user) => res.status(200).send(user))
  .catch((err) => {
    console.error(err);
    if (err.name === "DocumentNotFoundError") {
      return res
          .status(NOTFOUND_ERROR)
          .send({ message: err.message });
    } if (err.name === "CastError") {
      return res.status(INVALID_DATA_ERROR).send({ message: "Invalid data" });
    }
    return res.status(DEFAULT_ERROR).send({message: "An error has occurred on the server"});
  });
};

module.exports = {
  updateUser,
  createUser,
  getCurrentUser,
  loginUser
  };