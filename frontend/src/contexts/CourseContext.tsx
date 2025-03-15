import { createContext } from "react";
import { CourseDTO } from "@dti-isin/backend-api-client";

export type CourseContextType = {
    courses: CourseDTO[];
    isLoadingCourses: boolean;
    errorCourses: Error | null;
    selectedCourseId: string | null;
    setSelectedCourseId: (id: string | null) => void;
    createCourse: (name: string) => Promise<void>;
    fetchCourses: () => void;
    isCreatingCourse: boolean;
    errorCreateCourse: Error | null;
};

export const CourseContext = createContext<CourseContextType | undefined>(undefined);