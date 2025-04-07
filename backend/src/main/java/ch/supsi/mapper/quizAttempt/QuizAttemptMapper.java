package ch.supsi.mapper.quizAttempt;

import ch.supsi.mapper.BadgeMapper;
import ch.supsi.mapper.IBaseMapper;
import ch.supsi.mapper.response.builder.IQuestionResponseMapperBuilder;
import ch.supsi.model.api.QuizAttempt;
import ch.supsi.model.api.badge.Badge;
import ch.supsi.model.api.response.QuestionResponse;
import ch.supsi.model.dto.api.BadgeDTO;
import ch.supsi.model.dto.api.QuizAttemptDTO;
import ch.supsi.model.dto.api.response.QuestionResponseDTO;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.bson.types.ObjectId;

import java.util.List;
import java.util.stream.Collectors;

@ApplicationScoped
public class QuizAttemptMapper {
    public QuizAttemptDTO toDTO(QuizAttempt quizAttempt, List<QuestionResponseDTO> questionResponseDTOList, List<BadgeDTO> badgeDTOList) {
        QuizAttemptDTO dto = new QuizAttemptDTO();
        dto.setId(quizAttempt.id.toString());
        dto.setQuizPublicationId(quizAttempt.quizPublicationId.toString());
        dto.setUserAzureOID(quizAttempt.userAzureOID);
        dto.setStartedAt(quizAttempt.startedAt);
        dto.setCompletedAt(quizAttempt.completedAt);
        dto.setResponses(questionResponseDTOList);
        dto.setBadges(badgeDTOList);
        return dto;
    }

    public QuizAttempt toEntity(QuizAttemptDTO dto, List<QuestionResponse> questionResponseList, List<Badge> badgeList) {
        QuizAttempt quizAttempt = new QuizAttempt();

        if (dto.getId() != null) {
            quizAttempt.id = new ObjectId(dto.getId());
        }

        quizAttempt.quizPublicationId = new ObjectId(dto.getQuizPublicationId());
        quizAttempt.userAzureOID = dto.getUserAzureOID();
        quizAttempt.startedAt = dto.getStartedAt();
        quizAttempt.completedAt = dto.getCompletedAt();
        quizAttempt.responses = questionResponseList;
        quizAttempt.badges = badgeList;
        return quizAttempt;
    }
}