import React from "react";
import {CourseListProvider} from "./CourseListProvider.tsx";
import {CourseCRUDProvider} from "./CourseCRUDProvider.tsx";
import {CourseSelectionProvider} from "./CourseSelectionProvider.tsx";

export const CourseProviders: React.FC<{ children: React.ReactNode }> = ({children}) => {
    return (
        <CourseListProvider>
            <CourseCRUDProvider>
                <CourseSelectionProvider>
                    {children}
                </CourseSelectionProvider>
            </CourseCRUDProvider>
        </CourseListProvider>
    );
};