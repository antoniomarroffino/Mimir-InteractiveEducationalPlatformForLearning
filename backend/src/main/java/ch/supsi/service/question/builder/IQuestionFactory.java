package ch.supsi.service.question.builder;

import ch.supsi.model.api.question.Question;
import ch.supsi.model.api.question.QuestionType;
import ch.supsi.model.dto.api.question.QuestionDTO;
import ch.supsi.service.question.strategy.IQuestionCreationStrategy;

public interface IQuestionFactory {
    <E extends Question, D extends QuestionDTO> IQuestionCreationStrategy<E, D> getStrategy(QuestionType type);
}
