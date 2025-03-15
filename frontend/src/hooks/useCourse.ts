import { useContext } from "react";
import { CourseContext, CourseContextType } from "../contexts/CourseContext";

export const useCourse = (): CourseContextType => {
    const context = useContext(CourseContext);

    if (!context) {
        throw new Error("useCourse must be used within a CourseProvider");
    }

    return context;
};