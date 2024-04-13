const router = require("express").Router();

const {
  createItem,
  deleteItem,
  getItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

const { handleAuthorization } = require("../middlewares/auth");

router.get("/", getItem );
router.use(handleAuthorization);

router.post("/", createItem);
router.delete("/:itemId", deleteItem);
router.put("/:itemId/likes", likeItem);
router.delete("/:itemId/likes", dislikeItem);


module.exports = router;