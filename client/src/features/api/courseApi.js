import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const courseApi = createApi({
  reducerPath: "courseApi",

  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL}/api`,
    credentials: "include",
  }),

  tagTypes: ["Course", "Lecture", "Enrollment"],

  endpoints: (builder) => ({

    // ─────────────────────────────
    // COURSES
    // ─────────────────────────────

    getCourses: builder.query({
      query: () => "/course/all",
      providesTags: ["Course"],
    }),

    getCourseById: builder.query({
      query: (id) => `/course/${id}`,
      providesTags: (result, error, id) => [
        { type: "Course", id }
      ],
    }),

    createCourse: builder.mutation({
      query: (data) => ({
        url: "/course/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Course"],
    }),

    updateCourse: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/course/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        "Course",
        { type: "Course", id }
      ],
    }),

    deleteCourse: builder.mutation({
      query: (id) => ({
        url: `/course/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Course"],
    }),

    // ─────────────────────────────
    // LECTURES
    // ─────────────────────────────

    getLectures: builder.query({
      query: (courseId) => `/lecture/course/${courseId}`,
      providesTags: ["Lecture"],
    }),

    addLecture: builder.mutation({
      query: (data) => ({
        url: "/lecture/add",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Lecture", "Course"],
    }),

    // ─────────────────────────────
    // ENROLLMENTS (🔥 FIXED COMPLETELY)
    // ─────────────────────────────

    enrollInCourse: builder.mutation({
      query: (courseId) => ({
        url: "/enrollment/enroll",
        method: "POST",
        body: { courseId },
      }),

      // ✅ FIX: update BOTH enrollment + course cache
      invalidatesTags: ["Enrollment", "Course"],
    }),

    getEnrolledCourses: builder.query({
      query: () => "/enrollment/my-courses",

      // 🔥 IMPORTANT FIX (THIS WAS YOUR MAIN BUG)
      providesTags: ["Enrollment"],
    }),

    updateLectureProgress: builder.mutation({
      query: (data) => ({
        url: "/enrollment/update-progress",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Lecture", "Enrollment"],
    }),

    getCourseProgress: builder.query({
      query: (courseId) => `/enrollment/progress/${courseId}`,
      providesTags: ["Lecture"],
    }),

  }),
});

// ─────────────────────────────
// EXPORT HOOKS
// ─────────────────────────────

export const {
  useGetCoursesQuery,
  useGetCourseByIdQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  useGetLecturesQuery,
  useAddLectureMutation,
  useEnrollInCourseMutation,
  useGetEnrolledCoursesQuery,
  useUpdateLectureProgressMutation,
  useGetCourseProgressQuery,
} = courseApi;