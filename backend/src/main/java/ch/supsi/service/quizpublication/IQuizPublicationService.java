package ch.supsi.service.quizpublication;

import ch.supsi.model.api.QuizPublication;
import ch.supsi.model.dto.api.QuizPublicationDTO;
import org.bson.types.ObjectId;

import java.util.List;

public interface IQuizPublicationService {
    QuizPublicationDTO publishQuiz(QuizPublicationDTO quizPublicationDTO);

    QuizPublicationDTO getQuizPublicationById(ObjectId publicationID);

    QuizPublicationDTO getPublicationByCode(String code);

    QuizPublicationDTO updateQuizPublication(ObjectId publicationId, QuizPublicationDTO quizPublicationDTO);

    QuizPublicationDTO deactivateQuizPublication(ObjectId publicationId);

    boolean deleteQuizPublication(ObjectId publicationId);

    List<QuizPublicationDTO> getPublicationsByQuizId(ObjectId quizId);
}
