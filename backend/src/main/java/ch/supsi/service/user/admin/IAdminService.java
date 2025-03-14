package ch.supsi.service.user.admin;

import com.microsoft.graph.models.User;

public interface IAdminService {
    void createAdmin(User microsoftUser);

    void deleteAdmins();
}
