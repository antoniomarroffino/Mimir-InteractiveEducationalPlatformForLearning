package ch.supsi.model.dto.api;

import ch.supsi.model.dto.api.response.QuestionResponseDTO;
import io.quarkus.runtime.annotations.RegisterForReflection;
import jakarta.validation.constraints.NotNull;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@RegisterForReflection
@Schema(description = "QuizAttempt DTO", name = "QuizAttemptDTO")
public class QuizAttemptDTO {
    private String id;

    @NotNull(message = "Quiz publication ID cannot be null")
    private String quizPublicationId;

    private String userAzureOID;

    private LocalDateTime startedAt;

    private LocalDateTime completedAt;

    private List<QuestionResponseDTO> responses;

    private List<BadgeDTO> badges = new ArrayList<>();

    public QuizAttemptDTO() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getQuizPublicationId() {
        return quizPublicationId;
    }

    public void setQuizPublicationId(String quizPublicationId) {
        this.quizPublicationId = quizPublicationId;
    }

    public String getUserAzureOID() {
        return userAzureOID;
    }

    public void setUserAzureOID(String userAzureOID) {
        this.userAzureOID = userAzureOID;
    }

    public LocalDateTime getStartedAt() {
        return startedAt;
    }

    public void setStartedAt(LocalDateTime startedAt) {
        this.startedAt = startedAt;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }

    public List<QuestionResponseDTO> getResponses() {
        return responses;
    }

    public void setResponses(List<QuestionResponseDTO> responses) {
        this.responses = responses;
    }

    public List<BadgeDTO> getBadges() {
        return badges;
    }

    public void setBadges(List<BadgeDTO> badges) {
        this.badges = badges != null ? badges : new ArrayList<>();
    }
}