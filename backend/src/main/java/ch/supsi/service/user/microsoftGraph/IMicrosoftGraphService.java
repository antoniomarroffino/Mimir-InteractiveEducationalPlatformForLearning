package ch.supsi.service.user.microsoftGraph;

import ch.supsi.model.dto.api.UserWithoutCoursesDTO;

import java.util.List;

public interface IMicrosoftGraphService {
    UserWithoutCoursesDTO getUserByOid(String oid);

    UserWithoutCoursesDTO getUserByEmail(String email);

    List<UserWithoutCoursesDTO> getAllUsers();
}
