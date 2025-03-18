package ch.supsi.mapper;

import ch.supsi.mapper.question.QuestionMapper;
import ch.supsi.model.api.Quiz;
import ch.supsi.model.dto.api.QuizDTO;
import ch.supsi.model.dto.api.question.QuestionDTO;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.bson.types.ObjectId;

import java.time.LocalDateTime;
import java.util.stream.Collectors;

@ApplicationScoped
public class QuizMapper implements IBaseMapper<Quiz, QuizDTO> {
    @Inject
    QuestionMapper questionMapper;

    @Override
    public QuizDTO toDTO(Quiz quiz) {
        if (quiz == null) {
            System.err.println("Received null Quiz");
            return null;
        }

        try {
            QuizDTO dto = new QuizDTO();
            dto.setId(quiz.getId().toString());
            dto.setName(quiz.getName());
            dto.setDescription(quiz.getDescription());
            if (quiz.getQuestions() != null) {
                dto.setQuestions(quiz.getQuestions().stream()
                        .map(question -> {
                            try {
                                return questionMapper.toDTO(question);
                            } catch (Exception e) {
                                System.err.println("Error converting question: " + question.getQuestionText());
                                e.printStackTrace();
                                throw e;
                            }
                        })
                        .collect(Collectors.toList()));
            }

            return dto;
        } catch (Exception e) {
            System.err.println("Error converting Quiz to DTO for quiz: " + quiz.getName());
            e.printStackTrace();
            throw new RuntimeException("Failed to convert Quiz to DTO", e);
        }
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
                .map(questionMapper::toEntity)
                .collect(Collectors.toList()).reversed());

        quiz.setCreatedAt(dto.getCreatedAt() != null ? dto.getCreatedAt() : LocalDateTime.now());
        quiz.setUpdatedAt(dto.getUpdatedAt() != null ? dto.getUpdatedAt() : LocalDateTime.now());

        return quiz;
    }
}