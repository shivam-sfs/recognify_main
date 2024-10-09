
const service = require("../models/serviceModel")
exports.list = async (req, res) => {
  try {
    const response = await service.list(req);
    return res.status(response.status).json(response);
  } catch (error) {
    return res.json(new Response(500, "F").custom(error.message));
  }
};
exports.get = async (req, res) => {
  try {
    const response = await service.get(req);
    return res.status(response.status).json(response);
  } catch (error) {
    return res.json(new Response(500, "F").custom(error.message));
  }
};
exports.create = async (req, res) => {
  try {
    const response = await service.create(req);
    return res.status(response.status).json(response);
  } catch (error) {
    return res.json(new Response(500, "F").custom(error.message));
  }
};
exports.update = async (req, res) => {
  try {
    const response = await service.update(req);
    return res.status(response.status).json(response);
  } catch (error) {
    return res.json(new Response(500, "F").custom(error.message));
  }
};
exports.deleteItem = async (req, res) => {
  try {
    const response = await service.deleteItem(req);
    return res.status(response.status).json(response);
  } catch (error) {
    return res.json(new Response(500, "F").custom(error.message));
  }
};
exports.restore = async (req, res) => {
  try {
    const response = await service.restore(req);
    return res.status(response.status).json(response);
  } catch (error) {
    return res.json(new Response(500, "F").custom(error.message));
  }
};
