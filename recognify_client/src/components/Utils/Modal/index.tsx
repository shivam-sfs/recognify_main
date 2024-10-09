import ApiFeature from "@/Api/ApiFeature";
import { setLoader } from "@/redux/reducer/loader";
import { Formik, Form } from "formik";
import React, { cloneElement, ReactNode } from "react";
import { Modal } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { PAGE_TYPE_ADD, PAGE_TYPE_EDIT } from "@/components/Utils/constants";
import { setRecallApi } from "@/redux/reducer/RecallApi";

const Index: React.FC<{
  config: MainActionModalType;
  children: JSX.Element[] | JSX.Element | any;
}> = (props) => {
  const {
    id,
    onClose,
    isActive,
    type,
    urls,
    path,
    form = true,
    formData: fromDataStatus = false,
    validationSchema,
    initValue,
    onSuccess,
    onError,
    addValue,
    addFiles,
    deleteValue,
  } = props.config;
  const children = props.children;
  //   Hooks
  const dispatch = useDispatch();

  // Image convert in base 64 format

  //   from submit
  const onsubmit = async (value: any) => {
    dispatch(setLoader(true));

    (deleteValue || []).map((item) => delete value[item]);

    try {
      value = {...value,...addValue}
      let formData = value;
      if (fromDataStatus) {
        formData = new FormData();


        if (addFiles) {
          Object.keys(addFiles).map((key: string) => {
            formData.append(
              key,
              addFiles[key as unknown as keyof typeof addFiles]
            );
          });
        }



        (Object.keys({ ...value, ...(addValue || {}) }) || []).map(
          (item: any) => {
            if (typeof value[item] !== "object") {
              formData.append(item, value[item]);
            } else {
              if (value[item] != null) {
                (Object.keys(value[item]) || []).map((arrValue: any) => {
                  if (typeof value[item][arrValue] === "object") {
                    (Object.keys(value[item][arrValue]) || []).map(
                      (arrayItem: any) => {
                        formData.append(
                          `${item}[${arrayItem}][]`,
                          value[item][arrValue][arrayItem]
                        );
                      }
                    );
                  } else {
                    formData.append(`${item}[]`, value[item][arrValue]);
                  }
                });
              }
            }
          }
        );
      }
      

      let res;
      if (type === PAGE_TYPE_EDIT) {
        res = await ApiFeature.put(urls, formData, id, true);
      } else {
        res = await ApiFeature.post(urls, formData, 0, true);
      }

      if (res.status == 200) {
        dispatch(setLoader(false));
        dispatch(setRecallApi(true));
        onClose("")
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      console.log(error);
      if (onError) onError();
      dispatch(setLoader(false));
    } finally {
      dispatch(setLoader(false));
    }
  };

  const renderChildrenWithProps = (child: ReactNode, props: any) => {
    // If the child is a valid React element, clone it with the additional props
    if (React.isValidElement(child)) {
      return cloneElement(child, props);
    }
    return child; // If not, just return the child as is
  };

  return (
    <Modal
      show={isActive}
      onHide={() => onClose("")}
      dialogClassName="modal-lg bg-glass"
      style={{ marginLeft: "23px" }}
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <h3>
            {/* {type == PAGE_TYPE_ADD ? "Add " : "Edit "}  */}
            {path}
          </h3>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {form ? (
          <Formik
            enableReinitialize={true}
            onSubmit={onsubmit}
            initialValues={initValue}
            validationSchema={validationSchema}
          >
            {(fromProps) => (
              <Form>
                {typeof props.children === "function"
                  ? props.children(fromProps)
                  : "turn on form true"}
              </Form>
            )}
          </Formik>
        ) : (
          children
        )}
      </Modal.Body>
    </Modal>
  );
};

export default Index;

const InitializeFormValues = (props: any, keys: Array<keyof any>): any => {
  const { type, data } = props;
  const initialValues: any = {};

  keys.forEach((key) => {
    initialValues[key] = type === PAGE_TYPE_ADD ? "" : data[key] || "";
  });

  return initialValues as any;
};

export { InitializeFormValues };
