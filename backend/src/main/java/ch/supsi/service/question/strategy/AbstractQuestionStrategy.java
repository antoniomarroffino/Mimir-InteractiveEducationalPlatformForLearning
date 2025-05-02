package ch.supsi.service.question.strategy;

import ch.supsi.model.api.question.Question;
import ch.supsi.model.dto.api.question.QuestionDTO;

public abstract class AbstractQuestionStrategy<E extends Question, D extends QuestionDTO> implements IQuestionCreationStrategy<E, D> {
    @Override
    public void updateQuestion(E entity, D questionDTOUpdated) {
        entity.questionText = questionDTOUpdated.getQuestionText();
        entity.points = questionDTOUpdated.getPoints();
    }
}