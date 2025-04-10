package ch.supsi.model.dto.api;

import ch.supsi.model.api.badge.Badge;
import io.quarkus.runtime.annotations.RegisterForReflection;
import jakarta.validation.constraints.NotBlank;

import java.util.ArrayList;
import java.util.List;

@RegisterForReflection
public class BadgeHolderDTO {
    private String id;

    @NotBlank(message = "Azure OID cannot be null or empty")
    private String azureOID;

    private List<Badge> badges;

    public BadgeHolderDTO() {
        this.badges = new ArrayList<>();
    }

    public BadgeHolderDTO(String azureOID) {
        this();
        this.azureOID = azureOID;
    }

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getAzureOID() {
        return this.azureOID;
    }

    public void setAzureOID(String azureOID) {
        this.azureOID = azureOID;
    }

    public List<Badge> getBadges() {
        return this.badges;
    }

    public void setBadges(List<Badge> badges) {
        this.badges = badges != null ? badges : new ArrayList<>();
    }
}