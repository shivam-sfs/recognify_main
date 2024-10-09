import { useEffect, useState } from "react";
import {
  WORK_STATUS_TYPE_DATA,
  WORK_STATUS_TYPE_KEY,
} from "../Utils/constants";
import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { setRecallApi } from "@/redux/reducer/RecallApi";
import { useRouter } from "next/router";
import axios from "axios";
import ShowToast, { errorMessage, error, success } from "../Utils/ShowToast";
import { removeToken } from "@/redux/reducer/login";

const StatusChange = ({ data, token }: any) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const Base_url = process.env.NEXT_PUBLIC_BASE_URL || "";

  if (data?.partner_id == 4) {
    console.log(data?.status);
  }
  return (
    <div className="dataTables_filter mb-1">
      <select
        className="form-select"
        onChange={(e) => {
          async function getCategoryData() {
            try {
              const FullPath = `${Base_url}/${"partners_work/update"}/${
                data.id
              }`;
              const res = await axios.put(
                FullPath,
                { ...data, status: +e.target.value, pay_id: data.payment_id },
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
          getCategoryData();
        }}
        aria-label="Default select example"
      >
        {WORK_STATUS_TYPE_KEY.map((value: string, index) => {
          console.log(value, data?.status, value == data?.status);
          return (
            <option value={value} selected={data?.status == value} key={index}>
              {
                WORK_STATUS_TYPE_DATA[
                  value as keyof typeof WORK_STATUS_TYPE_DATA
                ]
              }
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default StatusChange;
