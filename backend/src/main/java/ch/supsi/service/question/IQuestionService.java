package ch.supsi.service.question;

import ch.supsi.model.api.question.QuestionType;
import ch.supsi.model.dto.api.question.QuestionDTO;
import org.bson.types.ObjectId;

import java.util.List;

public interface IQuestionService {
    QuestionDTO createQuestionTemplate(QuestionType type);

    List<QuestionDTO> getQuestionsInQuiz(ObjectId courseId, ObjectId folderId, ObjectId quizId);

    QuestionDTO addQuestionToQuiz(ObjectId courseId, ObjectId folderId, ObjectId quizId, QuestionDTO questionDTO);

    QuestionDTO updateQuestion(ObjectId courseId, ObjectId folderId, ObjectId quizId, ObjectId questionId, QuestionDTO questionDTO);

    void deleteQuestion(ObjectId courseId, ObjectId folderId, ObjectId quizId, ObjectId questionId);
}