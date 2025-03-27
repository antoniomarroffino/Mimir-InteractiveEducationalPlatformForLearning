package ch.supsi.model.dto.api;

import ch.supsi.model.api.user.Role;
import io.quarkus.runtime.annotations.RegisterForReflection;

@RegisterForReflection
public class UserWithoutCoursesDTO {
    private String azureOid;
    private String name;
    private String email;
    private Role role;

    public UserWithoutCoursesDTO() {
    }

    public UserWithoutCoursesDTO(String azureOid, String name, String email, Role role) {
        this.azureOid = azureOid;
        this.name = name;
        this.email = email;
        this.role = role;
    }

    public String getAzureOid() {
        return azureOid;
    }

    public void setAzureOid(String azureOid) {
        this.azureOid = azureOid;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }
}
