package ch.supsi.service.quiz;

import ch.supsi.model.dto.api.CourseDTO;
import ch.supsi.model.dto.api.FolderDTO;
import ch.supsi.model.dto.api.QuizDTO;
import org.bson.types.ObjectId;

import java.util.List;

public interface IQuizService {
    List<QuizDTO> getQuizzesInFolder(FolderDTO folderDTO);

    QuizDTO getQuizInFolder(FolderDTO folderDTO, ObjectId quizId);

    QuizDTO addQuizToFolder(CourseDTO courseDTO, FolderDTO folderDTO, QuizDTO quizDTO);

    QuizDTO updateQuizInFolder(CourseDTO courseDTO, FolderDTO folderDTO, ObjectId quizId, QuizDTO quizDTO);

    void removeQuizFromFolder(CourseDTO courseDTO, FolderDTO folderDTO, ObjectId quizId);
}