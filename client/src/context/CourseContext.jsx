import { createContext, useContext } from "react";
import {
  useGetCoursesQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
} from "@/features/api/courseApi";
import { toast } from "sonner";

const CourseContext = createContext();

export function CourseProvider({ children }) {
  const { data, isLoading, error, refetch } = useGetCoursesQuery();
  const [createCourse]       = useCreateCourseMutation();
  const [updateCourseMutation] = useUpdateCourseMutation();
  const [deleteCourseMutation] = useDeleteCourseMutation();

  // Keep raw MongoDB documents — components use course._id directly
  const courses = data?.courses || [];

  const addCourse = async (course) => {
    try {
      await createCourse(course).unwrap();
      toast.success("Course added successfully");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to add course");
    }
  };

  const updateCourse = async (id, updated) => {
    try {
      await updateCourseMutation({ id, ...updated }).unwrap();
      toast.success("Course updated successfully");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update course");
    }
  };

  const deleteCourse = async (id) => {
    try {
      await deleteCourseMutation(id).unwrap();
      toast.success("Course deleted successfully");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete course");
    }
  };

  return (
    <CourseContext.Provider value={{ 
      courses, 
      loading: isLoading, 
      error, 
      addCourse, 
      updateCourse, 
      deleteCourse,
      refetch 
    }}>
      {children}
    </CourseContext.Provider>
  );
}

export function useCourses() {
  return useContext(CourseContext);
}