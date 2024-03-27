import { configureStore, createSlice } from "@reduxjs/toolkit";
import testsApi from "./testsApi"; // Предполагается, что у вас есть файл с созданным API, например api.js
import { authReducer } from "./testsApi";

const store = configureStore({
  reducer: {
    // Добавляем редьюсеры, созданные с помощью createApi
    auth: authReducer,
    [testsApi.reducerPath]: testsApi.reducer,
  },
  // Добавляем middleware для работы с асинхронными запросами API
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(testsApi.middleware),
});

export default store;
