package ch.supsi.service.question.strategy;

import ch.supsi.model.api.question.MultipleChoiceQuestion;
import ch.supsi.model.api.question.Question;
import ch.supsi.model.api.question.QuestionType;
import ch.supsi.model.dto.api.question.MultipleChoiceQuestionDTO;
import ch.supsi.model.dto.api.question.QuestionDTO;
import jakarta.enterprise.context.ApplicationScoped;

public class MultipleChoiceQuestionStrategy extends AbstractQuestionStrategy<MultipleChoiceQuestion, MultipleChoiceQuestionDTO> {
    @Override
    public Question createQuestion() {
        return new MultipleChoiceQuestion();
    }

    @Override
    public void updateQuestion(MultipleChoiceQuestion entity, MultipleChoiceQuestionDTO questionDTOUpdated) {
        if(entity == null || questionDTOUpdated == null)
            return;

        super.updateQuestion(entity, questionDTOUpdated);
        entity.choices = questionDTOUpdated.getChoices();
        entity.correctAnswerIndexes = questionDTOUpdated.getCorrectAnswerIndexes();
    }
}