package ch.supsi.service.user;

import ch.supsi.model.api.user.Role;
import ch.supsi.model.api.user.User;

public class UserServiceTest {

    public static User createTestUser(String azureOid, Role role) {
        User user = new User();
        user.azureOid = azureOid;
        user.role = role;
        return user;
    }
}
