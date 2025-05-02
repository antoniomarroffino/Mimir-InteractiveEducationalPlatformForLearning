import React from "react";
import {CourseListProvider} from "./CourseListProvider.tsx";
import {CourseCRUDProvider} from "./CourseCRUDProvider.tsx";

export const CourseProviders: React.FC<{ children: React.ReactNode }> = ({children}) => {
    return (
        <CourseListProvider>
            <CourseCRUDProvider>
                {children}
            </CourseCRUDProvider>
        </CourseListProvider>
    );
};