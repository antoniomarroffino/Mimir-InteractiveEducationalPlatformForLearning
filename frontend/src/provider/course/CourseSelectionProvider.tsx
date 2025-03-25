import React, {useMemo, useState} from "react";
import {CourseDTO} from "@dti-isin/backend-api-client";
import {CourseSelectionContext} from "../../contexts/course/CourseSelectionContext.ts";

export const CourseSelectionProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
    const [selectedCourse, setSelectedCourse] = useState<CourseDTO | null>(null);

    const value = useMemo(() => ({
        selectedCourseId,
        setSelectedCourseId,
        selectedCourse,
        setSelectedCourse,
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