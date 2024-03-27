import { call, put, takeEvery } from "redux-saga/effects";
import axios from "axios";
axios.defaults.withCredentials = true;
axios.defaults.headers.common["scope-key"] =
  "DfjzAPRkCYwb8GnKuZHFEUpLr2BsETAz7yJjnX3gV9Cxs4EjgHat9FnNLVRfxuGczkt7hrgd8HDa3TeQPVfCwBKmJZPfWUEn7GeF93HqgsV52K";
import { baseURL } from "./settings";

// Action Types
const CHECK_USER_EXISTENCE = "CHECK_USER_EXISTENCE";
const USER_EXISTENCE_SUCCESS = "USER_EXISTENCE_SUCCESS";
const USER_EXISTENCE_FAILURE = "USER_EXISTENCE_FAILURE";
const USER_LOGOUT = "USER_LOGOUT";

const SIGNUP_USER = "SIGNUP_USER";
const USER_SIGNUP_SUCCESS = "USER_SIGNUP_SUCCESS";
const USER_SIGNUP_FAILURE = "USER_SIGNUP_FAILURE";

// Action Creators

const signupUser = (username, password, passwordConfirmation, isAdmin) => ({
  type: SIGNUP_USER,
  payload: { username, password, passwordConfirmation, isAdmin },
});

const userSignupSuccess = () => ({
  type: USER_SIGNUP_SUCCESS,
});

const userSignupFailure = (error) => ({
  type: USER_SIGNUP_FAILURE,
  payload: error,
});

const checkUserExistence = (username, password) => ({
  type: CHECK_USER_EXISTENCE,
  payload: { username, password },
});

const userExistenceSuccess = () => ({
  type: USER_EXISTENCE_SUCCESS,
});

const userExistenceFailure = () => ({
  type: USER_EXISTENCE_FAILURE,
});

const userLogout = () => ({
  type: USER_LOGOUT,
});

// Reducer
const initialState = {
  loading: false,
  error: null,
  auth: localStorage.getItem("auth"),
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case CHECK_USER_EXISTENCE:
      return { ...state, loading: true, error: null, auth: true };
    case USER_EXISTENCE_SUCCESS:
      return { ...state, loading: false, auth: true };
    case USER_EXISTENCE_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case SIGNUP_USER:
      return { ...state, loading: true, error: null };
    case USER_SIGNUP_SUCCESS:
      return { ...state, loading: false, auth: true };
    case USER_SIGNUP_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case USER_LOGOUT:
      return { ...state, loading: false, auth: false };
    default:
      return state;
  }
};

// Saga Worker

function* signupUserSaga(action) {
  try {
    const { username, password, passwordConfirmation, isAdmin } = action.payload;
    const response = yield call(axios.post, `${baseURL}/signup`, {
      username,
      password,
      password_confirmation: passwordConfirmation,
      is_admin: isAdmin,
    });
    if (response.data) {
      localStorage.setItem("auth", true);
      yield put(userSignupSuccess());
    } else {
      yield put(userSignupFailure("Failed to create user"));
    }
  } catch (error) {
    yield put(userSignupFailure("Error creating user"));
  }
}

function* checkUserExistenceSaga(action) {
  try {
    // Send request to json-server
    const response = yield call(axios.post, `${baseURL}/signin`, {
      username: action.payload.username,
      password: action.payload.password,
    });
    console.log(JSON.stringify(response.data));
    // Check if user exists
    if (response.data) {
      localStorage.setItem("auth", JSON.stringify(response.data));
      yield put(userExistenceSuccess());
    } else {
      yield put(userExistenceFailure("User not found"));
    }
  } catch (error) {
    yield put(userExistenceFailure("Error checking user existence"));
  }
}

// eslint-disable-next-line require-yield
function* logoutUserSaga() {
  localStorage.setItem("auth", "false");
}

// Saga Watcher
function* rootSaga() {
  yield takeEvery(CHECK_USER_EXISTENCE, checkUserExistenceSaga);
  yield takeEvery(USER_LOGOUT, logoutUserSaga);
  yield takeEvery(SIGNUP_USER, signupUserSaga);
}

export { checkUserExistence, signupUser, reducer, rootSaga, userLogout };
