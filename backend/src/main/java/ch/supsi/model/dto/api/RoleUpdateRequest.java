package ch.supsi.model.dto.api;

import ch.supsi.model.api.user.Role;
import io.quarkus.runtime.annotations.RegisterForReflection;

@RegisterForReflection
public class RoleUpdateRequest {
    private Role role;

    public RoleUpdateRequest() {
    }

    public RoleUpdateRequest(Role role) {
        this.role = role;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }
}
