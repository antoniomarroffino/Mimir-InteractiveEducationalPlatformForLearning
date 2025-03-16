package ch.supsi.service.question.strategy;

import ch.supsi.model.api.question.Question;
import ch.supsi.model.api.question.QuestionType;
import ch.supsi.model.api.question.TrueFalseQuestion;
import ch.supsi.model.dto.api.question.QuestionDTO;
import ch.supsi.model.dto.api.question.TrueFalseQuestionDTO;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class TrueFalseQuestionStrategy implements QuestionCreationStrategy {

    @Override
    public QuestionType getType() {
        return QuestionType.TRUE_FALSE;
    }

    @Override
    public Question createQuestion() {
        return new TrueFalseQuestion();
    }

    @Override
    public QuestionDTO createQuestionTemplate() {
        return new TrueFalseQuestionDTO();
    }
}