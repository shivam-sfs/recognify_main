import React, { useState } from "react";
import Modal, { InitializeFormValues } from "@/components/Utils/Modal";
import MapComponent from "../Utils/map/map";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";

interface FormValues {
  name: string;
  last_name: string;
  company: string;
  email: string;
  number: string;
}

const ActionScreen: React.FC<ActionModalType> = (props) => {
  
  const validationSchema = Yup.object({
    first_name: Yup.string()
      .max(30, "Name must be 30 characters or less")
      .required("Name is required"),
    last_name: Yup.string()
      .max(30, "Last name must be 30 characters or less")
      .required("Last name is required"),
    company: Yup.string()
      .max(100, "Company name must be 100 characters or less")
      .required("Company is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    number: Yup.string()
      .matches(
        /^\+?[1-9]\d{1,14}$/,
        "Invalid phone number. Enter in international format, e.g., +91 111 111 1111"
      )
      .required("Phone number is required"),
  });

  const keys = ["first_name", "last_name", "company", "email", "number"];

  const initValue: FormValues = InitializeFormValues(props, keys);

  return (
    <Modal config={{ ...props, initValue, validationSchema }}>
      {(Props: any) => (
        <div>
          <div>
            <label htmlFor="first_name">First Name</label>
            <Field
              className="form-control-alternative form-control field-input"
              name="first_name"
              type="text"
            />
            <ErrorMessage name="name" component="div" className="error" />
          </div>

          <div>
            <label htmlFor="last_name">Last Name</label>
            <Field
              className="form-control-alternative form-control field-input"
              name="last_name"
              type="text"
            />
            <ErrorMessage name="last_name" component="div" className="error" />
          </div>

          <div>
            <label htmlFor="company">Company</label>
            <Field
              className="form-control-alternative form-control field-input"
              name="company"
              type="text"
            />
            <ErrorMessage name="company" component="div" className="error" />
          </div>

          <div>
            <label htmlFor="email">Email</label>
            <Field
              className="form-control-alternative form-control field-input"
              name="email"
              type="email"
            />
            <ErrorMessage name="email" component="div" className="error" />
          </div>

          <div>
            <label htmlFor="number">Phone Number</label>
            <Field
              className="form-control-alternative form-control field-input"
              name="number"
              type="text"
            />
            <ErrorMessage name="number" component="div" className="error" />
          </div>

          <button
            className="btn btn-primary mt-5 d-block text-uppercase"
            type="submit"
          >
            Submit
          </button>
        </div>
      )}
    </Modal>
  );
};

export default ActionScreen;
