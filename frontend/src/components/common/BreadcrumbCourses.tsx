import React from 'react';
import {Link} from 'react-router-dom';
import {BsChevronRight, BsListTask} from 'react-icons/bs';
import {CourseDTO, FolderDTO, QuizDTO} from '@dti-isin/backend-api-client';
import {FiBookOpen, FiChevronRight, FiHome} from "react-icons/fi";

interface BreadcrumbCoursesProps {
    course?: CourseDTO;
    folder?: FolderDTO;
    quiz?: QuizDTO;
}

export const BreadcrumbCourses: React.FC<BreadcrumbCoursesProps> = ({
                                                          course,
                                                          folder,
                                                          quiz
                                                      }) => {
    return (
        <div className="mb-8">
            <ul className="flex flex-wrap items-center gap-2 text-sm bg-base-200 px-4 py-2 rounded-full">
                <li>
                    <Link
                        to="/"
                        className="flex items-center text-primary hover:text-primary-focus transition-colors"
                    >
                        <FiHome className="mr-1.5"/>
                        Home
                    </Link>
                </li>
                {course && (
                    <>
                        <FiChevronRight className="text-base-content/40"/>
                        <li>
                            <Link
                                to="/courses"
                                className="flex items-center text-primary hover:text-primary-focus transition-colors"
                            >
                                <FiBookOpen className="mr-1.5"/>
                                Courses
                            </Link>
                        </li>
                        <FiChevronRight className="text-base-content/40"/>
                        <li>
                            <Link
                                to={`/courses/${course.id}`}
                                className="text-primary hover:text-primary-focus"
                            >
                                {course.name}
                            </Link>
                        </li>
                    </>
                )}

                {folder && (
                    <>
                        <FiChevronRight className="text-base-content/40"/>
                        <li>
                            <Link
                                to={`/courses/${course?.id}`}
                                className="flex items-center text-primary hover:text-primary-focus transition-colors"
                            >
                                <FiBookOpen className="mr-1.5"/>
                                {folder.name}
                            </Link>
                        </li>
                    </>
                )}

                {quiz && (
                    <>
                        <BsChevronRight className="text-base-content/40"/>
                        <li>
                            <div
                                className="flex items-center text-primary hover:text-primary-focus transition-colors font-semibold"
                            >
                                <BsListTask className="mr-1.5"/>
                                {quiz.name}
                            </div>
                        </li>
                    </>
                )}
            </ul>
        </div>
    );
};