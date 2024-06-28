const router = require("express").Router();
const userRouter = require("./users");
const itemRouter = require("./clothingItems");
const  NotFoundError  = require("../utils/errors/notFoundError");
const { loginUser, createUser } = require("../controllers/users");

const { loginValidation,createUserValidation } = require("../middlewares/validation");

router.post("/signin",loginValidation,loginUser);
router.post("/signup",createUserValidation,createUser);


router.use("/users", userRouter);
router.use("/items", itemRouter);

router.use((req, res, next) => {
  next(new NotFoundError("Item not found"));
});

module.exports = router;