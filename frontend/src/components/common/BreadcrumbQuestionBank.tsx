import React from "react";
import { FiBookOpen, FiHome } from "react-icons/fi";
import { QuestionBankDTO } from "@dti-isin/backend-api-client";
import { BaseBreadcrumb, Crumb } from "./BaseBreadcrumb.tsx";

interface BreadcrumbQuestionBankProps {
    questionBankDTO?: QuestionBankDTO;
}

export const BreadcrumbQuestionBank: React.FC<BreadcrumbQuestionBankProps> = ({ questionBankDTO }) => {
    const crumbs: Crumb[] = [
        { label: "Home", to: "/", icon: <FiHome /> },
        { label: "Question banks", to: "/question_banks", icon: <FiBookOpen /> }
    ];

    if (questionBankDTO) {
        crumbs.push({
            label: questionBankDTO.name
        });
    }

    return <BaseBreadcrumb crumbs={crumbs} />;
};
