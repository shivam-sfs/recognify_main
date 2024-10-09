const Joi = require('joi');

exports.leadValidationSchema = Joi.object({
    lead_id: Joi.number().optional(),
    is_active: Joi.number().optional(),
    email: Joi.string().email().required(),
    full_name: Joi.string().min(3).max(255).required(),
    message: Joi.string().min(3).max(255).required(),
    type: Joi.number().valid(1, 2).default(1), 
    status: Joi.string().default("On Review"),
    is_deleted: Joi.boolean().optional(),
    updated_at: Joi.date().optional() 
});

exports.leadValidation = Joi.object({
    lead_id: Joi.number().required()
});
