const router = require("express").Router();

const {
  createItem,
  deleteItem,
  getItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

const { handleAuthorization } = require("../middlewares/auth");

router.use(handleAuthorization);

router.post("/", createItem);
router.get("/", getItem );
router.delete("/:itemId", deleteItem);
router.put("/:itemId/likes", likeItem);
router.delete("/:itemId/likes", dislikeItem);


module.exports = router;