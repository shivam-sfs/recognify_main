const Response = require("../helper/static/Response");
const projectModel = require("../models/projectModel");

exports.list = async (req, res) => {
  try {
    const response = await projectModel.list(req.body);
    return res.status(response.status).json(response);
  } catch (error) {
    return res.json(new Response(500, "F").custom(error.message));
  }
};

exports.save = async (req, res) => {
  try {
    const { id } = req.params;
    const file = req.file;
    const response = await projectModel.save({ ...req.body, file, id });
    return res.status(response.status).json(response);
  } catch (error) {
    return res.json(new Response(500, "F").custom(error.message));
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await projectModel.delete({ id });
    return res.status(response.status).json(response);
  } catch (error) {
    return res.json(new Response(500, "F").custom(error.message));
  }
};
