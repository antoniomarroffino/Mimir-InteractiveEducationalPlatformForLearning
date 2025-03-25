import {useContext} from "react";
import {CourseSelectionContext} from "../../contexts/course/CourseSelectionContext.ts";

export const useCourseSelection = () => {
    const context = useContext(CourseSelectionContext);
    if (context === undefined) {
        throw new Error('useCourseSelection must be used within a CourseSelectionProvider');
    }
    return context;
};