const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../Models/User");

// 🔹 Signup Controller
const signup = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      canSeeMCQ,
      canSeeTrueFalse,
      canSeeFillBlank,
    } = req.body;

    // Validate role
    if (!role || !["admin", "student"].includes(role)) {
      return res.status(400).json({
        message: "Invalid role. Role must be either 'admin' or 'student'.",
        success: false,
      });
    }

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "User already exists, please log in.",
        success: false,
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
      role,
      canSeeMCQ: canSeeMCQ || false,
      canSeeTrueFalse: canSeeTrueFalse || false,
      canSeeFillBlank: canSeeFillBlank || false,
    });

    await newUser.save();

    res.status(201).json({
      message: "Signup successful",
      success: true,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// 🔹 Login Controller
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(403).json({
        message: "Auth failed, email or password is incorrect",
        success: false,
      });
    }

    // Compare password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(403).json({
        message: "Auth failed, email or password is incorrect",
        success: false,
      });
    }

    // Create JWT Token with permissions
    const jwtToken = jwt.sign(
      {
        email: user.email,
        _id: user._id,
        role: user.role,
        canSeeMCQ: user.canSeeMCQ,
        canSeeTrueFalse: user.canSeeTrueFalse,
        canSeeFillBlank: user.canSeeFillBlank,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(200).json({
      message: "Login successful",
      success: true,
      email: user.email,
      role: user.role,
      jwtToken,
      name: user.name,
      canSeeMCQ: user.canSeeMCQ,
      canSeeTrueFalse: user.canSeeTrueFalse,
      canSeeFillBlank: user.canSeeFillBlank,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// 🔹 Update Profile (Self User Update)
const updateUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, email } = req.body;

    const updates = { name, email };

    await UserModel.findByIdAndUpdate(userId, updates, { new: true });

    res.json({
      success: true,
      message: "User updated successfully",
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// 🔹 Fetch Own Profile
const userDetail = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  signup,
  login,
  updateUser,
  userDetail,
};
