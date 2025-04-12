package ch.supsi.service.response;

import ch.supsi.model.api.question.Question;
import ch.supsi.model.api.response.QuestionResponse;

public interface IPointsCalculator {
    int calculatePoints(QuestionResponse response, Question question);
}