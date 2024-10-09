const fs = require("fs");
const path = require("path");
const { compareHash, hashAndSalt } = require("../config/Bcrypt/bcrypt");
const knex = require("../config/connection/config");
const {
  partnerValidationSchema,
} = require("../config/validation-schema/partnersValidation.js");
const {
  listValidation,
} = require("../config/validation-schema/listValidation");
const { authHandler } = require("../helper/third-party/messages.js");
const Response = require("../helper/static/Response");

/* -------------------------------------------------------------------------- */
/*                             save partners                                 */
/* -------------------------------------------------------------------------- */

exports.savePartners = async (postData) => {
  try {
    const { error, value } = partnerValidationSchema.validate(postData);

    if (error) {
      return new Response(400, "F").custom(error?.details[0]?.message);
    }

    delete value.partner_id;

    if (postData?.partner_id) {
      const findPartners = await knex("partners")
        .where({ partner_id: postData?.partner_id })
        .first();

      if (!findPartners) {
        return new Response(400, "F").custom(
          authHandler("PARTNERS_NOT_EXISTS")
        );
      }

      value.first_name = postData?.first_name || findPartners?.first_name;
      value.last_name = postData?.last_name || findPartners?.last_name;
      value.gender = postData?.gender || findPartners?.gender;
      value.email = postData?.email || findPartners?.email;
      value.number = postData?.number || findPartners?.number;
      value.resume = postData?.resume || findPartners?.resume;
      value.skills = postData?.skills || findPartners?.skills;

      value.is_active =
        postData?.is_active !== undefined || postData?.is_active != ""
          ? postData?.is_active
          : findPartners?.is_active;

      let message = "PARTNERS_UPDATED";
      if (postData?.is_deleted == "true") {
        message = "PARTNERS_DELETED";
      }

      if (postData?.is_active === 1) {
        message = "PARTNERS_ACTIVATED";
      } else if (postData?.is_active === 0) {
        message = "PARTNERS_DEACTIVATED";
      }

      //check email already exists or not
      const checkEmailExists = await knex("partners")
        .where({ email: value.email, is_deleted: 1 })
        .whereNot({ partner_id: postData?.partner_id })
        .first();

      if (checkEmailExists) {
        return new Response(400, "F").custom(authHandler("DUPLICATE_EMAIL"));
      }

      //check Phone number already exists or not
      const checkPhoneNumberExists = await knex("partners")
        .where({ number: value.number, is_deleted: 1 })
        .whereNot({ partner_id: postData?.partner_id })
        .first();

      if (checkPhoneNumberExists) {
        return new Response(400, "F").custom(authHandler("DUPLICATE_PHONE"));
      }
      const result = await knex("partners")
        .update(value)
        .where({ partner_id: postData?.partner_id });
      return new Response(result ? 200 : 400, result ? "T" : "F").custom(
        authHandler(result ? message : "PARTNERS_UPDATED_FAILED")
      );
    } else {
      const findPartners = await knex("partners")
        .where({ email: value.email, is_deleted: 1 })
        .first();

      if (findPartners) {
        return new Response(400, "F").custom(authHandler("DUPLICATE_EMAIL"));
      }
      //check Phone number already exists or not
      const checkPhoneNumberExists = await knex("partners")
        .where({ number: value.number, is_deleted: 1 })
        .first();

      if (checkPhoneNumberExists) {
        return new Response(400, "F").custom(authHandler("DUPLICATE_PHONE"));
      }
      const result = await knex("partners").insert(value);

      return new Response(result ? 200 : 500, result ? "T" : "F").custom(
        authHandler(result ? "PARTNERS_ADDED" : "PARTNERS_FAILED")
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
  const partner_id = postData?.authData?.partner_id || 0;

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
    value.orderBy = "partner_id";
  }

  if (!value.order) {
    value.order = "DESC";
  }

  try {
    const list = await knex("partners")
      .select(
        "partner_id",
        "first_name",
        "last_name",
        "gender",
        "email",
        "number",
        "resume",
        "skills",
        "is_active",
        "is_deleted",
        "created_at",
        "updated_at"
      )
      .where({ is_deleted: 1 })
      .andWhere(function () {
        if (value.searchParam) {
          this.where("first_name", "like", `%${value.searchParam}%`);
          this.orWhere("last_name", "like", `%${value.searchParam}%`);
          this.orWhere("number", "like", `%${value.searchParam}%`);
          this.orWhere("email", "like", `%${value.searchParam}%`);
        }
      })
      .andWhere(function () {
        if (partner_id) {
          this.whereNot("partner_id", "=", partner_id);
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
      return new Response(500, "F").custom(authHandler("PARTNERS_LIST_WRONG"));
    }
    const workDetails = await Promise.all(
      list &&
        list.map(async (partner) => {
          const work = await knex("partner_work")
            .select(
              "partner_work.*",
              "payment.id  as payment_id",
              "payment.amount as amount",
              "payment.currency as currency",
              "payment.type as type",
              "payment.status as pay_status",
              "payment.description as payDescription",
              "payment.payment_method as payment_method"
            )
            .innerJoin("payment", function () {
              this.on("partner_work.id", "=", "payment.work_id").andOn(
                "payment.work_type",
                "=",
                2
              );
            })
            .where("partner_work.is_deleted", 1)
            .andWhere("payment.is_deleted", 1)
            .andWhere({ "partner_work.partner_id": partner.partner_id });
          return {
            ...partner,
            work,
          };
        })
    );
    const totalCount = await knex("partners")
      .select(knex.raw("count(*) as total"))
      .where({ is_deleted: 1 })
      .andWhere(function () {
        if (value.searchParam) {
          this.where("first_name", "like", `%${value.searchParam}%`);
          this.orWhere("last_name", "like", `%${value.searchParam}%`);
          this.orWhere("number", "like", `%${value.searchParam}%`);
          this.orWhere("email", "like", `%${value.searchParam}%`);
        }
      })
      .andWhere(function () {
        if (partner_id) {
          this.whereNot("partner_id", "=", partner_id);
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

    return new Response(200, "T", { list: workDetails, pagination }).custom(
      "Partners List"
    );
  } catch (error) {
    return new Response(500, "F").custom(error.message);
  }
};

/* -------------------------------------------------------------------------- */
/*                                 Delete a partners                               */
/* -------------------------------------------------------------------------- */

exports.delete = async (postData) => {
  try {
    const { partner_id } = postData;

    const { error, value } = customerValidation.validate({ partner_id });

    if (error) {
      return new Response(400, "F").custom(error.details[0]?.message);
    }

    const deletedRowsCount = await knex("partners")
      .update({ is_deleted: 0 })
      .where({ partner_id });

    if (deletedRowsCount > 0) {
      return new Response(200, "T").custom(authHandler("PARTNERS_DELETED"));
    } else {
      return new Response(400, "F").custom(
        authHandler("FAILED_DELETE_PARTNERS")
      );
    }
  } catch (error) {
    return new Response(500, "F").custom(error.message);
  }
};
