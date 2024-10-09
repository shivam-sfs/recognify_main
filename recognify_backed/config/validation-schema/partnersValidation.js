const Joi = require("joi");

exports.partnerValidationSchema = Joi.object({
  partner_id: Joi.number().optional(),
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  gender: Joi.string().valid("male", "female", "other").required(),
  email: Joi.string().email().required(),
  number: Joi.string().required(),
  resume: Joi.string().allow('').optional(),
  skills: Joi.string().required(),
  is_active: Joi.number().valid(0, 1).optional(),
  is_deleted: Joi.number().valid(0, 1).optional(),
  created_at: Joi.date().optional(),
  updated_at: Joi.date().optional(),
});

exports.partnersValidation = Joi.object({
  partner_id: Joi.number().required(),
});
