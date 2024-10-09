// OtpVerify.jsx
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import OtpInput from "react-otp-input";

import ApiFeature from "@/Api/ApiFeature";
import { CONFIRM_PASSWORD_PAGE } from "../Utils/constants";

const OtpVerify: React.FC<any> = (props) => {
  const email = props.otpData.email;
  const [otp, setOtp] = useState("");
  const [resendTimer, setResendTimer] = useState(10);

  useEffect(() => {
    let timer: string | number | NodeJS.Timeout | undefined;
    if (resendTimer > 0) {
      timer = setTimeout(() => {
        setResendTimer(resendTimer - 1);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const handleVerify = async (values: any) => {
    const formData = {
      email: email,
      userEnteredOtp: otp,
    };
    try {
      const responseData = await ApiFeature.post("user/check-otp", formData);
      if (responseData.status === 200) {
        const res = responseData.user.email;
        props.onClose(CONFIRM_PASSWORD_PAGE);
        setOtp("");
      } else {
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const HandleResendOtp = async () => {
    const paylaod = {
      email: email,
    };
    try {
      const response = await ApiFeature.post("user/send-mail-otp", paylaod);
      if (response.status === 200) {
        setResendTimer(10);
      } else {
        console.log(" OTP did'nt received!!!  ");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Modal
        show={props.show}
        onHide={() => {
          props.onClose("");
        }}
        dialogClassName="modal-md"
        backdrop="static"
        style={{ marginLeft: "23px" }}
      >
        <Modal.Header closeButton>
          <Modal.Title>OTP Verification </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row justify-content-center">
            <div
              className="col-12 col-md-6 col-lg-4"
              style={{ minWidth: "500px" }}
            >
              <div
                className="card bg-white mb-5 mt-4 border-0"
                style={{ boxShadow: "0 12px 15px rgba(0, 0, 0, 0.02)" }}
              >
                <div className="card-body p-5 text-center">
                  <h4>Verify</h4>
                  <p>Your code was sent to you via email</p>
                  <br />
                  <div className="otp-field mb-4">
                    <OtpInput
                      value={otp}
                      onChange={setOtp}
                      numInputs={6}
                      renderSeparator={<span> &nbsp; &nbsp;</span>}
                      renderInput={(props: any) => (
                        <input {...props} style={{ width: "50px" }} />
                      )}
                    />
                  </div>
                  <button
                    className="btn btn-primary mb-3"
                    onClick={handleVerify}
                  >
                    Verify
                  </button>
                  {resendTimer && resendTimer ? (
                    <p className="resend text-muted mb-0">
                      Resend OTP{" "}
                      <span
                        style={{ color: "red" }}
                      >{`${resendTimer} Sec`}</span>
                    </p>
                  ) : (
                    <p className="resend text-muted mb-0">
                      Didn&#39;t receive code?{" "}
                      <a
                        className="cursor-pointer resend"
                        onClick={() => HandleResendOtp()}
                      >
                        Request again
                      </a>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default OtpVerify;
