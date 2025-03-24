import React from "react";
import {CourseListProvider} from "./CourseListProvider";
import {CourseCRUDProvider} from "./CourseCRUDProvider";
import {CourseSelectionProvider} from "./CourseSelectionProvider";

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