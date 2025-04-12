package ch.supsi.service.quizattempt.points.builder;

import ch.supsi.model.api.question.Question;
import ch.supsi.model.api.question.QuestionType;
import ch.supsi.model.api.response.QuestionResponse;
import ch.supsi.service.quizattempt.points.strategy.IPointsCalculatorStrategy;

public interface IPointsCalculatorBuilder {
    <E extends QuestionResponse, D extends Question> IPointsCalculatorStrategy<E, D> getPointsCalculator(QuestionType questionType);
}
