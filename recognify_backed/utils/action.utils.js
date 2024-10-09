const knex = require("../config/connection/config");
const { authHandler } = require("../helper/static/messages");

async function deleteQuery(table, obj, validator, DELETED = "") {
  const { error } = validator.validate(obj);
  if (error) {
    return { status: 400, header: "F", massage: error.details[0]?.message };
  }
  const deletedCount = await knex(table).update({ is_deleted: 0 }).where(obj);

  return deletedCount > 0
    ? { status: 200, header: "T", massage: authHandler(`${DELETED}_DELETED`) }
    : {
        status: 400,
        header: "F",
        massage: authHandler(`FAILED_DELETE_${DELETED}`),
      };
}

module.exports = { deleteQuery };
