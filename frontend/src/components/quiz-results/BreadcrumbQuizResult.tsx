import React from "react";
import {CourseDTO, FolderDTO, QuizDTO} from "@dti-isin/backend-api-client";
import {FiBook, FiBookOpen, FiHome} from "react-icons/fi";
import {BsBarChart, BsFolder2, BsPatchQuestion} from "react-icons/bs";
import {BaseBreadcrumb, Crumb} from "../common/BaseBreadcrumb.tsx";

interface BreadcrumbQuizResultProps {
    course?: CourseDTO;
    folder?: FolderDTO;
    quiz?: QuizDTO;
}

export const BreadcrumbQuizResult: React.FC<BreadcrumbQuizResultProps> = ({
                                                                              course,
                                                                              folder,
                                                                              quiz,
                                                                          }) => {
    const crumbs: Crumb[] = [
        {label: "Home", to: "/", icon: <FiHome/>},
    ];

    if (course) {
        crumbs.push({
            label: "Courses",
            to: "/courses",
            icon: <FiBook/>,
        });

        crumbs.push({
            label: course.name,
            to: `/courses/${course.id}`,
            icon: <FiBookOpen/>,
        });
    }

    if (folder) {
        crumbs.push({
            label: folder.name,
            to: `/courses/${course?.id}`,
            icon: <BsFolder2/>,
        });
    }

    if (quiz) {
        crumbs.push({
            label: quiz.name,
            to: `/courses/${course?.id}`,
            icon: <BsPatchQuestion/>,
        });

        crumbs.push({
            label: "Results",
            icon: <BsBarChart/>,
        });
    }

    return <BaseBreadcrumb crumbs={crumbs}/>;
};
