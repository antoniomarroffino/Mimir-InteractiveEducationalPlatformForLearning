package ch.supsi.service.question.strategy;

import ch.supsi.model.api.question.Question;

public interface IQuestionCreationStrategy<E, D> {
    Question createQuestion();

    void updateQuestion(E entity, D questionDTOUpdated);
}