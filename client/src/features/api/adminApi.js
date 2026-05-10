import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000",
  withCredentials: true, // sends cookies automatically
});

export const fetchDashboardStats = () => API.get("/api/admin/dashboard");

export const fetchAdminUsers = () => API.get("/api/admin/users");
export const enrollAdminUser = (data) => API.post("/api/admin/users/enroll", data);

export const fetchAdminCourses = () => API.get("/api/admin/courses");
export const createCourse = (data) => API.post("/api/admin/courses", data);
export const updateCourse = (id, data) => API.put(`/api/admin/courses/${id}`, data);
export const deleteCourse = (id) => API.delete(`/api/admin/courses/${id}`);
export const fetchCourseStructure = (id) => API.get(`/api/admin/courses/${id}/structure`);

export const addSection = (courseId, data) => API.post(`/api/admin/courses/${courseId}/sections`, data);
export const updateSection = (sectionId, data) => API.put(`/api/admin/sections/${sectionId}`, data);
export const deleteSection = (sectionId) => API.delete(`/api/admin/sections/${sectionId}`);

export const addLecture = (sectionId, data) => API.post(`/api/admin/sections/${sectionId}/lectures`, data);
export const updateLecture = (lectureId, data) => API.put(`/api/admin/lectures/${lectureId}`, data);
export const deleteLecture = (lectureId) => API.delete(`/api/admin/lectures/${lectureId}`);

export const uploadLectureResource = (lectureId, formData) => 
  API.post(`/api/admin/lectures/${lectureId}/resource`, formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });