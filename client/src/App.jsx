import React, { useEffect, Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/context/AuthContext";
import { CourseProvider } from "@/context/CourseContext";
import { Provider } from "react-redux";
import { appStore } from "./app/store";
import { Toaster } from "sonner";
import { useLoadUserQuery } from "@/features/api/authApi";

/* ------------------------------
   Lazy Loaded Pages
------------------------------ */

const Home = lazy(() => import("./pages/Home"));
const LoginPage = lazy(() => import("./pages/Login"));
const Courses = lazy(() => import("./pages/student/Courses"));
const CourseDetails = lazy(() => import("./pages/CourseDetails"));
const VerifyOtp = lazy(() => import("./pages/VerifyOtp"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const MyCourses = lazy(() => import("./pages/student/MyCourses"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const CoursePlayer = lazy(() => import("./pages/student/CoursePlayer"));

/* Admin */
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminCourses = lazy(() => import("./pages/admin/AdminCourses"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const EditCourse = lazy(() => import("./pages/admin/EditCourse"));

/* Components */
const Navbar = lazy(() => import("@/components/ui/Navbar"));
const Footer = lazy(() => import("./components/Footer"));
const AuthModal = lazy(() => import("@/components/ui/AuthModel"));
const ProtectedRoute = lazy(() => import("@/components/ui/ProtectedRoute"));
const AdminLayout = lazy(() => import("./components/layout/AdminLayout"));

/* ------------------------------
   Premium Loader
------------------------------ */

function PageLoader() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
      <div className="flex flex-col items-center gap-5">
        
        <div className="relative">
          <div className="w-12 h-12 rounded-full border border-white/10" />
          <div className="absolute inset-0 w-12 h-12 rounded-full border-t-2 border-white animate-spin" />
        </div>

        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-white/40 animate-pulse" />
          <span className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-medium">
            Loading Workspace
          </span>
        </div>

      </div>
    </div>
  );
}

/* ------------------------------
   GitHub OAuth Redirect
------------------------------ */

function GithubCallbackRedirect() {
  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");

    if (code) {
      const apiUrl =
        import.meta.env.VITE_API_URL || "http://localhost:4000";

      window.location.href = `${apiUrl}/api/auth/github/callback?code=${code}`;
    }
  }, []);

  return <PageLoader />;
}

/* ------------------------------
   Routes
------------------------------ */

function AppRoutes() {
  const { isLoading } = useLoadUserQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>

        {/* Public Layout */}
        <Route
          element={
            <>
              <Navbar />
              <AuthModal />
              <Outlet />
              <Footer />
            </>
          }
        >
          <Route path="/" element={<Home />} />

          <Route path="/login" element={<LoginPage />} />

          <Route path="/courses" element={<Courses />} />

          <Route
            path="/courses/:id"
            element={<CourseDetails />}
          />

          <Route
            path="/verify-otp"
            element={<VerifyOtp />}
          />

          <Route
            path="/forgot-password"
            element={<ForgotPassword />}
          />

          {/* Protected Student Routes */}

          <Route
            path="/my-courses"
            element={
              <ProtectedRoute>
                <MyCourses />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/learn/:id"
            element={
              <ProtectedRoute>
                <CoursePlayer />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* GitHub Auth */}
        <Route
          path="/api/auth/github/callback"
          element={<GithubCallbackRedirect />}
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />

          <Route
            path="courses"
            element={<AdminCourses />}
          />

          <Route
            path="team"
            element={<AdminUsers />}
          />

          <Route
            path="courses/:id"
            element={<EditCourse />}
          />

          <Route
            path="/admin/courses/:id"
            element={<EditCourse />}
          />
        </Route>

      </Routes>
    </Suspense>
  );
}

/* ------------------------------
   App
------------------------------ */

export default function App() {
  return (
    <Provider store={appStore}>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
      >
        <BrowserRouter>
          <AuthProvider>
            <CourseProvider>

              <AppRoutes />

              <Toaster
                position="top-right"
                richColors
                closeButton
                theme="dark"
              />

            </CourseProvider>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
}