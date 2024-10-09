import React, { ChangeEvent, useEffect, useState } from "react";
import { Button, Form, FormGroup, Modal } from "react-bootstrap";
import { Formik, Field, ErrorMessage, Form as FormikForm } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import Image from "next/image";
import { setLoader } from "@/redux/reducer/loader";
import { RootState } from "@/redux/store";
import ShowToast, { errorMessage } from "@/components/Utils/ShowToast";
import ApiFeature from "@/Api/ApiFeature";
import { setRecallApi } from "@/redux/reducer/RecallApi";
import { setToken } from "@/redux/reducer/login";
interface userType {
  user_id: number;
  email: string;
  image: string;
  oldImage: string;
  role: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  company_name: string;
  address: string;
  is_active: number;
  created_at: string;
}

const UserProfile = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [picture, setPicture] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const token = useSelector(
    (state: RootState) => state.login?.userToken?.token
  );
  const userID = useSelector(
    (state: RootState) => state.login?.userToken?.user_id
  );
  const userData: any = useSelector(
    (state: RootState) => state.login?.userToken
  );

  const imageOnChange = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e?.target.files && e?.target.files?.length > 0) {
      setLogoFile(e.target.files[0]);
      file2Base64(e.target.files[0]).then((img: string) => {
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

  const initialValues = {
    image: userData?.image || "",
    oldImage: userData?.oldImage || "",
    first_name: userData?.first_name || "",
    last_name: userData?.last_name || "",
    password: "",
    email: userData?.email || "",
    role: userData?.role || "",
    address: userData?.address || "",
    phone_number: userData?.phone_number || "",
    company_name: userData?.company_name || "",
  };
  const MAX_FILE_SIZE_BYTES = 1024 * 1024 * 1;

  const isScreenSizeXL = window.innerWidth >= 1200 && window.innerWidth < 1400;
  const tableResponsiveClass = isScreenSizeXL
    ? "table-responsive-xl"
    : "table-responsive-xxl";

  const backToCustomer = () => {
    router.back();
  };
  return (
    <>
      <div className="card">
        <div className={`card-datatable ${tableResponsiveClass}`}>
          <div className="dataTables_wrapper dt-bootstrap5">
            <div className="card-header flex-column flex-md-row d-flex justify-content-between align-items-center mb-3">
              <h4 className="col-md-6 mb-2 mb-md-0">User Profile</h4>
              <div
                className="btn-close p-2"
                onClick={() => backToCustomer()}
              ></div>
            </div>
            <div className="row w-100 m-auto">
              <Formik
                enableReinitialize={true}
                initialValues={initialValues}
                validationSchema={Yup.object().shape({
                  first_name: Yup.string()
                    .matches(/^[a-zA-Z]+$/, "Invalid name format")
                    .required("First Name is required")
                    .min(2, "First Name must be at least 2 characters")
                    .max(30, "First Name can be at most 30 characters"),
                  last_name: Yup.string()
                    .matches(/^[a-zA-Z]+$/, "Invalid Last Name format")
                    .required("Last Name is required")
                    .min(2, "Last Name must be at least 2 characters")
                    .max(30, "Last Name can be at most 30 characters"),
                  email: Yup.string()
                    .required("Email is required")
                    .email("Invalid email format")
                    .max(100, "Email can be at most 100 characters"),
                  role: Yup.string().required("Role is required"),
                  address: Yup.string()
                    .required("Address is required")
                    .min(8, "Address must be at least 8 characters")
                    .max(100, "Address Name can be at most 100 characters"),
                  phone_number: Yup.string()
                    .required("Phone Number is required")
                    .min(10, "Phone Number must be at least 10 digits")
                    .max(10, "Phone Number can be at most 10 digits")
                    .matches(
                      /^[0-9]+$/,
                      "Phone Number must contain only digits"
                    ),
                  password: Yup.string()
                    .min(8, "Password must be at least 8 characters")
                    .max(15, "Password can be at most 15 characters")
                    .notRequired(),
                })}
                onSubmit={async (values) => {
                  dispatch(setLoader(true));
                  try {
                    if (logoFile && logoFile.size > MAX_FILE_SIZE_BYTES) {
                      ShowToast(
                        errorMessage,
                        "Image size should not exceed 1 MB."
                      );
                      dispatch(setLoader(false));
                      return;
                    }
                    const formData = new FormData();
                    if (logoFile) {
                      formData.append("image", logoFile || values.image);
                      formData.append("oldImage", values.oldImage.trim());
                    }
                    formData.append("first_name", values.first_name.trim());
                    formData.append("last_name", values.last_name.trim());
                    if (values.password.trim() !== "") {
                      formData.append("password", values.password.trim());
                    }
                    formData.append("email", values.email.trim());
                    formData.append("role", values.role.toString());
                    formData.append("address", values.address.trim());
                    formData.append("phone_number", values.phone_number.trim());
                    formData.append("company_name", values.company_name.trim());

                    let res = await ApiFeature.put(
                      "user/update",
                      formData,
                      userID,
                      true
                    );

                    if (res.status == 200) {
                      console.log(res?.data);
                      dispatch(setLoader(false));
                      dispatch(setRecallApi(true));
                      dispatch(setToken(res?.data?.jwtToken));
                      router?.back();
                      setPicture("");
                      setLogoFile(null);
                    }
                  } catch (error) {
                    dispatch(setLoader(false));
                  } finally {
                    dispatch(setLoader(false));
                  }
                }}
              >
                {({ values, handleSubmit }) => (
                  <Form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-md-6 col-sm-12">
                        <Form.Label className="d-flex flex-column align-items-center">
                          <h5
                            style={{
                              marginBottom: "10px",
                              fontWeight: "bold",
                            }}
                          >
                            Upload user image
                          </h5>
                          <small style={{ color: "gray" }}>
                            Supported formats: JPG, PNG, JPEG / Max file size is
                            1MB
                          </small>
                        </Form.Label>
                        <div className="avatar-upload mb-3">
                          <div className="avatar-edit">
                            <input
                              type="file"
                              id="imageUpload"
                              accept=".png, .jpg, .jpeg"
                              onChange={(event) => imageOnChange(event)}
                            />
                            <label htmlFor="imageUpload"></label>
                          </div>
                          <div className="avatar-preview">
                            {picture || userData?.image ? (
                              <Image
                                src={
                                  picture ||
                                  userData?.image ||
                                  "/recognify/react/img/profile.png"
                                }
                                alt="Profile Image"
                                width={192}
                                height={192}
                                quality={100}
                                style={{
                                  position: "relative",
                                  borderRadius: "100%",
                                  objectFit: "cover",
                                  border: "6px solid #F8F8F8",
                                  boxShadow:
                                    " 0px 2px 4px 0px rgba(0, 0, 0, 0.1)",
                                }}
                              />
                            ) : (
                              <div className="upload-placeholder"></div>
                            )}
                          </div>
                          {/* <i className="d-flex justify-content-center mt-3">
                            Max file size is 1MB{' '}
                          </i> */}
                        </div>
                      </div>
                      <div className="col-md-6 col-sm-12">
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
                        <Form.Group controlId="email">
                          <Form.Label className="form-control-label">
                            <h6>Email</h6>
                          </Form.Label>
                          <Field
                            type="email"
                            className="form-control-alternative form-control field-input"
                            name="email"
                            disabled
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
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <Form.Group controlId="role">
                          <Form.Label className="form-control-label">
                            <h6>Role</h6>
                          </Form.Label>
                          <Field
                            as="select"
                            className="form-control-alternative form-control field-input"
                            name="role"
                            disabled
                          >
                            <option hidden value="">
                              Select a role
                            </option>
                            <option value={1}>Admin</option>
                            <option value={2}>Customer</option>
                            <option value={3}>Supplier</option>
                          </Field>
                          <ErrorMessage
                            name="role"
                            component="span"
                            className="error-message"
                          />
                        </Form.Group>
                      </div>
                      <div className="col-md-6">
                        <Form.Group controlId="phone_number">
                          <Form.Label className="form-control-label">
                            <h6>Phone Number</h6>
                          </Form.Label>
                          <Field
                            type="phone"
                            className="form-control-alternative form-control field-input"
                            name="phone_number"
                            autoComplete="off"
                            placeholder="Phone Number"
                          />
                          <ErrorMessage
                            name="phone_number"
                            component="span"
                            className="error-message"
                          />
                        </Form.Group>
                      </div>
                      {/* <div className="col-md-6">
                          <Form.Group controlId="password">
                            <Form.Label className="form-control-label">
                              <h6>Password</h6>
                            </Form.Label>
                            <Field
                              type="password"
                              className="form-control-alternative form-control field-input "
                              name="password"
                              autoComplete="off"
                              placeholder="Password"
                            />
                            <ErrorMessage
                              name="password"
                              component="span"
                              className="error-message"
                            />
                          </Form.Group>
                        </div> */}
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <Form.Group controlId="company_name">
                          <Form.Label className="form-control-label">
                            <h6>Company Name</h6>
                          </Form.Label>
                          <Field
                            type="text"
                            className="form-control-alternative form-control field-input"
                            name="company_name"
                            autoComplete="off"
                            placeholder="Company Name"
                          />
                        </Form.Group>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-12">
                        <Form.Group controlId="address">
                          <Form.Label className="form-control-label">
                            <h6>Address</h6>
                          </Form.Label>
                          <Field
                            as="textarea"
                            className="form-control-alternative form-control field-input"
                            name="address"
                            autoComplete="off"
                            rows={4}
                            placeholder="Address"
                          />
                          <ErrorMessage
                            name="address"
                            component="span"
                            className="error-message"
                          />
                        </Form.Group>
                      </div>
                    </div>
                    <div className="row mt-4">
                      <div className="col-md-12 m-auto text-center">
                        <Button className="btn btn-primary w-25" type="submit">
                          Update
                        </Button>
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
