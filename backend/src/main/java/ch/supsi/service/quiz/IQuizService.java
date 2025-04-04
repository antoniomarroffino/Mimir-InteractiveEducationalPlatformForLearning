package ch.supsi.service.quiz;

import ch.supsi.model.dto.api.FolderDTO;
import ch.supsi.model.dto.api.QuizDTO;
import org.bson.types.ObjectId;

import java.util.List;

public interface IQuizService {
    List<QuizDTO> getQuizzesInFolder(FolderDTO folderDTO);

    QuizDTO getQuizInFolder(FolderDTO folderDTO, ObjectId quizId);

    QuizDTO addQuizToFolder(ObjectId courseId, ObjectId folderId, QuizDTO quizDTO);

    QuizDTO updateQuizInFolder(ObjectId courseId, ObjectId folderId, ObjectId quizId, QuizDTO quizDTO);

    void removeQuizFromFolder(ObjectId courseId, ObjectId folderId, ObjectId quizId);
}