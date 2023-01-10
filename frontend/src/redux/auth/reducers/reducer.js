import * as actionTypes from "../action/actionTypes";
import { updateObject } from "../utility";

const initState = {
  loading: false,
  token: null,
  username: null,
  email: null,
  isTeacher: null,
  isStudent: null,
  isVerified: null,
  isSuperUser: null,
  isStuff: null,
  error: null,
};

const authStart = (state, action) => {
  return updateObject(state, {
    loading: true,
  });
};

const authSuccess = (state, action) => {
  return updateObject(state, {
    loading: false,
    token: action.token,
    username: action.username,
    isTeacher: action.isTeacher,
    isStudent: action.isStudent,
    isVerified: action.isVerified,
    email: action.email,

    isSuperUser: action.isSuperUser,
    isStuff: action.isStuff,
  });
};

const authFailure = (state, action) => {
  return updateObject(state, {
    loading: false,
    error: action.error,
  });
};

const authLogout = (state, action) => {
  return updateObject(state, initState);
};

const authReducer = (state = initState, action) => {
  switch (action.type) {
    case actionTypes.AUTH_START:
      return authStart(state, action);
    case actionTypes.AUTH_SUCCESS:
      return authSuccess(state, action);
    case actionTypes.AUTH_FAILURE:
      return authFailure(state, action);
    case actionTypes.AUTH_LOGOUT:
      return authLogout(state, action);

    default:
      return state;
  }
};

export default authReducer;
