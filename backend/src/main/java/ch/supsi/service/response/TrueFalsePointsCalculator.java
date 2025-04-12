package ch.supsi.service.response;

import ch.supsi.model.api.question.Question;
import ch.supsi.model.api.question.TrueFalseQuestion;
import ch.supsi.model.api.response.QuestionResponse;
import ch.supsi.model.api.response.TrueFalseQuestionResponse;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class TrueFalsePointsCalculator implements IPointsCalculator {
    @Override
    public int calculatePoints(QuestionResponse response, Question question) {
        TrueFalseQuestionResponse tfResponse = (TrueFalseQuestionResponse) response;
        TrueFalseQuestion tfQuestion = (TrueFalseQuestion) question;
        return tfResponse.selectedAnswer == tfQuestion.correctAnswer ? question.points : 0;
    }
}
