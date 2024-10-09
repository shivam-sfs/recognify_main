const knex = require("../../config/connection/config");
const Response = require("../../helper/static/Response");
const { authHandler } = require("../../helper/third-party/messages");

class Curd {
  /**
   *
   * @param {string} table select table name
   * @param {object} config additional config for filtering
   * @param {object} data contains search and filter parameters
   * @param {string} select select column
   */

  constructor(table, config, data, select) {
    this.table = table;
    this.config = config;
    this.data = data;
    this.select = select;
  }

  /**
   *
   * @returns {{
   *   status: number,
   *   success: boolean,
   *   info: string,
   *   data: {
   *     list: object[],
   *     pagination: {
   *       limit: number,
   *       offset: number,
   *       total: number
   *     }
   *   },
   *   message: string
   * }}
   */
  async list(findCondition, addJoin) {
    try {
      const self = this;

      // if (!self?.data?.orderBy) {
      //   self.data.orderBy = "create_at";
      // }

      // if (!self?.data?.order) {
      //   self.data.order = "DESC";
      // }
      // const filter = findCondition;
      // filter[`${this.table}.is_deleted`] = self?.config?.is_deleted;

      const baseQuery = knex(self.table)
        .where({})
        .andWhere((builder) => {
          self.searchBuild(builder);
        })
        .andWhere((builder) => {
          self.dateFilter(builder);
        });
      // .orderBy(self?.data?.orderBy, self?.data?.order);

      // Fetch the paginated result
      const listQuery = baseQuery.clone().select("*");
      // .orderBy(self?.data?.orderBy, self?.data?.order)

      if (self?.data?.limit) {
        listQuery.limit(+self?.data?.limit).offset(+self?.data?.offset);
      }
      const list = await listQuery;

      if (!list) {
        return new Response(500, "F").custom(
          authHandler(`${(self.table || "").toLocaleUpperCase()}_LIST_WRONG`)
        );
      }

      // Fetch the total result count (without pagination)
      const totalCount = await knex
        .from(baseQuery.as("countQuery"))
        .count({ total: "*" })
        .first();

      const total = totalCount.total;

      // pagination object
      const pagination = {
        limit: self?.data?.limit,
        offset: self?.data?.offset,
        total,
      };

      return new Response(200, "T", { list, pagination }).custom(
        `${(self.table || "").toLocaleUpperCase()} List`
      );
    } catch (error) {
      console.log(error);
      return new Response(500, "F").custom(error.message);
    }
  }

  /**
   *
   * @param {object} findCondition condition where data not insert
   * @returns {{
   *   status: number,
   *   success: boolean,
   *   info: string,
   *   data: string,
   *   message: string
   * }}
   */
  async get(findCondition) {
    try {
      const data = await knex(this.table)
        .select(this.select || "*")
        .where({ ...findCondition, is_deleted: this?.config?.is_deleted })
        .first();

      if (!data) {
        return new Response(404, "F").custom(
          authHandler(`${(this.table || "").toLocaleUpperCase()}_NOT_EXISTS`)
        );
      }

      return new Response(200, "T", data).custom(
        authHandler(`${(this.table || "").toLocaleUpperCase()}_GET`)
      );
    } catch (error) {
      return new Response(500, "F").custom(error.message);
    }
  }

  async getCount(findCondition, as, count, not) {
    try {
      if (!as) {
        throw new Error("Alias is required");
      }
      let query = knex(this.table)
        .count(`${count || "*"} as ${as}`)
        .where({ ...findCondition, is_deleted: this?.config?.is_deleted });

      if (not && Object.keys(not).length > 0) {
        Object.keys(not).forEach((key) => {
          query = query.whereNotIn(key, not[key]);
        });
      }

      const data = await query.first();

      if (!data) {
        return new Response(404, "F").custom(
          authHandler(`${(this.table || "").toLocaleUpperCase()}_NOT_EXISTS`)
        );
      }

      return new Response(200, "T", data).custom(
        authHandler(`${(this.table || "").toLocaleUpperCase()}_GET`)
      );
    } catch (error) {
      // console.log(error);
      return new Response(500, "F").custom(error.message);
    }
  }

  async getSum(findCondition, as, sum) {
    try {
      if (!as) throw new Error("Alias is required");
      if (!sum) throw new Error("Sum column is required");

      const data = await knex(this.table)
        .sum(`${sum} as ${as}`)
        .where({ ...findCondition, is_deleted: this?.config?.is_deleted })
        .first();

      if (!data) {
        return new Response(404, "F").custom(
          authHandler(`${(this.table || "").toLocaleUpperCase()}_NOT_EXISTS`)
        );
      }

      return new Response(200, "T", data).custom(
        authHandler(`${(this.table || "").toLocaleUpperCase()}_GET`)
      );
    } catch (error) {
      return new Response(500, "F").custom(error.message);
    }
  }

  /**
   *
   * @param {object} data create data
   * @param {object} findCondition condition where data not insert
   * @returns {{
   *   status: number,
   *   success: boolean,
   *   info: string,
   *   message: string
   * }}
   */

  async create(findCondition) {
    try {
      // if condition obj is exist then find out any matching data
      if (findCondition) {
        const find = await knex(this.table)
          .where({ ...findCondition, is_deleted: this?.config?.is_deleted })
          .first();

        if (find) {
          return new Response(400, "F").custom(
            authHandler(
              `DUPLICATE_${(
                Object.keys(findCondition)[0] || ""
              ).toLocaleUpperCase()}`
            )
          );
        }
      }
      // insert data in table
      const result = await knex(this.table).insert(this.data);
      console.log(result);

      // response according to the insert result
      return new Response(
        result ? 200 : 500,
        result ? "T" : "F",
        result ? { id: result[0] } : ""
      ).custom(
        authHandler(
          result
            ? `${(this.table || "").toLocaleUpperCase()}_ADDED`
            : `${(this.table || "").toLocaleUpperCase()}_FAILED`
        )
      );
    } catch (error) {
      return new Response(500, "F").custom(error.message);
    }
  }

  /**
   * @param {object} data updated data
   * @param {object} findCondition where data update
   * @returns {{
   *   status: number,
   *   success: boolean,
   *   info: string,
   *   message: string
   * }}
   */

  async update(findCondition) {
    try {
      // if findCondition is empty then return error
      if (!findCondition) {
        throw new Error("findCondition is required");
      }
      const find = await knex(this.table)
        .where({ ...findCondition, is_deleted: this?.config?.is_deleted })
        .first();

      if (!find) {
        return new Response(400, "F").custom(
          authHandler(`${(this.table || "").toLocaleUpperCase()}_NOT_EXISTS`)
        );
      }

      const result = await knex(this.table)
        .update(this.data)
        .where({ ...findCondition, is_deleted: this?.config?.is_deleted });
      if (result) {
        return new Response(result ? 200 : 500, result ? "T" : "F").custom(
          authHandler(
            result
              ? `${(this.table || "").toLocaleUpperCase()}_UPDATED`
              : `${(this.table || "").toLocaleUpperCase()}_UPDATED_FAILED`
          )
        );
      }
    } catch (error) {
      return new Response(500, "F").custom(error.message);
    }
  }

  /**
   * @param {*} findCondition data delete condition
   * @returns {{
   *   status: number,
   *   success: boolean,
   *   info: string,
   *   message: string
   * }}
   */
  async delete(findCondition) {
    try {
      // update is_deleted =  0
      const deletedRowsCount = await knex(this.table)
        .update({ is_deleted: 0 })
        .where(findCondition);

      // response according to the delete result
      if (deletedRowsCount > 0) {
        return new Response(200, "T").custom(
          authHandler(`${(this.table || "").toLocaleUpperCase()}_DELETED`)
        );
      } else {
        return new Response(400, "F").custom(
          authHandler(`FAILED_DELETE_${(this.table || "").toLocaleUpperCase()}`)
        );
      }
    } catch (error) {
      return new Response(500, "F").custom(error.message);
    }
  }

  /**
   * Build search query conditions
   * @param {*} _this instance on knex function
   */

  searchBuild(_this) {
    if (this?.data?.searchParam) {
      (this?.config?.searchOn || []).map((item, index) => {
        if (index == 0) {
          _this.where(item, "like", `%${this?.data?.searchParam}%`);
        } else {
          _this.orWhere(item, "like", `%${this?.data?.searchParam}%`);
        }
      });
    }
  }

  /**
   * Build date filter conditions
   * @param {*} _this instance on knex function
   */

  dateFilter(_this) {
    if (this?.data?.startDate && this?.data?.endDate) {
      _this.whereBetween("created_at", [
        this?.data?.startDate + " 00:00:00",
        this?.data?.endDate + " 23:59:59",
      ]);
    } else if (this?.data?.startDate) {
      _this.where("created_at", "like", `%${this?.data?.startDate}%`);
    }
  }
}

module.exports = Curd;
