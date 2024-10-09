const Response = require("../helper/static/Response");
const knex = require("../config/connection/config");
const Curd = require("../utils/Crud/Curd");

const table = "partner_work";

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
  console.log("res_partner_work1")
  const project_id = postData.project_id;
  const projectData = await new Curd(
    "project",
    { is_deleted: 1 },
    postData
  ).get({
    id: project_id,
  });
  console.log(id,"sgfd")

  if (projectData.success) {
    const project = projectData?.data;

    try {
      if (id) {
        const res_partner_work = await new Curd(
          table,
          { is_deleted: 1 },
          {
            client_id: project?.client_id,
            project: project?.project,
            project_id: postData?.project_id,
            partner_id: postData?.partner_id,
            status: postData?.status,
            deadline: postData?.deadline,
            description: postData?.description,
          }
        ).update({ id });
        console.log("res_partner_work1")
        if (res_partner_work?.success) {
          const pay_id = postData?.pay_id;
          const pay_data = {
            amount: postData?.amount,
            currency: postData?.currency,
            description: postData?.payDescription,
            payment_method: postData?.payment_method,
            type: postData?.type,
            status: postData?.pay_status,
            work_id: id,
            work_type: 2,
          };
          console.log("res_partner_work",pay_id,pay_data)
          return await new Curd("payment", { is_deleted: 1 }, pay_data).update({
            id: pay_id,
          });
        }
      } else {
        const res_partner_work = await new Curd(
          table,
          { is_deleted: 1 },
          {
            client_id: project?.client_id,
            project: project?.project,
            project_id: postData?.project_id,
            partner_id: postData?.partner_id,
            status: postData?.status,
            deadline: postData?.deadline,
            description: postData?.description,
          }
        ).create();

        if (res_partner_work.success) {
          const pay_data = {
            amount: postData?.amount,
            currency: postData?.currency,
            description: postData?.payDescription,
            payment_method: postData?.payment_method,
            type: postData?.type,
            status: postData?.pay_status,
            work_id: res_partner_work.data.id,
            work_type: 2,
          };

          if (res_partner_work?.success) {
            return await new Curd(
              "payment",
              { is_deleted: 1 },
              pay_data
            ).create();
          }
        }
      }
    } catch (error) {
      console.log(error)
      return new Response(500, "F").custom(error.message);
    }
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
