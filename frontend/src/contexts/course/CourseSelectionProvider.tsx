import React, {useMemo, useState} from "react";
import {CourseDTO} from "@dti-isin/backend-api-client";
import {CourseSelectionContext} from "./CourseSelectionContext";

export const CourseSelectionProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
    const [selectedCourse, setSelectedCourse] = useState<CourseDTO | null>(null);

    const value = useMemo(() => ({
        selectedCourseId,
        setSelectedCourseId,
        selectedCourse,
        setSelectedCourse,
        selectCourse: (course: CourseDTO) => {
            setSelectedCourseId(course.id || null);
            setSelectedCourse(course);
        },
        deselectCourse: () => {
            setSelectedCourseId(null);
            setSelectedCourse(null);
        }
    }), [selectedCourseId, selectedCourse]);

    return (
        <CourseSelectionContext.Provider value={value}>
            {children}
        </CourseSelectionContext.Provider>
    );
};