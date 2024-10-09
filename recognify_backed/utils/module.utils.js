function DateFilter(queryBuilder, value, key = "created_at") {
  if (value.startDate && value.endDate) {
    queryBuilder.whereBetween(key, [
      value.startDate + " 00:00:00",
      value.endDate + " 23:59:59",
    ]);
  } else if (value.startDate) {
    queryBuilder.where(key, "like", `%${value.startDate}%`);
  }
}

function SearchFilter(queryBuilder, list = [], value) {
  if (value.searchParam) {
    list.map((item, index) => {
      if (index == 0) {
        queryBuilder.where(item, "like", `%${value.searchParam}%`);
      } else {
        queryBuilder.orWhere(item, "like", `%${value.searchParam}%`);
      }
    });
  }
}

function mergeIfNullOrUndefinedOrEmpty(obj1, obj2) {
  for (const key in obj1) {
    if (
      obj1[key] === undefined ||
      (obj1[key] === null && obj2[key] !== undefined && obj2[key] !== "")
    ) {
      obj1[key] = obj2[key];
    }
  }
  return obj1;
}

module.exports = { DateFilter, SearchFilter, mergeIfNullOrUndefinedOrEmpty };
