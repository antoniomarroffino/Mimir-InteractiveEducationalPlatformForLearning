
import { BasePageHeader } from "../common/BasePageHeader";
import React from "react";
import {FiClipboard} from "react-icons/fi";

interface QuizReviewPageHeaderProps {
    totalAttempts: number;
    onToggleInfo: () => void;
    showInfoToggle?: boolean;
}

export const QuizReviewPageHeader: React.FC<QuizReviewPageHeaderProps> = ({
                                                                              totalAttempts,
                                                                              onToggleInfo,
                                                                              showInfoToggle = true,
                                                                          }) => (
    <BasePageHeader
        title="Review Your Quiz Attempts"
        subtitle={`You’ve completed ${totalAttempts} attempt${totalAttempts === 1 ? '' : 's'}. View your answers and progress.`}
        icon={<FiClipboard className="w-10 h-10 text-white" />}
        gradientFrom="from-green-500"
        gradientTo="to-teal-500"
        showInfoToggle={showInfoToggle}
        onToggleInfo={onToggleInfo}
    />
);
