package ch.supsi.model.dto.api;

import ch.supsi.model.api.badge.Badge;
import com.microsoft.graph.models.User;
import io.quarkus.runtime.annotations.RegisterForReflection;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.ArrayList;
import java.util.List;

@RegisterForReflection
public class BadgeHolderDTO {
    private String id;

    @NotNull(message = "User cannot be null")
    private UserWithoutCoursesDTO user;

    private List<Badge> badges;

    public BadgeHolderDTO() {
        this.badges = new ArrayList<>();
    }

    public BadgeHolderDTO(UserWithoutCoursesDTO user) {
        this();
        this.user = user;
    }

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public UserWithoutCoursesDTO getUser() {
        return this.user;
    }

    public void setUser(UserWithoutCoursesDTO user) {
        this.user = user;
    }

    public List<Badge> getBadges() {
        return this.badges;
    }

    public void setBadges(List<Badge> badges) {
        this.badges = badges != null ? badges : new ArrayList<>();
    }
}