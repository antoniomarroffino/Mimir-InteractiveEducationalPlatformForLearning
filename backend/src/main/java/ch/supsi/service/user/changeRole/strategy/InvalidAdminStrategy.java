package ch.supsi.service.user.changeRole.strategy;

import jakarta.enterprise.context.Dependent;
import jakarta.ws.rs.ForbiddenException;

@Dependent
public class InvalidAdminStrategy implements ChangeRoleStrategy {
    @Override
    public void changeRole(com.microsoft.graph.models.User microsoftUser) {
        throw new ForbiddenException("Cannot change role to admin");
    }
}