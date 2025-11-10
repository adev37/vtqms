// Importing the Joi library
const Joi = require("joi");

// Middleware for validating the signup data
const signupValidation = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(4).max(100).required(),
    role: Joi.string().valid("admin", "student").required(),
    // 🔵 ADD permission fields here to allow canSeeMCQ, canSeeTrueFalse, canSeeFillBlank
    canSeeMCQ: Joi.boolean().optional(),
    canSeeTrueFalse: Joi.boolean().optional(),
    canSeeFillBlank: Joi.boolean().optional(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res
      .status(400)
      .json({ message: error.details[0].message, success: false });
  }

  next();
};

// Middleware for validating the login data
const loginValidation = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(4).max(100).required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res
      .status(400)
      .json({ message: error.details[0].message, success: false });
  }

  next();
};

// 🛡️ Export properly
module.exports = {
  signupValidation,
  loginValidation,
};
