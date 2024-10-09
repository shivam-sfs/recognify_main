const Response = require("../helper/static/Response");
const knex = require("../config/connection/config");
const Curd = require("../utils/Crud/Curd");

const table = "payment";

// Get all clients (with filtering by is_deleted)
exports.list = async (postData) => {
  try {
    return await new Curd(table, { is_deleted: 1 }, postData).list();
  } catch (error) {
    return new Response(500, "F").custom(error.message);
  }
};

// Save or update a client
exports.save = async (postData) => {
  const { id } = postData;

  try {
    if (id) {
      return await new Curd(table, { is_deleted: 1 }, postData).update({ id });
    } else {
      return await new Curd(table, { is_deleted: 1 }, postData).create();
    }
  } catch (error) {
    return new Response(500, "F").custom(error.message);
  }
};

// Soft delete a client
exports.delete = async (id) => {
  try {
    return await new Curd(table, { is_deleted: 1 }, postData).delete({ id });
  } catch (error) {
    return new Response(500, "F").custom(error.message);
  }
};


// Get client by ID
exports.getById = async (id) => {
  try {
    return await new Curd(table, { is_deleted: 1 }, postData).get({ id });
  } catch (error) {
    return new Response(500, "F").custom(error.message);
  }
};
