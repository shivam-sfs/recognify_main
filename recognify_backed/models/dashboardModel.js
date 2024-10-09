const knex = require("../config/connection/config");
const Response = require("../helper/static/Response");

function getAllMonthStartDates(year) {
  if (year) {
    // Create an array of first dates of each month
    const monthStartDates = Array.from({ length: 12 }, (_, index) => {
      const monthStartDate = new Date(year, index + 1, 1);
      return monthStartDate.toISOString().split("T")[0];
    });

    return monthStartDates;
  }

  // Handle invalid year
  return null;
}

function getAllDatesInMonth(year, month) {
  if (year && month) {
    // Calculate the last day of the month
    const lastDay = new Date(year, month, 0).getDate();

    // Create an array of all dates in the month
    const allDatesInMonth = Array.from({ length: lastDay }, (_, index) => {
      const date = new Date(year, month - 1, index + 2);
      return date.toISOString().split("T")[0];
    });

    return allDatesInMonth;
  }

  // Handle invalid year or month
  return null;
}

function getLevels({ year, month }) {
  if (year && month) {
    return getAllDatesInMonth(year, month);
  } else if (year) {
    return getAllMonthStartDates(year);
  }
}

function getStartAndEndDate(payload) {
  const { year, month } = payload;

  if (year && month) {
    // Calculate start date of the month
    const startDate = new Date(year, month - 1, 1);
    const formattedStartDate = startDate.toISOString().split("T")[0];

    // Calculate end date of the month
    const endDate = new Date(year, month, 0);
    const formattedEndDate = endDate.toISOString().split("T")[0];

    return {
      chart_data_type: "DAY",
      startDate: formattedStartDate,
      endDate: formattedEndDate,
    };
  } else if (year) {
    // Calculate start date of the year
    const startDate = new Date(year, 0, 1);
    const formattedStartDate = startDate.toISOString().split("T")[0];

    // Calculate end date of the year
    const endDate = new Date(year, 12, 0);
    const formattedEndDate = endDate.toISOString().split("T")[0];

    return {
      chart_data_type: "MONTH",
      startDate: formattedStartDate,
      endDate: formattedEndDate,
    };
  }

  // Handle invalid payload or missing data
  return null;
}

exports.list = async (postData) => {
  const year = postData.year || new Date().getFullYear();
  const month = postData.month || "";
  const { chart_data_type, startDate, endDate } = getStartAndEndDate({
    year,
    month,
  });
  console.log(year, month);

  try {
    const partner_total = await knex
      .select(knex.raw("COUNT(*) AS total_partner"))
      .from("partners")
      .where("is_deleted", 1)
      .where("is_active", 1)
      .first();

    const join_total = await knex
      .select(knex.raw("COUNT(*) AS total_join"))
      .from("leads")
      .where("is_deleted", 1)
      .where("type", 1)
      .where("is_active", 1)
      .first();

    const hire_total = await knex
      .select(knex.raw("COUNT(*) AS total_hire"))
      .from("leads")
      .where("is_deleted", 1)
      .where("type", 2)
      .where("is_active", 1)
      .first();

    // const work_total_in_init = await knex
    //   .select(knex.raw("COUNT(*) AS work_total_in_init"))
    //   .from("works")
    //   .where("is_deleted", 1)
    //   .where("is_active", 1)
    //   .where("status", "Initial Stage")
    //   .first();

    // const work_total_in_progress = await knex
    //   .select(knex.raw("COUNT(*) AS work_total_in_progress"))
    //   .from("works")
    //   .where("is_deleted", 1)
    //   .where("is_active", 1)
    //   .where("status", "In Progress")
    //   .first();

    // const work_total_in_completed = await knex
    //   .select(knex.raw("COUNT(*) AS work_total_in_completed"))
    //   .from("works")
    //   .where("is_deleted", 1)
    //   .where("is_active", 1)
    //   .where("status", "Completed")
    //   .first();

    const lead_list = await knex("leads")
      .select(knex.raw(`created_at AS label`))
      .select(knex.raw("COUNT(*) AS total_Lead"))
      .where("is_deleted", 1)
      .groupBy(knex.raw(`EXTRACT(DAY FROM created_at)`))
      .orderBy("created_at");

    const labels = (lead_list || []).map(
      (label, index) => new Date(label?.label).toISOString().split("T")[0]
    );
    const leads_data = (lead_list || []).map(
      (label, index) => label?.total_Lead || 0
    );

    return new Response(200, "T", {
      ...partner_total,
      ...join_total,
      ...hire_total,
      // ...work_total_in_init,
      // ...work_total_in_progress,
      // ...work_total_in_completed,
      chart: {
        labels: labels,
        leads: leads_data,
      },
    }).custom("User List");
  } catch (error) {
    console.log(error);
    return new Response(500, "F").custom(error.message);
  }
};
