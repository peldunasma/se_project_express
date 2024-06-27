const router = require("express").Router();
const { handleAuthorization } = require("../middlewares/auth");

const { createItemValidation,idValidation } = require("../middlewares/validation");

const {
  createItem,
  deleteItem,
  getItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");


router.get("/", getItem );


router.use(handleAuthorization);


router.post("/",createItemValidation, createItem);
router.delete("/:itemId",idValidation, deleteItem);
router.put("/:itemId/likes",idValidation, likeItem);
router.delete("/:itemId/likes",idValidation, dislikeItem);


module.exports = router;