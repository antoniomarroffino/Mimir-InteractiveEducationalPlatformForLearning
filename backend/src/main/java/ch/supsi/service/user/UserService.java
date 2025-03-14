package ch.supsi.service.user;

import ch.supsi.model.api.user.Role;
import ch.supsi.model.api.user.User;
import ch.supsi.model.dto.api.UserWithoutCoursesDTO;
import ch.supsi.repository.UserRepository;
import ch.supsi.service.user.changeRole.builder.IChangeRoleStrategyBuilder;
import io.quarkus.security.identity.SecurityIdentity;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.InternalServerErrorException;
import jakarta.ws.rs.NotFoundException;
import org.eclipse.microprofile.jwt.JsonWebToken;

import java.util.List;
import java.util.Optional;

@ApplicationScoped
public class UserService implements IUserService {
    private static final String OID_CLAIM_KEY = "oid";
    private static final String NAME_CLAIM_KEY = "name";
    private static final String EMAIL_CLAIM_KEY = "preferred_username";
    @Inject
    UserRepository userRepository;
    @Inject
    SecurityIdentity securityIdentity;
    @Inject
    IChangeRoleStrategyBuilder changeRoleStrategyBuilder;

    @Override
    public User getUserByAzureOid(String oid) {
        Optional<User> userOpt = this.userRepository.findByAzureOidOptional(oid);
        return userOpt.orElse(null);
    }

    @Override
    public List<User> getAllUsers() {
        return this.userRepository.findNonAdminUsers();
    }

    @Override
    public void changeRole(com.microsoft.graph.models.User microsoftUser, Role newRole) {
        if (microsoftUser == null)
            throw new InternalServerErrorException("Microsoft user is null");

        this.changeRoleStrategyBuilder.buildChangeRoleStrategy(newRole).changeRole(microsoftUser);
    }

    @Override
    public User getCurrentLoggedUser() {
        String oid = this.getOidFromJWT();
        Optional<User> userOpt = this.userRepository.findByAzureOidOptional(oid);
        if (userOpt.isEmpty())
            throw new NotFoundException("User with oid " + oid + " not found");
        return userOpt.get();
    }

    @Override
    public UserWithoutCoursesDTO buildUserWithoutCoursesDTO(com.microsoft.graph.models.User microsoftUser) {
        if (microsoftUser == null)
            throw new InternalServerErrorException("Microsoft user is null");

        Optional<User> userOpt = this.userRepository.findByAzureOidOptional(microsoftUser.id);

        return new UserWithoutCoursesDTO(
                microsoftUser.id,
                microsoftUser.displayName,
                microsoftUser.userPrincipalName,
                userOpt.isEmpty() ? Role.STUDENT : userOpt.get().role
        );
    }

    @Override
    public String getOidFromJWT() {
        return this.getJwtFromSecurityIdentity().getClaim(OID_CLAIM_KEY);
    }

    @Override
    public String getNameFromJWT() {
        return this.getJwtFromSecurityIdentity().getClaim(NAME_CLAIM_KEY);
    }

    @Override
    public String getEmailFromJWT() {
        return this.getJwtFromSecurityIdentity().getClaim(EMAIL_CLAIM_KEY);
    }

    private JsonWebToken getJwtFromSecurityIdentity() {
        return (JsonWebToken) this.securityIdentity.getPrincipal();
    }
}
