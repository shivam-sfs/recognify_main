import {useEffect, useState} from "react";
import {FaSort, FaSearch, FaFilter} from "react-icons/fa";
import {debounce} from "../Throttle";
import {
  DEBOUNCE_THRESHOLD,
  FILTER_OPTION_TYPE_DATA,
  FILTER_OPTION_TYPE_KEY,
  LIST_ORDER_TYPE_DATA,
  LIST_ORDER_TYPE_KEYS,
  LIST_PROPERTY_FOR_DATA,
  LIST_PROPERTY_FOR_KEYS,
  LIST_PROPERTY_TYPE_DATA,
  LIST_PROPERTY_TYPE_KEYS,
  TABLE_ITEM_OPTION,
} from "../constants";

// filter option
let SHOW_ENTRIES = "SHOW_ENTRIES",
  START_DATE = "START_DATE",
  END_DATE = "END_DATE",
  SEARCH = "SEARCH",
  FILTER = "FILTER",
  SHORT_BY = "SHORT_BY",
  PROPERTY_TYPE = "PROPERTY_TYPE",
  PROPERTY_FOR = "PROPERTY_FOR";

// all des
export {
  SHOW_ENTRIES, START_DATE, END_DATE, SEARCH, FILTER, SHORT_BY, PROPERTY_TYPE
  , PROPERTY_FOR
};

const Index = (props: filter) => {
  const {filter, setFilter, disable = [], orderBy} = props;
  const [search, setSearch] = useState("");
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout>();

  // Handler for the input change event
  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {value} = event.target;
    setSearch(value);
    // Debounced version of handleInputChange
    debounce(
      () => {
        setFilter((pre: object) => ({
          ...pre,
          searchParam: value,
        }));
      },
      DEBOUNCE_THRESHOLD,
      timeoutId,
      setTimeoutId
    )();
  };

  const ORDER_BY = (orderBy || FILTER_OPTION_TYPE_KEY)

  return (
    <div className="row mt-2 ms-2 me-2 d-flex justify-content-sm-start">
      <div className="col-12 col-md-2 col-lg-3 mt-1 d-flex  justify-content-center  justify-content-md-start">
        {disable.indexOf(SHOW_ENTRIES) == -1 ? (
          <label>
            Show entries
            <div className="dataTables_length ">
              <select
                className="form-select"
                onChange={(e) =>
                  setFilter((pre: object) => ({
                    ...pre,
                    limit: e.target.value,
                  }))
                }
                defaultValue={filter.limit}
                aria-label="Default select example"
              >
                {TABLE_ITEM_OPTION.map((value, index) => (
                  <option
                    selected={filter.limit === value}
                    value={value}
                    key={index}
                  >
                    {value}
                  </option>
                ))}
              </select>
            </div>
          </label>
        ) : null}
      </div>
      <div className="col-12 pr-3 col-md-10 col-lg-9 mb-1 d-flex flex-wrap justify-content-center justify-content-md-end">
        {disable.indexOf(START_DATE) == -1 ? (
          <div className="dataTables_filter mb-1">
            <label>
              Start Date
              <input
                type="date"
                name="startDate"
                id="startDate"
                className="form-control"
                onChange={(e) =>
                  setFilter((pre: object) => ({
                    ...pre,
                    startDate: e.target.value,
                  }))
                }
              />
            </label>
          </div>
        ) : null}
        {disable.indexOf(END_DATE) == -1 ? (
          <div className="dataTables_filter mb-1">
            <label className="form-label">
              End Date
              <input
                type="date"
                className="form-control"
                onChange={(e) =>
                  setFilter((pre: object) => ({
                    ...pre,
                    endDate: e.target.value,
                  }))
                }
              />
            </label>
          </div>
        ) : null}
        {disable.indexOf(SEARCH) == -1 ? (
          <div className="dataTables_filter mb-1 ">
            <label>
              <FaSearch style={{marginRight: "5px"}} />
              Search
              <input
                type="search"
                onChange={onInputChange}
                value={search}
                placeholder="Search..."
                className="form-control"
              />
            </label>
          </div>
        ) : null}
        {disable.indexOf(PROPERTY_FOR) == -1 ? (
          <div className="dataTables_filter mb-1">
            <label>
              <FaSort style={{marginRight: "5px"}} />
              property for
              <select
                className="form-select "
                onChange={(e) =>
                  setFilter((pre: object) => ({
                    ...pre,
                    property_for: e.target.value,
                  }))
                }
                aria-label="Default select example"
              >
                <option value="">select</option>
                {LIST_PROPERTY_FOR_KEYS.map((value: string, index) => (
                  <option
                    value={
                      LIST_PROPERTY_FOR_DATA[
                      value as unknown as keyof typeof LIST_PROPERTY_FOR_DATA
                      ]
                    }
                    selected={
                      filter.property_for ===
                      LIST_PROPERTY_FOR_DATA[
                      value as keyof typeof LIST_PROPERTY_FOR_DATA
                      ]
                    }
                    key={index}
                  >
                    {value}
                  </option>
                ))}
              </select>
            </label>
          </div>
        ) : null}
        {disable.indexOf(PROPERTY_TYPE) == -1 ? (
          <div className="dataTables_filter mb-1">
            <label>
              <FaSort style={{marginRight: "5px"}} />
              property type
              <select
                className="form-select "
                onChange={(e) =>
                  setFilter((pre: object) => ({
                    ...pre,
                    property_type: e.target.value,
                  }))
                }
                aria-label="Default select example"
              >
                <option value="">select</option>
                {LIST_PROPERTY_TYPE_KEYS.map((value: string, index) => (
                  <option
                    value={
                      LIST_PROPERTY_TYPE_DATA[
                      value as unknown as keyof typeof LIST_PROPERTY_TYPE_DATA
                      ]
                    }
                    selected={
                      filter.property_type ===
                      LIST_PROPERTY_TYPE_DATA[
                      value as keyof typeof LIST_PROPERTY_TYPE_DATA
                      ]
                    }
                    key={index}
                  >
                    {value}
                  </option>
                ))}
              </select>
            </label>
          </div>
        ) : null}
        {disable.indexOf(FILTER) == -1 ? (
          <div className="dataTables_filter mb-1">
            <label>
              <FaFilter style={{marginRight: "5px"}} /> Filter
              <select
                className="form-select "
                onChange={(e) =>
                  setFilter((pre: object) => ({
                    ...pre,
                    orderBy: e.target.value,
                  }))
                }
                aria-label="Default select example"
                defaultValue={"createdAt"}
              >
                {ORDER_BY.map((value, index) => (
                  <option
                    value={
                      ORDER_BY[value as keyof typeof ORDER_BY] as string | number | readonly string[] | undefined
                    }
                    selected={
                      filter.orderBy ===
                      ORDER_BY[
                      value as keyof typeof ORDER_BY
                      ]
                    }
                    key={index}
                  >
                    {value?.replace("_", " ")?.toUpperCase()}
                  </option>
                ))}
                <option
                  value={
                    "is_active"
                  }
                  selected={
                    filter.orderBy ===
                    'is_active'
                  }
                >
                  ACTIVE
                </option>
                <option
                  value={
                    "created_at"
                  }
                  selected={
                    filter.orderBy ===
                    'created_at'
                  }
                >
                  TIME
                </option>
              </select>
            </label>
          </div>
        ) : null}
        {disable.indexOf(SHORT_BY) == -1 ? (
          <div className="dataTables_filter mb-1">
            <label>
              <FaSort style={{marginRight: "5px"}} />
              Sort by
              <select
                className="form-select "
                onChange={(e) =>
                  setFilter((pre: object) => ({
                    ...pre,
                    order: e.target.value,
                  }))
                }
                aria-label="Default select example"
              >
                {LIST_ORDER_TYPE_KEYS.map((value: string, index) => (
                  <option
                    value={
                      LIST_ORDER_TYPE_DATA[
                      value as unknown as keyof typeof LIST_ORDER_TYPE_DATA
                      ]
                    }
                    selected={
                      filter.order ===
                      LIST_ORDER_TYPE_DATA[
                      value as keyof typeof LIST_ORDER_TYPE_DATA
                      ]
                    }
                    key={index}
                  >
                    {value}
                  </option>
                ))}
              </select>
            </label>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Index;
