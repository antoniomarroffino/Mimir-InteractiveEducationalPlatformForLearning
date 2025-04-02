package ch.supsi.mapper.quiz;

import ch.supsi.model.api.Quiz;
import ch.supsi.model.dto.api.QuizDTO;
import ch.supsi.model.dto.api.question.QuestionDTO;
import org.bson.types.ObjectId;
import org.jetbrains.annotations.NotNull;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public class QuizMapper {
    public QuizDTO toDTO(@NotNull Quiz quiz, List<QuestionDTO> questionDTOList) {
        QuizDTO dto = new QuizDTO();
        dto.setId(quiz.id.toString());
        dto.setName(quiz.name);
        dto.setDescription(quiz.description);
        dto.setQuestions(questionDTOList);
        dto.setUpdatedAt(quiz.updatedAt);
        return dto;
    }

    public Quiz toEntity(@NotNull QuizDTO dto, Set<String> questionIdList) {
        Quiz quiz = new Quiz(dto.getName());

        if (dto.getId() != null) {
            quiz.id = new ObjectId(dto.getId());
        }

        quiz.description = dto.getDescription();

        quiz.questionsId = questionIdList.stream()
                .map(ObjectId::new)
                .collect(Collectors.toSet());

        quiz.createdAt = dto.getCreatedAt() != null ? dto.getCreatedAt() : LocalDateTime.now();
        quiz.updatedAt = dto.getUpdatedAt() != null ? dto.getUpdatedAt() : LocalDateTime.now();

        return quiz;
    }
}