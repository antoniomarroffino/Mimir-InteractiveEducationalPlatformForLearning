package ch.supsi.service.question.strategy;

import ch.supsi.model.api.question.MultipleChoiceQuestion;
import ch.supsi.model.api.question.Question;
import ch.supsi.model.api.question.QuestionType;
import ch.supsi.model.dto.api.question.MultipleChoiceQuestionDTO;
import ch.supsi.model.dto.api.question.QuestionDTO;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class MultipleChoiceQuestionStrategy implements IQuestionCreationStrategy {
    @Override
    public Question createQuestion() {
        return new MultipleChoiceQuestion();
    }
}