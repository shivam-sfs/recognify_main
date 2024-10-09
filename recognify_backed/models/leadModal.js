const fs = require("fs");
const path = require("path");
const { compareHash, hashAndSalt } = require("../config/Bcrypt/bcrypt");
const knex = require("../config/connection/config");
const {
  leadValidationSchema,
  leadList,
} = require("../config/validation-schema/leadValidation");
const {
  listValidation,
} = require("../config/validation-schema/listValidation");
const { authHandler } = require("../helper/third-party/messages");
const Response = require("../helper/static/Response");
const { mailer } = require("../helper/third-party/mailer");
const {WelcomeTemplate} = require("../utils/MailTemplate")

/* -------------------------------------------------------------------------- */
/*                              lead LEAD                                 */
/* -------------------------------------------------------------------------- */

exports.saveLead = async (postData) => {
  try {
    const { error, value } = leadValidationSchema.validate(postData);

    if (error) {
      return new Response(400, "F").custom(error?.details[0]?.message);
    }

    delete value.lead_id;

    if (postData?.lead_id) {
      const findLead = await knex("leads")
        .where({ lead_id: postData?.lead_id })
        .first();

      if (!findLead) {
        return new Response(400, "F").custom(authHandler("LEAD_NOT_EXISTS"));
      }

      value.full_name = postData?.full_name || findLead?.full_name;
      value.email = postData?.email || findLead?.email;
      value.message = postData?.message || findLead?.message;
      value.type = postData?.type || findLead?.type;
      value.status = postData?.status || findLead?.status;

      value.is_active =
        postData?.is_active !== undefined || postData?.is_active != ""
          ? postData?.is_active
          : findLead?.is_active;

      let message = "LEAD_UPDATED";
      if (postData?.is_deleted == "true") {
        message = "LEAD_DELETED";
      }

      if (postData?.is_active === 1) {
        message = "LEAD_ACTIVATED";
      } else if (postData?.is_active === 0) {
        message = "LEAD_DEACTIVATED";
      }

      //check email already exists or not
      const checkEmailExists = await knex("leads")
        .where({ email: value.email, is_deleted: 1 })
        .whereNot({ lead_id: postData?.lead_id })
        .first();

      const result = await knex("leads")
        .update(value)
        .where({ lead_id: postData?.lead_id });
      return new Response(result ? 200 : 400, result ? "T" : "F").custom(
        authHandler(result ? message : "LEAD_UPDATED_FAILED")
      );
    } else {
      const findlead = await knex("leads")
        .where({ email: value.email, is_deleted: 1 })
        .first();

      const result = await knex("leads").insert(value);
      if(result){
        mailer(
          value.email,
          findlead?"Welcome Back to Recognify!":"Welcome to Recongnify",
          WelcomeTemplate(value.full_name)
        )
        return {
          status: 200,
          success: true,
          message: "Welcome to Recongnify",
          email: value.full_name,
        };
      }

      return new Response(result ? 200 : 500, result ? "T" : "F").custom(
        authHandler(result ? "LEAD_ADDED" : "LEAD_FAILED")
      );
    }
  } catch (error) {
    return new Response(500, "F").custom(error.message);
  }
};

/* -------------------------------------------------------------------------- */
/*                                 get user list                              */
/* -------------------------------------------------------------------------- */

exports.list = async (postData) => {
  const {
    limit,
    offset,
    orderBy,
    order,
    searchParam,
    startDate,
    endDate,
    host,
  } = postData;
  const lead_id = postData?.authData?.lead_id || 0;

  const { error, value } = listValidation.validate({
    limit,
    offset,
    orderBy,
    order,
    searchParam,
    startDate,
    endDate,
  });

  if (error) {
    return new Response(400, "F").custom(error?.details[0]?.message);
  }

  if (!value.orderBy) {
    value.orderBy = "lead_id";
  }

  if (!value.order) {
    value.order = "DESC";
  }

  try {
    const list = await knex("leads")
      .select(
        "lead_id",
        "full_name",
        "email",
        "message",
        "type",
        "status",
        "is_active",
        "is_deleted",
        "created_at",
        "updated_at"
      )
      .where({ is_deleted: 1 })
      .andWhere(function () {
        if (value.searchParam) {
          this.where("full_name", "like", `%${value.searchParam}%`);
          this.orWhere("message", "like", `%${value.searchParam}%`);
          this.orWhere("email", "like", `%${value.searchParam}%`);
        }
      })
      .andWhere(function () {
        if (lead_id) {
          this.whereNot("lead_id", "=", lead_id);
        }
      })
      .andWhere(function () {
        if (value.startDate && value.endDate) {
          this.whereBetween("created_at", [
            value.startDate + " 00:00:00",
            value.endDate + " 23:59:59",
          ]);
        } else if (value.startDate) {
          this.where("created_at", "like", `%${value.startDate}%`);
        }
      })

      .orderBy(value.orderBy, value.order)
      .limit(value.limit)
      .offset(value.offset);

    if (!list) {
      return new Response(500, "F").custom(authHandler("LEAD_LIST_WRONG"));
    }

    const totalCount = await knex("leads")
      .select(knex.raw("count(*) as total"))
      .where({ is_deleted: 1 })
      .andWhere(function () {
        if (value.searchParam) {
          this.where("full_name", "like", `%${value.searchParam}%`);
          this.orWhere("message", "like", `%${value.searchParam}%`);
          this.orWhere("email", "like", `%${value.searchParam}%`);
        }
      })
      .andWhere(function () {
        if (lead_id) {
          this.whereNot("lead_id", "=", lead_id);
        }
      })
      .andWhere(function () {
        if (value.startDate && value.endDate) {
          this.whereBetween("created_at", [
            value.startDate + " 00:00:00",
            value.endDate + " 23:59:59",
          ]);
        } else if (value.startDate) {
          this.where("created_at", "like", `%${value.startDate}%`);
        }
      })
      .first();

    if (!totalCount) {
      return new Response(500, "F").custom(authHandler("TOTAL_WRONG"));
    }

    const total = totalCount.total;
    const pagination = {
      limit,
      offset,
      total,
    };

    return new Response(200, "T", { list, pagination }).custom("LEAD List");
  } catch (error) {
    return new Response(500, "F").custom(error.message);
  }
};

exports.delete = async (postData) => {
  try {
    const { lead_id } = postData;

    const { error, value } = LEADValidation.validate({ lead_id });

    if (error) {
      return new Response(400, "F").custom(error.details[0]?.message);
    }

    const deletedRowsCount = await knex("leads")
      .update({ is_deleted: 0 })
      .where({ lead_id });

    if (deletedRowsCount > 0) {
      return new Response(200, "T").custom(authHandler("LEAD_DELETED"));
    } else {
      return new Response(400, "F").custom(authHandler("FAILED_DELETE_LEAD"));
    }
  } catch (error) {
    return new Response(500, "F").custom(error.message);
  }
};
