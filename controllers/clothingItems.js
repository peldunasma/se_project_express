const ClothingItem = require("../models/clothingItem");
const {
  INVALID_DATA_ERROR,
  NOTFOUND_ERROR,
  DEFAULT_ERROR,
} = require("../utils/errors");

// returns all clothing items

const getClothingItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.log(err);
      res
        .status(DEFAULT_ERROR)
        .send({ message: "The server has encountered an error" });
    });
};

// creates a new item

const createClothingItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(INVALID_DATA_ERROR).send({ message: "Invalid data" });
      } else {
        return res
          .status(DEFAULT_ERROR)
          .send({ message: "The server has encountered an error" });
      }
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
        return res.status(NOTFOUND_ERROR).send({ message: "Item not found"});
      }else if (err.name === "CastError") {
        return res.status(NOTFOUND_ERROR).send({ message: "Invalid data" });
      } else {
        return res.status(DEFAULT_ERROR).send({ message: "The server has encountered an error" });
      }
    });
};

// like an item

const likeItem = (req, res) => {
  clothingItem
    .findByIdAndUpdate(
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
        return res.status(NOTFOUND_ERROR).send({ message: "Item not found"});
      }

      else if (err.name === "CastError") {
        return res.status(NOTFOUND_ERROR).send({ message: "Invalid data" });
      } else {
        return res.status(DEFAULT_ERROR).send({ message: "The server has encountered an error"  });
      }
    });
};

// unlike an item

const dislikeItem = (req, res) => {
  clothingItem
    .findByIdAndUpdate(
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
        return res.status(NOTFOUND_ERROR).send({ message: "Item not found"});
      }

      else if (err.name === "CastError") {
        return res.status(NOTFOUND_ERROR).send({ message: "Invalid data" });
      } else {
        return res.status(DEFAULT_ERROR).send({ message: "The server has encountered an error"  });
      }
    });
};

module.exports = {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeItem,
  dislikeItem,
};
