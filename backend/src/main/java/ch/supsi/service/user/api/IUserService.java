package ch.supsi.service.user.api;

import ch.supsi.model.api.user.Role;
import ch.supsi.model.api.user.User;
import ch.supsi.model.dto.api.UserWithoutCoursesDTO;

import java.util.List;


public interface IUserService {
    User getUserByAzureOid(String oid);

    List<User> getAllUsers();

    void changeRole(UserWithoutCoursesDTO userWithoutCoursesDTO, Role role);

    User getCurrentLoggedUser();
}
