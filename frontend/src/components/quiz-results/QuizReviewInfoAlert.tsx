import { PageInfoAlert } from "../common/PageInfoAlert";
import { FaClipboardList } from "react-icons/fa";

export const QuizReviewInfoAlert = () => {
    return (
        <PageInfoAlert
            icon={<FaClipboardList />}
            title="Review Past Attempts"
            message="Here you can revisit each quiz attempt, view your answers, and understand your progress over time. Select an attempt to explore the full details."
            colorFrom="from-green-50"
            colorTo="to-teal-50"
            iconColor="text-emerald-600"
        />
    );
};
