import {Link} from 'react-router-dom';
import {BsChevronRight} from 'react-icons/bs';
import {CourseDTO, FolderDTO, QuizDTO} from '@dti-isin/backend-api-client';
import React from "react";

interface QuizBreadcrumbProps {
    course: CourseDTO;
    folder: FolderDTO | null;
    quiz: QuizDTO | null;
    courseId: string;
}

export const QuizBreadcrumb: React.FC<QuizBreadcrumbProps> = ({
                                                                  course,
                                                                  folder,
                                                                  quiz,
                                                                  courseId
                                                              }) => (
    <div className="mb-8">
        <ul className="flex items-center gap-2 text-sm">
            <li>
                <Link to="/" className="text-primary hover:text-primary-focus">
                    Home
                </Link>
            </li>
            <BsChevronRight className="text-gray-400"/>
            <li>
                <Link
                    to={`/courses/${courseId}`}
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
                            to={`/courses/${courseId}`}
                            className="text-primary hover:text-primary-focus"
                        >
                            {folder.name}
                        </Link>
                    </li>
                </>
            )}
            <BsChevronRight className="text-gray-400"/>
            <li>
                <span className="font-semibold">
                    {quiz ? quiz.name : 'New Quiz'}
                </span>
            </li>
        </ul>
    </div>
);