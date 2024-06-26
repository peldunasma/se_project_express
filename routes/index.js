const router = require("express").Router();
const userRouter = require("./users");
const itemRouter = require("./clothingItems");
const { NotFoundError } = require("../utils/errors");
const { loginUser, createUser } = require("../controllers/users");
const { loginValidator, createUserValidator } = require("../middlewares/validation");


router.post("/signin",loginValidator,loginUser);
router.post("/signup",createUserValidator,createUser);


router.use("/users", userRouter);
router.use("/items", itemRouter);

router.use((req, res) => {
  next(new NotFoundError("Router not found"));
});

module.exports = router;