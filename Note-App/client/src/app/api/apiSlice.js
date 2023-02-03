import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3500" }), //Need to change baseUrl when deploying the application
  tagTypes: ['Note', 'User'],
  endpoints: builder => ({}),
});
