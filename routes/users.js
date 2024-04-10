const router = require("express").Router();
const { handleAuthorization } = require("../middlewares/auth");
const { getCurrentUser, updateUser } = require("../controllers/users");

router.get("/me", getCurrentUser);

router.patch("/me", updateUser);

module.exports = router;
