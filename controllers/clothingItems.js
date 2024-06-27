const ClothingItem = require("../models/clothingItem");
const BadRequestError = require("../utils/errors/badRequestError");
const NotFoundError = require("../utils/errors/notFoundError");
const ForbiddenError = require("../utils/errors/forbiddenError");


// returns all clothing items

const getItem = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => {
      console.log(items);
      return res.status(200).send(items);
    })
    .catch((err) => {
      next(err);
    });
};

// creates a new item

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  ClothingItem.create({
    name,
    weather,
    imageUrl,
    owner,
  })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        next(new BadRequestError("Bad request, Invalid data"));
      } else {
        next(err);
      }
    });
};

// deletes an item

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;
  console.log(req.params);

  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (item.owner.toString() !== req.user._id.toString()) {
       next(
          new ForbiddenError(
            "You do not have sufficient privileges delete this item.",
          ),
        );
      }
      return ClothingItem.findByIdAndDelete(itemId)
        .orFail()
        .then(() => res.status(200).send(item));
    })

    .catch((err) => {
      console.log(err);
      if (err.name === "CastError") {
        next(new BadRequestError("Bad request, Invalid data"));
      }
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Item not found"));
      }
      next(new BadRequestError("An error has occurred on the server"));
    });
};

// likes an item

const likeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((item) => {
      res.status(200).send(item);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        next(new BadRequestError("Bad request, Invalid data"));
      }
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Item not found"));
      }
      next(err);
    });
};

// unlikes an item

const dislikeItem = (req, res, next) => {
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
        next(new NotFoundError("Item not found"));
      }

      if (err.name === "CastError") {
        next(new BadRequestError("Bad request, Invalid data"));
      }
      next(err)
    });
};

module.exports = {
  getItem,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
};
