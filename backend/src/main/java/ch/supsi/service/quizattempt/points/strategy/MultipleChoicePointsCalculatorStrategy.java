package ch.supsi.service.quizattempt.points.strategy;

import ch.supsi.model.api.question.MultipleChoiceQuestion;
import ch.supsi.model.api.question.Question;
import ch.supsi.model.api.response.MultipleChoiceQuestionResponse;
import ch.supsi.model.api.response.QuestionResponse;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class MultipleChoicePointsCalculatorStrategy implements IPointsCalculatorStrategy<MultipleChoiceQuestionResponse, MultipleChoiceQuestion> {
    @Override
    public int calculatePoints(MultipleChoiceQuestionResponse response, MultipleChoiceQuestion question) {
        return response.selectedAnswerIndexes.equals(question.correctAnswerIndexes) ? question.points : 0;
    }
}