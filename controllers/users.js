const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const User = require("../models/user");

const ConflictError = require("../utils/errors/conflictError");
const BadRequestError = require("../utils/errors/badRequestError");
const NotFoundError = require("../utils/errors/notFoundError");
const UnauthorizedError = require("../utils/errors/unauthorizedError");

// returns all users

const updateUser = (req, res, next) => {
  const { _id } = req.user;
  const { name, avatar } = req.body;
  User.findByIdAndUpdate(
    _id,
    { name, avatar },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        next(new BadRequestError(", Bad request, Invalid data"));
      }
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Item not found"));
      }
      if (err.name === "CastError") {
        next(new BadRequestError("Bad request, Invalid data"));
      }
      next(err);
    });
};

// creates a new user

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  if (!email) {
    next(new BadRequestError("Bad request, Invalid data"));
    return;
  }

  User.findOne({ email })
    .select("+password")
    .then((user) => {
      if (user) {
        const error = new Error("Duplicate user");
        error.statusCode = ConflictError;
        throw error;
      }

      return bcrypt.hash(password, 10);
    })
    .then((hash) =>
      User.create({
        name,
        avatar,
        email,
        password: hash,
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
      if (err.statusCode === ConflictError) {
        next(new ConflictError("Duplicate Error"));
      }
      if (err.name === "ValidationError") {
        next(new BadRequestError("Bad request, Invalid data"));
      }
      next(err);
    });
};

// user login

const loginUser = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    next(new BadRequestError("Invalid credentials"));
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
    .catch((err) => {
      // otherwise, we get an error
      console.error(err);
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid credentials"));
      }
      if (err.message === "Incorrect email or password") {
       next(new UnauthorizedError("Unauthorized data."));
      }
      next(err);
    });
};

// returns all users by _Id

const getCurrentUser = (req, res) => {
  const { _id } = req.user;
  User.findById(_id)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Item not found"));
      }
      if (err.name === "CastError") {
        next(new BadRequestError("Bad request, Invalid data"));
      }
      next(err);
    });
};

module.exports = {
  updateUser,
  createUser,
  getCurrentUser,
  loginUser,
};
