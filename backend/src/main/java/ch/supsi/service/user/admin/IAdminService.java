package ch.supsi.service.user.admin;

import ch.supsi.model.dto.api.UserWithoutCoursesDTO;
import com.microsoft.graph.models.User;

public interface IAdminService {
    void createAdmin(User microsoftUser);
}
