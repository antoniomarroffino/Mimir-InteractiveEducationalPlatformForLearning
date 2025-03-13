package ch.supsi.service.user.admin;

import ch.supsi.model.dto.api.UserWithoutCoursesDTO;

public interface IAdminService {
    void createAdmin(UserWithoutCoursesDTO userWithoutCoursesDTO);
}
