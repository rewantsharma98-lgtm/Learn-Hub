import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/context/AuthContext";
import { CourseProvider } from "@/context/CourseContext";
import { Provider } from "react-redux";
import { appStore } from "./app/store";
import { Toaster } from "sonner";
import { useLoadUserQuery } from "@/features/api/authApi";

import CourseDetails  from "./pages/CourseDetails";
import Navbar         from "@/components/ui/Navbar";
import AuthModal      from "@/components/ui/AuthModel";
import ProtectedRoute from "@/components/ui/ProtectedRoute";
import LoginPage      from "./pages/Login";
import Home           from "./pages/Home";
import Courses        from "./pages/student/Courses";
import MyCourses      from "./pages/student/MyCourses";
import AdminCourses   from "./pages/admin/AdminCourses";
import ProfilePage    from "./pages/ProfilePage";
import VerifyOtp      from "./pages/VerifyOtp";
import CoursePlayer   from "./pages/student/CoursePlayer";
import AdminDashboard from "./pages/admin/AdminDashboard";
import EditCourse     from "./pages/admin/EditCourse";
import AdminUsers     from "./pages/admin/AdminUsers";
import AdminLayout    from "./components/layout/AdminLayout";
import Footer         from "./components/layout/Footer";

// GitHub Auth Redirect Helper (in case user configures port 5173 on GitHub)
function GithubCallbackRedirect() {
  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");
    if (code) {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4000";
      window.location.href = `${apiUrl}/api/auth/github/callback?code=${code}`;
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center text-white">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Finalizing Github Secure Handshake...</p>
      </div>
    </div>
  );
}

function AppRoutes() {
  const { isLoading } = useLoadUserQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1a1a1a]">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <Routes>
      {/* public routes — share Navbar + AuthModal layout */}
      <Route element={<><Navbar /><AuthModal /><Outlet /><Footer /></>}>
        <Route path="/"            element={<Home />} />
        <Route path="/login"       element={<LoginPage />} />
        <Route path="/courses"     element={<Courses />} />
        <Route path="/courses/:id" element={<CourseDetails />} />
        <Route path="/verify-otp"  element={<VerifyOtp />} />

        {/* protected student routes */}
        <Route path="/my-courses" element={<ProtectedRoute><MyCourses /></ProtectedRoute>} />
        <Route path="/profile"    element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/learn/:id"  element={<ProtectedRoute><CoursePlayer /></ProtectedRoute>} />
      </Route>

      <Route path="/api/auth/github/callback" element={<GithubCallbackRedirect />} />

      {/* admin routes */}
      <Route path="/admin" element={<ProtectedRoute adminOnly={true}><AdminLayout /></ProtectedRoute>}>
        <Route index          element={<AdminDashboard />} />
        <Route path="courses"      element={<AdminCourses />} />
        <Route path="team"         element={<AdminUsers />} />
        <Route path="courses/:id"  element={<EditCourse />} />
        <Route path="/admin/courses/:id" element={<EditCourse />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <Provider store={appStore}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <BrowserRouter>
          <AuthProvider>
            <CourseProvider>
              <AppRoutes />
              <Toaster position="top-right" richColors closeButton />
            </CourseProvider>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
}