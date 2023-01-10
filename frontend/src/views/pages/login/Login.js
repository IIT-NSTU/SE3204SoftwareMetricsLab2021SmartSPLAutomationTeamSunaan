import React from "react";
import { useState } from "react";
import { Link, Navigate, NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { isEmptyOrSpaces } from "src/views/utils";
import studentIcon from "../../../assets/images/graduate.png";
import teacherIcon from "../../../assets/images/teacher.png";
import "./login.css";
import * as actions from "../../../redux/auth/action/actionCreate";
import {
  CCallout,
  CCardImage,
  CCardTitle,
  CCardText,
  CImage,
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  COffcanvas,
  COffcanvasHeader,
  COffcanvasTitle,
  CCloseButton,
  COffcanvasBody,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilLockLocked, cilUser } from "@coreui/icons";

function Login({
  login,
  isAuthenticated,
  isTeacher,
  isVerified,
  isStudent,
  isLoading,
}) {
  if (isAuthenticated && isTeacher && isVerified) {
    return <Navigate to="/dashboard/teacher" />;
  } else if (isAuthenticated && isStudent && isVerified) {
    return <Navigate to="/dashboard/student" />;
  } else if (isAuthenticated && !isVerified) {
    return <Navigate to="/verify-email" />;
  }

  const [visible, setVisible] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const username = event.target.username.value;
    const password = event.target.password.value;

    if (isEmptyOrSpaces(username)) {
      toast.error("Username is required !");
    } else if (isEmptyOrSpaces(password)) {
      toast.error("Password is required !");
    } else {
      login(username, password);
    }
  };
  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={10} lg={7}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm
                    className="row g-3 needs-validation"
                    noValidate
                    onSubmit={handleSubmit}
                  >
                    <h1>Login</h1>
                    <p className="text-medium-emphasis">
                      Sign In to your account
                    </p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Username"
                        name="username"
                        autoComplete="username"
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        name="password"
                        placeholder="Password"
                        autoComplete="current-password"
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={8}>
                        {isLoading ? (
                          <CButton
                            color="dark"
                            type="submit"
                            className="px-4"
                            disabled
                          >
                            Signing in ..
                          </CButton>
                        ) : (
                          <CButton color="dark" type="submit" className="px-4">
                            Sign in
                          </CButton>
                        )}
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-dark py-5">
                <CCardBody
                  className="text-center"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <h2>Sign up</h2>
                  <p>Don't have an account? </p>

                  <CButton
                    color="dark"
                    onClick={() => setVisible(true)}
                    active
                    className="mt-3"
                  >
                    Register Now!
                  </CButton>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
        <COffcanvas
          placement="top"
          scroll={false}
          visible={visible}
          onHide={() => setVisible(false)}
        >
          <COffcanvasHeader>
            <COffcanvasTitle
              style={{
                margin: "0 auto",
                fontSize: "1.5rem",
                fontWeight: "bold",
              }}
            >
              <span>What's your profession ?</span>
            </COffcanvasTitle>
            <CCloseButton
              className="text-reset"
              onClick={() => setVisible(false)}
            />
          </COffcanvasHeader>
          <COffcanvasBody>
            <CRow>
              <CCol sm>
                <Link
                  to="/register/student"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <CCallout color="dark">
                    <div style={{ display: "flex" }}>
                      <div style={{ marginRight: "20px" }}>
                        <CImage
                          src={studentIcon}
                          thumbnail
                          width={75}
                          height={75}
                        />
                      </div>
                      <div>
                        <CCardTitle>Student</CCardTitle>
                        <CCardText>Sign up as student.</CCardText>
                      </div>
                    </div>
                  </CCallout>
                </Link>
              </CCol>
              <CCol sm>
                <Link
                  to="/register/teacher"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <CCallout color="dark">
                    <div style={{ display: "flex" }}>
                      <div style={{ marginRight: "20px" }}>
                        <CImage
                          src={teacherIcon}
                          thumbnail
                          width={75}
                          height={75}
                        />
                      </div>
                      <div>
                        <CCardTitle>Teacher</CCardTitle>
                        <CCardText>Sign up as teacher.</CCardText>
                      </div>
                    </div>
                  </CCallout>
                </Link>
              </CCol>
            </CRow>
          </COffcanvasBody>
        </COffcanvas>
      </CContainer>
    </div>
  );
}

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
    login: (username, password) =>
      dispatch(actions.authLogin(username, password)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
