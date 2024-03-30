const { JWT_SECRET } = require("../utils/config");
const User = require("../models/user");
const {
  INVALID_DATA_ERROR,
  NOTFOUND_ERROR,
  DEFAULT_ERROR,
  UNAUTHORIZED_ERROR,
} = require("../utils/errors");

// returns all users

const updateUser = (req, res) => {
  const { userId } = req.params;
  const { name, avatar } = req.body;
  User.findByIdAndUpdate(
    userId,
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
  User.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!email) {
        throw new Error("Enter a valid email");
      }
      if (user) {
        throw new Error("Email is already in use");
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
      return res.status(INVALID_DATA_ERROR ).send({message: "Invalid data"});
      }
      return res.status(DEFAULT_ERROR).send({message: "An error has occurred on the server"});
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
  .then(user => {
        // we get the user object if the email and password match
        const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
          expiresIn: "7d",
        });
        res.send({ token });
  })
  .catch(err => {
        // otherwise, we get an error
        console.error(err);
      if (err.name === "ValidationError") {
      return res.status(UNAUTHORIZED_ERROR).send({message: "Invalid credentials"});
      }
      return res.status(DEFAULT_ERROR).send({message: "An error has occurred on the server"});
    });
}

// returns all users by _Id

const getCurrentUser = (req,res) => {
  const { userId } = req.params;
  User.findById(userId)
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