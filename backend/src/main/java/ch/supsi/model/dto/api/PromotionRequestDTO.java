package ch.supsi.model.dto.api;

import ch.supsi.model.api.user.Role;
import io.quarkus.runtime.annotations.RegisterForReflection;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@RegisterForReflection
public class PromotionRequestDTO {
    @NotBlank
    @Email
    private String email;

    @NotNull
    private Role role;

    public PromotionRequestDTO() {
    }

    public PromotionRequestDTO(String email, Role role) {
        this.email = email;
        this.role = role;
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
