package ch.supsi.service.user.changeRole.strategy;

public interface IChangeRoleStrategy {
    void changeRole(com.microsoft.graph.models.User microsoftUser);
}
