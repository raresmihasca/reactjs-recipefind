import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {  Link, useNavigate } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import './Login.css';
import { login } from "../../slices/Auth";
import { clearMessage } from "../../slices/Message";
import TimedPopup from "../../components/popup/TimedPopup";

const Login = () => {

  const [successful, setSuccessful] = useState(false);

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { isLoggedIn } = useSelector((state) => state.auth);
  const { message } = useSelector((state) => state.message);
  const dispatch = useDispatch();

  const [isPopupVisible, setIsPopupVisible] = useState(false);

  useEffect(() => {
    dispatch(clearMessage());
  }, [dispatch]);

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().required("This field is required!"),
    password: Yup.string().required("This field is required!"),
  });

  const handleLogin = (formValue) => {
    const { email, password } = formValue;
    setLoading(true);

    dispatch(login({ email, password }))
      .unwrap()
      .then(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        const userRole=user.roles[0];
        if(userRole==="ROLE_ADMIN"){
          navigate("/admin/shifts");
        }else if(userRole==="ROLE_MEDIC"){
            navigate("/medic/dashboard/calendar");
        }else{
          navigate("/")
        }
        window.location.reload();
        setIsPopupVisible(true);
      })
      .catch(() => {
        setLoading(false);
        setIsPopupVisible(true);
      });
  };

  if (isLoggedIn) {
    navigate("/account")
  }

  return (
  <>
      {isPopupVisible && (<TimedPopup message={message} isVisible={isPopupVisible} setIsVisible={setIsPopupVisible} messageType={successful?"success":"error"}></TimedPopup>)}
    <div className="background-wrapper-login login-form-resize">
      <div className="container-login right-panel-active" id="container">
        <div className="form-container sign-in-container">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleLogin}
      >
        {({ errors, touched }) => (
          <Form className="form-login">
              <div>
                <h1>Sign In</h1>
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
                    Sign In
                  </button>
                </div>
                <div className="form-group">
                  
                   <Link to="/forgot-password">Forgot Password?</Link>
                </div>
              </div>
          </Form>
        )}
      </Formik>
    </div>
    <div class="overlay-container">
      <div class="overlay-login">
          <div class="overlay-panel overlay-right">
              <h1>Welcome Back!</h1> 
               <p>To keep connected with us please login with your personal info</p> 
          </div>
      </div>
  </div>
  </div>
  </div>
  </>
);
};

export default Login;