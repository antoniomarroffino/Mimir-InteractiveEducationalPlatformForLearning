package ch.supsi.service.question.strategy;

import ch.supsi.model.api.question.Question;
import ch.supsi.model.api.question.TrueFalseQuestion;
import ch.supsi.model.dto.api.question.TrueFalseQuestionDTO;

public class TrueFalseQuestionStrategy extends AbstractQuestionStrategy<TrueFalseQuestion, TrueFalseQuestionDTO> {
    @Override
    public Question createQuestion() {
        return new TrueFalseQuestion();
    }

    @Override
    public void updateQuestion(TrueFalseQuestion entity, TrueFalseQuestionDTO questionDTOUpdated) {
        if (entity == null || questionDTOUpdated == null)
            return;
        super.updateQuestion(entity, questionDTOUpdated);
        entity.correctAnswer = questionDTOUpdated.getCorrectAnswer();
    }
}