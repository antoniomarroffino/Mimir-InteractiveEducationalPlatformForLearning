package ch.supsi.service.user.api;

import ch.supsi.model.api.user.Role;
import ch.supsi.model.api.user.User;
import ch.supsi.model.dto.api.UserWithoutCoursesDTO;
import ch.supsi.repository.UserRepository;
import ch.supsi.service.user.api.changeRole.builder.IChangeRoleStrategyBuilder;
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
    public void changeRole(UserWithoutCoursesDTO userWithoutCoursesDTO, Role newRole) {
        if (userWithoutCoursesDTO == null)
            throw new InternalServerErrorException("userWithoutCoursesDTO is null");

        this.changeRoleStrategyBuilder.buildChangeRoleStrategy(newRole).changeRole(userWithoutCoursesDTO);
    }

    @Override
    public User getCurrentLoggedUser() {
        String oid = this.getOidFromJWT();
        Optional<User> userOpt = this.userRepository.findByAzureOidOptional(oid);
        if (userOpt.isEmpty())
            throw new NotFoundException("User with oid " + oid + " not found");
        return userOpt.get();
    }

    private String getOidFromJWT() {
        return this.getJwtFromSecurityIdentity().getClaim(OID_CLAIM_KEY);
    }

    private String getNameFromJWT() {
        return this.getJwtFromSecurityIdentity().getClaim(NAME_CLAIM_KEY);
    }

    private String getEmailFromJWT() {
        return this.getJwtFromSecurityIdentity().getClaim(EMAIL_CLAIM_KEY);
    }

    private JsonWebToken getJwtFromSecurityIdentity() {
        return (JsonWebToken) this.securityIdentity.getPrincipal();
    }
}
