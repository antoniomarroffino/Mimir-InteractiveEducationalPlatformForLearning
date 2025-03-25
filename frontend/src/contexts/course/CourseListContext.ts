import {CourseDTO} from "@dti-isin/backend-api-client";
import {createContext} from "react";

export type CourseListContextType = {
    courses: CourseDTO[];
    isLoadingCourses: boolean;
    errorCourses: Error | null;
    fetchCourses: () => Promise<void>;
};

export const CourseListContext = createContext<CourseListContextType | undefined>(undefined);