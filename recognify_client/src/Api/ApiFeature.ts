import axios from "axios";
import ShowToast, {
  errorMessage,
  error,
  success,
} from "../components/Utils/ShowToast";
import {Dispatch} from "react";
import {AnyAction} from "redux";
import {NextRouter} from "next/router";
import {removeToken} from "@/redux/reducer/login";
import RecallApi, {setRecallApi} from "@/redux/reducer/RecallApi";

const Base_url = process.env.NEXT_PUBLIC_BASE_URL || "";

interface ApiFeatureType {
  config?: {dispatch: Dispatch<AnyAction>; router: NextRouter; token: string} | null;
  get?: any;
  post?: any;
  put?: any;
  delete?: any;
}

const ApiFeature: ApiFeatureType = {
  config: null,
  get: async (
    path: string,
    id: number | null = null,
    toast = false
  ) => {
    const context = ApiFeature.config;
    try {
      const FullPath = id ? `${Base_url}/${path}/${id}` : `${Base_url}/${path}`;
      const res = await axios.get(FullPath, {
        headers: {
          Authorization: `Bearer ${context?.token}`,
          Accept: "application/json",
        },
      });
      if (toast && res?.data?.success) {
        ShowToast(success, res?.data?.message);
      } else if (res.data.status === 401) {

        context?.dispatch(removeToken());
        context?.router?.push("/login");
      }
      return res?.data;
    } catch (error: any) {
      context?.dispatch(setRecallApi(true));
      ShowToast(error, error?.response?.data?.message);
      return error;
    }
  },
  post: async function (
    path: string,
    data: any = {},
    id: number | null = null,
    isMultipart = false,
    toast = false
  ) {
    const context = ApiFeature.config;
    try {
      const FullPath = id ? `${Base_url}/${path}/${id}` : `${Base_url}/${path}`;
      const res = await axios.post(FullPath, data, {
        headers: {
          Authorization: `Bearer ${context?.token}`,
          Accept: isMultipart ? "multipart/form-data" : "application/json",
        },
      });
      if (toast && res?.data?.success) {
        ShowToast(success, res?.data?.message);
      } else if (res.data.status === 401) {
        context?.dispatch(removeToken());
        context?.router?.push("/login");
      }
      return res?.data;
    } catch (failedError: any) {
      context?.dispatch(setRecallApi(true));
      ShowToast(error, failedError?.response?.data?.message);
      return failedError;
    }
  },
  put: async (
    path: string,
    data: any = {},
    id: number | null = null,
    isMultipart = false,
    toast = true
  ) => {
    const context = ApiFeature.config;
    try {
      const FullPath = id ? `${Base_url}/${path}/${id}` : `${Base_url}/${path}`;
      const res = await axios.put(FullPath, data, {
        headers: {
          Authorization: `Bearer ${context?.token}`,
          Accept: isMultipart ? "multipart/form-data" : "application/json",
        },
      });
      if (toast && res?.data?.success) {
        ShowToast(success, res?.data?.message);
      } else if (res.data.status === 401) {

        context?.dispatch(removeToken());
        context?.router?.push("/login");
      }
      return res?.data;
    } catch (failedError: any) {
      context?.dispatch(setRecallApi(true));
      ShowToast(error, failedError?.response?.data?.message);
      return failedError;
    }
  },
  delete: async (
    path: string,
    id: number | null = null,
    toast = true
  ) => {
    const context = ApiFeature.config;
    try {
      const FullPath = id ? `${Base_url}/${path}/${id}` : `${Base_url}/${path}`;
      const res = await axios.delete(FullPath, {
        headers: {
          Authorization: `Bearer ${context?.token}`,
        },
      });
      if (toast && res?.data?.success) {
        ShowToast(success, res?.data?.message);
      } else if (res.data.status === 401) {

        context?.dispatch(removeToken());
        context?.router?.push("/login");
      }
      return res?.data;
    } catch (failedError: any) {
      context?.dispatch(setRecallApi(true));
      ShowToast(error, failedError?.response?.data?.message);
      return failedError;
    }
  },
};

export default ApiFeature;
