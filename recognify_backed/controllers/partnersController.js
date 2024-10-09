const Response = require("../helper/static/Response");
const partnersModel = require("../models/partnersModel");
const projectModel = require("../models/projectModel");

exports.list = async (req, res) => {
  try {
    const response = await partnersModel.list(req.body);
    return res.status(response.status).json(response);
  } catch (error) {
    return res.json(new Response(500, "F").custom(error.message));
  }
};
exports.work_list = async (req, res) => {
  try {
    const response = await projectModel.list(req.body);
    return res.status(response.status).json(response);
  } catch (error) {
    return res.json(new Response(500, "F").custom(error.message));
  }
};

exports.savePartners = async (req, res) => {
  try {
    const { partner_id } = req.params;
    const { file } = req;
    const { email, first_name, last_name, gender, number, skills, is_active } =
      req.body;
    const postData = {
      partner_id,
      first_name,
      last_name,
      gender,
      email,
      number,
      resume: file ? file.filename : "",
      skills,
      is_active,
    };
    const response = await partnersModel.savePartners(postData);
    return res.status(response.status).json(response);
  } catch (error) {
    return res.json(new Response(500, "F").custom(error.message));
  }
};

exports.delete = async (req, res) => {
  try {
    const { partner_id } = req.params;
    const response = await partnersModel.delete({ partner_id });
    return res.status(response.status).json(response);
  } catch (error) {
    return res.json(new Response(500, "F").custom(error.message));
  }
};
