package ch.supsi.service.question;

import ch.supsi.model.api.question.Question;
import ch.supsi.model.dto.api.question.QuestionDTO;

public interface QuestionCreationStrategy {
    Question createQuestion();
    QuestionDTO createQuestionTemplate();
}