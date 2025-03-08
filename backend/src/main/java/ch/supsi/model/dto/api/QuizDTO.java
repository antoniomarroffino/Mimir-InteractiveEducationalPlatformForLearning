package ch.supsi.model.dto.api;

import ch.supsi.model.api.Quiz;
import org.bson.types.ObjectId;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class QuizDTO {
    private String id;
    private String name;
    private String description;
    private List<QuestionDTO> questions = new ArrayList<>();
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public QuizDTO() {
    }

    public static QuizDTO fromEntity(Quiz quiz) {
        if (quiz == null) return null;

        QuizDTO dto = new QuizDTO();
        dto.setId(quiz.getId() != null ? quiz.getId().toString() : null);
        dto.setName(quiz.getName());
        dto.setDescription(quiz.getDescription());
        /*dto.setQuestions(quiz.getQuestions().stream()
                .map(QuestionDTO::fromEntity)
                .collect(Collectors.toList()));*/
        dto.setCreatedAt(quiz.getCreatedAt());
        dto.setUpdatedAt(quiz.getUpdatedAt());
        return dto;
    }

    public Quiz toEntity() {
        Quiz quiz = new Quiz();
        if (this.id != null) {
            quiz.setId(new ObjectId(this.id));
        }
        quiz.setName(this.name);
        quiz.setDescription(this.description);
        /*quiz.setQuestions(this.questions.stream()
                .map(QuestionDTO::toEntity)
                .collect(Collectors.toList()));*/
        quiz.setCreatedAt(this.createdAt);
        quiz.setUpdatedAt(this.updatedAt);
        return quiz;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<QuestionDTO> getQuestions() {
        return questions;
    }

    public void setQuestions(List<QuestionDTO> questions) {
        this.questions = questions != null ? questions : new ArrayList<>();
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
