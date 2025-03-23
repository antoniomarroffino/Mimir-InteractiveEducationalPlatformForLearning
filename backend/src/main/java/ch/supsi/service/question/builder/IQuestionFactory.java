package ch.supsi.service.question.builder;

import ch.supsi.model.api.question.Question;
import ch.supsi.model.api.question.QuestionType;
import ch.supsi.model.dto.api.question.QuestionDTO;

public interface IQuestionFactory {
    Question createQuestion(QuestionType type);

}
