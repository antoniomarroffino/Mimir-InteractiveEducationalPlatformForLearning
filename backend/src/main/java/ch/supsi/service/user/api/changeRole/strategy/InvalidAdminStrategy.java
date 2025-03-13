package ch.supsi.service.user.api.changeRole.strategy;

import ch.supsi.model.dto.api.UserWithoutCoursesDTO;
import jakarta.enterprise.context.Dependent;
import jakarta.ws.rs.ForbiddenException;

@Dependent
public class InvalidAdminStrategy implements ChangeRoleStrategy {
    @Override
    public void changeRole(UserWithoutCoursesDTO userWithoutCoursesDTO) {
        throw new ForbiddenException("Cannot change role to admin");
    }
}