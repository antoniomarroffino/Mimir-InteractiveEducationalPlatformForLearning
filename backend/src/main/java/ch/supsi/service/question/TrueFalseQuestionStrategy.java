package ch.supsi.service.question;

import ch.supsi.model.api.question.Question;
import ch.supsi.model.api.question.TrueFalseQuestion;
import ch.supsi.model.dto.api.question.QuestionDTO;
import ch.supsi.model.dto.api.question.TrueFalseQuestionDTO;

public class TrueFalseQuestionStrategy implements QuestionCreationStrategy {
    @Override
    public Question createQuestion() {
        return new TrueFalseQuestion();
    }
    @Override
    public QuestionDTO createQuestionTemplate() {
        return new TrueFalseQuestionDTO();
    }
}