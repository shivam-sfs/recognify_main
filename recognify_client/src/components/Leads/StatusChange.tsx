import { useEffect, useState } from "react";
import {
  LEADS_STATUS_TYPE_DATA,
  LEADS_STATUS_TYPE_KEY,
} from "../Utils/constants";
import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { setRecallApi } from "@/redux/reducer/RecallApi";
import { useRouter } from "next/router";
import axios from "axios";
import ShowToast, { errorMessage, error, success } from "../Utils/ShowToast";
import { removeToken } from "@/redux/reducer/login";

const StatusChange = ({ data }: any) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const token = useSelector(
    (state: RootState) => state?.login?.userToken?.token
  );
  const Base_url = process.env.NEXT_PUBLIC_BASE_URL || "";

  const [admin_status, setAdmin_status] = useState(data?.status || "");
  const recallApi = useSelector(
    (state: RootState) => state?.recallApi?.recallApi
  );

  return (
    <div className="dataTables_filter mb-1">
      <select
        className="form-select"
        onChange={(e) => {
          async function getCategoryData() {
            if (admin_status != data?.admin_status) {
              try {
                const FullPath = `${Base_url}/${"lead/update"}/${data.lead_id}`;
                console.log(FullPath);
                const res = await axios.put(
                  FullPath,
                  { ...data, status: e.target.value },
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                      Accept: "application/json",
                    },
                  }
                );
                if (res?.data?.success) {
                  dispatch(setRecallApi(true));
                  ShowToast(success, res?.data?.message);
                } else if (res.data.status === 401) {
                  dispatch(removeToken());
                  router?.push("/login");
                }
              } catch (failedError: any) {
                dispatch(setRecallApi(true));
                ShowToast(error, failedError?.response?.data?.message);
                return failedError;
              }
            }
          }
          getCategoryData();
        }}
        aria-label="Default select example"
      >
        {LEADS_STATUS_TYPE_KEY.map((value: string, index) => (
          <option
            value={
              LEADS_STATUS_TYPE_DATA[
                value as unknown as keyof typeof LEADS_STATUS_TYPE_DATA
              ]
            }
            selected={
              admin_status ===
              LEADS_STATUS_TYPE_DATA[
                value as keyof typeof LEADS_STATUS_TYPE_DATA
              ]
            }
            key={index}
          >
            {value}
          </option>
        ))}
      </select>
    </div>
  );
};

export default StatusChange;

// import {useEffect, useState} from "react";
// import {RootState} from "@/redux/store";
// import {useDispatch, useSelector} from "react-redux";
// import {setLoader} from "@/redux/reducer/loader";
// import ApiFeature from "@/Api/ApiFeature";
// import {setRecallApi} from "@/redux/reducer/RecallApi";

// const StatusChange = (data: any, options: any, key = "", path = "") => {
//     const dispatch = useDispatch();

//     const [status, setStatus] = useState(data[key] || "")
//     const recallApi = useSelector(
//         (state: RootState) => state.recallApi.recallApi
//     );

//     useEffect(() => {
//         dispatch(setLoader(true));
//         async function getCategoryData() {
//             if (data[key] !== status) {
//                 const res = await ApiFeature.put(`${path}/update`, {...data, [key]: status}, data._id, true);
//             }
//         }
//         try {
//             getCategoryData();
//         } catch (error) {
//             dispatch(setRecallApi(false));
//             dispatch(setLoader(false));
//         } finally {
//             dispatch(setRecallApi(false));
//             dispatch(setLoader(false));
//         }
//         return () => { };
//     }, [status]);

//     console.log(options)

//     return <div className="dataTables_filter mb-1">

//         <select
//             className="form-select "
//             onChange={(e) => {setStatus(e.target.value)}
//             }
//             aria-label="Default select example"
//         >
//             {(Object.keys(options) || []).map((value: string, index) => (
//                 <option
//                     value={
//                         options[
//                         value as unknown as keyof typeof options
//                         ]
//                     }
//                     selected={
//                         status ===
//                         options[
//                         value as keyof typeof options
//                         ]
//                     }
//                     key={index}
//                 >
//                     {value}
//                 </option>
//             ))}

//         </select>
//     </div>
// }

// export default StatusChange;
