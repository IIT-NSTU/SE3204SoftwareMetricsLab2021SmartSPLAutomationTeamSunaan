import * as actionType from "./actionTypes";
import { toast } from "react-toastify";
import axios from "axios";
import { handleError } from "../utility";

export const authStart = () => {
  return {
    type: actionType.AUTH_START,
  };
};

export const authSuccess = (
  token,
  isTeacher,
  username,
  email,
  isStudent,
  isVerified,
  isSuperUser,
  isStuff
) => {
  return {
    type: actionType.AUTH_SUCCESS,
    token: token,
    isTeacher: isTeacher,
    isStudent: isStudent,
    isVerified: isVerified,
    username: username,
    email: email,
    isSuperUser: isSuperUser,
    isStuff: isStuff,
  };
};

export const authFailure = (error) => {
  return {
    type: actionType.AUTH_FAILURE,
    error: error,
  };
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("expirationDate");

  localStorage.removeItem("isTeacher");
  localStorage.removeItem("isStudent");
  localStorage.removeItem("isVerified");
  localStorage.removeItem("username");
  localStorage.removeItem("email");
  localStorage.removeItem("isStuff");
  localStorage.removeItem("isSuperUser");
  return {
    type: actionType.AUTH_LOGOUT,
  };
};

export const checkAuthTimeOut = (expirationTime) => {
  return (dispatch) => {
    setTimeout(() => {
      dispatch(logout());
    }, expirationTime * 1000);
  };
};

export const authLogin = (username, password) => {
  return (dispatch) => {
    dispatch(authStart());
    axios.defaults.headers = {
      "Content-Type": "application/json",
    };
    axios
      .post("http://127.0.0.1:8000/api/users/login/", {
        username: username,
        password: password,
      })
      .then((response) => {
        const token = response.data.token;
        const isTeacher = response.data.is_teacher;
        const isStudent = response.data.is_student;
        const isVerified = response.data.is_verified;
        const isStuff = response.data.is_staff;
        const isSuperUser = response.data.is_superuser;
        const username = response.data.username;
        const email = response.data.email;
        const expirationDate = new Date(new Date().getTime() + 3600 * 1000);
        localStorage.setItem("token", JSON.stringify(token));
        localStorage.setItem("expirationDate", expirationDate);
        dispatch(
          authSuccess(
            token,
            isTeacher,
            username,
            email,
            isStudent,
            isVerified,
            isStuff,
            isSuperUser
          )
        );
        dispatch(checkAuthTimeOut(3600));
      })
      .catch((error) => {
        dispatch(
          authFailure(error.response.data ? error.response.data : error)
        );
        // toast.error(error.response.data.non_field_errors[0]);
        handleError(error);
      });
  };
};

export const studentAuthSignUp = (
  username,
  firstname,
  lastname,
  email,
  roll,
  cgpa,
  password,
  confirm_password
) => {
  return (dispatch) => {
    dispatch(authStart());
    axios.defaults.headers = {
      "Content-Type": "application/json",
    };
    axios
      .post("http://127.0.0.1:8000/api/users/student/sign-up/", {
        username: username,
        email: email,
        password: password,
        confirm_password: confirm_password,
        first_name: firstname,
        last_name: lastname,
        roll: roll,
        cgpa: cgpa,
      })
      .then((response) => {
        const token = response.data.token;
        const isTeacher = response.data.is_teacher;
        const isStudent = response.data.is_student;
        const isVerified = response.data.is_verified;

        const isStuff = response.data.is_staff;
        const isSuperUser = response.data.is_superuser;
        const username = response.data.username;
        const email = response.data.email;
        const expirationDate = new Date(new Date() + 3600 * 1000);

        localStorage.setItem("token", JSON.stringify(token));
        localStorage.setItem("expirationDate", expirationDate);

        dispatch(
          authSuccess(
            token,
            isTeacher,
            username,
            email,
            isStudent,
            isVerified,
            isStuff,
            isSuperUser
          )
        );

        dispatch(checkAuthTimeOut(3600));
      })
      .catch((error) => {
        dispatch(authFailure(error.response.data));
        handleError(error);
      });
  };
};

export const teacherAuthSignUp = (
  username,
  firstname,
  lastname,
  email,
  designation,
  password,
  confirm_password
) => {
  return (dispatch) => {
    dispatch(authStart());
    axios.defaults.headers = {
      "Content-Type": "application/json",
    };
    axios
      .post("http://127.0.0.1:8000/api/users/teacher/sign-up/", {
        username: username,
        email: email,
        password: password,
        confirm_password: confirm_password,
        first_name: firstname,
        last_name: lastname,
        designation: designation,
      })
      .then((response) => {
        const token = response.data.token;
        const isTeacher = response.data.is_teacher;
        const isStudent = response.data.is_student;
        const isVerified = response.data.is_verified;

        const isStuff = response.data.is_staff;
        const isSuperUser = response.data.is_superuser;
        const username = response.data.username;
        const email = response.data.email;
        const expirationDate = new Date(new Date() + 3600 * 1000);

        localStorage.setItem("token", JSON.stringify(token));
        localStorage.setItem("expirationDate", expirationDate);

        dispatch(
          authSuccess(
            token,
            isTeacher,
            username,
            email,
            isStudent,
            isVerified,
            isStuff,
            isSuperUser
          )
        );

        dispatch(checkAuthTimeOut(3600));
      })
      .catch((error) => {
        dispatch(authFailure(error.response.data));
        handleError(error);
      });
  };
};

export const authCheckState = () => {
  return (dispatch) => {
    const token = JSON.parse(localStorage.getItem("token"));

    if (!token) {
      console.log("not token");
      dispatch(logout());
    } else {
      const expirationDate = new Date(localStorage.getItem("expirationDate"));

      if (expirationDate <= new Date()) {
        console.log("expirationDate");
        dispatch(logout());
      } else {
        console.log("success");
        console.log(token);
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        };
        axios
          .get("http://127.0.0.1:8000/api/users/verify-token/", config)
          .then((response) => {
            const isTeacher = response.data.is_teacher;
            const isStudent = response.data.is_student;
            const isVerified = response.data.is_verified;

            const isStuff = response.data.is_staff;
            const isSuperUser = response.data.is_superuser;
            const username = response.data.username;
            const email = response.data.email;

            dispatch(
              authSuccess(
                token,
                isTeacher,
                username,
                email,
                isStudent,
                isVerified,
                isStuff,
                isSuperUser
              )
            );
          })
          .catch((error) => {
            dispatch(authFailure(error.response.data));
            handleError(error);
          });

        dispatch(
          checkAuthTimeOut((expirationDate - new Date().getTime()) / 1000)
        );
      }
    }
  };
};
