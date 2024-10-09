import ApiFeature from "@/Api/ApiFeature";
import { setLoader } from "@/redux/reducer/loader";
import { Button, Form } from "react-bootstrap";
import { Formik, Field, ErrorMessage } from "formik";
import React, { ChangeEvent, useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { setRecallApi } from "@/redux/reducer/RecallApi";
import ShowToast, { error, errorMessage } from "../Utils/ShowToast";
import { useRouter } from "next/router";
import {
  MAX_FILE_SIZE_BYTES,
  PAGE_TYPE_ADD,
} from "../Utils/constants";
import { TagsInput } from "react-tag-input-component";
import axios from "axios";
import ActionFeature from "@/Api/ActionFeature";

const ActionScreen: React.FC<ActionModalType> = (props) => {
  // props
  const { id, onClose, isActive, data, type, urls, path } = props;

  // validation logic
  const validation = {
    first_name: Yup.string()
      .required("First Name is required")
      .min(2, "First Name must be at least 2 characters")
      .max(30, "First Name can be at most 30 characters"),
    last_name: Yup.string()
      .required("Last Name is required")
      .min(2, "Last Name must be at least 2 characters")
      .max(30, "Last Name can be at most 30 characters"),
    email: Yup.string()
      .required("Email is required")
      .email("Invalid email format")
      .max(50, "Email can be at most 100 characters"),
    gender: Yup.string().required("Gender is required"),
    number: Yup.string()
      .required("Phone Number is required")
      .min(10, "Phone Number must be at least 10 digits")
      .max(13, "Enter valid number")
      .matches(/^[0-9]+$/, "Phone Number must contain only digits"),
  };

  // states

  const [formInitData] = useState<any>({
    first_name: type == PAGE_TYPE_ADD ? "" : data.first_name,
    last_name: type == PAGE_TYPE_ADD ? "" : data.last_name,
    email: type == PAGE_TYPE_ADD ? "" : data.email,
    gender: type == PAGE_TYPE_ADD ? "" : data.gender,
    number: type == PAGE_TYPE_ADD ? "" : data.number,
  });

  const [picture, setPicture] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [skills, setSkills] = useState<string[]>(
    type == PAGE_TYPE_ADD ? [] : data?.skills?.split(",")
  );
  //   Hooks
  const dispatch = useDispatch();
  const router = useRouter();

  const imageOnChange = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e?.target.files && e?.target.files?.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > MAX_FILE_SIZE_BYTES) {
        ShowToast(
          errorMessage,
          "Document size should not exceed more than 2 MB."
        );
        dispatch(setLoader(false));
        return;
      }
      setLogoFile(selectedFile);
      file2Base64(selectedFile).then((img: string) => {
        setPicture(img);
      });
    }
  };

  const file2Base64 = (file: File): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result?.toString() || "");
      reader.onerror = (error) => reject(error);
    });
  };

  //   from submit
  const onsubmit = async (value: any) => {
    dispatch(setLoader(true));
    let res;
    try {
      const formData = new FormData();

      formData.append("first_name", value.first_name.trim());
      formData.append("last_name", value.last_name.trim());
      formData.append("email", value.email.trim());
      formData.append("number", value.number);
      formData.append("gender", value.gender);
      if (skills) {
        formData.append("skills", skills.join(","));
      }

      if (logoFile) {
        formData.append("resume", logoFile);
      }

      if (type == PAGE_TYPE_ADD) {
        res = await ApiFeature.post(urls, formData, id, true);
      } else {
        res = await ApiFeature.put(urls, formData, id, true);
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
              {<>{console.log(errors)}</>}
              <div className="row">
                <div className="col-md-6">
                  <Form.Group controlId="first_name">
                    <Form.Label className="form-control-label">
                      <h6>First Name</h6>
                    </Form.Label>
                    <Field
                      type="text"
                      className="form-control-alternative form-control field-input"
                      name="first_name"
                      autoComplete="off"
                      placeholder="First Name"
                    />
                    <ErrorMessage
                      name="first_name"
                      component="span"
                      className="error-message"
                    />
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group controlId="last_name">
                    <Form.Label className="form-control-label">
                      <h6>Last Name</h6>
                    </Form.Label>
                    <Field
                      type="text"
                      className="form-control-alternative form-control field-input"
                      name="last_name"
                      autoComplete="off"
                      placeholder="Last Name"
                    />
                    <ErrorMessage
                      name="last_name"
                      component="span"
                      className="error-message"
                    />
                  </Form.Group>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <Form.Group controlId="email">
                    <Form.Label className="form-control-label">
                      <h6>Email</h6>
                    </Form.Label>
                    <Field
                      type="email"
                      className="form-control-alternative form-control field-input"
                      name="email"
                      autoComplete="off"
                      placeholder="Email"
                    />
                    <ErrorMessage
                      name="email"
                      component="span"
                      className="error-message"
                    />
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group controlId="number">
                    <Form.Label className="form-control-label">
                      <h6>Phone Number</h6>
                    </Form.Label>
                    <Field
                      type="phone"
                      className="form-control-alternative form-control field-input"
                      name="number"
                      autoComplete="off"
                      placeholder="Phone Number"
                    />
                    <ErrorMessage
                      name="number"
                      component="span"
                      className="error-message"
                    />
                  </Form.Group>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <Form.Group controlId="role">
                    <Form.Label className="form-control-label">
                      <h6>Gender</h6>
                    </Form.Label>
                    <Field
                      as="select"
                      className="form-control-alternative form-control field-input"
                      name="gender"
                    >
                      <option hidden value="">
                        Select Gender
                      </option>
                      <option value={"male"}>Male</option>
                      <option value={"female"}>Female</option>
                      <option value={"other"}>Other</option>
                    </Field>
                    <ErrorMessage
                      name="role"
                      component="span"
                      className="error-message"
                    />
                  </Form.Group>
                </div>
              </div>
              <div className="mt-1">
                <Form.Group controlId="role">
                  <Form.Label className="form-control-label">
                    <h6>Skills</h6>
                  </Form.Label>
                  <TagsInput
                    value={skills}
                    onChange={setSkills}
                    name="fruits"
                    placeHolder="Skills"
                  />
                </Form.Group>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <Form.Group controlId="documents">
                    <Form.Label className="form-control-label">
                      <h6>Upload Resume</h6>
                    </Form.Label>

                    <div>
                      {picture ||
                        (data?.resume && (
                          <a
                            href={picture || data?.resume}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View Document
                          </a>
                        ))}
                      <br />
                      <input
                        type="file"
                        accept="image/gif,image/jpeg,image/png,image/bmp,application/pdf,application/doc, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/xml, text/csv, .xml, text/xml"
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          imageOnChange(e)
                        }
                        className="form-control-alternative form-control field-input mt-2"
                        name="documents"
                        autoComplete="off"
                        placeholder="Upload New Document"
                      />
                    </div>
                  </Form.Group>
                </div>
              </div>
              <div className="row mt-4">
                <div className="col-md-12 m-auto text-center">
                  <Button className="btn btn-primary w-50" type="submit">
                    {type == PAGE_TYPE_ADD ? "Add" : "Update"}
                  </Button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default ActionScreen;
