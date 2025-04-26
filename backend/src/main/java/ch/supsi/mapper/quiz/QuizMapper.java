package ch.supsi.mapper.quiz;

import ch.supsi.model.api.Quiz;
import ch.supsi.model.dto.api.QuizDTO;
import ch.supsi.model.dto.api.question.QuestionDTO;
import jakarta.enterprise.context.ApplicationScoped;
import org.bson.types.ObjectId;
import org.jetbrains.annotations.NotNull;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@ApplicationScoped
public class QuizMapper {
    public QuizDTO toDTO(@NotNull Quiz quiz, List<QuestionDTO> questionDTOList) {
        QuizDTO dto = new QuizDTO();
        dto.setId(quiz.id.toString());
        dto.setName(quiz.name);
        dto.setDescription(quiz.description);
        dto.setQuestions(questionDTOList);
        dto.setCreatedAt(quiz.createdAt);
        dto.setUpdatedAt(quiz.updatedAt);
        dto.setTimeLimitMinutes(quiz.timeLimitMinutes);
        return dto;
    }

    public Quiz toEntity(@NotNull QuizDTO dto, List<String> questionIdList) {
        Quiz quiz = new Quiz(dto.getName());

        if (dto.getId() != null) {
            quiz.id = new ObjectId(dto.getId());
        }

        quiz.description = dto.getDescription();
        quiz.timeLimitMinutes = dto.getTimeLimitMinutes();

        quiz.questionsId = questionIdList.stream()
                .map(ObjectId::new)
                .collect(Collectors.toList());

        quiz.createdAt = dto.getCreatedAt() != null ? dto.getCreatedAt() : LocalDateTime.now();
        quiz.updatedAt = dto.getUpdatedAt() != null ? dto.getUpdatedAt() : LocalDateTime.now();

        return quiz;
    }
}
