import React from 'react';
import { CourseContext } from './CourseContext';
import { useCourse } from '../hooks/course/useCourse';

export const CourseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const courseState = useCourse();
    return (
        <CourseContext.Provider value={courseState}>
            {children}
        </CourseContext.Provider>
    );
};