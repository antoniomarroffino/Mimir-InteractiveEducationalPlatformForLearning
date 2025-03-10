package ch.supsi.service.question;

import ch.supsi.model.api.question.Question;
import ch.supsi.model.api.question.TrueFalseQuestion;

public class TrueFalseQuestionStrategy implements QuestionCreationStrategy {
    @Override
    public Question createQuestion() {
        return new TrueFalseQuestion();
    }
}