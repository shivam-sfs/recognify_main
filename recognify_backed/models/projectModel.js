const Response = require("../helper/static/Response");
const knex = require("../config/connection/config");
const Curd = require("../utils/Crud/Curd");
const { currencyRate } = require("./clientModel");

const table = "project";

const deleteFilter = { is_deleted: 1 };
exports.list = async (postData) => {
  try {
    if (!postData?.orderBy) {
      postData.orderBy = "create_at";
    }

    if (!postData?.order) {
      postData.order = "DESC";
    }

    const baseQuery = knex("project")
      .innerJoin("payment", function () {
        this.on("project.id", "=", "payment.work_id").andOn(
          "payment.work_type",
          "=",
          1
        );
      })
      .where("project.is_deleted", 1)
      .andWhere("payment.is_deleted", 1)
      .andWhere((builder) => {
        searchBuild(builder, postData, ["project.project"]);
      })
      .andWhere((builder) => {
        dateFilter(builder, postData);
      })
      .groupBy("project.id");

    const list = await baseQuery
      .clone()
      .select(
        "project.*",
        knex.raw(
          'CONCAT("[", GROUP_CONCAT(JSON_OBJECT("id", payment.id, "amount", payment.amount, "currency", payment.currency, "description", payment.description, "payment_method", payment.payment_method, "type", payment.type, "status", payment.status, "work_id", payment.work_id, "created_at", payment.created_at)), "]") AS payments'
        )
      )
      .limit(postData.limit)
      .offset(postData.offset);

    const totalCount = await baseQuery.clone().select("project.id");

    const currencyRateCache = {};

    const listOfData = await Promise.all(
      (list || []).map(async (item) => {
        const payments = JSON.parse(item.payments || `[]`);
        let total_amount = 0;

        for (const payment of payments) {
          const currency = payment?.currency;

          // Check if the currency rate is already in the cache
          let rate;
          if (currencyRateCache[currency]) {
            rate = currencyRateCache[currency]; // Use the cached value
          } else {
            rate = await currencyRate(currency); // Fetch and cache the value
            currencyRateCache[currency] = rate;
          }

          const amount = payment?.amount;
          total_amount += amount * rate;
        }

        item.payments = payments;
        item.total_amount = total_amount;
        return item;
      })
    );

    const total = (totalCount || []).length;

    const pagination = {
      limit: postData.limit,
      offset: postData.offset,
      total,
    };

    return new Response(200, "T", { list: listOfData, pagination }).custom(
      `${(table || "").toLocaleUpperCase()} List`
    );
  } catch (error) {
    return new Response(500, "F").custom(error.message);
  }
};

function formDataMap(formData) {
  const result = [];

  // Get the first key dynamically to determine the entry count
  const firstKey = Object.keys(formData)[1];
  const entryCount = formData[firstKey].length;

  for (let i = 0; i < entryCount; i++) {
    const entry = {};

    // Loop through each key and populate the entry object
    Object.keys(formData).forEach((key) => {
      entry[key] = formData[key][i];
    });

    result.push(entry); // Add the entry to the result array
  }

  return result;
}

// Save or update a client
exports.save = async (postData) => {
  const { id } = postData;
  const fileWithPublic = postData?.file?.path;
  let file = (fileWithPublic || "").replace(/^public[\\/]/, "");

  try {
    if (id) {
      const work_data = {
        client_id: postData?.client_id,
        project: postData?.project,
        description: postData?.description,
        status: postData?.status,
        deadline: postData?.deadline,
        file,
      };
      const updateObj = await new Curd(table, deleteFilter, work_data).update({
        id,
      });
      if (updateObj?.success) {
        const deleteRes = (postData?.deleteArray || []).map(async (pay_id) => {
          return await new Curd("payment").delete({
            id: pay_id,
          });
        });
        const mapData = formDataMap(postData?.payments);
        const paymentRes = (mapData || []).map(async (payment) => {
          const pay_id = payment?.id;
          if (pay_id) {
            return await new Curd("payment", { is_deleted: 1 }, payment).update(
              {
                id: pay_id,
              }
            );
          } else {
            payment.work_id = id;
            payment.work_type = 1;
            delete payment.created_at;
            return await new Curd(
              "payment",
              { is_deleted: 1 },
              payment
            ).create();
          }
        });

        const res = await Promise.all(paymentRes);
        return (res || [])[0];
      }
      return updateObj;
    } else {
      const work_data = {
        client_id: postData?.client_id,
        project: postData?.project,
        description: postData?.description,
        status: postData?.status,
        deadline: postData?.deadline,
        file,
      };

      const project = await new Curd(table, deleteFilter, work_data).create();
      const workId = project?.data?.id;

      if (project && postData?.payments) {
        let payment = [];
        const mapData = formDataMap(postData?.payments);
        if (mapData) {
          payment = (mapData || []).map(async (item) => {
            item.description = item.payDescription;
            item.work_id = workId;
            item.work_type = 1;
            delete item.payDescription;
            return await new Curd("payment", deleteFilter, item).create();
          });
        }

        if (payment) {
          return payment[0];
        }
      }
      return project;
    }
  } catch (error) {
    return new Response(500, "F").custom(error.message);
  }
};

// Soft delete a client
exports.delete = async (id) => {
  try {
    return await new Curd(table, deleteFilter, postData).delete({ id });
  } catch (error) {
    return new Response(500, "F").custom(error.message);
  }
};

// Get client by ID
exports.getById = async (id) => {
  try {
    return await new Curd(table, deleteFilter, postData).get({ id });
  } catch (error) {
    return new Response(500, "F").custom(error.message);
  }
};

function searchBuild(_this, postData, searchOn) {
  if (postData.searchParam) {
    (searchOn || []).map((item, index) => {
      if (index == 0) {
        _this.where(item, "like", `%${postData.searchParam}%`);
      } else {
        _this.orWhere(item, "like", `%${postData.searchParam}%`);
      }
    });
  }
}

function dateFilter(_this, postData) {
  if (postData.startDate && postData.endDate) {
    _this.whereBetween("created_at", [
      postData.startDate + " 00:00:00",
      postData.endDate + " 23:59:59",
    ]);
  } else if (postData.startDate) {
    _this.where("created_at", "like", `%${postData.startDate}%`);
  }
}
