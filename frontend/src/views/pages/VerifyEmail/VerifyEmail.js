import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { isEmptyOrSpaces } from "../../utils";
import { toast } from "react-toastify";
import axios from "axios";
import * as actions from "../../../redux/auth/action/actionCreate";
import { connect } from "react-redux";
import { handleError } from "../../../redux/auth/utility";
import { useState } from "react";

import {
  CButton,
  CCol,
  CContainer,
  CFormInput,
  CInputGroup,
  CRow,
  CForm,
} from "@coreui/react";

const VerifyEmail = ({
  logout,
  isAuthenticated,
  isTeacher,
  isVerified,
  isStudent,
}) => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state.auth);
  const [isLoading, setLoading] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const code = event.target.code.value;
    if (isEmptyOrSpaces(code)) {
      toast.error("Code can't be empty!");
    } else {
      setLoading(true);

      axios.defaults.headers = {
        "Content-Type": "application/json",
      };
      axios
        .post("http://127.0.0.1:8000/api/users/verify-account/", {
          email: state.email,
          otp: code,
        })
        .then((response) => {
          toast.success(response.data.message);
          dispatch(actions.authCheckState());

          setLoading(false);
        })
        .catch((error) => {
          //toast.error(error.response.data.message);
          setLoading(false);
          handleError(error);
        });
    }
  };
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  } else if (isAuthenticated && isTeacher && isVerified) {
    return <Navigate to="/dashboard/teacher" />;
  } else if (isAuthenticated && isStudent && isVerified) {
    return <Navigate to="/dashboard/student" />;
  }
  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CForm
          className="row g-3 needs-validation"
          noValidate
          onSubmit={handleSubmit}
        >
          {" "}
          <CRow className="justify-content-center">
            <CCol md={6}>
              <span className="clearfix">
                <h4 className="pt-3">Please verify your email !</h4>
                <p className="text-medium-emphasis float-start">
                  we sent an email to {state.email}
                </p>
              </span>

              <CInputGroup className="input-prepend">
                <CFormInput
                  type="text"
                  name="code"
                  placeholder="Enter 8 digit code"
                />

                {isLoading ? (
                  <CButton type="submit" color="dark" disabled>
                    please wait..
                  </CButton>
                ) : (
                  <CButton type="submit" color="dark">
                    Confirm
                  </CButton>
                )}
              </CInputGroup>
              <CInputGroup className="input-prepend">
                <CButton
                  color="dark"
                  style={{ width: "100%", marginTop: "10px" }}
                  onClick={() => logout()}
                >
                  Logout
                </CButton>
              </CInputGroup>
            </CCol>
          </CRow>
        </CForm>
      </CContainer>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token !== null,
    isTeacher: state.auth.isTeacher,
    isStudent: state.auth.isStudent,
    isVerified: state.auth.isVerified,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(actions.logout()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(VerifyEmail);
