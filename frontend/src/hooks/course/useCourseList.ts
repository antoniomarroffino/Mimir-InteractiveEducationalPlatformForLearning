import {useContext} from "react";
import {CourseListContext} from "../../contexts/course/CourseListContext.ts";

export const useCourseList = () => {
    const context = useContext(CourseListContext);
    if (context === undefined) {
        throw new Error('useCourseList must be used within a CourseListProvider');
    }
    return context;
};