package ch.supsi.mapper.quizAttempt;

import ch.supsi.model.api.QuizAttempt;
import ch.supsi.model.api.badge.Badge;
import ch.supsi.model.api.response.QuestionResponse;
import ch.supsi.model.dto.api.BadgeDTO;
import ch.supsi.model.dto.api.QuizAttemptDTO;
import ch.supsi.model.dto.api.UserWithoutCoursesDTO;
import ch.supsi.model.dto.api.response.QuestionResponseDTO;
import jakarta.enterprise.context.ApplicationScoped;
import org.bson.types.ObjectId;
import org.jetbrains.annotations.NotNull;

import java.util.List;

@ApplicationScoped
public class QuizAttemptMapper {
    public QuizAttemptDTO toDTO(@NotNull QuizAttempt quizAttempt, List<QuestionResponseDTO> questionResponseDTOList, List<BadgeDTO> badgeDTOList) {
        QuizAttemptDTO dto = new QuizAttemptDTO();
        dto.setId(quizAttempt.id.toString());
        dto.setQuizPublicationId(quizAttempt.quizPublicationId.toString());
        dto.setUser(new UserWithoutCoursesDTO(quizAttempt.userAzureOID, null, null, null));
        dto.setStartedAt(quizAttempt.startedAt);
        dto.setCompletedAt(quizAttempt.completedAt);
        dto.setResponses(questionResponseDTOList);
        dto.setBadges(badgeDTOList);
        dto.setStatus(quizAttempt.status);
        dto.setTimeRemainingSeconds(quizAttempt.timeRemainingSeconds);
        return dto;
    }

    public QuizAttempt toEntity(@NotNull QuizAttemptDTO dto, List<QuestionResponse> questionResponseList, List<Badge> badgeList) {
        QuizAttempt quizAttempt = new QuizAttempt();

        if (dto.getId() != null) {
            quizAttempt.id = new ObjectId(dto.getId());
        }

        quizAttempt.quizPublicationId = new ObjectId(dto.getQuizPublicationId());
        quizAttempt.userAzureOID = dto.getUser() == null ? null : dto.getUser().getAzureOid();
        quizAttempt.startedAt = dto.getStartedAt();
        quizAttempt.completedAt = dto.getCompletedAt();
        quizAttempt.responses = questionResponseList;
        quizAttempt.badges = badgeList;
        quizAttempt.status = dto.getStatus();
        quizAttempt.timeRemainingSeconds = dto.getTimeRemainingSeconds();
        return quizAttempt;
    }
}