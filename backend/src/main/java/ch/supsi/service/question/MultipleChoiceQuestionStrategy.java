package ch.supsi.service.question;

import ch.supsi.model.api.question.MultipleChoiceQuestion;
import ch.supsi.model.api.question.Question;
import ch.supsi.model.api.question.QuestionType;
import ch.supsi.model.dto.api.question.MultipleChoiceQuestionDTO;
import ch.supsi.model.dto.api.question.QuestionDTO;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class MultipleChoiceQuestionStrategy implements QuestionCreationStrategy {

    @Override
    public QuestionType getType() {
        return QuestionType.MULTIPLE_CHOICE;
    }

    @Override
    public Question createQuestion() {
        return new MultipleChoiceQuestion();
    }

    @Override
    public QuestionDTO createQuestionTemplate() {
        return new MultipleChoiceQuestionDTO();
    }
}