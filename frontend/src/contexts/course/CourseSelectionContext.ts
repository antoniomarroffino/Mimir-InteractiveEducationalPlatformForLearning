import {createContext} from "react";
import {CourseDTO} from "@dti-isin/backend-api-client";

export type CourseSelectionContextType = {
    selectedCourseId: string | null;
    setSelectedCourseId: (id: string | null) => void;
    selectedCourse: CourseDTO | null;
    setSelectedCourse: (course: CourseDTO | null) => void;
    deselectCourse: () => void;
};

export const CourseSelectionContext = createContext<CourseSelectionContextType | undefined>(undefined);