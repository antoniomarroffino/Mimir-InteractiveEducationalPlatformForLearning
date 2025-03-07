import { createContext, useContext } from 'react';
import { CourseDTO } from '../api/generated';

interface CourseContextType {
    courses: CourseDTO[];
    isLoading: boolean;
    error: Error | null;
    createCourse: (name: string) => Promise<void>;
    selectedCourseId: string | null;
    setSelectedCourseId: (id: string | null) => void;
}

export const CourseContext = createContext<CourseContextType | undefined>(undefined);

export const useCourseContext = () => {
    const context = useContext(CourseContext);
    if (!context) {
        throw new Error('useCourseContext must be used within a CourseProvider');
    }
    return context;
};