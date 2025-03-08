import React from 'react';
import { CourseContext } from './CourseContext.tsx';
import { useCourse } from '../../hooks/course/useCourse.ts';

export const CourseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const courseState = useCourse();
    return (
        <CourseContext.Provider value={courseState}>
            {children}
        </CourseContext.Provider>
    );
};