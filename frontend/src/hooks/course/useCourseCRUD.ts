import {useContext} from "react";
import {CourseCRUDContext} from "../../contexts/course/CourseCRUDContext.ts";

export const useCourseCRUD = () => {
    const context = useContext(CourseCRUDContext);
    if (context === undefined) {
        throw new Error('useCourseCRUD must be used within a CourseCRUDProvider');
    }
    return context;
};