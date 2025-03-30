import React from "react";
import {Link} from "react-router-dom";
import {FiBookOpen, FiChevronRight, FiHome} from "react-icons/fi";
import {QuestionBankDTO} from "@dti-isin/backend-api-client";

interface BreadcrumbQuestionBankProps {
    questionBankDTO?: QuestionBankDTO;
}

export const BreadcrumbQuestionBank: React.FC<BreadcrumbQuestionBankProps> = ({questionBankDTO}) => {

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
                {questionBankDTO && (
                    <>
                        <FiChevronRight className="text-base-content/40"/>
                        <li>
                            <Link
                                to="/question_banks"
                                className="flex items-center text-primary hover:text-primary-focus transition-colors"
                            >
                                <FiBookOpen className="mr-1.5"/>
                                Question banks
                            </Link>
                        </li>
                        <FiChevronRight className="text-base-content/40"/>
                        <li>
                            <Link
                                to={`/question_banks/${questionBankDTO.id}`}
                                className="text-primary hover:text-primary-focus"
                            >
                                {questionBankDTO.name}
                            </Link>
                        </li>
                    </>
                )}
            </ul>
        </div>
    );
};