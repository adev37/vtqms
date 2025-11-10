const router = require("express").Router();

// Controllers
const {
  signup,
  login,
  updateUser,
  userDetail,
} = require("../Controllers/AuthController");

// Middlewares
const verifyToken = require("../Middlewares/verifyToken");
const {
  signupValidation,
  loginValidation,
} = require("../Middlewares/AuthValidation");

// Models (even though not used here directly — not wrong)
const UserModel = require("../Models/User");

// Signup route with validation
router.post("/signup", signupValidation, signup);

// Login route with validation
router.post("/login", loginValidation, login);

// Update profile route (protected)
router.put("/updateUser", verifyToken, updateUser);

// GET user detail route (protected)
router.get("/userDetail", verifyToken, userDetail);

module.exports = router;
