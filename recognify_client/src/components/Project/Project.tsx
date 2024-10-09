import react, { useEffect, useState } from "react";
import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import Filter, { FILTER, PROPERTY_FOR, PROPERTY_TYPE } from "../Utils/Filter";
import CustomTable, { ActionButtons, DELETE } from "../Utils/CustomTable";
import Image from "next/image";
import Pagination from "../Utils/Pagination";
import React from "react";
import {
  INIT_FILTER,
  PAGE_TYPE_ADD,
  PAGE_TYPE_EDIT,
  WORK_STATUS_TYPE_DATA,
} from "../Utils/constants";
import TableHeader, {
  FIRST_BUTTON,
  SECOND_BUTTON,
} from "../Utils/CustomTable/TableHeader";
import ActionFeature from "@/Api/ActionFeature";
import ActionScreen from "./ActionScreen";
// import StatusChange from "./StatusChange";

const order_by_option = ["name", "email", "message", "type", "status"];

const Works = () => {
  // init
  const path = "project";

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
      value: "project Id",
      key: "id",
    },
    {
      key: "project",
      value: "Project",
    },
    {
      value: "Description",
      key: "description",
    },
    {
      value: "Payment",
      component: ({ data }) => "$" + (data?.total_amount || 0).toFixed(2),
    },
    {
      value: "status ",
      component: ({ data }) => (
        <div>
          {
            WORK_STATUS_TYPE_DATA[
              data?.status as keyof typeof WORK_STATUS_TYPE_DATA
            ]
          }
        </div>
      ),
    },
    {
      value: "files",
      component: ({ data }) => (
        <div>
          {data?.file ? (
            <a target="_black" href={"/" + data?.file}>
              Files
            </a>
          ) : (
            ""
          )}
        </div>
      ),
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

export default Works;
