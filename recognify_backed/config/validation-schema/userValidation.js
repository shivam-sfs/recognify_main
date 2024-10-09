const Joi = require('joi');

exports.signupValidationSchema = Joi.object({
  user_id: Joi.number().optional(),
  oldImage: Joi.string().allow('',null).optional(),
  host: Joi.string().allow('',null).optional(),
  role: Joi.number().min(1).max(3).optional(),
  company_name: Joi.string().min(0).max(50).allow('', null).optional(),
  phone_number: Joi.string().pattern(new RegExp('^[0-9]{10}$')),
  created_by: Joi.number().required(),
  is_active: Joi.number().optional(),
  image: Joi.string().when('user_id', {
    is: Joi.exist(),
    then: Joi.string().allow('').optional(),
    otherwise: Joi.string().required()
  }),
  password: Joi.string().when('user_id', {
    is: Joi.exist(),
    then: Joi.string().allow('', null).optional(),
    otherwise: Joi.string().min(8).max(20).required(),
  }),
  email: Joi.string().email().when('user_id', {
    is: Joi.exist(),
    then: Joi.string().allow('').optional(),
    otherwise: Joi.string().email().required(),
  }),
  first_name: Joi.string().when('user_id', {
    is: Joi.exist(),
    then: Joi.string().allow('').optional(),
    otherwise: Joi.string().min(3).max(20).required(),
  }),
  last_name: Joi.string().when('user_id', {
    is: Joi.exist(),
    then: Joi.string().allow('').optional(),
    otherwise: Joi.string().min(3).max(20).required(),
  }),
  address: Joi.string().when('user_id', {
    is: Joi.exist(),
    then: Joi.string().allow('').optional(),
    otherwise: Joi.string().min(8).max(50).required(),
  }),
  is_deleted : Joi.boolean().optional()
});

exports.loginValidationSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(20).required(),
});

exports.forgotPasswordSchema = Joi.object({
  newPassword: Joi.string().min(8).max(20).required(),
  confirmNewPassword: Joi.string().min(8).max(20).required()
});


exports.toogleUserValidation = Joi.object({
  user_id: Joi.number().required(),
  is_active: Joi.number().min(0).max(1).required(),
  created_by: Joi.number().required()
});

exports.deleteUserValidation = Joi.object({
  user_id: Joi.number().required(),
});

exports.userList = Joi.object({
  user_id: Joi.number().required(),
});

exports.emailValidation = Joi.object({
  email: Joi.string().email().required()
})
