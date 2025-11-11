const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../Models/User");

// Signup
const signup = async (req, res) => {
  try {
    const {
      name, email, password, role,
      canSeeMCQ, canSeeTrueFalse, canSeeFillBlank,
    } = req.body;

    if (!role || !["admin", "student"].includes(role)) {
      return res.status(400).json({ success: false, message: "Invalid role. Use 'admin' or 'student'." });
    }

    const existingUser = await UserModel.findOne({ email }).lean();
    if (existingUser) {
      return res.status(409).json({ success: false, message: "User already exists, please log in." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await new UserModel({
      name, email, password: hashedPassword, role,
      canSeeMCQ: !!canSeeMCQ,
      canSeeTrueFalse: !!canSeeTrueFalse,
      canSeeFillBlank: !!canSeeFillBlank,
    }).save();

    return res.status(201).json({ success: true, message: "Signup successful" });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    const user = await UserModel.findOne({ email }).lean();

    if (!user) {
      return res.status(401).json({ success: false, message: "Auth failed, email or password is incorrect" });
    }

    if (!user.password) {
      console.error("Login Error: user has no password in DB", { email });
      return res.status(500).json({ success: false, message: "Server data error" });
    }

    const isPasswordCorrect = await bcrypt.compare(String(password), String(user.password));
    if (!isPasswordCorrect) {
      return res.status(401).json({ success: false, message: "Auth failed, email or password is incorrect" });
    }

    if (!process.env.JWT_SECRET) {
      console.error("Missing JWT_SECRET");
      return res.status(500).json({ success: false, message: "Server configuration error" });
    }

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

    return res.status(200).json({
      success: true,
      message: "Login successful",
      email: user.email,
      role: user.role,
      jwtToken,
      name: user.name || "",
      canSeeMCQ: user.canSeeMCQ,
      canSeeTrueFalse: user.canSeeTrueFalse,
      canSeeFillBlank: user.canSeeFillBlank,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Self update
const updateUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, email } = req.body;
    await UserModel.findByIdAndUpdate(userId, { name, email }, { new: true });
    return res.json({ success: true, message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Own profile
const userDetail = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    return res.json({ success: true, user });
  } catch (error) {
    console.error("Error fetching user details:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = { signup, login, updateUser, userDetail };
