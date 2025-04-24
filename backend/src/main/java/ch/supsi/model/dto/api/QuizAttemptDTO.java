package ch.supsi.model.dto.api;

import ch.supsi.model.api.AttemptStatus;
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

    private UserWithoutCoursesDTO user;

    private LocalDateTime startedAt;

    private LocalDateTime completedAt;

    private List<QuestionResponseDTO> responses;

    private List<BadgeDTO> badges;

    @Schema(description = "Status of the attempt (IN_PROGRESS, TERMINATED)")
    private AttemptStatus status;

    private Long timeUsed;

    public QuizAttemptDTO() {
        this.responses = new ArrayList<>();
        this.badges = new ArrayList<>();
        this.timeUsed = 0L;
    }

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getQuizPublicationId() {
        return this.quizPublicationId;
    }

    public void setQuizPublicationId(String quizPublicationId) {
        this.quizPublicationId = quizPublicationId;
    }

    public UserWithoutCoursesDTO getUser() {
        return this.user;
    }

    public void setUser(UserWithoutCoursesDTO user) {
        this.user = user;
    }

    public LocalDateTime getStartedAt() {
        return this.startedAt;
    }

    public void setStartedAt(LocalDateTime startedAt) {
        this.startedAt = startedAt;
    }

    public LocalDateTime getCompletedAt() {
        return this.completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }

    public List<QuestionResponseDTO> getResponses() {
        return this.responses;
    }

    public void setResponses(List<QuestionResponseDTO> responses) {
        this.responses = responses != null ? responses : new ArrayList<>();
    }

    public List<BadgeDTO> getBadges() {
        return this.badges;
    }

    public void setBadges(List<BadgeDTO> badges) {
        this.badges = badges != null ? badges : new ArrayList<>();
    }

    public AttemptStatus getStatus() {
        return status;
    }

    public void setStatus(AttemptStatus status) {
        this.status = status;
    }

    public Long getTimeUsed() {
        return this.timeUsed;
    }

    public void setTimeUsed(Long timeUsed) {
        this.timeUsed = timeUsed;
    }
}