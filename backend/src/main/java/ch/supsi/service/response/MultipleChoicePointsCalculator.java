package ch.supsi.service.response;

import ch.supsi.model.api.question.MultipleChoiceQuestion;
import ch.supsi.model.api.question.Question;
import ch.supsi.model.api.response.MultipleChoiceQuestionResponse;
import ch.supsi.model.api.response.QuestionResponse;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class MultipleChoicePointsCalculator implements IPointsCalculator {
    @Override
    public int calculatePoints(QuestionResponse response, Question question) {
        MultipleChoiceQuestionResponse mcResponse = (MultipleChoiceQuestionResponse) response;
        MultipleChoiceQuestion mcQuestion = (MultipleChoiceQuestion) question;
        return mcResponse.selectedAnswerIndexes.equals(mcQuestion.correctAnswerIndexes) ? question.points : 0;
    }
}