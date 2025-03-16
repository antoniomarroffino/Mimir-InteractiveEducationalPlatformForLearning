package ch.supsi.service.quiz;

import ch.supsi.model.dto.api.QuizDTO;
import org.bson.types.ObjectId;
import java.util.List;

public interface IQuizService {
    List<QuizDTO> getQuizzesInFolder(ObjectId courseId, ObjectId folderId);
    QuizDTO getQuizInFolder(ObjectId courseId, ObjectId folderId, ObjectId quizId);
    QuizDTO addQuizToFolder(ObjectId courseId, ObjectId folderId, QuizDTO quizDTO);
    QuizDTO updateQuizInFolder(ObjectId courseId, ObjectId folderId, ObjectId quizId, QuizDTO quizDTO);
    void removeQuizFromFolder(ObjectId courseId, ObjectId folderId, ObjectId quizId);
}