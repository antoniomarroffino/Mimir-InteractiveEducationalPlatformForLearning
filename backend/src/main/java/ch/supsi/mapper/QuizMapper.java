package ch.supsi.mapper;

import ch.supsi.model.api.Quiz;
import ch.supsi.model.dto.api.QuizDTO;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.bson.types.ObjectId;

import java.time.LocalDateTime;
import java.util.stream.Collectors;

@ApplicationScoped
public class QuizMapper implements BaseMapper<Quiz, QuizDTO> {
    @Inject
    QuestionMapper questionMapper;

    @Override
    public QuizDTO toDTO(Quiz quiz) {
        if (quiz == null) {
            return null;
        }

        QuizDTO dto = new QuizDTO();
        dto.setId(quiz.getId() != null ? quiz.getId().toString() : null);
        dto.setName(quiz.getName());
        dto.setDescription(quiz.getDescription());

        dto.setQuestions(quiz.getQuestions().stream()
                .map(questionMapper::toDTO)
                .collect(Collectors.toList()));

        dto.setCreatedAt(quiz.getCreatedAt());
        dto.setUpdatedAt(quiz.getUpdatedAt());

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

        // Usa il questionMapper che ha già l'injection del factory
        quiz.setQuestions(dto.getQuestions().stream()
                .map(questionMapper::toEntity)
                .collect(Collectors.toList()));

        quiz.setCreatedAt(dto.getCreatedAt() != null ? dto.getCreatedAt() : LocalDateTime.now());
        quiz.setUpdatedAt(dto.getUpdatedAt() != null ? dto.getUpdatedAt() : LocalDateTime.now());

        return quiz;
    }
}