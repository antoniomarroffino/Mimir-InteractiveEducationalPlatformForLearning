import React, { useMemo } from "react";
import { useQuery } from "react-query";
import { CourseDTO } from "@dti-isin/backend-api-client";
import { courseApi } from "../../../config/config.ts";
import { CourseListContext } from "../../contexts/course/CourseListContext.ts";

export const CourseListProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const teacherCoursesQuery = useQuery<CourseDTO[], Error>({
    queryKey: ["teacherCourses"],
    queryFn: async () => (await courseApi.apiCoursesTeacherGet()).data,
  });

  const allCoursesQuery = useQuery<CourseDTO[], Error>({
    queryKey: ["allCourses"],
    queryFn: async () => (await courseApi.apiCoursesGet()).data,
  });

  const value = useMemo(
    () => ({
      teacherCourses: teacherCoursesQuery.data || [],
      allCourses: allCoursesQuery.data || [],

      isLoadingTeacherCourses: teacherCoursesQuery.isLoading,
      isLoadingAllCourses: allCoursesQuery.isLoading,

      errorTeacherCourses: teacherCoursesQuery.error,
      errorAllCourses: teacherCoursesQuery.error,
    }),
    [teacherCoursesQuery, allCoursesQuery]
  );

  return (
    <CourseListContext.Provider value={value}>
      {children}
    </CourseListContext.Provider>
  );
};
