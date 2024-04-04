import { configureStore } from "@reduxjs/toolkit";
import testsApi from "./testsApi";
import { authReducer } from "./testsApi";

const store = configureStore({
  reducer: {
    auth: authReducer,
    [testsApi.reducerPath]: testsApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(testsApi.middleware),
});

export default store;
