import { call, put, takeEvery } from "redux-saga/effects";
import axios from "axios";
import { baseURL } from "./settings";

// Action Types
const CHECK_USER_EXISTENCE = "CHECK_USER_EXISTENCE";
const USER_EXISTENCE_SUCCESS = "USER_EXISTENCE_SUCCESS";
const USER_EXISTENCE_FAILURE = "USER_EXISTENCE_FAILURE";
const USER_LOGOUT = "USER_LOGOUT";

// Action Creators
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
    case USER_LOGOUT:
      return { ...state, loading: false, auth: false };
    default:
      return state;
  }
};

// Saga Worker
function* checkUserExistenceSaga(action) {
  try {
    // Send request to json-server
    const response = yield call(axios.get, `${baseURL}/user`, {
      params: {
        username: action.payload.username,
        password: action.payload.password,
      },
    });

    // Check if user exists
    if (response.data && response.data.length > 0) {
      localStorage.setItem("auth", true);
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
}

export { checkUserExistence, reducer, rootSaga, userLogout };
