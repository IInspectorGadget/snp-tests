import { createSlice } from "@reduxjs/toolkit";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.headers.common["scope-key"] =
  "DfjzAPRkCYwb8GnKuZHFEUpLr2BsETAz7yJjnX3gV9Cxs4EjgHat9FnNLVRfxuGczkt7hrgd8HDa3TeQPVfCwBKmJZPfWUEn7GeF93HqgsV52K";

const BASE_URL = "https://interns-test-fe.snp.agency/api/v1/"; // Замените на ваш базовый URL API

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isAuth: localStorage.getItem("isAuth"),
  },
  reducers: {
    setCurrentUser: (state, action) => {
      state.user = action.payload.user;
      state.isAuth = action.payload.isAuth;
    },
  },
});

export const { setCurrentUser } = authSlice.actions;
export const authReducer = authSlice.reducer;
export const selectIsAuthenticated = (state) => state.auth.isAuth;

const testsApi = createApi({
  reducerPath: "testsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      // Здесь вы можете добавить любые заголовки, необходимые для каждого запроса
      // Например, если вы хотите добавить заголовок аутентификации, вы можете получить его из состояния Redux
      headers.set(
        "scope-key",
        "DfjzAPRkCYwb8GnKuZHFEUpLr2BsETAz7yJjnX3gV9Cxs4EjgHat9FnNLVRfxuGczkt7hrgd8HDa3TeQPVfCwBKmJZPfWUEn7GeF93HqgsV52K",
      );
      return headers;
    },
    credentials: "include",
  }),
  endpoints: (builder) => ({
    // Регистрация
    signup: builder.mutation({
      query: (credentials) => ({
        url: "/signup",
        method: "POST",
        body: credentials,
      }),
    }),
    // Авторизация
    signin: builder.mutation({
      query: (credentials) => ({
        url: "/signin",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User"],
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "DELETE",
      }),
      onQueryStarted: async () => {
        // Очищаем куки при выходе из системы
        console.log(document.cookie);
        document.cookie = "";
      },
      invalidatesTags: ["User"],
    }),

    // Получение текущего пользователя
    getCurrentUser: builder.query({
      query: () => "/users/current",
      providesTags: ["User"],
    }),
    // Создание теста
    createTest: builder.mutation({
      query: (testData) => ({
        url: "/tests",
        method: "POST",
        body: testData,
      }),
      invalidatesTags: ["Tests"],
    }),
    // Редактирование теста
    updateTest: builder.mutation({
      query: ({ id, ...updates }) => ({
        url: `/tests/${id}`,
        method: "PATCH",
        body: updates,
      }),
      invalidatesTags: ["Tests"],
    }),
    // Удаление теста
    deleteTest: builder.mutation({
      query: (id) => ({
        url: `/tests/${id}`,
        method: "DELETE",
      }),
    }),
    // Получение теста
    getTestById: builder.query({
      query: (id) => `/tests/${id}`,
      providesTags: (result, error, id) => {
        console.log(id);
        return [{ type: "Tests", id }];
      },
    }),
    // Получение списка тестов с пагинацией
    getTests: builder.query({
      query: ({ page = 1, per = 5, search = "", sort = "created_at_desc" } = {}) => ({
        url: `/tests?page=${page}&per=${per}&search=${search}&sort=${sort}`,
      }),
      providesTags: ["Tests"],
    }),
    // Создание вопроса
    createQuestion: builder.mutation({
      query: ({ test_id, ...questionData }) => ({
        url: `/tests/${test_id}/questions`,
        method: "POST",
        body: questionData,
      }),
      invalidatesTags: (result, error, { test_id }) => [{ type: "Tests", id: test_id }],
    }),
    // Редактирование вопроса
    updateQuestion: builder.mutation({
      query: ({ id, ...updates }) => ({
        url: `/questions/${id}`,
        method: "PATCH",
        body: updates,
      }),
      invalidatesTags: (result, error, { test_id }) => [{ type: "Tests", id: test_id }],
    }),
    // Удаление вопроса
    deleteQuestion: builder.mutation({
      query: (id) => ({
        url: `/questions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { test_id }) => [{ type: "Tests", id: test_id }],
    }),
    // Создание ответа
    createAnswer: builder.mutation({
      query: ({ questionId, ...answerData }) => ({
        url: `/questions/${questionId}/answers`,
        method: "POST",
        body: answerData,
      }),
      invalidatesTags: (result, error, { test_id }) => {
        console.log(test_id);
        return [{ type: "Tests", id: test_id }];
      },
    }),
    // Редактирование ответа
    updateAnswer: builder.mutation({
      query: ({ id, ...updates }) => ({
        url: `/answers/${id}`,
        method: "PATCH",
        body: updates,
      }),
      invalidatesTags: (result, error, { test_id }) => [{ type: "Tests", id: test_id }],
    }),
    // Перемещение ответа
    moveAnswer: builder.mutation({
      query: ({ id, position }) => ({
        url: `/answers/${id}/insert_at/${position}`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, { test_id }) => [{ type: "Tests", id: test_id }],
    }),
    // Удаление ответа
    deleteAnswer: builder.mutation({
      query: ({ id }) => ({
        url: `/answers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { testId }) => {
        return [{ type: "Tests", id: testId }];
      },
    }),
  }),
});

export const {
  useSignupMutation,
  useSigninMutation,
  useGetCurrentUserQuery,
  useCreateTestMutation,
  useUpdateTestMutation,
  useDeleteTestMutation,
  useGetTestByIdQuery,
  useGetTestsQuery,
  useCreateQuestionMutation,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation,
  useCreateAnswerMutation,
  useUpdateAnswerMutation,
  useMoveAnswerMutation,
  useDeleteAnswerMutation,
  useLogoutMutation,
} = testsApi;

export default testsApi;
