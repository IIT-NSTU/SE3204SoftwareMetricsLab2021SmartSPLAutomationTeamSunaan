import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { isEmptyOrSpaces } from "../utils";
import { toast } from "react-toastify";
import axios from "axios";
import * as actions from "../../redux/auth/action/actionCreate";
import { connect } from "react-redux";
import { handleError } from "../../redux/auth/utility";
import {
  CButton,
  CCol,
  CContainer,
  CFormInput,
  CInputGroup,
  CRow,
  CForm,
} from "@coreui/react";

const JoinSpl = ({ isAuthenticated, username, token }) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const code = event.target.code.value;
    if (isEmptyOrSpaces(code)) {
      toast.error("Code can't be empty!");
    } else {
      console.log(username);
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      };
      axios
        .post(
          "http://127.0.0.1:8000/api/spl-manager/spl/join",
          {
            username: username,
            join_code: code,
          },
          config
        )
        .then((response) => {
          console.log(response.data);
          toast.success(response.data.message);
        })
        .catch((error) => {
          handleError(error);
          console.log(error);
        });
    }
  };
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }
  return (
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
              <h4 className="pt-3">Enter spl join code !</h4>
            </span>

            <CInputGroup className="input-prepend">
              <CFormInput
                type="text"
                name="code"
                placeholder="Enter join code"
              />
              <CButton type="submit" color="dark">
                Join
              </CButton>
            </CInputGroup>
          </CCol>
        </CRow>
      </CForm>
    </CContainer>
  );
};

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token !== null,
    token: state.auth.token,
    isTeacher: state.auth.isTeacher,
    username: state.auth.username,
    isStudent: state.auth.isStudent,
    isVerified: state.auth.isVerified,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(actions.logout()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(JoinSpl);
