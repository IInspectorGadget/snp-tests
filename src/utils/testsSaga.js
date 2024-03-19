import { call, put, takeEvery } from "redux-saga/effects";
import axios from "axios";

// Action Types
const FETCH_TESTS = "FETCH_TESTS";
const FETCH_TESTS_SUCCESS = "FETCH_TESTS_SUCCESS";
const FETCH_TESTS_FAILURE = "FETCH_TESTS_FAILURE";
const CREATE_TEST = "CREATE_TEST";
const CREATE_TEST_SUCCESS = "CREATE_TEST_SUCCESS";
const CREATE_TEST_FAILURE = "CREATE_TEST_FAILURE";
const DELETE_TEST = "DELETE_TEST";
const DELETE_TEST_SUCCESS = "DELETE_TEST_SUCCESS";
const DELETE_TEST_FAILURE = "DELETE_TEST_FAILURE";

const SET_ORDER = "SET_ORDER";
const SET_ORDER_DESC = "SET_ORDER_DESC";
const SET_ORDER_ASC = "SET_ORDER_ASC";

// Action Creators
const setOrder = (order) => ({
  type: SET_ORDER,
  payload: { order },
});

const setOrderDesc = () => ({
  type: SET_ORDER_DESC,
});

const setOrderAsc = () => ({
  type: SET_ORDER_ASC,
});

const fetchTests = (order) => ({
  type: FETCH_TESTS,
  payload: { order },
});

const fetchTestsSuccess = (tests) => ({
  type: FETCH_TESTS_SUCCESS,
  payload: tests,
});

const fetchTestsFailure = (error) => ({
  type: FETCH_TESTS_FAILURE,
  payload: error,
});

const createTest = (test) => ({
  type: CREATE_TEST,
  payload: test,
});

const createTestSuccess = (test) => ({
  type: CREATE_TEST_SUCCESS,
  payload: test,
});

const createTestFailure = (error) => ({
  type: CREATE_TEST_FAILURE,
  payload: error,
});

const deleteTest = (id) => ({
  type: DELETE_TEST,
  payload: id,
});

const deleteTestSuccess = (id) => ({
  type: DELETE_TEST_SUCCESS,
  payload: id,
});

const deleteTestFailure = (error) => ({
  type: DELETE_TEST_FAILURE,
  payload: error,
});

// Reducer
// Реализация вашего редюсера
const initialState = {
  tests: [],
  loading: false,
  error: null,
  order: localStorage.getItem("order") || "",
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ORDER:
    case SET_ORDER_DESC:
      return { ...state, order: "" };
    case SET_ORDER_ASC:
      return { ...state, order: "-" };
    case FETCH_TESTS:
    case CREATE_TEST:
    case DELETE_TEST:
      return { ...state, loading: true, error: null };
    case FETCH_TESTS_SUCCESS:
      return { ...state, loading: false, tests: action.payload };
    case FETCH_TESTS_FAILURE:
    case CREATE_TEST_FAILURE:
    case DELETE_TEST_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case CREATE_TEST_SUCCESS:
      return { ...state, loading: false, tests: [...state.tests, action.payload] };
    case DELETE_TEST_SUCCESS:
      return { ...state, loading: false, tests: state.tests.filter((test) => test.id !== action.payload) };
    default:
      return state;
  }
};
// Saga Workers

function* setOrderSaga(action) {
  const { order } = action.payload;
  if (order) {
    localStorage.setItem("order", "");
    yield put(setOrderDesc());
  } else {
    localStorage.setItem("order", "-");
    yield put(setOrderAsc());
  }
  fetchTestsSaga();
}

function* fetchTestsSaga(action) {
  try {
    const { order } = action.payload;
    const response = yield call(axios.get, "http://localhost:3000/tests", {
      params: {
        _sort: `${order}date`,
      },
    });
    yield put(fetchTestsSuccess(response.data));
  } catch (error) {
    yield put(fetchTestsFailure(error));
  }
}

function* createTestSaga(action) {
  try {
    const response = yield call(axios.post, "http://localhost:3000/tests", action.payload);
    yield put(createTestSuccess(response.data));
  } catch (error) {
    yield put(createTestFailure(error));
  }
}

function* deleteTestSaga(action) {
  try {
    yield call(axios.delete, `http://localhost:3000/tests/${action.payload}`);
    yield put(deleteTestSuccess(action.payload));
  } catch (error) {
    yield put(deleteTestFailure(error));
  }
}

// Saga Watchers
function* testsSaga() {
  yield takeEvery(FETCH_TESTS, fetchTestsSaga);
  yield takeEvery(CREATE_TEST, createTestSaga);
  yield takeEvery(DELETE_TEST, deleteTestSaga);
  yield takeEvery(SET_ORDER, setOrderSaga);
}

export { reducer, setOrder, fetchTests, createTest, deleteTest, testsSaga };
