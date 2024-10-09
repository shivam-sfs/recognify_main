import react, { useEffect, useState } from "react";
import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import Filter, { FILTER, PROPERTY_FOR, PROPERTY_TYPE } from "../Utils/Filter";
import { DDMMYYYY } from "../Utils/Formeter";
import CustomTable, { ActionButtons, DELETE } from "../Utils/CustomTable";
import Pagination from "../Utils/Pagination";
import React from "react";
import { INIT_FILTER, PAGE_TYPE_ADD, PAGE_TYPE_EDIT, PAYMENT_STATUS_TYPE_DATA } from "../Utils/constants";
import TableHeader, { FIRST_BUTTON } from "../Utils/CustomTable/TableHeader";
import ActionFeature from "@/Api/ActionFeature";
import { Accordion } from "react-bootstrap";
import { useRouter } from "next/navigation";
import ActionScreen from "./ActionScreen";
import ActionScreenWork from "./ActionScreenWork";
import { GrUserWorker } from "react-icons/gr";
import StatusChange from "./StatusChange";
import { FaTrash } from "react-icons/fa";
import { setLoader } from "@/redux/reducer/loader";
import ApiFeature from "@/Api/ApiFeature";
import { setRecallApi } from "@/redux/reducer/RecallApi";
import { confirmAlert } from "react-confirm-alert";
// // import StatusChange from "./StatusChange";

const order_by_option = [
  "name",
  "city",
  "number",
  "zip_code",
  "property",
  "ads",
];

const Interaction = () => {
  //   // init
  const path = "partners";

  //   // configure
  ActionFeature.path = path;

  //   // hooks
  const dispatch = useDispatch();
  const router = useRouter();
  const token = useSelector((state: RootState) => state.login.userToken?.token);
  const { recallApi } = useSelector((state: RootState) => state.recallApi);

  // status
  const [filter, setFilter] = useState(INIT_FILTER);
  const [fetchData, setFetchData] = useState({
    list: [{ df: "ff", interaction: [{ gjf: "dhsfhj" }] }],
    pagination: { total: 0 },
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [actionType, setActionType] = useState<string>("");
  const [workActionType, setWorkActionType] = useState<string>("");
  const [selectedWork, setSelectedWork] = useState<any>({});
  const [selected, setSelected] = useState<any>({});

  //   // useEffects
  useEffect(() => {
    ActionFeature.get(currentPage, filter, setFetchData);
  }, [filter, token, dispatch, currentPage, recallApi]);

  //   // custom table components

  async function Delete(work_id: any  ) {
    try {
      dispatch(setLoader(true));
      const res: any = await ApiFeature.delete(`work/delete`, work_id);
      if (res.status === 200) {
        dispatch(setLoader(false));
        dispatch(setRecallApi(true));
      }
    } catch (e) {
      dispatch(setRecallApi(true));
      dispatch(setRecallApi(true));
      dispatch(setLoader(false));
    } finally {
      dispatch(setLoader(false));
    }
  }

  const TableCustomize: CustomTable[] = [
    {
      value: "S.No",
      index: true,
    },
    {
      value: "work",
      key: "project"
    },
    {
      value: "description",
      key: "description",
    },
    {
      key: "amount",
      value: "amount",
    },
    {
      key: "currency",
      value: "currency",
    },
    {
      value: "Payment status",
      component: ({ data }) => (
        <div className={data?.pay_status != "1" ? "green" : "red"}>
          {
            PAYMENT_STATUS_TYPE_DATA[
              data?.pay_status as keyof typeof PAYMENT_STATUS_TYPE_DATA
            ]
          }
        </div>
      ),
    },
    {
      value: "status",
      component: ({ data }) => <StatusChange data={data} token={token} />,
    },
    {
      value: "deadline",
      component: ({ data }) => <>{DDMMYYYY(data.deadline)}</>,
    },
    {
      value: "action",
      component: ({ data }) => (
        <>
          <ActionButtons
            id={data.work_id}
            setEdit={setWorkActionType}
            data={data}
            setSelected={setSelectedWork}
            disable={[DELETE]}
          />
          &nbsp;
          <button
            onClick={() => {
              confirmAlert({
                title: "Delete",
                message: "are you sure you want to delete.",
                buttons: [
                  {
                    label: "Yes",
                    onClick: async () => {
                      Delete(data.work_id);
                    },
                  },
                  {
                    label: "No",
                  },
                ],
              });
            }}
            className="btn btn-danger"
            data-tooltip="Delete"
          >
            <FaTrash size={16} />
          </button>
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
      {(workActionType === PAGE_TYPE_ADD ||
        workActionType === PAGE_TYPE_EDIT) && (
        <ActionScreenWork
          id={selectedWork.partner_id || 0}
          isActive={
            workActionType === PAGE_TYPE_ADD ||
            workActionType === PAGE_TYPE_EDIT
          }
          onClose={setWorkActionType}
          data={{ ...selectedWork, id: selectedWork.partner_id }}
          type={
            workActionType == PAGE_TYPE_ADD ? PAGE_TYPE_ADD : PAGE_TYPE_EDIT
          }
          urls={workActionType == PAGE_TYPE_ADD ? `partners_work/add` : `partners_work/update`}
          path={"work"}
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
              AddButtonText="New Profile"
              disable={[FIRST_BUTTON]}
              recall={()=>{setFilter(INIT_FILTER)}}
            />
            <Filter
              filter={filter}
              setFilter={setFilter}
              disable={[PROPERTY_FOR, PROPERTY_TYPE,FILTER]}
              orderBy={order_by_option}
            />

            <div className="bg-light mx-2 my-3 py-1 pt-2">
              <div className="row w-100 mx-3 justify-content-center">
                <div
                  className="col"
                  style={{
                    maxWidth: "150px",
                    textTransform: "capitalize",
                  }}
                >
                  <b>Name</b>
                </div>
                <div
                  className="col"
                  style={{
                    maxWidth: "150px",
                    textTransform: "capitalize",
                  }}
                >
                  <b>Gender</b>
                </div>
                <div className="col text-capitalize">
                  <b>Email</b>
                </div>
                <div className="col text-capitalize">
                  <b>number</b>
                </div>
                <div className="col text-capitalize text-truncate me-5">
                  <b>Skills</b>
                </div>
              </div>
              {((fetchData && fetchData.list) || []).map(
                (item: any, index: number) => {
                  let AccordionData = [...(item.work || [])];
                  return (
                    <>
                      <Accordion
                        defaultActiveKey="1"
                        className="initialism mt-3 mx-3 my-1"
                      >
                        <Accordion.Item eventKey="0" >
                          <Accordion.Header>
                            <div className="row w-100">
                              <div
                                className="col"
                                style={{
                                  maxWidth: "150px",
                                  textTransform: "capitalize",
                                }}
                              >
                                <b>
                                  {item?.first_name + " " + item?.last_name}
                                </b>
                              </div>
                              <div
                                className="col"
                                style={{
                                  maxWidth: "150px",
                                  textTransform: "capitalize",
                                }}
                              >
                                {item.gender}
                              </div>
                              <div className="col text-capitalize">
                                {item?.email || ""}
                              </div>
                              <div className="col text-capitalize">
                                {item?.number || ""}
                              </div>
                              <div className="col text-capitalize text-truncate me-5">
                                {item?.skills?.replace(",", ", ") || ""}
                              </div>
                            </div>
                          </Accordion.Header>
                          <Accordion.Body>
                            <div className="d-flex justify-content-end">
                              <div></div>
                              <div>
                                <button
                                  onClick={() => {
                                    setWorkActionType(PAGE_TYPE_ADD);
                                    setSelectedWork(item);
                                  }}
                                  className="btn bg-primary bg-gradient"
                                  data-tooltip="Add Work"
                                >
                                  <GrUserWorker size="20" color="#fff" />
                                </button>
                                &nbsp;
                                <ActionButtons
                                  data={item}
                                  setSelected={setSelected}
                                  id={item._id || 0}
                                  setEdit={setActionType}
                                />
                              </div>
                            </div>
                            <CustomTable
                              tableCustomize={TableCustomize}
                              data={AccordionData}
                              StartIndex={
                                +filter.limit * (+currentPage - 1) + 1 || 1
                              }
                            />
                          </Accordion.Body>
                        </Accordion.Item>
                      </Accordion>
                    </>
                  );
                }
              )}
            </div>
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

export default Interaction;
