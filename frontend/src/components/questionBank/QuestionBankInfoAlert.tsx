import {FiDatabase} from "react-icons/fi";
import {PageInfoAlert} from "../common/PageInfoAlert";

export const QuestionBankInfoAlert = () => {
    return (
        <PageInfoAlert
            icon={<FiDatabase/>}
            title="What is a Question Bank?"
            message="Question Banks are shared collections of questions that teachers can create and contribute to. You can create your own, or reuse questions from existing ones — making quizzes faster, smarter, and more collaborative."
            colorFrom="from-purple-50"
            colorTo="to-indigo-50"
            iconColor="text-purple-600"
        />
    );
};
