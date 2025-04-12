package ch.supsi.service.quizattempt.points.strategy;

import ch.supsi.model.api.question.Question;
import ch.supsi.model.api.response.QuestionResponse;

public interface IPointsCalculatorStrategy<E extends QuestionResponse, D extends Question> {
    int calculatePoints(E response, D question);
}