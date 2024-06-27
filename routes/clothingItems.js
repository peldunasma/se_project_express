const router = require("express").Router();
const { handleAuthorization } = require("../middlewares/auth");

const { createItemValidator,idValidator } = require("../middlewares/validation");

const {
  createItem,
  deleteItem,
  getItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");


router.get("/", getItem );


router.use(handleAuthorization);


router.post("/",createItemValidator, createItem);
router.delete("/:itemId",idValidator, deleteItem);
router.put("/:itemId/likes",idValidator, likeItem);
router.delete("/:itemId/likes",idValidator, dislikeItem);


module.exports = router;