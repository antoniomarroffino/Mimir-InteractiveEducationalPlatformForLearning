import {CourseDTO} from "@dti-isin/backend-api-client";
import {createContext} from "react";

export type CourseListContextType = {
    teacherCourses: CourseDTO[];
    allCourses: CourseDTO[];

    isLoadingTeacherCourses: boolean;
    isLoadingAllCourses: boolean;

    errorTeacherCourses: Error | null;
    errorAllCourses: Error | null;
};

export const CourseListContext = createContext<CourseListContextType | undefined>(undefined);