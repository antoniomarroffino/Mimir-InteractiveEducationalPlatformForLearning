import React from 'react';
import {Link} from 'react-router-dom';
import {BsChevronRight} from 'react-icons/bs';
import {CourseDTO, FolderDTO, QuizDTO} from '@dti-isin/backend-api-client';

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
        <div className="mb-8">
            <ul className="flex items-center gap-2 text-sm">
                <li>
                    <Link
                        to="/"
                        className="text-primary hover:text-primary-focus"
                    >
                        Home
                    </Link>
                </li>
                <BsChevronRight className="text-gray-400"/>
                <li>
                    <Link
                        to={`/courses/${course.id}`}
                        className="text-primary hover:text-primary-focus"
                    >
                        {course.name}
                    </Link>
                </li>
                {folder && (
                    <>
                        <BsChevronRight className="text-gray-400"/>
                        <li>
                            <Link
                                to={`/courses/${course.id}`}
                                className="text-primary hover:text-primary-focus"
                            >
                                {folder.name}
                            </Link>
                        </li>
                    </>
                )}
                {quiz && (
                    <>
                        <BsChevronRight className="text-gray-400"/>
                        <li>
                            <span className="font-semibold">{quiz.name}</span>
                        </li>
                    </>
                )}
            </ul>
        </div>
    );
};