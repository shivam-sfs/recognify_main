import react, { useEffect, useState } from "react";
import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import Filter, { FILTER, PROPERTY_FOR, PROPERTY_TYPE } from "../Utils/Filter";
import CustomTable, { ActionButtons, DELETE } from "../Utils/CustomTable";
import Image from "next/image";
import Pagination from "../Utils/Pagination";
import React from "react";
import { INIT_FILTER, PAGE_TYPE_ADD, PAGE_TYPE_EDIT } from "../Utils/constants";
import TableHeader, {
  FIRST_BUTTON,
  SECOND_BUTTON,
} from "../Utils/CustomTable/TableHeader";
import ActionFeature from "@/Api/ActionFeature";
import { UserName } from "../users/Users";
import ActionScreen from "./ActionScreen";
import ActionScreenWork from "../Project/ActionScreen";
import { GrUserWorker } from "react-icons/gr";
// import StatusChange from "./StatusChange";

const PAGE_TYPE_WORK = "PAGE_TYPE_WORK";

const order_by_option = ["name", "email", "message", "type", "status"];

const Clients = () => {
  // init
  const path = "client";

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
      value: "Full Name",
      component: ({ data }) => (
        <div className="d-flex px-2 py-1">
          <div className="text-left">
            <h6 className="text-left">{`${data.first_name || ""} ${
              data.last_name || ""
            }`}</h6>
            <p className="text-left text-xs text-secondary mb-0">{`${data.email}`}</p>
          </div>
        </div>
      ),
    },
    {
      key: "number",
      value: "Phone",
    },
    {
      key: "total_project",
      value: "project",
    },
    {
      value: "ongoing project",
      key: "ongoing_project",
    },
    {
      value: "Total Payment",
      component: ({ data }) => "$" + (data?.total_amount || 0).toFixed(2),
    },
    {
      value: "due Payment",
      component: ({ data }) => "$" + (data?.due_amount || 0).toFixed(2),
    },
    {
      value: "Action",
      component: ({ data }) => (
        <>
          <ActionButtons
            id={data.work_id}
            setEdit={setActionType}
            data={data}
            setSelected={setSelected}
            disable={[DELETE]}
          />
          &nbsp;
          <button
            onClick={() => {
              setSelected(data);
              setActionType(PAGE_TYPE_WORK);
            }}
            className="btn"
            data-tooltip="Edit"
          >
            <GrUserWorker size={16} />
          </button>
          &nbsp;
        </>
      ),
    },
  ];


  return (
    <>
      {actionType === PAGE_TYPE_WORK && (
        <ActionScreenWork
          id={0}
          isActive={actionType === PAGE_TYPE_WORK}
          onClose={setActionType}
          data={{ ...selected, client_id: selected.id }}
          type={PAGE_TYPE_WORK}
          urls={`project/add`}
          path={"Project"}
        />
      )}
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
              disable={[FIRST_BUTTON]}
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
              limit={filter?.limit}
              setCurrentPage={setCurrentPage}
              total={fetchData?.pagination?.total || 0}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Clients;
