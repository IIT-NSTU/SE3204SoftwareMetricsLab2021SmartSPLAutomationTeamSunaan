import React from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import { connect } from "react-redux";
import * as actions from "../../../redux/auth/action/actionCreate";
import { Navigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CFormSelect,
  CAlertLink,
  CAlert,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilLockLocked, cilUser } from "@coreui/icons";
import { isEmptyOrSpaces } from "src/views/utils";

const StudentRegister = ({
  signUp,
  isAuthenticated,
  isTeacher,
  isVerified,
  isStudent,
  isLoading,
}) => {
  if (isAuthenticated && isTeacher && isVerified) {
    return <Navigate to="/dashboard/teacher" />;
  } else if (isAuthenticated && isStudent && isVerified) {
    return <Navigate to="/dashboard/student" />;
  } else if (isAuthenticated && !isVerified) {
    return <Navigate to="/verify-email" />;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const username = event.target.username.value;
    const password = event.target.password.value;
    const email = event.target.email.value;
    const cpassword = event.target.cpassword.value;
    const cgpa = event.target.cgpa.value;
    const roll = event.target.roll.value;
    const firstName = event.target.firstName.value;
    const lastName = event.target.lastName.value;

    if (isEmptyOrSpaces(username)) {
      toast.error("Username is required !");
    } else if (isEmptyOrSpaces(password)) {
      toast.error("Password is required !");
    } else if (isEmptyOrSpaces(cpassword)) {
      toast.error("Confirm Password is required !");
    } else if (isEmptyOrSpaces(email)) {
      toast.error("Email is required !");
    } else if (isEmptyOrSpaces(cgpa)) {
      toast.error("Cgpa is required !");
    } else if (isEmptyOrSpaces(roll)) {
      toast.error("Roll is required !");
    } else {
      signUp(
        username,
        firstName,
        lastName,
        email,
        roll,
        cgpa,
        password,
        cpassword
      );
    }
  };

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={10} lg={9}>
            <CCard className="mx-4">
              <CCardBody style={{ padding: "1.5rem 1.5rem 0rem 1.5rem" }}>
                <h1>Register for student</h1>
                <p className="text-medium-emphasis">Create your account</p>
                <CForm className="row g-3" noValidate onSubmit={handleSubmit}>
                  <CCol xs={12}>
                    <CFormInput
                      placeholder="Email"
                      autoComplete="email"
                      name="email"
                      label="Email"
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormInput
                      type="password"
                      placeholder="Password"
                      autoComplete="new-password"
                      name="password"
                      label="Password"
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormInput
                      type="password"
                      placeholder="Confirm Password"
                      autoComplete="new-password"
                      name="cpassword"
                      label="Confirm Password"
                    />
                  </CCol>

                  <CCol md={6}>
                    <CFormInput
                      placeholder="First Name"
                      name="firstName"
                      label="First Name"
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormInput
                      placeholder="Last name"
                      autoComplete=""
                      name="lastName"
                      label="Last Name"
                    />
                  </CCol>

                  <CCol md={6}>
                    <CFormInput
                      placeholder="Username"
                      label="Username"
                      name="username"
                    />
                  </CCol>
                  <CCol md={4}>
                    <CFormInput
                      type="text"
                      placeholder="Roll Number"
                      label="Roll"
                      name="roll"
                    />
                  </CCol>
                  <CCol md={2}>
                    <CFormInput
                      type="text"
                      placeholder="Cgpa"
                      name="cgpa"
                      label="CGPA"
                    />
                  </CCol>

                  <div className="d-grid" style={{ marginTop: "2rem" }}>
                    {isLoading ? (
                      <CButton color="dark" type="submit" disabled>
                        Creating your account ..
                      </CButton>
                    ) : (
                      <CButton type="submit" color="dark">
                        Create Account
                      </CButton>
                    )}
                  </div>
                </CForm>
                <CAlert
                  color="light"
                  style={{ textAlign: "center", marginTop: "1rem" }}
                >
                  Already have an account? {"   "}
                  <CAlertLink to={"/"} component={NavLink}>
                    Sign in
                  </CAlertLink>
                  .
                </CAlert>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token !== null,
    isTeacher: state.auth.isTeacher,
    isLoading: state.auth.loading,
    isStudent: state.auth.isStudent,
    isVerified: state.auth.isVerified,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    signUp: (
      username,
      firstname,
      lastname,
      email,
      roll,
      cgpa,
      password,
      confirm_password
    ) =>
      dispatch(
        actions.studentAuthSignUp(
          username,
          firstname,
          lastname,
          email,
          roll,
          cgpa,
          password,
          confirm_password
        )
      ),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(StudentRegister);
