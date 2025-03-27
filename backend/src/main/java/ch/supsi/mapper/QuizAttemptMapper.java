package ch.supsi.mapper;

import ch.supsi.mapper.response.builder.IQuestionResponseMapperBuilder;
import ch.supsi.model.api.QuizAttempt;
import ch.supsi.model.dto.api.QuizAttemptDTO;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.bson.types.ObjectId;

import java.util.stream.Collectors;

@ApplicationScoped
public class QuizAttemptMapper implements IBaseMapper<QuizAttempt, QuizAttemptDTO> {

    @Inject
    IQuestionResponseMapperBuilder questionResponseMapperBuilder;

    @Override
    public QuizAttemptDTO toDTO(QuizAttempt quizAttempt) {
        if (quizAttempt == null) {
            return null;
        }

        QuizAttemptDTO dto = new QuizAttemptDTO();
        dto.setId(quizAttempt.id.toString());
        dto.setQuizPublicationId(quizAttempt.quizPublicationId.toString());

        if (quizAttempt.userId != null) {
            dto.setUserId(quizAttempt.userId.toString());
        }

        dto.setStartedAt(quizAttempt.startedAt);
        dto.setCompletedAt(quizAttempt.completedAt);

        if (quizAttempt.responses != null) {
            dto.setResponses(quizAttempt.responses.stream()
                    .map(question -> this.questionResponseMapperBuilder.getQuestionResponseDTOMapper(question.type).toDTO(question))
                    .collect(Collectors.toList()));
        }

        return dto;
    }

    @Override
    public QuizAttempt toEntity(QuizAttemptDTO dto) {
        if (dto == null) {
            return null;
        }

        QuizAttempt quizAttempt = new QuizAttempt();

        if (dto.getId() != null) {
            quizAttempt.id = new ObjectId(dto.getId());
        }

        quizAttempt.quizPublicationId = new ObjectId(dto.getQuizPublicationId());

        if (dto.getUserId() != null) {
            quizAttempt.userId = new ObjectId(dto.getUserId());
        }

        quizAttempt.startedAt = dto.getStartedAt();
        quizAttempt.completedAt = dto.getCompletedAt();

        quizAttempt.responses = dto.getResponses().stream()
                .map(qDTO -> this.questionResponseMapperBuilder.getQuestionResponseDTOMapper(qDTO.getType()).toEntity(qDTO))
                .collect(Collectors.toList()).reversed();


        return quizAttempt;
    }
}