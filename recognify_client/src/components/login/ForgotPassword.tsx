import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { ErrorMessage, Formik, Form } from "formik";
import * as Yup from "yup";
import { Button, FormGroup, Input, InputGroup, Label } from "reactstrap";
import ApiFeature from "@/Api/ApiFeature";
import { OTP_PAGE } from "../Utils/constants";

const ForgotPassword: React.FC<any> = (props) => {
  const { onClose, setEmail } = props;

  const [email, setInputEmail] = useState("");
  const SignupSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),
  });

  const handleSubmit = async (values: any) => {
    console.log("Inside the mail");
    try {
      values.email = values.email?.trim();
      const responseData = await ApiFeature.post("user/send-mail-otp", values);

      if (responseData.status === 200) {
        console.log("Response of Forgot Password", responseData);
        const otpRes = responseData.email;
        setEmail(otpRes);
        onClose(OTP_PAGE);
      } else {
        console.log("Mail not Sent");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <Modal
        show={props.show}
        onHide={() => {
          onClose("none");
        }}
        dialogClassName="modal-md"
        backdrop="static"
        style={{ marginLeft: "23px" }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Forgot Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* <span>Enter your mail for the Verification Process; we will send 6 digit code to your mail. </span> */}
          <Formik
            enableReinitialize={true}
            initialValues={{
              email,
            }}
            validationSchema={SignupSchema}
            onSubmit={handleSubmit}
          >
            <Form>
              <div className="mt-2">
                <span style={{ color: "blue" }}>
                  Enter your email for the verification process; we will send a
                  6-digit code to your email.
                </span>
              </div>
              <div className="row mt-4">
                <div className="col-md-12">
                  <FormGroup>
                    <Label className="d-flex"> Email</Label>
                    <InputGroup className="input-group-alternative">
                      {/* <InputGroupText>
                            <CiUser />
                          </InputGroupText> */}

                      <Input
                        placeholder="Enter Email"
                        type="email"
                        name="email"
                        id="email"
                        autoComplete="off"
                        onChange={(e) => setInputEmail(e.target.value)}
                        value={email}
                      />
                    </InputGroup>
                    <ErrorMessage
                      name="email"
                      component="span"
                      className="error-message"
                    />
                  </FormGroup>
                  <Button
                    className="my-4 d-block mx-auto w-100"
                    color="primary"
                    type="submit"
                  >
                    Continue
                  </Button>
                </div>
              </div>
            </Form>
          </Formik>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ForgotPassword;
