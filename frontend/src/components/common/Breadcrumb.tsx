import React from 'react';
import { Link } from 'react-router-dom';
import {
    BsHouseFill,
    BsChevronRight,
    BsFolderFill,
    BsListTask
} from 'react-icons/bs';
import { CourseDTO, FolderDTO, QuizDTO } from '@dti-isin/backend-api-client';

interface BreadcrumbProps {
    course: CourseDTO;
    folder?: FolderDTO;
    quiz?: QuizDTO;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
                                                          course,
                                                          folder,
                                                          quiz
                                                      }) => {
    return (
        <nav className="mb-8">
            <ol
                className="
                    flex
                    items-center
                    gap-3
                    text-sm
                    bg-base-100
                    rounded-xl
                    p-3
                    shadow-md
                "
            >
                <li>
                    <Link
                        to="/"
                        className="
                            flex
                            items-center
                            gap-2
                            text-base-content/70
                            hover:text-primary
                            transition-colors
                        "
                    >
                        <BsHouseFill className="text-lg" />
                        <span className="hidden md:inline">Home</span>
                    </Link>
                </li>

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