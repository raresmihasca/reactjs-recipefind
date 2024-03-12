import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { register } from "../../slices/Auth";
import { clearMessage } from "../../slices/Message";
import "./Register.css";
import TimedPopup from "../../components/popup/TimedPopup";
import AuthService from "../../services/AuthService";

const Register = () => {
  const [successful, setSuccessful] = useState(false);
  const navigate = useNavigate();
  const { message } = useSelector((state) => state.message);
  const dispatch = useDispatch();

  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupMessageType, setPopupMessageType] = useState("");

  useEffect(() => {
    dispatch(clearMessage());
  }, [dispatch]);

  const initialValues = {
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    firstName: Yup.string()
      .test(
        "len",
        "The firstName must be between 3 and 20 characters.",
        (val) =>
          val &&
          val.toString().length >= 3 &&
          val.toString().length <= 20
      )
      .required("This field is required!"),
    lastName: Yup.string()
      .test(
        "len",
        "The lastName must be between 3 and 20 characters.",
        (val) =>
          val &&
          val.toString().length >= 3 &&
          val.toString().length <= 20
      )
      .required("This field is required!"),
    email: Yup.string()
      .email("This is not a valid email.")
      .required("This field is required!"),
    password: Yup.string()
      .test(
        "len",
        "The password must be between 6 and 40 characters.",
        (val) =>
          val &&
          val.toString().length >= 6 &&
          val.toString().length <= 40
      )
      .required("This field is required!"),
  });

  const handleRegister = (formValue) => {
    const { firstName, lastName, phone, email, password } = formValue;

    setSuccessful(false);
    AuthService.register(firstName, lastName, email, phone, password)
      .then(() => {
        // setSuccessful(true);
        setPopupMessage("Account created successfully! Redirecting...");
        setPopupMessageType("success");
        setIsPopupVisible(true);
      })
      .catch((error) => {
        setSuccessful(false);
        setIsPopupVisible(true)
        setPopupMessage(error.response.data.message);
        setPopupMessageType("error");
      });
  };

  return (
  <>
    {isPopupVisible && (<TimedPopup message={popupMessage} isVisible={isPopupVisible} setIsVisible={setIsPopupVisible}
                                    messageType={popupMessageType} timer={2000} redirect={`/login`}></TimedPopup>)}
                                    
    <div className="background-wrapper-register sign-up-form-resize">
      <div className="container-register right-panel-active" id="container">
      <div className="form-container sign-up-container">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleRegister}
        >
          {({ errors, touched }) => (
            <Form className="form-register">
              {!successful && (
                <div>
                  <h1>Create Account</h1>
                  <div className="form-group">
                    <label htmlFor="firstName" className="label-login">First Name</label>
                    <Field
                      name="firstName"
                      type="text"
                      className={
                        "form-control custom-input" +
                        (errors.firstName && touched.firstName
                          ? " is-invalid"
                          : "")
                      }
                    />
                    <ErrorMessage
                      name="firstName"
                      component="div"
                      className="invalid-feedback"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName" className="label-login">Last Name</label>
                    <Field
                      name="lastName"
                      type="text"
                      className={
                        "form-control custom-input" +
                        (errors.lastName && touched.lastName
                          ? " is-invalid"
                          : "")
                      }
                    />
                    <ErrorMessage
                      name="lastName"
                      component="div"
                      className="invalid-feedback"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="phone" className="label-login">Phone</label>
                    <Field
                      name="phone"
                      type="text"
                      className={
                        "form-control custom-input" +
                        (errors.phone && touched.phone
                          ? " is-invalid"
                          : "")
                      }
                    />
                    <ErrorMessage
                      name="phone"
                      component="div"
                      className="invalid-feedback"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email" className="label-login">Email</label>
                    <Field
                      name="email"
                      type="email"
                      className={
                        "form-control custom-input" +
                        (errors.email && touched.email ? " is-invalid" : "")
                      }
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="invalid-feedback"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="password" className="label-login">Password</label>
                    <Field
                      name="password"
                      type="password"
                      className={
                        "form-control custom-input" +
                        (errors.password && touched.password
                          ? " is-invalid"
                          : "")
                      }
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="invalid-feedback"
                    />
                  </div>

                  <div className="form-group">
                    <button type="submit" className="custom-button">
                      Sign Up
                    </button>
                  </div>
                  <div className="form-group">
                    <p>Already have an account? <a href="/login">Login now</a></p>
                  </div>
                </div>
              )}
            </Form>
          )}
        </Formik>
      </div>
      <div class="overlay-container">
        <div class="overlay-register">
            <div class="overlay-panel overlay-left">
                <h1>Hello, Friend!</h1> 
                 <p>Enter your personal details and start journey with us</p>
            </div>
        </div>
    </div>
    </div>
    </div>
  </>
  );
};

export default Register;