import React, { useState } from "react";
import { Button, Form, FormGroup, InputGroup, Modal } from "react-bootstrap";
import {
  Formik,
  Field,
  ErrorMessage as FormikForm,
  ErrorMessage,
} from "formik";
import * as Yup from "yup";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { InputGroupText } from "reactstrap";
import ApiFeature from "@/Api/ApiFeature";
import ShowToast, { success } from "../Utils/ShowToast";

const ConfirmPassword: React.FC<any> = (props) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showConfimModal, setShowConfirmModal] = useState(true);
  const email = props.otpData.email;
  console.log(email);

  const handleSubmit = async (values: any) => {
    console.log("Out of Confirm Password Modal");

    values.newPassword = values.newPassword?.trim();
    values.confirmNewPassword = values.confirmNewPassword?.trim();
    try {
      const response = await ApiFeature.post("user/forgetPassword", values);
      if (response.status === 200) {
        ShowToast(success, "password changed");
        props.onClose("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const SignupSchema = Yup.object().shape({
    newPassword: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .max(8, "Password can be at most 8 characters"),
    // .required('Password is required'),
    confirmNewPassword: Yup.string().oneOf(
      [Yup.ref("newPassword"), null as unknown as string],
      "Passwords must match"
    ),
  });

  return (
    <>
      <Modal
        show={props.show}
        onHide={() => {
          props.onClose("none");
        }}
        dialogClassName="modal-md"
        backdrop="static"
        style={{ marginLeft: "23px" }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Enter your new Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            enableReinitialize={true}
            initialValues={{
              email: email || "",
              newPassword: "",
              confirmNewPassword: "",
            }}
            validationSchema={SignupSchema}
            onSubmit={handleSubmit}
          >
            {({ values, handleSubmit }) => (
              <Form onSubmit={handleSubmit}>
                <div className="mt-2"></div>
                <div className="row mt-4">
                  <div className="col-md-12">
                    <Form.Group controlId="newPassword">
                      <Form.Label className="form-control-label">
                        <h6>Enter New Password</h6>
                      </Form.Label>
                      <InputGroup>
                        <Field
                          type={showPassword ? "text" : "password"}
                          className="form-control-alternative form-control"
                          name="newPassword"
                          autoComplete="off"
                          style={{
                            backgroundColor: "#eee",
                            border: "none",
                          }}
                        />
                        <InputGroupText
                          onClick={() => setShowPassword(!showPassword)}
                          style={{ cursor: "pointer" }}
                        >
                          {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                        </InputGroupText>
                      </InputGroup>
                      <ErrorMessage
                        name="newPassword"
                        component="span"
                        className="error-message"
                      />
                    </Form.Group>
                  </div>
                  <div className="col-md-12">
                    <Form.Group controlId="confirmNewPassword">
                      <Form.Label className="form-control-label">
                        <h6>Confirm password</h6>
                      </Form.Label>
                      <InputGroup>
                        <Field
                          type={showConfirmPassword ? "text" : "password"}
                          className="form-control-alternative form-control"
                          name="confirmNewPassword"
                          autoComplete="off"
                          style={{
                            backgroundColor: "#eee",
                            border: "none",
                            // padding: '8px 15px',
                            // width: '100%',
                            // margin: '0',
                          }}
                        />
                        <InputGroupText
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          style={{ cursor: "pointer" }}
                        >
                          {showConfirmPassword ? (
                            <FaRegEye />
                          ) : (
                            <FaRegEyeSlash />
                          )}
                        </InputGroupText>
                      </InputGroup>

                      <ErrorMessage
                        name="confirmNewPassword"
                        component="span"
                        className="error-message"
                      />
                    </Form.Group>
                  </div>
                </div>

                <div className="row mt-4">
                  <div className="col-md-12 m-auto text-center">
                    <Button
                      className="my-4 d-block mx-auto w-50"
                      color="primary"
                      type="submit"
                    >
                      Update Password
                    </Button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ConfirmPassword;
