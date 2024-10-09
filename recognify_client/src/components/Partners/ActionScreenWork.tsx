import ApiFeature from "@/Api/ApiFeature";
import { setLoader } from "@/redux/reducer/loader";
import { Button, Form } from "react-bootstrap";
import { Formik, Field, ErrorMessage } from "formik";
import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { setRecallApi } from "@/redux/reducer/RecallApi";
import Select from "react-select";
import {
  CURRENCY_STATUS_TYPE_DATA,
  CURRENCY_STATUS_TYPE_KEY,
  INIT_FILTER,
  PAGE_TYPE_ADD,
  PAYMENT_METHOD_TYPE_DATA,
  PAYMENT_METHOD_TYPE_KEY,
  PAYMENT_STATUS_TYPE_DATA,
  PAYMENT_STATUS_TYPE_KEY,
  PAYMENT_TYPE_DATA,
  PAYMENT_TYPE_KEY,
  WORK_STATUS_TYPE_DATA,
  WORK_STATUS_TYPE_KEY,
} from "../Utils/constants";
import ActionFeature from "@/Api/ActionFeature";
import debounce from "lodash.debounce";
const ActionScreen: React.FC<ActionModalType> = (props) => {
  // props
  const { id, onClose, isActive, data, type, urls, path } = props;

  const [workOptions, setWorkOptions] = useState([
    ...(type == PAGE_TYPE_ADD ? [] : [{ value: data.id, label: data.project }]),
  ]);
  const getWorkData = (data: any) => {
    setWorkOptions(
      (data.list || []).map((item: any) => ({
        value: item.id,
        label: item.project,
        ...item,
      }))
    );
  };

  const handleInputChange = (inputValue: string) => {
    if (inputValue) {
      fetchWorkData(inputValue); // Call API with input value
    } else {
      setWorkOptions([]); // Clear options if input is empty
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchWorkData = useCallback(
    debounce(async (inputValue: any) => {
      try {
        ActionFeature.get(
          1,
          { ...INIT_FILTER, searchParam: inputValue, limit: 20 },
          getWorkData,
          {},
          "work_list"
        );
      } catch (error) {
        console.error("Error fetching work data", error);
      }
    }, 500), // Delay of 500ms to debounce
    []
  );
  // validation logic
  const validation = {
    project_id: Yup.string().required("work Name is required"),
    description: Yup.string()
      .required("Description is required")
      .max(200, "Description should not exceed 200 characters"),
    status: Yup.string().required("Status is required"),
    deadline: Yup.date().required("Deadline is required"),
    amount: Yup.number()
      .required("Amount is required")
      .min(1, "Amount must be at least 1"),
    currency: Yup.string().required("Currency is required"),
    payDescription: Yup.string()
      .required("Payment description is required")
      .max(200, "Description should not exceed 200 characters"),
    payment_method: Yup.string().required("Payment method is required"),
    type: Yup.string().required("Type is required"),
    pay_status: Yup.string().required("payment Status is required"),
  };

  // states

  const [formInitData] = useState<any>({
    project_id: type == PAGE_TYPE_ADD ? "" : data.project_id,
    description: type == PAGE_TYPE_ADD ? "" : data.description,
    status: type == PAGE_TYPE_ADD ? "" : data.status,
    deadline: type == PAGE_TYPE_ADD ? "" : data.deadline,
    amount: type == PAGE_TYPE_ADD ? "" : data.amount,
    currency: type == PAGE_TYPE_ADD ? "" : data.currency,
    payDescription: type == PAGE_TYPE_ADD ? "" : data.payDescription,
    payment_method: type == PAGE_TYPE_ADD ? "" : data.payment_method,
    type: type == PAGE_TYPE_ADD ? "" : data.type,
    pay_status: type == PAGE_TYPE_ADD ? "" : data.pay_status,
    pay_id: type == PAGE_TYPE_ADD ? "" : data.payment_id
  });

  //   Hooks
  const dispatch = useDispatch();

  //   from submit
  const onsubmit = async (value: any) => {
    dispatch(setLoader(true));
    let res;
    try {
      if (type == PAGE_TYPE_ADD) {
        res = await ApiFeature.post(
          urls,
          { ...value, partner_id: data.partner_id },
          0
        );
      } else {
        res = await ApiFeature.put(urls, value, id);
      }
      if (res.status == 200) {
        dispatch(setLoader(false));
        dispatch(setRecallApi(true));
        onClose("");
      }
    } catch (error) {
      dispatch(setLoader(false));
    } finally {
      dispatch(setLoader(false));
    }
  };
  return (
    <Modal
      show={isActive}
      onHide={() => onClose("")}
      dialogClassName="modal-lg"
      style={{ marginLeft: "23px" }}
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <h6 className="col-md-6 mb-2 mb-md-0">Profile</h6>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          enableReinitialize={true}
          onSubmit={onsubmit}
          initialValues={formInitData}
          validationSchema={Yup.object().shape(validation)}
        >
          {({ values, setFieldValue, errors, handleSubmit }) => (
            <Form onSubmit={handleSubmit} className="w-100">
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="project_id">Select Work</label>
                    <Select
                      id="project_id"
                      name="project_id"
                      options={workOptions}
                      onChange={(option: any) =>
                        setFieldValue("project_id", option?.value)
                      }
                      onInputChange={handleInputChange}
                      value={workOptions.find(
                        (option: any) => option?.value === values.project_id
                      )}
                      placeholder="Search and select work"
                      className="form-control-alternative form-control field-input"
                    />
                    <ErrorMessage name="project_id" component="div" />
                  </div>

                  <div>
                    <label htmlFor="description">Description</label>
                    <Field
                      name="description"
                      as="textarea"
                      className="form-control-alternative form-control field-input"
                    />
                    <ErrorMessage name="description" component="div" />
                  </div>

                  <div>
                    <label htmlFor="status">Status</label>
                    <Field
                      name="status"
                      as="select"
                      className="form-control-alternative form-control field-input"
                    >
                      <option value="" disabled selected>
                        select Work Status
                      </option>
                      {WORK_STATUS_TYPE_KEY.map((key: string, index) => (
                        <option key={key} value={key}>
                          {
                            WORK_STATUS_TYPE_DATA[
                              key as unknown as keyof typeof WORK_STATUS_TYPE_DATA
                            ]
                          }
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name="status" component="div" />
                  </div>

                  <div>
                    <label htmlFor="deadline">Deadline</label>
                    <Field
                      name="deadline"
                      type="date"
                      className="form-control-alternative form-control field-input"
                    />
                    <ErrorMessage name="deadline" component="div" />
                  </div>
                </div>
                <div className="col-md-6">
                  <div>
                    <label htmlFor="amount">Amount</label>
                    <Field
                      name="amount"
                      type="number"
                      className="form-control-alternative form-control field-input"
                    />
                    <ErrorMessage name="amount" component="div" />
                  </div>

                  <div>
                    <label htmlFor="currency">Currency</label>
                    <Field
                      name="currency"
                      as="select"
                      className="form-control-alternative form-control field-input"
                    >
                      <option value="" disabled selected>
                        Select Currency
                      </option>
                      {CURRENCY_STATUS_TYPE_KEY.map((key: string, index) => (
                        <option key={key} value={key}>
                          {
                            CURRENCY_STATUS_TYPE_DATA[
                              key as unknown as keyof typeof CURRENCY_STATUS_TYPE_DATA
                            ]
                          }
                        </option>
                      ))}
                      {/* Add more currencies as needed */}
                    </Field>
                    <ErrorMessage name="currency" component="div" />
                  </div>

                  <div>
                    <label htmlFor="payDescription">Payment Description</label>
                    <Field
                      name="payDescription"
                      as="textarea"
                      className="form-control-alternative form-control field-input"
                    />
                    <ErrorMessage name="payDescription" component="div" />
                  </div>

                  <div>
                    <label htmlFor="payment_method">Payment Method</label>
                    <Field
                      name="payment_method"
                      as="select"
                      className="form-control-alternative form-control field-input"
                    >
                      <option value="">Select Payment Method</option>
                      {PAYMENT_METHOD_TYPE_KEY.map((key: string, index) => (
                        <option key={key} value={key}>
                          {
                            PAYMENT_METHOD_TYPE_DATA[
                              key as unknown as keyof typeof PAYMENT_METHOD_TYPE_DATA
                            ]
                          }
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name="payment_method" component="div" />
                  </div>

                  <div>
                    <label htmlFor="type">Type</label>
                    <Field
                      name="type"
                      as="select"
                      className="form-control-alternative form-control field-input"
                    >
                      <option value="">Select Payment Type</option>
                      {PAYMENT_TYPE_KEY.map((key: string, index) => (
                        <option key={key} value={key}>
                          {
                            PAYMENT_TYPE_DATA[
                              key as unknown as keyof typeof PAYMENT_TYPE_DATA
                            ]
                          }
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name="type" component="div" />
                  </div>

                  <div className="col-md-3">
                    <label htmlFor="pay_status">Payment Status</label>
                    <Field
                      name="pay_status"
                      as="select"
                      className="form-control-alternative form-control field-input"
                    >
                      <option value={""}>select pay status</option>
                      {PAYMENT_STATUS_TYPE_KEY.map((key: string, index) => (
                        <option key={key} value={key}>
                          {
                            PAYMENT_STATUS_TYPE_DATA[
                              key as unknown as keyof typeof PAYMENT_STATUS_TYPE_DATA
                            ]
                          }
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name="pay_status" component="div" />
                  </div>
                </div>
              </div>
              <div className="row mt-4">
                <div className="col-md-12 m-auto text-center">
                  <Button className="btn btn-primary w-50" type="submit">
                    {type == PAGE_TYPE_ADD ? "Add" : "Update"}
                  </Button>
                </div>
              </div>
              <pre>{JSON.stringify(errors, null, 0)}</pre>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default ActionScreen;
