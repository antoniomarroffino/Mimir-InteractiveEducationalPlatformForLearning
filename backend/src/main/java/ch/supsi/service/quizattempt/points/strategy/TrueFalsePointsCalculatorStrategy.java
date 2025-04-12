package ch.supsi.service.quizattempt.points.strategy;

import ch.supsi.model.api.question.Question;
import ch.supsi.model.api.question.TrueFalseQuestion;
import ch.supsi.model.api.response.QuestionResponse;
import ch.supsi.model.api.response.TrueFalseQuestionResponse;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class TrueFalsePointsCalculatorStrategy implements IPointsCalculatorStrategy<TrueFalseQuestionResponse, TrueFalseQuestion> {
    @Override
    public int calculatePoints(TrueFalseQuestionResponse response, TrueFalseQuestion question) {
        return response.selectedAnswer == question.correctAnswer ? question.points : 0;
    }
}
