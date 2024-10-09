const Joi = require("joi");

exports.workValidationSchema = Joi.object({
  work_id: Joi.number().optional(),
  partner_id: Joi.number().optional(),
  work: Joi.string().required(),
  price: Joi.number().required(),
  status: Joi.string().default("On Review"),
  type: Joi.string().required(),
  message: Joi.string().required(),
  deadline: Joi.string().required(),
  is_active: Joi.number().valid(0, 1).optional(),
  is_deleted: Joi.boolean().optional(),
  created_at: Joi.date().optional(),
  updated_at: Joi.date().optional(),
});

exports.workValidation = Joi.object({
  work_id: Joi.number().required(),
});
