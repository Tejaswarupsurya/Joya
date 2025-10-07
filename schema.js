const Joi = require("joi");
const { facilitiesList, categoryList } = require("./utils/constants");

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    category: Joi.string()
      .valid(...categoryList)
      .required(),
    facilities: Joi.alternatives()
      .try(
        Joi.array()
          .items(Joi.string().valid(...facilitiesList))
          .min(1),
        Joi.string().valid(...facilitiesList)
      )
      .required(),
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

module.exports.bookingSchema = Joi.object({
  checkIn: Joi.date()
    .custom((value, helpers) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const checkInDate = new Date(value);
      checkInDate.setHours(0, 0, 0, 0);

      if (checkInDate < tomorrow) {
        return helpers.error("date.min");
      }
      return value;
    })
    .required()
    .messages({
      "date.min": "Check-in date must be tomorrow or later.",
      "any.required": "Check-in date is required.",
    }),
  checkOut: Joi.date().greater(Joi.ref("checkIn")).required().messages({
    "date.greater": "Check-out date must be after check-in date.",
    "any.required": "Check-out date is required.",
  }),
  guests: Joi.number().integer().min(1).max(6).required().messages({
    "number.min": "At least 1 guest is required.",
    "number.max": "Maximum 6 guests allowed.",
    "any.required": "Number of guests is required.",
  }),
  dateRange: Joi.string().optional(),
});

module.exports.hostApplicationSchema = Joi.object({
  fullName: Joi.string().min(2).max(50).required().messages({
    "string.min": "Full name must be at least 2 characters long.",
    "string.max": "Full name must not exceed 50 characters.",
    "any.required": "Full name is required.",
  }),
  phone: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required()
    .messages({
      "string.pattern.base": "Phone number must be exactly 10 digits.",
      "any.required": "Phone number is required.",
    }),
  aadhaar: Joi.string()
    .pattern(/^[0-9]{12}$/)
    .required()
    .messages({
      "string.pattern.base": "Aadhaar number must be exactly 12 digits.",
      "any.required": "Aadhaar number is required.",
    }),
});
