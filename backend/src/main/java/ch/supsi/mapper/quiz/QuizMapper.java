package ch.supsi.mapper.quiz;

import ch.supsi.model.api.Quiz;
import ch.supsi.model.dto.api.QuizDTO;
import ch.supsi.model.dto.api.question.QuestionDTO;
import org.bson.types.ObjectId;
import org.jetbrains.annotations.NotNull;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

public class QuizMapper {
    public QuizDTO toDTO(@NotNull Quiz quiz, List<QuestionDTO> questionDTOList) {
        QuizDTO dto = new QuizDTO();
        dto.setId(quiz.getId().toString());
        dto.setName(quiz.getName());
        dto.setDescription(quiz.getDescription());
        dto.setQuestions(questionDTOList);
        return dto;
    }

    public Quiz toEntity(@NotNull QuizDTO dto, Set<String> questionIdList) {
        Quiz quiz = new Quiz(dto.getName());

        if (dto.getId() != null) {
            quiz.setId(new ObjectId(dto.getId()));
        }

        quiz.setDescription(dto.getDescription());

        quiz.setQuestions(questionIdList);

        quiz.setCreatedAt(dto.getCreatedAt() != null ? dto.getCreatedAt() : LocalDateTime.now());
        quiz.setUpdatedAt(dto.getUpdatedAt() != null ? dto.getUpdatedAt() : LocalDateTime.now());

        return quiz;
    }
}