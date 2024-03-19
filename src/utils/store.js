import createSagaMiddleware from "redux-saga";
import { reducer as userReducer, rootSaga as userSaga } from "./userSaga";
import { reducer as testsReducer, testsSaga } from "./testsSaga";
import { applyMiddleware, combineReducers, createStore } from "redux";

// Создание саги-прослойки
const sagaMiddleware = createSagaMiddleware();

const rootReducer = combineReducers({
  user: userReducer,
  tests: testsReducer,
});

// Создание хранилища Redux, передача корневого редюсера и применение саги-прослойки
const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));

// Запуск корневой саги
sagaMiddleware.run(testsSaga);
sagaMiddleware.run(userSaga);

export default store;
