import React, { RefObject, useRef, useState } from "react";
import Modal, { InitializeFormValues } from "@/components/Utils/Modal";
import * as Yup from "yup";
import { Field, ErrorMessage, useField, FieldArray } from "formik";
import {
  CURRENCY_STATUS_TYPE_DATA,
  CURRENCY_STATUS_TYPE_KEY,
  PAYMENT_METHOD_TYPE_DATA,
  PAYMENT_METHOD_TYPE_KEY,
  PAYMENT_STATUS_TYPE_DATA,
  PAYMENT_STATUS_TYPE_KEY,
  PAYMENT_TYPE_DATA,
  PAYMENT_TYPE_KEY,
  WORK_STATUS_TYPE_DATA,
  WORK_STATUS_TYPE_KEY,
} from "../Utils/constants";

interface FileUploadProps {
  setFiles: any;
  name: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ setFiles, name }) => {
  return (
    <div>
      <label htmlFor="files">Choose files</label>
      <input
        type="file"
        onChange={(event) => {
          setFiles(
            event.currentTarget.files ? event.currentTarget.files[0] : null
          );
        }}
        name={name}
        className="form-control-alternative form-control field-input"
      />
    </div>
  );
};

const ActionScreen: React.FC<ActionModalType> = (props) => {
  const fileRef: any = useRef(null);
  const [files, setFiles] = useState<any>();
  const [deleteArray, setDeleteArray] = useState<any[]>([]);

  const validationSchema = Yup.object({
    project: Yup.string().required("project is required"),
    description: Yup.string(),
    status: Yup.string().required("Status is required"),
    deadline: Yup.date().required("Deadline is required"),
    payments: Yup.array().of(
      Yup.object().shape({
        amount: Yup.number().required("Amount is required"),
        currency: Yup.string().required("Currency is required"),
        description: Yup.string().optional(),
        payment_method: Yup.string().required("Payment method is required"),
        type: Yup.number()
          .oneOf([1, 2], "Type must be either Credit or Debit")
          .required("Type is required"),
      })
    ),
  });

  const keys = [
    "client_id",
    "project",
    "description",
    "status",
    "deadline",
    "payments",
  ];

  function removeData(data: any) {
    if (data?.id) {
      setDeleteArray((pre) => [...pre, data?.id]);
    }
  }

  const initValue = {
    file: null,
    ...InitializeFormValues(props, keys),
  };

  initValue.payments = initValue.payments ? initValue.payments : [];

  return (
    <Modal
      config={{
        ...props,
        initValue,
        validationSchema,
        formData: true,
        addValue: { client_id: props.data?.client_id, deleteArray },
        addFiles: { files: files },
      }}
    >
      {(Props: any) => (
        <div>
          <div className="row">
            <div className="">
              <div>
                <label htmlFor="project">project</label>
                <Field
                  name="project"
                  type="text"
                  className="form-control-alternative form-control field-input"
                />
                <ErrorMessage name="project" component="div" />
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
                  <option value="">Select project Status</option>
                  {WORK_STATUS_TYPE_KEY.map((key) => (
                    <option key={key} value={key}>
                      {
                        WORK_STATUS_TYPE_DATA[
                          key as keyof typeof WORK_STATUS_TYPE_DATA
                        ]
                      }
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="status" component="div" />
              </div>

              <div>
                <label htmlFor="file">File</label>
                <FileUpload setFiles={setFiles} name="file" />
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
            <div className="mt-2">
              <FieldArray name="payments">
                {({ remove, push }) => (
                  <div>
                    {Props.values.payments.map(
                      (payment: any, index: number) => (
                        <div key={index} className="col-md-12">
                          <h6>Milestone {index + 1}</h6>
                          <div className="row">
                            <div className="row">
                              {/* Amount Field */}
                              <div className="col-md-3">
                                <label htmlFor={`payments.${index}.amount`}>
                                  Amount
                                </label>
                                <Field
                                  name={`payments.${index}.amount`}
                                  type="number"
                                  className="form-control-alternative form-control field-input"
                                />
                                <ErrorMessage
                                  name={`payments.${index}.amount`}
                                  component="div"
                                />
                              </div>

                              {/* Currency Field */}
                              <div className="col-md-3">
                                <label htmlFor={`payments.${index}.currency`}>
                                  Currency
                                </label>
                                <Field
                                  name={`payments.${index}.currency`}
                                  as="select"
                                  className="form-control-alternative form-control field-input"
                                >
                                  <option value="">Select Currency</option>
                                  {CURRENCY_STATUS_TYPE_KEY.map((key) => (
                                    <option key={key} value={key}>
                                      {
                                        CURRENCY_STATUS_TYPE_DATA[
                                          key as keyof typeof CURRENCY_STATUS_TYPE_DATA
                                        ]
                                      }
                                    </option>
                                  ))}
                                </Field>
                                <ErrorMessage
                                  name={`payments.${index}.currency`}
                                  component="div"
                                />
                              </div>

                              {/* Payment Method Field */}
                              <div className="col-md-3">
                                <label
                                  htmlFor={`payments.${index}.payment_method`}
                                >
                                  Payment Method
                                </label>
                                <Field
                                  name={`payments.${index}.payment_method`}
                                  as="select"
                                  className="form-control-alternative form-control field-input"
                                >
                                  <option value="">
                                    Select Payment Method
                                  </option>
                                  {PAYMENT_METHOD_TYPE_KEY.map((key) => (
                                    <option key={key} value={key}>
                                      {
                                        PAYMENT_METHOD_TYPE_DATA[
                                          key as keyof typeof PAYMENT_METHOD_TYPE_DATA
                                        ]
                                      }
                                    </option>
                                  ))}
                                </Field>
                                <ErrorMessage
                                  name={`payments.${index}.payment_method`}
                                  component="div"
                                />
                              </div>

                              {/* Type Field */}
                              <div className="col-md-3">
                                <label htmlFor={`payments.${index}.type`}>
                                  Type
                                </label>
                                <Field
                                  name={`payments.${index}.type`}
                                  as="select"
                                  className="form-control-alternative form-control field-input"
                                >
                                   <option value="">
                                    Select Payment Type
                                  </option>
                                  {PAYMENT_TYPE_KEY.map((key) => (
                                    <option key={key} value={key}>
                                      {
                                        PAYMENT_TYPE_DATA[
                                          key as keyof typeof PAYMENT_TYPE_DATA
                                        ]
                                      }
                                    </option>
                                  ))}
                                </Field>
                                <ErrorMessage
                                  name={`payments.${index}.type`}
                                  component="div"
                                />
                              </div>
                              <div className="col-md-3">
                                <label htmlFor={`payments.${index}.status`}>
                                  Status
                                </label>
                                <Field
                                  name={`payments.${index}.status`}
                                  as="select"
                                  className="form-control-alternative form-control field-input"
                                >
                                  <option value={""}>select pay status</option>
                                  {PAYMENT_STATUS_TYPE_KEY.map(
                                    (key: string, index) => (
                                      <option key={key} value={key}>
                                        {
                                          PAYMENT_STATUS_TYPE_DATA[
                                            key as unknown as keyof typeof PAYMENT_STATUS_TYPE_DATA
                                          ]
                                        }
                                      </option>
                                    )
                                  )}
                                </Field>
                                <ErrorMessage
                                  name={`payments.${index}.status`}
                                  component="div"
                                />
                              </div>
                            </div>

                            <div className="row">
                              {/* Description Field */}
                              <div className="col-md-12">
                                <label
                                  htmlFor={`payments.${index}.description`}
                                >
                                  Description
                                </label>
                                <Field
                                  name={`payments.${index}.description`}
                                  as="textarea"
                                  className="form-control-alternative form-control field-input"
                                />
                                <ErrorMessage
                                  name={`payments.${index}.description`}
                                  component="div"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Remove Button */}
                          <button
                            type="button"
                            className="btn mt-3"
                            onClick={() => {
                              removeData(payment);
                              remove(index);
                            }}
                          >
                            Remove
                          </button>

                          <hr />
                        </div>
                      )
                    )}

                    {/* Add New Payment Button */}
                    <button
                      type="button"
                      className="btn"
                      onClick={() =>
                        push({
                          amount: "",
                          currency: "",
                          description: "",
                          payment_method: "",
                          type: 1, // Default to Credit
                        })
                      }
                    >
                      Add Milestone
                    </button>
                  </div>
                )}
              </FieldArray>
            </div>
          </div>

          <div className="mt-3">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
          <pre>{JSON.stringify(Props.errors, null, 1)}</pre>
        </div>
      )}
    </Modal>
  );
};

export default ActionScreen;

// (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
//   new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
//   j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
//   'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
//   })(window,document,'script','dataLayer','GTM-MDSJXMW');

//       window.__be = window.__be || {};
//       window.__be.id = "66cdff0b4ce0500007270109";
//       (function() {
//           var be = document.createElement('script'); be.type = 'text/javascript'; be.async = true;
//           be.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'cdn.chatbot.com/widget/plugin.js';
//           var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(be, s);
//       })();

// window.__ow = window.__ow || {};
// window.__ow.organizationId = "dfcd2670-befc-4a21-8799-71a0058f81e3";
// window.__ow.template_id = "4226b77a-c4f4-404c-aa51-f08c80433c4e";
// window.__ow.integration_name = "manual_settings";
// window.__ow.product_name = "chatbot";
// ;(function(n,t,c){function i(n){return e._h?e._h.apply(null,n):e._q.push(n)}var e={_q:[],_h:null,_v:"2.0",on:function(){i(["on",c.call(arguments)])},once:function(){i(["once",c.call(arguments)])},off:function(){i(["off",c.call(arguments)])},get:function(){if(!e._h)throw new Error("[OpenWidget] You can't use getters before load.");return i(["get",c.call(arguments)])},call:function(){i(["call",c.call(arguments)])},init:function(){var n=t.createElement("script");n.async=!0,n.type="text/javascript",n.src="https://cdn.openwidget.com/openwidget.js",t.head.appendChild(n)}};!n.__ow.asyncInit&&e.init(),n.OpenWidget=n.OpenWidget||e}(window,document,[].slice))
