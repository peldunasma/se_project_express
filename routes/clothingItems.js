const router = require("express").Router();

const {
  createClothingItem,
  deleteClothingItem,
  getClothingItems,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

router.post("/", createClothingItem);
router.get("/", getClothingItems );
router.delete("/:itemId", deleteClothingItem);
router.put("/:itemId/likes", likeItem);
router.delete("/:itemId/likes", dislikeItem);


module.exports = router;