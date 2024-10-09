const Response = require("../helper/static/Response");
const knex = require("../config/connection/config");
const Curd = require("../utils/Crud/Curd");

const axios = require("axios");

const API_KEY = process.env.ExchangeRate_API; // Add your ExchangeRate-API key

const table = "client";

// Get all clients (with filtering by is_deleted)
exports.list = async (postData) => {
  try {
    const list_of_Client = await new Curd(
      table,
      { is_deleted: 1, searchOn: ["first_name", "last_name", "email"] },
      postData
    ).list();

    const total = {
      due_payment: 0,
      total_payment: 0,
    };

    const resPromise = (list_of_Client.data.list || []).map(async (item) => {
      const total_project = await new Curd("project", {
        is_deleted: 1,
      }).getCount({ client_id: item.id }, "total_project");

      const ongoing_project = await new Curd("project", {
        is_deleted: 1,
      }).getCount({ client_id: item.id }, "ongoing_project", "*", {
        status: [5, 6],
      });

      const list_of_Work = await new Curd("project", {
        is_deleted: 1,
      }).list({ client_id: item.id });

      const paymentPromise = async (list_of_Work, filter = {}) => {
        let totalSumInUSD = 0;
        const workList = Array.isArray(list_of_Work?.data?.list)
          ? list_of_Work.data.list
          : [];
        for (const item of workList) {
          const payments = await knex("payment")
            .select("amount", "currency")
            .where({
              is_deleted: 1,
              work_id: item.id,
              work_type: 1,
              ...filter,
            });
          for (const payment of payments) {
            const { amount, currency } = payment;
            const conversionRate = await this.currencyRate(currency);
            totalSumInUSD += amount * conversionRate;
          }
        }

        return totalSumInUSD;
      };

      const total_amount = await paymentPromise(list_of_Work, { type: 1 });
      const due_amount = await paymentPromise(list_of_Work, {
        status: 2,
        type: 1,
      });

      return {
        ...item,
        total_project: total_project?.data?.total_project || 0,
        ongoing_project: ongoing_project?.data?.ongoing_project || 0,
        total_amount: total_amount || 0,
        due_amount: due_amount || 0,
        ...total,
      };
    });

    const resData = await Promise.all(resPromise);
    return new Response(200, "T", {
      list: resData,
      pagination: list_of_Client?.data?.pagination,
    }).custom(`${(table || "").toLocaleUpperCase()} List`);
  } catch (error) {
    return new Response(500, "F").custom(error.message);
  }
};

// Save or update a client
exports.save = async (postData) => {
  const { id, email } = postData;

  try {
    if (id) {
      return await new Curd(table, { is_deleted: 1 }, postData).update({ id });
    } else {
      return await new Curd(table, { is_deleted: 1 }, postData).create({
        email,
      });
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

// Function to fetch and store the rate in the database (only if not already fetched for today)
exports.currencyRate = async function (currency) {
  if (currency == "USD") return 1;
  const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

  // Check if the rate for this currency is already stored for today
  const existingRate = await knex("currency_rates")
    .where({ currency_code: currency, rate_date: today })
    .first();

  if (existingRate) {
    return existingRate.rate_to_usd;
  } else {
    // Fetch the conversion rate from ExchangeRate-API
    try {
      const response = await axios.get(
        `https://v6.exchangerate-api.com/v6/${API_KEY}/pair/${currency}/USD`
      );
      const conversionRate = response.data.conversion_rate;

      // Store the fetched rate in the database
      await knex("currency_rates").insert({
        currency_code: currency,
        rate_to_usd: conversionRate,
        rate_date: today,
      });

      return conversionRate;
    } catch (error) {
      throw new Error("Failed to fetch conversion rate");
    }
  }
};
