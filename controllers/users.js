const User = require("../models/user");
const {
  INVALID_DATA_ERROR,
  NOTFOUND_ERROR,
  DEFAULT_ERROR,
} = require("../utils/errors");

// returns all users

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      console.error(err);
      return res.status(DEFAULT_ERROR).send({ message: err.message });
    });
};

// creates a new user

const createUser = (req, res) => {
  const { name, avatar} = req.body;
  User.create({ name, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
      return res.status(INVALID_DATA_ERROR ).send({message: err.message});
      }
      return res.status(DEFAULT_ERROR).send({message: err.message});
    });
};

// returns all users by _Id

const getUser = (req,res) => {
  const { userId } = req.params;
  User.findById(userId)
  .orFail()
  .then((user) => res.send(user))
  .catch((err) => {
    console.error(err);
    if (err.name === "DocumentNotFoundError") {
      return res
          .status(NOTFOUND_ERROR)
          .send({ message: err.message });
    } else if (err.name === "CastError") {
      return res.status(NOTFOUND_ERROR).send({ message: err.message });
    }
    return res.status(DEFAULT_ERROR).send({message: err.message});
  });
};

module.exports = {
  getUsers,
  createUser,
  getUser
  };