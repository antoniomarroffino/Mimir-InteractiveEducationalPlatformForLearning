package ch.supsi.model.api.badge;

import org.eclipse.microprofile.openapi.annotations.media.Schema;

import java.time.LocalDateTime;

@Schema(description = "Badge model", name = "Badge")
public class Badge {
    public BadgeType type;
    public LocalDateTime assignedAt;
    public String assignedBy;

    public Badge() {
        this.assignedAt = LocalDateTime.now();
    }

    public Badge(BadgeType type, String assignedBy) {
        this();
        this.type = type;
        this.assignedBy = assignedBy;
    }
}