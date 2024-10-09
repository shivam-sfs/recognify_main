const Joi = require('joi');

exports.listValidation = Joi.object({
    limit: Joi.number().min(1).max(200).required(),
    offset: Joi.number().min(0).max(200).required(),
    orderBy: Joi.string().allow('', null).optional(),
    order: Joi.string().allow('', null).optional(),
    searchParam: Joi.string().allow('', null).optional(),
    startDate: Joi.string().allow('', null).optional(),
    endDate: Joi.string().allow('', null).optional(),
    created_by: Joi.number().allow('', null).optional(),
  });