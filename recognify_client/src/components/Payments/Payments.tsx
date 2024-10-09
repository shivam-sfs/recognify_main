import react, { useEffect, useState } from "react";
import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import Filter, { FILTER, PROPERTY_FOR, PROPERTY_TYPE } from "../Utils/Filter";
import CustomTable, { ActionButtons, DELETE } from "../Utils/CustomTable";
import Pagination from "../Utils/Pagination";
import React from "react";
import {
  INIT_FILTER,
  PAGE_TYPE_ADD,
  PAGE_TYPE_EDIT,
  PAYMENT_METHOD_TYPE_DATA,
  PAYMENT_STATUS_TYPE_DATA,
  PAYMENT_TYPE_DATA,
} from "../Utils/constants";
import TableHeader, {
  FIRST_BUTTON,
  SECOND_BUTTON,
} from "../Utils/CustomTable/TableHeader";
import ActionFeature from "@/Api/ActionFeature";
import ActionScreen from "./ActionScreen";
import { DDMMYYYY } from "../Utils/Formeter";
// import StatusChange from "./StatusChange";

const order_by_option = ["name", "email", "message", "type", "status"];

const Payments = () => {
  // init
  const path = "payments";

  // configure
  ActionFeature.path = path;

  // hooks
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.login.userToken?.token);
  const { recallApi } = useSelector((state: RootState) => state.recallApi);

  // status
  const [filter, setFilter] = useState(INIT_FILTER);
  const [fetchData, setFetchData] = useState({
    list: [],
    pagination: { total: 0 },
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [selected, setSelected] = useState<any>({});
  const [actionType, setActionType] = useState<string>("");

  // useEffects
  useEffect(() => {
    ActionFeature.get(currentPage, filter, setFetchData);
  }, [filter, token, dispatch, currentPage, recallApi]);

  // custom table components

  const TableCustomize: CustomTable[] = [
    {
      value: "S.No",
      index: true,
    },
    {
      value: "Payment Id",
      key: "id",
    },
    {
      key: "work_id",
      value: "Work id",
    },
    {
      value: "Payment",
      key: "amount",
    },
    {
      value: "Currency",
      key: "currency",
    },
    {
      value: "type",
      component: ({ data }) => (
        <div className={data?.type == "1" ? "green" : "red"}>
          {PAYMENT_TYPE_DATA[data?.type as keyof typeof PAYMENT_TYPE_DATA]}
        </div>
      ),
    },
    {
      value: "method",
      component: ({ data }) => (
        <div>
          {
            PAYMENT_METHOD_TYPE_DATA[
              data?.payment_method as keyof typeof PAYMENT_METHOD_TYPE_DATA
            ]
          }
        </div>
      ),
    },
    {
      value: "message",
      key: "description",
    },
    {
      value: "status",
      component: ({ data }) => (
        <div>
          {
            PAYMENT_STATUS_TYPE_DATA[
              data?.status as keyof typeof PAYMENT_STATUS_TYPE_DATA
            ]
          }
        </div>
      ),
    },
    {
      value: "Time",
      component: ({ data }) => <>{DDMMYYYY(data.created_at)}</>,
    },
    {
      value: "Action",
      component: ({ data }) => (
        <>
          <ActionButtons
            id={data.id}
            setEdit={setActionType}
            data={data}
            setSelected={setSelected}
            disable={[DELETE]}
          />
        </>
      ),
    },
  ];

  return (
    <>
      {(actionType === PAGE_TYPE_ADD || actionType === PAGE_TYPE_EDIT) && (
        <ActionScreen
          id={selected.id || 0}
          isActive={
            actionType === PAGE_TYPE_ADD || actionType === PAGE_TYPE_EDIT
          }
          onClose={setActionType}
          data={{ ...selected, id: selected.id }}
          type={actionType == PAGE_TYPE_ADD ? PAGE_TYPE_ADD : PAGE_TYPE_EDIT}
          urls={actionType == PAGE_TYPE_ADD ? `${path}/add` : `${path}/update`}
          path={path}
        />
      )}
      <div className="card bg-glass">
        <div className="card-datatable ">
          <div className="dataTables_wrapper dt-bootstrap5">
            <TableHeader
              title={`${path}`}
              onAddClick={() => setActionType(PAGE_TYPE_ADD)}
              onExportClick={() => {
                ActionFeature.download();
              }}
              disable={[FIRST_BUTTON, SECOND_BUTTON]}
              recall={() => {
                setFilter({ ...INIT_FILTER });
              }}
            />
            <Filter
              filter={filter}
              setFilter={setFilter}
              orderBy={order_by_option}
              disable={[PROPERTY_FOR, PROPERTY_TYPE, FILTER]}
            />

            <CustomTable
              tableCustomize={TableCustomize}
              data={(fetchData && fetchData.list) || []}
              StartIndex={+filter.limit * (+currentPage - 1) + 1 || 1}
            />

            <Pagination
              currentPage={currentPage}
              limit={filter.limit}
              setCurrentPage={setCurrentPage}
              total={fetchData.pagination?.total || 0}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Payments;
