const Joi = require("joi");

const signupValidation = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(100).required(), // align with model
    role: Joi.string().valid("admin", "student").required(),
    canSeeMCQ: Joi.boolean().optional(),
    canSeeTrueFalse: Joi.boolean().optional(),
    canSeeFillBlank: Joi.boolean().optional(),
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ success: false, message: error.details[0].message });
  next();
};

const loginValidation = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(100).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ success: false, message: error.details[0].message });
  next();
};

module.exports = { signupValidation, loginValidation };
