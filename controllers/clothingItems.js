const ClothingItem = require("../models/clothingItem");
const {
  INVALID_DATA_ERROR,
  NOTFOUND_ERROR,
  DEFAULT_ERROR,
} = require("../utils/errors");

// returns all clothing items

const getClothingItems = (req, res) => {
  ClothingItem.find({})
    .then ((items) => res.status(200).send(items))
    .catch((err) => {
      console.log(err);
      res.status(DEFAULT_ERROR).send({message: "An error has occurred on the server" })
    })
};

// creates a new item

const createClothingItem = (req, res) => {
  const { name, weather, imageUrl} = req.body;
  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
      return res.status(INVALID_DATA_ERROR ).send({message: "Invalid data"});
      }
      return res.status(DEFAULT_ERROR ).send({message: "An error has occurred on the server" });
    });
};

// deletes an item by _Id

const deleteClothingItem = (req, res) => {
  const { itemId } = req.params;
  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      console.log(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOTFOUND_ERROR).send({ message: err.message });
      }
      if (err.name === "CastError") {
        return res.status(INVALID_DATA_ERROR).send({ message: "Invalid data" });
      }
      return res.status(INVALID_DATA_ERROR).send({ message: "An error has occurred on the server"  });
    });
};

// like an item

const likeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((item) => {
      res.send(item);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOTFOUND_ERROR)
          .send({ message: err.message });
      }

      if (err.name === "CastError") {
        return res.status(INVALID_DATA_ERROR).send({ message:"Invalid data" });
      }
      return res.status(DEFAULT_ERROR).send({ message: "An error has occurred on the server"  });
    });
};

// unlike an item

const dislikeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((item) => {
      res.send(item);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOTFOUND_ERROR)
          .send({ message: err.message });
      }

      if (err.name === "CastError") {
        return res.status(INVALID_DATA_ERROR).send({ message: "Invalid data"});
      }
      return res.status(DEFAULT_ERROR).send({ message: "An error has occurred on the server"  });
    });
};

module.exports = {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeItem,
  dislikeItem
  };