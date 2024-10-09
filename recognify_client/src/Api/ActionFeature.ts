import {setLoader} from "@/redux/reducer/loader";

import {Dispatch} from "react";
import {AnyAction} from "redux";
import ApiFeature from "./ApiFeature";
import {setRecallApi} from "@/redux/reducer/RecallApi";
import {confirmAlert} from "react-confirm-alert";
import {downloadURI} from "@/components/Utils/utile";

interface ActionFeatureType {
    config: {dispatch: Dispatch<AnyAction>} | null;
    path: string;
    delete: (id: string | number,) => void;
    toggle: (id: string | number, data: any, url?: string, key?: string) => void;
    get: (currentPage: number, filter: FilterDataType, setData: React.Dispatch<any>, data?: object, url?: string) => void
    download: (id?: string | number, path?: string) => void
}

const ActionFeature: ActionFeatureType = {
    config: null,
    path: "",
    delete: (id: string | number,) => {
        const context = ActionFeature.config
        confirmAlert({
            title: "Delete",
            message: "are you sure you want to delete.",
            buttons: [
                {
                    label: "Yes",
                    onClick: async () => {
                        try {
                            context?.dispatch(setLoader(true));
                            const res: any = await ApiFeature.delete(
                                `${ActionFeature.path}/delete`,
                                id
                            );
                            if (res.status === 200) {
                                context?.dispatch(setLoader(false));
                                context?.dispatch(setRecallApi(true));
                            }
                        } catch (e) {
                            context?.dispatch(setRecallApi(true));
                            context?.dispatch(setRecallApi(true));
                            context?.dispatch(setLoader(false));
                        } finally {
                            context?.dispatch(setLoader(false));
                        }
                    },
                },
                {
                    label: "No",
                },
            ],
        });
    },
    toggle: async (id: string | number, data: any, url = "update", key = "is_active") => {
        const context = ActionFeature.config
        try {
            context?.dispatch(setLoader(true));

            console.log(key)
            const res: any = await ApiFeature.put(
                `${ActionFeature.path}/${url}`,
                {...data, [key]: data?.[key] ? false : true},
                id
            );
            if (res.status === 200) {
                context?.dispatch(setLoader(false));
                context?.dispatch(setRecallApi(true));
            }
        } catch (e) {
            context?.dispatch(setLoader(false));
        } finally {
            context?.dispatch(setLoader(false));
        }
    },
    get: async (currentPage: number, filter: FilterDataType, setData: React.Dispatch<any>, data: any, url = "list") => {
        const context = ActionFeature.config
        try {
            context?.dispatch(setLoader(true))
            const offset = (currentPage - 1) * filter.limit;
            const res: any = await ApiFeature.post(
                `${ActionFeature.path}/${url}`,
                {...filter, offset, ...data},
            );
            if (res && res.status == 200) {
                setData(res.data)
                context?.dispatch(setLoader(false));
                context?.dispatch(setRecallApi(false));
            }
        } catch (error) {
            context?.dispatch(setLoader(false));
        } finally {
            context?.dispatch(setLoader(false));
        }
    },
    download: async (id, path = "downloadExcel") => {
        const context = ActionFeature.config
        try {
            context?.dispatch(setLoader(true))
            const res: any = await ApiFeature.get(
                `${ActionFeature.path}/${path}`, id
            );
            if (res && res.status == 200) {
                downloadURI(process.env.NEXT_PUBLIC_BASE_URL + "/" + res.data.filePath, res.data.fileName)
                context?.dispatch(setLoader(false));
                context?.dispatch(setRecallApi(false));
            }
        } catch (error) {
            context?.dispatch(setLoader(false));
        } finally {
            context?.dispatch(setLoader(false));
        }
    }
}

export default ActionFeature