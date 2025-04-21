import React from "react";
import { CourseDTO, FolderDTO, QuizDTO } from "@dti-isin/backend-api-client";
import { FiBookOpen, FiHome } from "react-icons/fi";
import { BsListTask } from "react-icons/bs";
import { BaseBreadcrumb, Crumb } from "../common/BaseBreadcrumb.tsx";

interface BreadcrumbCoursesProps {
    course?: CourseDTO;
    folder?: FolderDTO;
    quiz?: QuizDTO;
}

export const BreadcrumbCourses: React.FC<BreadcrumbCoursesProps> = ({ course, folder, quiz }) => {
    const crumbs: Crumb[] = [
        { label: "Home", to: "/", icon: <FiHome /> }
    ];

    if (course) {
        crumbs.push({
            label: "Courses",
            to: "/courses",
            icon: <FiBookOpen />
        });
        crumbs.push({
            label: course.name,
            to: `/courses/${course.id}`
        });
    }

    if (folder) {
        crumbs.push({
            label: folder.name,
            to: `/courses/${course?.id}`
        });
    }

    if (quiz) {
        crumbs.push({
            label: quiz.name,
            icon: <BsListTask />
        });
    }

    return <BaseBreadcrumb crumbs={crumbs} />;
};
