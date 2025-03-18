package ch.supsi.service.question.strategy;

import ch.supsi.model.api.question.Question;
import ch.supsi.model.api.question.QuestionType;
import ch.supsi.model.dto.api.question.QuestionDTO;

public interface IQuestionCreationStrategy {
    Question createQuestion();
    QuestionDTO createQuestionTemplate();
}