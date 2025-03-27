import {createContext} from "react";
import {CourseDTO} from "@dti-isin/backend-api-client";

export type CourseCRUDContextType = {
    createCourse: (courseDTO: CourseDTO) => Promise<CourseDTO>;
    updateCourse: (id: string, courseDTO: CourseDTO) => Promise<CourseDTO>;
    assignCourse: (id: string) => Promise<void>;
    leftCourse: (id: string) => Promise<void>;
    deleteCourse: (id: string) => Promise<void>;

    isCreatingCourse: boolean;
    isUpdatingCourse: boolean;
    isAssigningCourse: boolean;
    isLeftCourse: boolean;
    isDeletingCourse: boolean;

    errorCreateCourse: Error | null;
    errorUpdateCourse: Error | null;
    errorAssignCourse: Error | null;
    errorLeftCourse: Error | null;
    errorDeleteCourse: Error | null;
};

export const CourseCRUDContext = createContext<CourseCRUDContextType | undefined>(undefined);