package ch.supsi.service.quizattempt;

import ch.supsi.model.api.badge.BadgeType;
import ch.supsi.model.dto.api.QuizAttemptDTO;
import org.bson.types.ObjectId;

import java.util.List;

public interface IQuizAttemptService {
    QuizAttemptDTO createQuizAttempt(QuizAttemptDTO quizAttemptDTO);

    QuizAttemptDTO getQuizAttemptById(ObjectId attemptId);

    List<QuizAttemptDTO> getQuizAttemptsByPublication(ObjectId publicationId);

    List<QuizAttemptDTO> getQuizAttemptsByUser(String userAzureOID);

    List<QuizAttemptDTO> getQuizAttemptsByPublicationAndQuestion(ObjectId publicationId, ObjectId questionId);

    QuizAttemptDTO updateQuizAttempt(ObjectId attemptId, QuizAttemptDTO dto);

    QuizAttemptDTO submitQuizAttempt(ObjectId attemptId, QuizAttemptDTO dto);

    void assignBadge(ObjectId attemptId, BadgeType badgeType, String teacherAzureOid);
}