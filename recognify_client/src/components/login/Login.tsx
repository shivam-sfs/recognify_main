import Image from "next/image";
import { GoogleLogin } from "@react-oauth/google";
import { AnyAction } from "redux";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { LoginWithCredential, googleLogin } from "@/redux/actions/login";
import { removeRememberMe, setRememberMe } from "@/redux/reducer/rememberMe";
import { useEffect, useState } from "react";
import { RootState } from "@/redux/store";
import { MdEmail } from "react-icons/md";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import ForgotPassword from "./ForgotPassword";
import OtpVerify from "./OtpVerify";
import ConfirmPassword from "./ConfirmPassword";
import logo from "../../../public/logo.png"
import {
  CONFIRM_PASSWORD_PAGE,
  FORGOT_PASSWORD_PAGE,
  LOGO_SRC,
  OTP_PAGE,
} from "../Utils/constants";

const Login = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const data = useSelector((state: RootState) => state.rememberme);
  const [formInitData, setFormInitData] = useState({
    email: data.email || "",
    password: data.password || "",
    rememberme: data.rememberme || false,
  });
  const [passwordHide, setPasswordHide] = useState(true);
  const [forgotEmail, setForgotEmail] = useState("");
  const [actionType, setActionType] = useState<string>("");

  const getGoogleData = async (token: string | undefined) => {
    dispatch(googleLogin(token) as unknown as AnyAction);
  };

  const onLoginSubmit = (e: RememberMeState) => {
    dispatch(
      LoginWithCredential({
        email: e.email,
        password: e.password,
      }) as unknown as AnyAction
    );
    if (e.rememberme) {
      dispatch(
        setRememberMe({
          email: e.email,
          password: e.password,
          rememberme: e.rememberme,
        })
      );
    } else {
      dispatch(removeRememberMe());
    }
  };

  useEffect(() => {
    setFormInitData({ ...data });
  }, [data]);

  return (
    <>
      {actionType === FORGOT_PASSWORD_PAGE && (
        <ForgotPassword
          show={actionType === FORGOT_PASSWORD_PAGE}
          onClose={setActionType}
          otpData={""}
          setEmail={setForgotEmail}
        />
      )}
      {actionType === OTP_PAGE && (
        <OtpVerify
          show={actionType === OTP_PAGE}
          onClose={setActionType}
          otpData={{ email: forgotEmail }}
        />
      )}
      {actionType === CONFIRM_PASSWORD_PAGE && (
        <ConfirmPassword
          show={actionType === CONFIRM_PASSWORD_PAGE}
          onClose={setActionType}
          otpData={{ email: forgotEmail }}
        />
      )}
      <section className=" overflow-hidden">
        <div className="container5  text-lg-start">
          <div className="d-flex justify-content-center align-items-center" style={{height:"100vh"}}>
            <div className="col-lg-6 mb-5 mb-lg-0 position-relative d-flex justify-content-center align-items-center">
              <div className="card bg-glass w-70">
                <div className="card-body px-4 py-5 px-md-5">
                  <Formik
                    initialValues={formInitData}
                    validate={(value) => {
                      const errors: farmError = {};
                      if (!value.email) {
                        errors.email = "Required";
                      } else if (
                        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
                          value.email
                        )
                      ) {
                        errors.email = "Invalid email address";
                      } else if (!value.password) {
                        errors.password = "Required";
                      } else if (value.password.length < 8) {
                        errors.password =
                          "password must be at least 6 characters";
                      }
                      return errors;
                    }}
                    onSubmit={onLoginSubmit}
                  >
                    {() => (
                      <Form>
                        <div className="form-outline mb-4">
                          <div className="d-flex h-100 w-100 justify-content-center align-item-center p-5 mb-3 position-relative z-index-3">
                            <Image
                              src={logo}
                              width={300}
                              height={45}
                              alt={"logo"}
                              className="object-fit-contain"
                            />
                          </div>
                          <ErrorMessage
                            name="email"
                            className="text-danger"
                            component="div"
                          />
                          <div className="form-control d-flex justify-content-center align-items-center">
                            <MdEmail
                              size={18}
                              className="d-inline-block mr-2"
                            />
                            <Field
                              type="email"
                              name="email"
                              className="border-0 h-100 w-100 form-control"
                            />
                          </div>
                          <label className="form-label" htmlFor="form3Example3">
                            Email address
                          </label>
                        </div>

                        <div className="form-outline mb-4">
                          <ErrorMessage
                            name="password"
                            className="text-danger"
                            component="div"
                          />
                          <div className="form-control d-flex justify-content-center align-items-center">
                            <span
                              onClick={() => setPasswordHide((pre) => !pre)}
                            >
                              {passwordHide ? (
                                <FaRegEyeSlash
                                  size={18}
                                  className="d-inline-block mr-2"
                                />
                              ) : (
                                <FaRegEye
                                  size={18}
                                  className="d-inline-block mr-2"
                                />
                              )}
                            </span>

                            <Field
                              type={passwordHide ? "password" : "text"}
                              name="password"
                              className="border-0 h-100 w-100 form-control"
                            />
                          </div>
                          <label className="form-label" htmlFor="form3Example4">
                            Password
                          </label>
                        </div>
                        <label className="mt-4  d-flex align-items-center">
                          <Field type="checkbox" name="rememberme" />
                          <span className="sign__in__checkbox__text">
                            Remember me
                          </span>
                        </label>
                        {/* <label className="mt-4  d-flex flex-row-reverse">
                          <span
                            className="sign__in__checkbox__text"
                            onClick={() => setActionType(FORGOT_PASSWORD_PAGE)}
                          >
                            Forgot password
                          </span>
                        </label> */}
                        <div className="d-flex justify-content-center">
                          <button
                            type="submit"
                            className="btn btn-primary btn-block mb-4"
                          >
                            Login
                          </button>
                        </div>

                        <div className="d-flex justify-content-center">
                          {/* <GoogleLogin
                            onSuccess={(credentialResponse) => {
                              console.log(credentialResponse);
                              getGoogleData(credentialResponse.credential);
                            }}
                            onError={() => {
                              console.log("Login Failed");
                            }}
                          /> */}
                        </div>
                      </Form>
                    )}
                  </Formik>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
