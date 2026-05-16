import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { userLoggedIn, userLoggedOut } from "../authSlice";

const USER_API = `${import.meta.env.VITE_API_URL}/api/auth`;

export const authApi = createApi({
  reducerPath: "authApi",

  baseQuery: fetchBaseQuery({
    baseUrl: USER_API,
    credentials: "include",
    prepareHeaders: (headers) => {
      headers.set("Accept", "application/json");
      return headers;
    },
  }),

  endpoints: (builder) => ({
    // ── Register ─────────────────────────────────────────────────────────────
    registerUser: builder.mutation({
      query: (data) => ({
        url: "/register",
        method: "POST",
        body: data,
      }),
    }),

    // ── Load logged-in user ───────────────────────────────────────────────────
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
          }
        } catch {}
      },
    }),

    // ── Login ────────────────────────────────────────────────────────────────
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

    // ── Verify Email/OTP ──────────────────────────────────────────────────────
    verifyEmail: builder.mutation({
      query: (data) => ({
        url: "/verify-email",
        method: "POST",
        body: data,
      }),
    }),

    // ── Resend OTP ────────────────────────────────────────────────────────────
    resendOtp: builder.mutation({
      query: (email) => ({
        url: "/resend-otp",
        method: "POST",
        body: { email },
      }),
    }),

    // ── Logout ────────────────────────────────────────────────────────────────
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
        } catch {}
      },
    }),

    // ── Send password-reset OTP ───────────────────────────────────────────────
    sendResetOtp: builder.mutation({
      query: (email) => ({
        url: "/send-reset-otp",
        method: "POST",
        body: { email },
      }),
    }),

    // ── Reset password ────────────────────────────────────────────────────────
    resetPassword: builder.mutation({
      query: (data) => ({
        url: "/reset-password",
        method: "POST",
        body: data,
      }),
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
  useSendResetOtpMutation,
  useResetPasswordMutation,
} = authApi;