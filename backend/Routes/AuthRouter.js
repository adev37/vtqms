const router = require("express").Router();

const { signup, login, updateUser, userDetail } = require("../Controllers/AuthController");
const verifyToken = require("../Middlewares/verifyToken");
const { signupValidation, loginValidation } = require("../Middlewares/AuthValidation");

router.post("/signup", signupValidation, signup);
router.post("/login", loginValidation, login);
router.put("/updateUser", verifyToken, updateUser);
router.get("/userDetail", verifyToken, userDetail);

module.exports = router;
