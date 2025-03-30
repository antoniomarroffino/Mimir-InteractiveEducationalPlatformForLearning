package ch.supsi.service.quizpublication;

import ch.supsi.model.api.QuizPublication;
import ch.supsi.model.dto.api.QuizPublicationDTO;
import org.bson.types.ObjectId;

import java.util.List;

public interface IQuizPublicationService {
    QuizPublicationDTO publishQuiz(QuizPublicationDTO quizPublicationDTO);

    QuizPublicationDTO getQuizPublicationById(ObjectId publicationID);

    QuizPublication getPublicationByReferences(String courseId, String folderId, String quizId);

    List<QuizPublication> getAllPublications();

    QuizPublication getPublicationByCode(String code);

    QuizPublicationDTO updateQuizPublication(QuizPublicationDTO quizPublicationDTO);

    QuizPublicationDTO deactivateQuizPublication(String publicationID);

    boolean deleteQuizPublication(String id);

    List<QuizPublicationDTO> getPublicationsByQuizId(String quizId);
}
