import {useParams} from "react-router-dom";
import {useGetQuestionBankById} from "../../hooks/questionBank/useSelectedQuestionBank.ts";

const QuestionBankDetails: React.FC = () => {
    const {questionBankId} = useParams();
    const {data: questionBankDTO, isLoading, error} = useGetQuestionBankById(questionBankId!);

    return (
        <div>

        </div>
    );
}

export default QuestionBankDetails;