package ch.supsi.model.dto.api;

import ch.supsi.model.dto.api.question.QuestionDTO;
import io.quarkus.runtime.annotations.RegisterForReflection;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@RegisterForReflection
public class QuizDTO {
    private String id;

    @NotBlank(message = "Quiz name cannot be null or empty")
    private String name;

    private String description;

    private List<QuestionDTO> questions = new ArrayList<>();

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private Integer timeLimitMinutes;

    public QuizDTO() {
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

    public Integer getTimeLimitMinutes() {
        return timeLimitMinutes;
    }

    public void setTimeLimitMinutes(Integer timeLimitMinutes) {
        this.timeLimitMinutes = timeLimitMinutes;
    }
}