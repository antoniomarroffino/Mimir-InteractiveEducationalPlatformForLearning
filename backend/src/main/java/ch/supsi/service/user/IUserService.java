package ch.supsi.service.user;

import ch.supsi.model.api.user.Role;
import ch.supsi.model.api.user.User;
import ch.supsi.model.dto.api.PromotionRequestDTO;
import org.eclipse.microprofile.jwt.JsonWebToken;

import java.util.List;


public interface IUserService {
    User getUserByAzureOid(String oid);
    List<User> getAllUsers();
    void changeRole(PromotionRequestDTO promotionRequestDTO);
    User createBaseUser(String oid);
    void synchronizeUser();
    User getCurrentLoggedUser();
}
