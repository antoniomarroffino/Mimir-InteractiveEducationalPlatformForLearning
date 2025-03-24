import {useContext} from "react";
import {QuestionListContext} from "../../contexts/question/QuestionListContext.ts";

export const useQuestionList = () => {
    const context = useContext(QuestionListContext);
    if(context === undefined) {
        throw new Error('useCourseList must be used within a CourseListProvider');
    }
    return context;
}