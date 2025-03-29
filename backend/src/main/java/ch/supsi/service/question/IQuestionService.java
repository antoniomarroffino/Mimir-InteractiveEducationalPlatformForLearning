package ch.supsi.service.question;

import ch.supsi.model.api.question.QuestionType;
import ch.supsi.model.dto.api.question.QuestionDTO;
import org.bson.types.ObjectId;

public interface IQuestionService {
    QuestionDTO createQuestionTemplate(QuestionType type);

    QuestionDTO createQuestionInQuestionBank(QuestionDTO questionDTO);

    QuestionDTO updateQuestion(ObjectId questionId, QuestionDTO questionDTO);

    void deleteQuestion(ObjectId questionId);
}