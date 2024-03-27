import { call, put, takeEvery } from "redux-saga/effects";
import axios from "axios";
import { baseURL } from "./settings";
axios.defaults.withCredentials = true;
axios.defaults.headers.common["scope-key"] =
  "DfjzAPRkCYwb8GnKuZHFEUpLr2BsETAz7yJjnX3gV9Cxs4EjgHat9FnNLVRfxuGczkt7hrgd8HDa3TeQPVfCwBKmJZPfWUEn7GeF93HqgsV52K";

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

const FETCH_TEST_BY_ID = "FETCH_TEST_BY_ID";
const FETCH_TEST_BY_ID_SUCCESS = "FETCH_TEST_BY_ID_SUCCESS";
const FETCH_TEST_BY_ID_FAILURE = "FETCH_TEST_BY_ID_FAILURE";

const UPDATE_TEST = "UPDATE_TEST";
const UPDATE_TEST_SUCCESS = "UPDATE_TEST_SUCCESS";
const UPDATE_TEST_FAILURE = "UPDATE_TEST_FAILURE";

// Action Creators
const updateTest = (id, updatedTest) => ({
  type: UPDATE_TEST,
  payload: { id, updatedTest },
});

const updateTestSuccess = (updatedTest) => ({
  type: UPDATE_TEST_SUCCESS,
  payload: updatedTest,
});

const updateTestFailure = (error) => ({
  type: UPDATE_TEST_FAILURE,
  payload: error,
});

const fetchTestById = (id) => ({
  type: FETCH_TEST_BY_ID,
  payload: id,
});

const fetchTestByIdSuccess = (test) => ({
  type: FETCH_TEST_BY_ID_SUCCESS,
  payload: test,
});

const fetchTestByIdFailure = (error) => ({
  type: FETCH_TEST_BY_ID_FAILURE,
  payload: error,
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
  data: null,
  loading: false,
  error: null,
  order: localStorage.getItem("order") || "",
  type: "",
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_TEST:
      return { ...state, type: "update", loading: true, error: null };
    case UPDATE_TEST_SUCCESS:
      return {
        ...state,
        type: "update",
        loading: false,
        data: [action.payload],
      };
    case UPDATE_TEST_FAILURE:
      return { ...state, type: "update", loading: false, error: action.payload };

    case FETCH_TEST_BY_ID:
      return { ...state, type: "fetchById", loading: true, error: null };
    case FETCH_TEST_BY_ID_SUCCESS:
      return { ...state, type: "fetchById", loading: false, data: [action.payload] }; // Обновляем только один тест
    case FETCH_TEST_BY_ID_FAILURE:
      return { ...state, type: "fetchById", loading: false, error: action.payload };

    case FETCH_TESTS:
      return { ...state, loading: true, error: null };
    case FETCH_TESTS_SUCCESS:
      return { ...state, loading: false, data: action.payload };
    case FETCH_TESTS_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case DELETE_TEST:
      return { ...state, loading: true, error: null };
    case DELETE_TEST_SUCCESS:
      return { ...state, loading: false, data: action.payload };
    case DELETE_TEST_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case CREATE_TEST:
      return { ...state, loading: true, error: null };
    case CREATE_TEST_SUCCESS:
      return { ...state, type: "create", loading: false, data: [action.payload] };
    case CREATE_TEST_FAILURE:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};
// Saga Workers
function* updateTestSaga(action) {
  try {
    const response = yield call(axios.put, `http://localhost:3000/tests/${action.payload.id}`, action.payload.updatedTest);
    yield put(updateTestSuccess(response.data));
  } catch (error) {
    yield put(updateTestFailure(error));
  }
}

function* fetchTestByIdSaga(action) {
  try {
    const response = yield call(axios.get, `http://localhost:3000/tests/${action.payload}`);
    yield put(fetchTestByIdSuccess(response.data));
  } catch (error) {
    yield put(fetchTestByIdFailure(error));
  }
}

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
    const { page, per, search, sort } = action.payload;
    const response = yield call(axios.get, `${baseURL}/tests`, {});

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
  yield takeEvery(FETCH_TEST_BY_ID, fetchTestByIdSaga);
  yield takeEvery(CREATE_TEST, createTestSaga);
  yield takeEvery(DELETE_TEST, deleteTestSaga);
  yield takeEvery(UPDATE_TEST, updateTestSaga);
}

export { reducer, fetchTests, fetchTestById, createTest, deleteTest, testsSaga, updateTest };
