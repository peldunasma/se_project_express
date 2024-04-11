const router = require("express").Router();

const {
  createItem,
  deleteItem,
  getItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

router.post("/", createItem);
router.get("/", getItem );
router.delete("/:itemId", deleteItem);
router.put("/:itemId/likes", likeItem);
router.delete("/:itemId/likes", dislikeItem);


module.exports = router;