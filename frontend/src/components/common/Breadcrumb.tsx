import React from 'react';
import { Link } from 'react-router-dom';
import {
    BsHouseFill,
    BsChevronRight,
    BsFolderFill,
    BsListTask
} from 'react-icons/bs';
import { CourseDTO, FolderDTO, QuizDTO } from '@dti-isin/backend-api-client';
import {Link} from 'react-router-dom';
import {BsChevronRight} from 'react-icons/bs';
import {CourseDTO, FolderDTO, QuizDTO} from '@dti-isin/backend-api-client';
import {FiBookOpen, FiChevronRight, FiHome} from "react-icons/fi";
import {useCourseSelection} from "../../hooks/course/useCourseSelection.ts";

interface BreadcrumbProps {
    course?: CourseDTO;
    folder?: FolderDTO;
    quiz?: QuizDTO;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
                                                          course,
                                                          folder,
                                                          quiz
                                                      }) => {

    const {deselectCourse} = useCourseSelection();

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
                                onClick={deselectCourse}
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

                <BsChevronRight className="text-base-content/40" />

                <li>
                    <Link
                        to={`/courses/${course.id}`}
                        className="
                            flex
                            items-center
                            gap-2
                            text-base-content/80
                            hover:text-primary
                            transition-colors
                        "
                    >
                        <BsFolderFill className="text-lg text-primary/70" />
                        {course.name}
                    </Link>
                </li>

                {folder && (
                    <>
                        <BsChevronRight className="text-gray-400"/>
                        <li>
                            <Link
                                to={`/courses/${course?.id}`}
                                className="text-primary hover:text-primary-focus"
                            >
                                <BsFolderFill className="text-lg text-primary/70" />
                                {folder.name}
                            </Link>
                        </li>
                    </>
                )}

                {quiz && (
                    <>
                        <BsChevronRight className="text-base-content/40" />
                        <li>
                            <div
                                className="
                                    flex
                                    items-center
                                    gap-2
                                    text-base-content/90
                                    font-semibold
                                "
                            >
                                <BsListTask className="text-lg text-primary" />
                                {quiz.name}
                            </div>
                        </li>
                    </>
                )}
            </ol>
        </nav>
    );
};