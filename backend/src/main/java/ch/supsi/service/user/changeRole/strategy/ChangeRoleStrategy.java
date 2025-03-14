package ch.supsi.service.user.changeRole.strategy;

import ch.supsi.model.dto.api.UserWithoutCoursesDTO;

public interface ChangeRoleStrategy {
    void changeRole(com.microsoft.graph.models.User microsoftUser);
}
