package ch.supsi.service.user.api.changeRole.strategy;

import ch.supsi.model.dto.api.UserWithoutCoursesDTO;

public interface ChangeRoleStrategy {
    void changeRole(UserWithoutCoursesDTO userWithoutCoursesDTO);
}
