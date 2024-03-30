const router = require("express").Router();
const { handleAuthorization } = require("../middlewares/auth");
const { getCurrentUser, updateUser } = require("../controllers/users");

router.get("/me", handleAuthorization, getCurrentUser);

router.patch("/me", handleAuthorization, updateUser);

module.exports = router;
