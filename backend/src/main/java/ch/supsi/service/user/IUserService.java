package ch.supsi.service.user;

import ch.supsi.model.api.user.Role;
import ch.supsi.model.api.user.User;
import org.eclipse.microprofile.jwt.JsonWebToken;

import java.util.List;


public interface IUserService {
    User getUserByAzureOid(String oid);
    List<User> getAllUsers();
    void changeRole(String oid, Role newRole);
    User createBaseUser(String oid);
    void updateUser(JsonWebToken jwt);
}
