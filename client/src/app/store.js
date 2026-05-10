import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "@/features/api/authApi";
import { courseApi } from "@/features/api/courseApi";
import authReducer from "@/features/authSlice";

export const appStore = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [courseApi.reducerPath]: courseApi.reducer,
    auth: authReducer, // ✅ ADD THIS LINE
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, courseApi.middleware),
});