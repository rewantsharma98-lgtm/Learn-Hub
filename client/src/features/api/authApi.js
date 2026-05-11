import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { userLoggedIn, userLoggedOut } from "../authSlice";
import { sendOtpEmail } from "@/lib/emailService";

const USER_API = `${import.meta.env.VITE_API_URL}/api/auth`;

export const authApi = createApi({
  reducerPath: "authApi",

  baseQuery: fetchBaseQuery({
    baseUrl: USER_API,
    credentials: "include",
  }),

  endpoints: (builder) => ({
    // ── Register ─────────────────────────────────────────────────────────────
    // Backend stores the OTP in MongoDB and returns it.
    // We then send the OTP email client-side via EmailJS.
    registerUser: builder.mutation({
      query: (data) => ({
        url: "/register",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.success && data.otp) {
            await sendOtpEmail(arg.email, data.otp);
          }
        } catch {
          // Errors are surfaced in the component via mutation result
        }
      },
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
          } else {
            dispatch(userLoggedOut());
          }
        } catch {
          dispatch(userLoggedOut());
        }
      },
    }),

    // ── Login ─────────────────────────────────────────────────────────────────
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

    // ── Verify email OTP ──────────────────────────────────────────────────────
    verifyEmail: builder.mutation({
      query: (data) => ({
        url: "/verify-account",
        method: "POST",
        body: data,
      }),
    }),

    // ── Resend OTP ────────────────────────────────────────────────────────────
    // Backend generates a fresh OTP and returns it; we send via EmailJS.
    resendOtp: builder.mutation({
      query: (email) => ({
        url: "/resend-otp",
        method: "POST",
        body: { email },
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.success && data.otp) {
            await sendOtpEmail(arg, data.otp);
          }
        } catch {}
      },
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
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.success && data.otp) {
            await sendOtpEmail(arg, data.otp);
          }
        } catch {}
      },
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