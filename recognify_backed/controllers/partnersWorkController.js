const Response = require("../helper/static/Response");
const partnersWorkModel = require("../models/partnersWorkModel.js");

exports.list = async (req, res) => {
  try {
    const response = await partnersWorkModel.list(req.body);
    return res.status(response.status).json(response);
  } catch (error) {
    return res.json(new Response(500, "F").custom(error.message));
  }
};

exports.save = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await partnersWorkModel.save({ ...req.body, id });
    return res.status(response.status).json(response);
  } catch (error) {
    return res.json(new Response(500, "F").custom(error.message));
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await partnersWorkModel.delete({ id });
    return res.status(response.status).json(response);
  } catch (error) {
    return res.json(new Response(500, "F").custom(error.message));
  }
};
