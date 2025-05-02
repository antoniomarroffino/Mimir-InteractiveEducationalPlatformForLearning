package ch.supsi.service.quiz;

import ch.supsi.model.dto.api.CourseDTO;
import ch.supsi.model.dto.api.QuizDTO;
import org.bson.types.ObjectId;

import java.util.List;

public interface IQuizService {
    List<QuizDTO> getQuizzesInFolder(CourseDTO courseDTO, ObjectId folderId);

    QuizDTO getQuizInFolder(CourseDTO courseDTO, ObjectId folderId, ObjectId quizIdd);

    QuizDTO addQuizToFolder(CourseDTO courseDTOd, ObjectId folderId, QuizDTO quizDTO);

    QuizDTO updateQuizInFolder(CourseDTO courseDTOd, ObjectId folderId, ObjectId quizId, QuizDTO quizDTO);

    void removeQuizFromFolder(CourseDTO courseDTO, ObjectId folderId, ObjectId quizId);
}