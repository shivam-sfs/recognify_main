import react, { useEffect, useState } from "react";
import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import Filter, { PROPERTY_FOR, PROPERTY_TYPE } from "../Utils/Filter";
import { DDMMYYYY } from "../Utils/Formeter";
import CustomTable, { ActionButtons, ActionSwitch } from "../Utils/CustomTable";
import Image from "next/image";
import Pagination from "../Utils/Pagination";
import React from "react";
import {
  USER_ROLE_TYPE_DATA,
  INIT_FILTER,
  PAGE_TYPE_ADD,
  PAGE_TYPE_EDIT,
} from "../Utils/constants";
import TableHeader, {
  FIRST_BUTTON,
  SECOND_BUTTON,
} from "../Utils/CustomTable/TableHeader";
import ActionFeature from "@/Api/ActionFeature";
import ActionScreen from "./ActionScreen";
import { FaBuildingUser } from "react-icons/fa6";
import { useRouter } from "next/router";

const order_by_option = [
  "first_name",
  "last_name",
  "email",
  "role",
  "zip_code",
  "state",
  "city",
];

export const UserName: React.FC<any> = ({ data }) => (
  <div className="d-flex px-2 py-1">
    <div>
      <Image
        src={data.url || "/img/profile.png"}
        alt="user1"
        width={36}
        height={36}
        className="avatar avatar-sm me-3"
      />
    </div>
    <div className="text-left">
      <h6 className="text-left">{`${data.first_name || ""} ${
        data.last_name || ""
      }`}</h6>
      <p className="text-left text-xs text-secondary mb-0">{`${data.email}`}</p>
    </div>
  </div>
);

const Users = () => {
  // init
  const path = "user";

  // configure
  ActionFeature.path = path;

  // hooks
  const dispatch = useDispatch();
  const router = useRouter();
  const token = useSelector((state: RootState) => state.login.userToken?.token);
  const { recallApi } = useSelector((state: RootState) => state.recallApi);

  // status
  const [filter, setFilter] = useState(INIT_FILTER);
  const [userData, setUserData] = useState<userDataType>({
    list: [],
    pagination: {},
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [selected, setSelected] = useState<userType>({});
  const [actionType, setActionType] = useState<string>("");

  // useEffects
  useEffect(() => {
    ActionFeature.get(currentPage, filter, setUserData);
  }, [filter, token, dispatch, currentPage, recallApi]);

  // custom table components

  const TableCustomize: CustomTable[] = [
    {
      value: "S.No",
      index: true,
    },
    {
      value: "User",
      component: UserName,
    },
    {
      value: "Address",
      key: "address",
    },
    {
      key: "phone_number",
      value: "Phone Number",
    },

    {
      value: "Role",
      component: ({ data }) => {
        return <>{data.role} </>;
      },
    },
    {
      value: "Created At",
      component: ({ data }) => <>{DDMMYYYY(data.created_at)}</>,
    },
    {
      value: "Status",
      combine: ["is_active"],
      component: ({ data }) => <ActionSwitch data={data} />,
    },
    {
      value: "Action",
      combine: ["user_id"],
      component: ({ data }) => (
        <>
          <ActionButtons
            data={data}
            setSelected={setSelected}
            setEdit={setActionType}
            id={data._id}
          />
        </>
      ),
      className: "d-flex ",
    },
  ];

  return (
    <>
      {(actionType === PAGE_TYPE_ADD || actionType === PAGE_TYPE_EDIT) && (
        <ActionScreen
          id={selected.user_id || 0}
          isActive={
            actionType === PAGE_TYPE_ADD || actionType === PAGE_TYPE_EDIT
          }
          onClose={setActionType}
          data={{ ...selected, id: selected.user_id }}
          type={actionType == PAGE_TYPE_ADD ? PAGE_TYPE_ADD : PAGE_TYPE_EDIT}
          urls={
            actionType == PAGE_TYPE_ADD ? `${path}/signUp` : `${path}/update`
          }
          path={path}
        />
      )}
      <div className="card bg-glass" style={{ overflowX: "hidden" }}>
        <div className="card-datatable ">
          <div className="dataTables_wrapper dt-bootstrap5">
            <TableHeader
              title={`${path}`}
              onAddClick={() => setActionType(PAGE_TYPE_ADD)}
              onExportClick={() => {
                ActionFeature.download();
              }}
              disable={[FIRST_BUTTON]}
            />
            <Filter
              filter={filter}
              setFilter={setFilter}
              disable={[PROPERTY_TYPE, PROPERTY_FOR]}
              orderBy={order_by_option}
            />

            <CustomTable
              tableCustomize={TableCustomize}
              data={(userData && userData.list) || []}
              StartIndex={+filter.limit * (+currentPage - 1) + 1 || 1}
            />

            <Pagination
              currentPage={currentPage}
              limit={filter.limit}
              setCurrentPage={setCurrentPage}
              total={userData.pagination?.total || 0}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Users;
