package ch.supsi.service.user.changeRole.strategy;

public interface ChangeRoleStrategy {
    void changeRole(com.microsoft.graph.models.User microsoftUser);
}
