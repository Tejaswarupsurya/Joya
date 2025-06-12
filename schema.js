const Joi = require("joi");
const { facilitiesList, categoryList } = require("./utils/constants");

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    category: Joi.string()
      .valid(...categoryList)
      .required(),
    facilities: Joi.alternatives().try(
      Joi.array().items(Joi.string().valid(...facilitiesList)).min(1),
      Joi.string().valid(...facilitiesList)
    ).required(),
    price: Joi.number().required().min(0),
    location: Joi.string().required(),
    country: Joi.string().required(),
  }).required(),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    comment: Joi.string().required(),
  }).required(),
});

module.exports.resetPasswordSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  code: Joi.string()
    .pattern(/^\d{6}$/)
    .required()
    .messages({
      "string.pattern.base": "OTP must be a 6-digit number.",
    }),
  password: Joi.string().min(6).required(),
  confirm: Joi.any().valid(Joi.ref("password")).required().messages({
    "any.only": "Passwords do not match.",
  }),
});

module.exports.signupSchema = Joi.object({
  username: Joi.string().min(3).max(20).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  confirm: Joi.any()
    .valid(Joi.ref("password"))
    .required()
    .messages({ "any.only": "Passwords do not match." }),
});

module.exports.updatePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  password: Joi.string().min(6).required(),
  confirm: Joi.valid(Joi.ref("password")).required().messages({
    "any.only": "Passwords do not match.",
  }),
});
