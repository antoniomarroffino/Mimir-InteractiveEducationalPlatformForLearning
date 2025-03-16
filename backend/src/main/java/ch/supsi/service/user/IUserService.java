package ch.supsi.service.user;

import ch.supsi.model.api.user.Role;
import ch.supsi.model.api.user.User;
import ch.supsi.model.dto.api.UserWithoutCoursesDTO;

import java.util.List;


public interface IUserService {
    User getUserByAzureOid(String oid);

    void changeRole(com.microsoft.graph.models.User microsoftUser, Role role);

    User getCurrentLoggedUser();

    UserWithoutCoursesDTO buildUserWithoutCoursesDTO(com.microsoft.graph.models.User microsoftUser);

    String getOidFromJWT();

    String getNameFromJWT();

    String getEmailFromJWT();
}
