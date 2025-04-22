import {FiDatabase} from 'react-icons/fi';
import {BasePageHeader} from "../common/BasePageHeader.tsx";
import React from "react";

interface QuestionBankPageHeaderProps {
    onToggleInfo: () => void;
    showInfoToggle?: boolean;
}

export const QuestionBankPageHeader: React.FC<QuestionBankPageHeaderProps> = ({
                                                                                  onToggleInfo,
                                                                                  showInfoToggle = true,
                                                                              }) => (
    <BasePageHeader
        title="Question Bank"
        subtitle="Empower your learning journey through shared knowledge"
        icon={<FiDatabase className="w-10 h-10 text-white"/>}
        gradientFrom="from-purple-500"
        gradientTo="to-fuchsia-500"
        showInfoToggle={showInfoToggle}
        onToggleInfo={onToggleInfo}
    />
);
