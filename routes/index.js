const router = require("express").Router();
const userRouter = require("./users");
const itemRouter = require("./clothingItems");
const  NOTFOUND_ERROR  = require("../utils/errors");
const { loginUser, createUser } = require("../controllers/users");



router.post("/signin",loginUser);
router.post("/signup",createUser);


router.use("/users", userRouter);
router.use("/items", itemRouter);

router.use((req, res) => {
  res.status(NOTFOUND_ERROR).send({ message: "Requested resource not found"});
});

module.exports = router;