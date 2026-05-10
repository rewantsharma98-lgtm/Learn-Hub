import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { userLoggedIn, userLoggedOut } from "../authSlice";

const USER_API = "http://localhost:4000/api/auth";

export const authApi = createApi({
  reducerPath: "authApi",

  baseQuery: fetchBaseQuery({
    baseUrl: USER_API,
    credentials: "include",
  }),

  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (data) => ({
        url: "/register",
        method: "POST",
        body: data,
      }),
    }),

    loadUser: builder.query({
  query: () => ({
    url: "/is-auth",
    method: "GET",
  }),
  async onQueryStarted(arg, { dispatch, queryFulfilled }) {
    try {
      const { data } = await queryFulfilled;
      if (data.success && data.user) {
        dispatch(userLoggedIn({ user: data.user }));
      } else {
        dispatch(userLoggedOut());
      }
    } catch {
      dispatch(userLoggedOut());
    }
  },
}),

loginUser: builder.mutation({
  query: (data) => ({
    url: "/login",
    method: "POST",
    body: data,
  }),
  async onQueryStarted(arg, { dispatch, queryFulfilled }) {
    try {
      const { data } = await queryFulfilled;
      if (data.success && data.user) {
        dispatch(userLoggedIn({ user: data.user }));
      }
    } catch {}
  },
}),
    verifyEmail: builder.mutation({
      query: (data) => ({
        url: "/verify-account",
        method: "POST",
        body: data,
      }),
    }),

    resendOtp: builder.mutation({
      query: (email) => ({
        url: "/resend-otp",
        method: "POST",
        body: { email },
      }),
    }),

    logoutUser: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.success) {
            dispatch(userLoggedOut());
          }
        } catch (err) {}
      },
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useLoadUserQuery,
  useVerifyEmailMutation,
  useResendOtpMutation,
  useLogoutUserMutation,
} = authApi;