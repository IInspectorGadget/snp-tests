import { configureStore } from "@reduxjs/toolkit";
import testsApi from "./testsApi";
import { authReducer } from "./testsApi";
import { setupListeners } from "@reduxjs/toolkit/query";

const store = configureStore({
  reducer: {
    auth: authReducer,
    [testsApi.reducerPath]: testsApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(testsApi.middleware),
});

setupListeners(store.dispatch);

export default store;
