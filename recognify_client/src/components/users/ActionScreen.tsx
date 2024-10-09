import ApiFeature from "@/Api/ApiFeature";
import {setLoader} from "@/redux/reducer/loader";
import {RootState} from "@/redux/store";
import {ErrorMessage, Field, Formik, Form} from "formik";
import {Form as FormStrap} from "react-bootstrap";
import React, {ChangeEvent, useEffect, useState} from "react";
import {Modal} from "react-bootstrap";
import {useDispatch, useSelector} from "react-redux";
import Image from "next/image";
import * as Yup from "yup";
import ShowToast, {error, success} from "../Utils/ShowToast";
import base64Converter from "../Utils/Converter/base64Converter";
import {setRecallApi} from "@/redux/reducer/RecallApi";
// import { debounceFun } from "../Utils/Throttle";
import {
  MAX_FILE_SIZE_BYTES,
  PAGE_TYPE_ADD,
  PAGE_TYPE_EDIT,
  STATE_OPTION,
  USER_ROLE_TYPE_DATA,
  USER_ROLE_TYPE_KEY,
} from "../Utils/constants";
import Select from 'react-select';
import TagsInput from 'react-tagsinput'
import MapComponent, {Coordinates} from "../Utils/map/automap";



const ActionScreen: React.FC<ActionModalType> = (props) => {
  const role = useSelector((state: RootState) => state.login.userToken?.role);

  // props
  const {id, onClose, isActive, data, type, urls, path} = props;

  const [Coordinates, setCoordinates] = useState<Coordinates>(type == PAGE_TYPE_ADD ? {lat: 22, lng: 78} : {lat: (data?.coordinates || [])[0] || 22, lng: (data?.coordinates || [])[1] || 78})
  // profile max size

  // user role

  // validation logic
  const validation = {
    first_name: Yup.string()
      .required("First Name is required")
      .min(2, "First Name must be at least 2 characters")
      .max(50, "First Name can be at most 50 characters"),
    last_name: Yup.string()
      .required("Last Name is required")
      .min(2, "Last Name must be at least 2 characters")
      .max(50, "Last Name can be at most 50 characters"),
    email: Yup.string()
      .required("Email is required")
      .email("Invalid email format")
      .max(100, "Email can be at most 100 characters"),
    password: Yup.string().optional(),
    role: Yup.string().required("Role is required"),
    contact_number: Yup.string()
      .required("Phone Number is required")
      .min(10, "Phone Number must be at least 10 digits")
      .max(10, "Phone Number can be at most 10 digits")
      .matches(/^[0-9]+$/, "Phone Number must contain only digits"),
    zip_code: Yup.number().required('Zip Code is required'),
    local_area: Yup.array().of(Yup.number()).optional(),
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
  };

  const [base64File, setBase64File] = useState("");
  const [formDataImg, setFormDataImg] = useState<File | null>();
  const [useInitData] = useState<editUserType>({
    first_name: type == PAGE_TYPE_ADD ? "" : data.first_name,
    last_name: type == PAGE_TYPE_ADD ? "" : data.last_name,
    email: type == PAGE_TYPE_ADD ? "" : data.email,
    role: type == PAGE_TYPE_ADD ? "" : data.role,
    contact_number: type == PAGE_TYPE_ADD ? "" : data.contact_number,
    password: type == PAGE_TYPE_ADD ? "" : data.password,
    zip_code: type == PAGE_TYPE_ADD ? 480001 : data.zip_code,
    local_area: type == PAGE_TYPE_ADD ? [] : data.local_area,
    city: type == PAGE_TYPE_ADD ? "" : data.city,
    state: type == PAGE_TYPE_ADD ? "" : data.state,
    address: type == PAGE_TYPE_ADD ? "" : data.address,
    coordinates: type == PAGE_TYPE_ADD ? {lat: 22, lng: 78} : {lat: (data?.coordinates || [])[0] || 22, lng: (data?.coordinates || [])[1] || 78}
  });

  //   Hooks
  const dispatch = useDispatch();

  // Image convert in base 64 format
  const onImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event?.target?.files?.length) {
      if (event.target.files[0].size > MAX_FILE_SIZE_BYTES) {
        event.target.value = "";
        ShowToast(error, "Image size should not exceed 1 MB.");
      } else {
        const File = event.target.files[0];
        setFormDataImg(File);
        base64Converter(File).then((file) => setBase64File(file));
      }
    }
  };

  //   from submit
  const onsubmit = async (value: any) => {
    dispatch(setLoader(true));
    try {
      const formData = new FormData();
      if (formDataImg) {
        formData.append("image", formDataImg);
        if (type === PAGE_TYPE_EDIT) {
          formData.append("oldImage", data.image);
        }
      }
      formData.append("first_name", value.first_name.trim());
      formData.append("last_name", value.last_name.trim());
      formData.append("email", value.email.trim());
      formData.append("role", value.role.toString());
      formData.append("contact_number", value.contact_number);
      if (value.password) formData.append("password", value.password.trim())
      formData.append("zip_code", value.zip_code);
      (value.local_area || []).map((zip: any) => {
        formData.append("local_area[]", zip);
      })
      Object.values(Coordinates).map((latlng: string) => {
        formData.append("coordinates[]", latlng);
      })
      formData.append("city", value.city.trim());
      formData.append("state", value.state.trim());
      let res;
      if (type === PAGE_TYPE_ADD) {
        res = await ApiFeature.post(urls, formData, 0, true);
      } else {
        res = await ApiFeature.put(urls, formData, data._id, true);
      }

      if (res.status == 200) {
        dispatch(setLoader(false));
        dispatch(setRecallApi(true));
        setFormDataImg(null);
        setBase64File("");
        onClose("");
      }
    } catch (error) {
      console.log(error);
      dispatch(setLoader(false));
    } finally {
      dispatch(setLoader(false));
    }
  };

  return (
    <Modal
      show={isActive}
      onHide={() => onClose("")}
      dialogClassName="modal-lg bg-glass"
      style={{marginLeft: "23px"}}
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <h3> {type == PAGE_TYPE_ADD ? "Add " : "Edit "} {path}</h3>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          enableReinitialize={true}
          onSubmit={onsubmit}
          initialValues={useInitData}
          validationSchema={Yup.object().shape(validation)}
        >
          {({values, setValues}) => (
            <Form>
              <div className="d-flex gap-column justify-content-between ">
                {/* image */}
                <div className="avatar-upload mb-3 ">
                  <div className="avatar-edit">
                    <input
                      type="file"
                      id="imageUpload"
                      accept=".png, .jpg, .jpeg"
                      onChange={onImageChange}
                    />
                    <label htmlFor="imageUpload"></label>
                  </div>
                  <div className="position-relative avatar-preview">
                    <Image
                      src={
                        type == PAGE_TYPE_ADD
                          ? base64File || "/assets/img/profile.png"
                          : base64File ||
                          data.image ||
                          "/assets/img/profile.png"
                      }
                      alt="profile Image"
                      width={200}
                      height={200}
                      className="rounded-circle object-fit-cover"
                    />
                  </div>
                </div>
                {/* name */}
                <div className="w-50">
                  {/* first name */}
                  <div className="w-100">
                    <FormStrap.Label className="form-control-label">
                      <h6>First Name</h6>
                    </FormStrap.Label>
                    <Field
                      type="text"
                      id="first_name"
                      placeholder="First Name"
                      name="first_name"
                      className="form-control-alternative form-control w-100"
                    />
                    <ErrorMessage
                      className="text-danger"
                      name="first_name"
                      component="div"
                    />
                  </div>
                  {/* last name */}
                  <div className="">
                    <FormStrap.Label className="form-control-label">
                      <h6>Last Name</h6>
                    </FormStrap.Label>
                    <Field
                      type="text"
                      placeholder="Last Name"
                      id="last_name"
                      name="last_name"
                      className="form-control-alternative form-control "
                    />
                    <ErrorMessage
                      className="text-danger"
                      name="last_name"
                      component="div"
                    />
                  </div>
                  {/* email uneditable */}
                  <div className="">
                    <FormStrap.Label className="form-control-label">
                      <h6>Email</h6>
                    </FormStrap.Label>
                    <Field
                      type="email"
                      placeholder="Email"
                      name="email"
                      id="email"
                      disabled={type === PAGE_TYPE_ADD ? false : true}
                      className="form-control-alternative form-control "
                    />
                    <ErrorMessage
                      className="text-danger"
                      name="email"
                      component="div"
                    />
                  </div>
                </div>
              </div>
              <div className="d-flex gap-column justify-content-between ">
                <div className="w-50">
                  {/* phone */}
                  <div className="">
                    <FormStrap.Label className="form-control-label">
                      <h6>Phone Number</h6>
                    </FormStrap.Label>
                    <Field
                      type="number"
                      placeholder="phone Number"
                      name="contact_number"
                      id="contact_number"
                      className="form-control-alternative form-control"
                    />
                    <ErrorMessage
                      className="text-danger"
                      name="contact_number"
                      component="div"
                    />
                  </div>
                  {/* role */}
                  <div>
                    <FormStrap.Label className="form-control-label">
                      <h6>Role</h6>
                    </FormStrap.Label>
                    <Field
                      as="select"
                      name="role"
                      id="role"
                      className="form-control-alternative form-control"
                    >


                      {role === 'admin' ? <>
                        <option value="" selected disabled hidden>
                          select role
                        </option>{USER_ROLE_TYPE_KEY.map(
                          (value: string, index: number) => {
                            return (
                              <option key={index} value={USER_ROLE_TYPE_DATA[
                                value as unknown as keyof typeof USER_ROLE_TYPE_DATA
                              ]}>
                                {
                                  USER_ROLE_TYPE_DATA[
                                    value as unknown as keyof typeof USER_ROLE_TYPE_DATA
                                  ].toUpperCase()
                                }
                              </option>
                            );
                          }
                        )}</> : <option selected value="user">
                        USER
                      </option>}
                    </Field>
                    <ErrorMessage
                      className="text-danger"
                      name="role"
                      component="div"
                    />
                  </div>{/* zip */}
                  {values.role == "broker" &&
                    <div className="">
                      <FormStrap.Label className="form-control-label">
                        <h6>Area (press Enter to add zip)</h6>
                      </FormStrap.Label>
                      <TagsInput
                        value={values.local_area || []}
                        onChange={(zip: number[]) => {setValues({...values, local_area: zip})}}
                        inputProps={{placeholder: 'zip codes'}}
                      />
                      <ErrorMessage name="local_area" component="div" />
                    </div>}
                  {/* zip code in add */}
                  {type == PAGE_TYPE_ADD && <div className="">
                    <FormStrap.Label className="form-control-label">
                      <h6>zip codes</h6>
                    </FormStrap.Label>
                    <Field
                      type="text"
                      id="zip_code"
                      name="zip_code"
                      placeholder="Enter zip codes"
                      className="form-control-alternative form-control "
                    />
                    <ErrorMessage name="zip_code" component="div" />
                  </div>}

                </div>
                <div className="w-50">
                  {/* password */}
                  {type == PAGE_TYPE_ADD && <div className="">
                    <FormStrap.Label className="form-control-label">
                      <h6>Password</h6>
                    </FormStrap.Label>
                    <Field
                      type="password"
                      placeholder="Password"
                      id="password"
                      name="password"
                      className="form-control-alternative form-control "
                    />
                    <ErrorMessage
                      className="text-danger"
                      name="password"
                      component="div"
                    />
                  </div>}

                  <div className="">

                    <FormStrap.Label className="form-control-label">
                      <h6>State</h6>
                    </FormStrap.Label>
                    <Select id="state" placeholder="State" name="state"
                      options={STATE_OPTION || {value: "", lable: ""}} className="form-control-alternative form-control "
                      defaultValue={{value: values.state, label: values.state}}
                      onChange={(selectedOption) =>
                        setValues({...values, state: selectedOption ? selectedOption.value : ''})
                      }
                    />

                    <ErrorMessage name="state" component="div" />
                  </div>

                  {/* city */}
                  <div className="">
                    <FormStrap.Label className="form-control-label">
                      <h6>City</h6>
                    </FormStrap.Label>
                    <Field
                      type="city"
                      placeholder="city"
                      id="city"
                      name="city"
                      className="form-control-alternative form-control "
                    />
                    <ErrorMessage
                      className="text-danger"
                      name="city"
                      component="div"
                    />
                  </div>

                  {/* zip code in edit */}
                  {
                    type !== PAGE_TYPE_ADD && <div className="">
                      <FormStrap.Label className="form-control-label">
                        <h6>zip codes</h6>
                      </FormStrap.Label>
                      <Field
                        type="text"
                        id="zip_code"
                        name="zip_code"
                        placeholder="Enter zip codes"
                        className="form-control-alternative form-control "
                      />
                      <ErrorMessage name="zip_code" component="div" />
                    </div>
                  }
                </div>
              </div>
              {/* address */}
              <div className="">
                <MapComponent setCoordinates={setCoordinates} Coordinates={Coordinates} />
              </div>
              {/* submit */}
              <div className="w-100 d-flex justify-content-center">
                <button
                  type="submit"
                  className="btn btn-primary mt-5 d-block text-uppercase"
                >
                  {type == PAGE_TYPE_ADD ? "Add " : "Update "}{path}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default ActionScreen;
