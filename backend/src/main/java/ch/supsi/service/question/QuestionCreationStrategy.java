package ch.supsi.service.question;

import ch.supsi.model.api.question.Question;

public interface QuestionCreationStrategy {
    Question createQuestion();
}