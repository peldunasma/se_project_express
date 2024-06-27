const router = require("express").Router();
const { getCurrentUser, updateUser } = require("../controllers/users");
const { handleAuthorization } = require("../middlewares/auth");
const { updateUserValidation } = require("../middlewares/validation");

router.use(handleAuthorization);

router.get("/me", getCurrentUser);

router.patch("/me",updateUserValidation,updateUser);

module.exports = router;
