package ch.supsi.model.dto.api;

import ch.supsi.model.api.badge.BadgeType;
import ch.supsi.model.api.user.User;
import io.quarkus.runtime.annotations.RegisterForReflection;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

@RegisterForReflection
public class BadgeDTO {
    private BadgeType type;
    private LocalDateTime assignedAt;
    @NotNull(message = "Assign by cannot be null")
    private UserWithoutCoursesDTO assignedBy;

    public BadgeDTO() {
    }

    public BadgeType getType() {
        return type;
    }

    public void setType(BadgeType type) {
        this.type = type;
    }

    public LocalDateTime getAssignedAt() {
        return assignedAt;
    }

    public void setAssignedAt(LocalDateTime assignedAt) {
        this.assignedAt = assignedAt;
    }

    public UserWithoutCoursesDTO getAssignedBy() {
        return assignedBy;
    }

    public void setAssignedBy(UserWithoutCoursesDTO assignedBy) {
        this.assignedBy = assignedBy;
    }
}