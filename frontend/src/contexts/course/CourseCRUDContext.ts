import {createContext} from "react";
import {CourseDTO} from "@dti-isin/backend-api-client";

export type CourseCRUDContextType = {
    createCourse: (courseDTO: CourseDTO) => Promise<CourseDTO>;
    updateCourse: (id: string, courseDTO: CourseDTO) => Promise<CourseDTO>;
    deleteCourse: (id: string) => Promise<void>;
    isCreatingCourse: boolean;
    isUpdatingCourse: boolean;
    isDeletingCourse: boolean;
    errorCreateCourse: Error | null;
    errorUpdateCourse: Error | null;
    errorDeleteCourse: Error | null;
};

export const CourseCRUDContext = createContext<CourseCRUDContextType | undefined>(undefined);