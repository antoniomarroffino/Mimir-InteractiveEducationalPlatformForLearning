import {BasePageHeader} from "../common/BasePageHeader";
import {FaClipboardList} from "react-icons/fa";

export const QuizReviewPageHeader = ({ totalAttempts }: { totalAttempts: number }) => {
    return (
        <BasePageHeader
            icon={<FaClipboardList className="w-10 h-10 text-white" />}
            title="Review Your Quiz Attempts"
            subtitle={`You’ve completed ${totalAttempts} attempt${totalAttempts === 1 ? '' : 's'}. View your answers and progress.`}
            gradientFrom="from-green-500"
            gradientTo="to-teal-500"
        />
    );
};
