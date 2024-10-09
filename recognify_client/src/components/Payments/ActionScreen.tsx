import React, { useState } from "react";
import Modal, { InitializeFormValues } from "@/components/Utils/Modal";
import MapComponent from "../Utils/map/map";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import {
  CURRENCY_STATUS_TYPE_DATA,
  CURRENCY_STATUS_TYPE_KEY,
  PAYMENT_METHOD_TYPE_DATA,
  PAYMENT_METHOD_TYPE_KEY,
  PAYMENT_TYPE_DATA,
  PAYMENT_TYPE_KEY,
} from "../Utils/constants";

interface FormValues {
  name: string;
  last_name: string;
  company: string;
  email: string;
  number: string;
}

const ActionScreen: React.FC<ActionModalType> = (props) => {
  const validationSchema = Yup.object({
    amount: Yup.number().required("Amount is required"),
    currency: Yup.string().required("Currency is required"),
    description: Yup.string(),
    payment_method: Yup.string().required("Payment method is required"),
    type: Yup.number()
      .oneOf([1, 2], "Type must be either 1 (credit) or 2 (debit)")
      .required("Payment type is required"),
  });

  const keys = ["amount", "currency", "description", "payment_method", "type"];

  const initValue: FormValues = InitializeFormValues(props, keys);

  return (
    <Modal config={{ ...props, initValue, validationSchema, formData: false }}>
      {(Props: any) => (
        <div>
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
              <option value="">Select Currency</option>
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
            <label htmlFor="description">Description</label>
            <Field
              name="description"
              as="textarea"
              className="form-control-alternative form-control field-input"
            />
            <ErrorMessage name="description" component="div" />
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
            <ErrorMessage name="type" component="div" />
          </div>

          <div>
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default ActionScreen;
