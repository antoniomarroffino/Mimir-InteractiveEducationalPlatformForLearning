package ch.supsi.mapper;

import ch.supsi.mapper.question.builder.IQuestionMapperBuilder;
import ch.supsi.model.api.Quiz;
import ch.supsi.model.dto.api.QuizDTO;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.bson.types.ObjectId;

import java.time.LocalDateTime;
import java.util.stream.Collectors;

@ApplicationScoped
public class QuizMapper implements IBaseMapper<Quiz, QuizDTO> {
    @Inject
    IQuestionMapperBuilder questionMapperBuilder;

    @Override
    public QuizDTO toDTO(Quiz quiz) {
        if (quiz == null) {
            return null;
        }

        QuizDTO dto = new QuizDTO();
        dto.setId(quiz.getId().toString());
        dto.setName(quiz.getName());
        dto.setDescription(quiz.getDescription());

        if (quiz.getQuestions() != null) {
            dto.setQuestions(quiz.getQuestions().stream()
                    .map(question -> this.questionMapperBuilder.getQuestionDTOMapper(question.getType()).toDTO(question))
                    .collect(Collectors.toList()));
        }
        return dto;
    }

    @Override
    public Quiz toEntity(QuizDTO dto) {
        if (dto == null) {
            return null;
        }

        Quiz quiz = new Quiz(dto.getName());

        if (dto.getId() != null) {
            quiz.setId(new ObjectId(dto.getId()));
        }

        quiz.setDescription(dto.getDescription());

        quiz.setQuestions(dto.getQuestions().stream()
                .map(qDTO -> this.questionMapperBuilder.getQuestionDTOMapper(qDTO.getType()).toEntity(qDTO))
                .collect(Collectors.toList()).reversed());

        quiz.setCreatedAt(dto.getCreatedAt() != null ? dto.getCreatedAt() : LocalDateTime.now());
        quiz.setUpdatedAt(dto.getUpdatedAt() != null ? dto.getUpdatedAt() : LocalDateTime.now());

        return quiz;
    }
}