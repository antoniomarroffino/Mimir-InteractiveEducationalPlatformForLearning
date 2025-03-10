package ch.supsi.service.user;

import ch.supsi.model.api.user.User;
import org.eclipse.microprofile.jwt.JsonWebToken;


public interface IUserService {
    User getUserByAzureOid(String oid);
    User createBaseUser(String oid);
    User updateUser(JsonWebToken jwt);
}
