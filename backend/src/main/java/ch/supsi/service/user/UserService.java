package ch.supsi.service.user;

import ch.supsi.model.api.user.User;
import ch.supsi.repository.UserRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.eclipse.microprofile.jwt.JsonWebToken;

import java.util.Map;
import java.util.Optional;

@ApplicationScoped
public class UserService implements IUserService{
    @Inject
    UserRepository userRepository;

    @Override
    public User getUserByAzureOid(String oid) {
        Optional<User> userOpt = this.userRepository.findByAzureOidOptional(oid);
        return userOpt.orElse(null);
    }

    @Override
    public User createBaseUser(String oid) {
        User user = new User();
        user.setAzureOid(oid);
        this.userRepository.persist(user);
        return user;
    }

    @Override
    public User updateUser(JsonWebToken jwt) {
        if(jwt == null)
            throw new RuntimeException("jwt is null");

        String oid = jwt.getClaim("oid");
        Optional<User> userOpt = this.userRepository.findByAzureOidOptional(oid);

        if(userOpt.isEmpty())
            throw new RuntimeException("user is empty");

        User user = userOpt.get();
        this.syncUser(jwt, user);

        this.userRepository.update(user);
        return user;
    }

    private void syncUser(JsonWebToken jwt, User user) {
        String jwtName = jwt.getClaim("name");
        if(jwtName != null && !jwtName.equals(user.getName()))
            user.setName(jwtName);

        String jwtEmail = jwt.getClaim("preferred_username");
        if(jwtEmail != null && !jwtEmail.equals(user.getEmail()))
            user.setEmail(jwtEmail);
    }
}
