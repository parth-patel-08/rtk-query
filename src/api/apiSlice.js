import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import tagTypes from "./tagTypes";
import generateEndPoint from "../utils/generateEndpoint";

const transformResponse = (response) => {
  // modify response
  return response;
};

const displayErrorMessage = (error) => {
  const statusCode = error?.originalStatus || error?.data?.StatusCode || 0;
  if (Math.floor(statusCode / 100) === 2) return;
  let errorMessage;
  switch (error?.data?.StatusCode) {
    case 400:
      errorMessage = error?.data?.Error || "Invalid data";
      break;
    case 401:
      errorMessage = error?.data?.Error || "Unauthenticated";
      break;
    case 403:
      errorMessage = error?.data?.Error || "No access for given URL";
      break;
    case 404:
      errorMessage = error?.data?.Error || "Page not found";
      break;
    case 500:
      errorMessage = error?.data?.Error || "Internal server error";
      break;
    default:
      errorMessage =
        error?.data?.Error || "Something went wrong, Please try again";
  }
  console.error(errorMessage);
};

const onQueryStarted = async (
  { toastMessage, errorMessage },
  { queryFulfilled, dispatch }
) => {
  try {
    const res = await queryFulfilled;
    if (toastMessage || res?.data?.Message) {
      console.log(toastMessage || res?.data?.Message);
    }
  } catch ({ error }) {
    if (errorMessage) {
      console.error(errorMessage);
    } else {
      displayErrorMessage(error);
    }
    if (error.status === 401) {
      //   dispatch(logoutUserSuccess());
      dispatch(api.util.resetApiState());
    }
  }
};

const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://jsonplaceholder.typicode.com",
    prepareHeaders: (headers) => {
      // headers.set("Authorization", "Bearer ${token}")
      return headers;
    },
  }),
  tagTypes,
  endpoints: (builder) => ({
    get: builder.query({
      query: ({ endpoint, query = {} }) => generateEndPoint(endpoint, query),
      providesTags: (result, error, { tags = [] }) => tags,
      transformResponse,
      onQueryStarted,
    }),
    post: builder.mutation({
      query: ({ endpoint, payload, query = {} }) => ({
        url: generateEndPoint(endpoint, query),
        method: "POST",
        body: payload,
      }),
      invalidatesTags: (result, error, { tags = [] }) => tags,
      transformResponse,
      onQueryStarted,
    }),
    put: builder.mutation({
      query: (endpoint, payload, query = {}) => ({
        url: generateEndPoint(endpoint, query),
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: (result, error, { tags = [] }) => tags,
      transformResponse,
      onQueryStarted,
    }),
    delete: builder.mutation({
      query: (endpoint, query = {}) => ({
        url: generateEndPoint(endpoint, query),
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { tags = [] }) => tags,
      transformResponse,
      onQueryStarted,
    }),
  }),
});

export const {
  useGetQuery,
  useLazyGetQuery,
  usePostMutation,
  usePutMutation,
  useDeleteMutation,
} = api;

export default api;
