const Response = require("../helper/static/Response");
const { extractRequestData } = require("../helper/static/request-response");
const dashboardModel = require('../models/dashboardModel');

exports.list = async (req, res) => {
  try {
    const postData = extractRequestData(req);
    const response = await dashboardModel.list(postData);
    return res.status(response.status).json(response);
  } catch (error) {
    return res.json(new Response(500, "F").custom(error.message));
  }
};
