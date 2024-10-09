const knex = require("../config/connection/config");

exports.list = async (req) => {
  const {
    limit = 10,
    offset = 0,
    orderBy = "created_at",
    order = "desc",
    searchParam,
    startDate,
    endDate,
  } = req.query;

  try {
    const query = knex("service")
      .select(
        "service.*",
        "client.first_name as client_first_name",
        "client.last_name as client_last_name",
        "payment.amount as payment_amount",
        "payment.currency as payment_currency",
        "partner.first_name as partner_first_name",
        "partner.last_name as partner_last_name",
        "service_type.service as service_type"
      )
      .leftJoin("client", "service.client_id", "client.id")
      .leftJoin("payment", "service.payment_id", "payment.id")
      .leftJoin("partners", "service.partner_id", "partners.partner_id")
      .leftJoin("service_type", "service.service_type_id", "service_type.id")
      .where("service.is_deleted", 1)
      .orderBy(orderBy, order)
      .limit(limit)
      .offset(offset);

    if (searchParam) {
      query.where("service.title", "like", `%${searchParam}%`);
    }

    if (startDate && endDate) {
      query.whereBetween("service.start_date", [startDate, endDate]);
    }

    const services = await query;
    return new Response(200, "T", services).custom();
  } catch (error) {
    return new Response(500, "F").custom(error.message);
  }
};

exports.get = async (req) => {
  const { id } = req.params;

  try {
    const service = await knex("service")
      .select(
        "service.*",
        "client.first_name as client_first_name",
        "client.last_name as client_last_name",
        "payment.amount as payment_amount",
        "payment.currency as payment_currency",
        "partner.first_name as partner_first_name",
        "partner.last_name as partner_last_name",
        "service_type.service as service_type"
      )
      .leftJoin("client", "service.client_id", "client.id")
      .leftJoin("payment", "service.payment_id", "payment.id")
      .leftJoin("partners", "service.partner_id", "partners.partner_id")
      .leftJoin("service_type", "service.service_type_id", "service_type.id")
      .where({ "service.id": id, "service.is_deleted": 1 })
      .first();

    if (!service) {
      return new Response(404, "F").custom("Service not found");
    }

    return new Response(200, "T", service).custom();
  } catch (error) {
    return new Response(500, "F").custom(error.message);
  }
};

exports.create = async (req) => {
  const {
    title,
    description,
    service_type_id,
    start_date,
    deadline,
    payment_type,
    payment_id,
    partner_id,
  } = req.body;
  const create_by = req.authData.user_id;

  try {
    const [newServiceId] = await knex("service").insert({
      title,
      description,
      service_type_id,
      start_date,
      deadline,
      payment_type,
      payment_id,
      partner_id,
      create_by,
    });
    const newService = await knex("service")
      .where({ id: newServiceId })
      .first();
    return new Response(201, "T", newService).custom(
      "Service created successfully"
    );
  } catch (error) {
    return new Response(500, "F").custom(error.message);
  }
};

exports.update = async () => {};

exports.deleteItem = async (req) => {
  const { id } = req.params;
  try {
    const updatedRows = await knex("service")
      .where({ id })
      .update({ is_deleted: 0 });
    if (!updatedRows) {
      return new Response(404, "F").custom("Service not found");
    }
    return new Response(200, "T").custom("Service deleted successfully");
  } catch (error) {
    return new Response(500, "F").custom(error.message);
  }
};

exports.restore = async (req) => {
  const { id } = req.params;
  try {
    const updatedRows = await knex("service")
      .where({ id })
      .update({ is_deleted: 1 });
    if (!updatedRows) {
      return new Response(404, "F").custom("Service not found");
    }
    return new Response(200, "T").custom("Service restored successfully");
  } catch (error) {
    return new Response(500, "F").custom(error.message);
  }
};
