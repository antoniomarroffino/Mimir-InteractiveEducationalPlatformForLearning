package ch.supsi.mapper.quizAttempt.facade;

import ch.supsi.mapper.BadgeMapper;
import ch.supsi.mapper.quizAttempt.QuizAttemptMapper;
import ch.supsi.mapper.response.builder.IQuestionResponseMapperBuilder;
import ch.supsi.model.api.QuizAttempt;
import ch.supsi.model.api.badge.Badge;
import ch.supsi.model.api.response.QuestionResponse;
import ch.supsi.model.dto.api.BadgeDTO;
import ch.supsi.model.dto.api.QuizAttemptDTO;
import ch.supsi.model.dto.api.response.QuestionResponseDTO;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.util.List;

@ApplicationScoped
public class QuizAttemptMapperFacade implements IQuizAttemptMapperFacade {
    @Inject
    QuizAttemptMapper quizAttemptMapper;

    @Inject
    IQuestionResponseMapperBuilder questionResponseMapperBuilder;

    @Inject
    BadgeMapper badgeMapper;

    @Override
    public QuizAttemptDTO toDTO(QuizAttempt entity) {
        if(entity == null) return null;

        List<QuestionResponseDTO> questionResponseDTOList = this.getQuestionResponsesDTOFromQuestionResponseEntity(entity.responses);
        List<BadgeDTO> badgeDTOList = this.getBadgesDTOFromBadgesEntity(entity.badges);

        return this.quizAttemptMapper.toDTO(entity, questionResponseDTOList, badgeDTOList);
    }

    @Override
    public QuizAttempt toEntity(QuizAttemptDTO dto) {
        if(dto == null) return null;

        List<QuestionResponse> questionResponseList = this.getQuestionResponsesFromQuestionResponsesDTO(dto.getResponses());
        List<Badge> badges = this.getBadgesFromBadgesDTO(dto.getBadges());

        return this.quizAttemptMapper.toEntity(dto, questionResponseList, badges);
    }

    private List<QuestionResponseDTO> getQuestionResponsesDTOFromQuestionResponseEntity(List<QuestionResponse> questionResponses) {
        return questionResponses
                .stream()
                .map(qResponseEntity -> this.questionResponseMapperBuilder.getQuestionResponseDTOMapper(qResponseEntity.responseType).toDTO(qResponseEntity))
                .toList();
    }

    private List<QuestionResponse> getQuestionResponsesFromQuestionResponsesDTO(List<QuestionResponseDTO> questionResponsesDTO) {
        return questionResponsesDTO
                .stream()
                .map(qResponseDTO -> this.questionResponseMapperBuilder.getQuestionResponseDTOMapper(qResponseDTO.getResponseType()).toEntity(qResponseDTO))
                .toList();
    }

    private List<BadgeDTO> getBadgesDTOFromBadgesEntity(List<Badge> badges) {
        return badges
                .stream()
                .map(this.badgeMapper::toDTO)
                .toList();
    }

    private List<Badge> getBadgesFromBadgesDTO(List<BadgeDTO> badgesDTO) {
        return badgesDTO
                .stream()
                .map(this.badgeMapper::toEntity)
                .toList();
    }
}
