package ch.supsi.service.user;

import ch.supsi.auth.AdminConfig;
import ch.supsi.model.api.user.Role;
import ch.supsi.model.api.user.User;
import ch.supsi.model.dto.api.PromotionRequestDTO;
import ch.supsi.repository.UserRepository;
import io.quarkus.security.identity.SecurityIdentity;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.NotFoundException;
import org.eclipse.microprofile.jwt.JsonWebToken;

import java.util.List;
import java.util.Optional;

@ApplicationScoped
public class UserService implements IUserService{
    @Inject
    UserRepository userRepository;

    @Inject
    AdminConfig adminConfig;

    @Inject
    SecurityIdentity securityIdentity;

    private static final String OID_CLAIM_KEY = "oid";
    private static final String NAME_CLAIM_KEY = "name";
    private static final String EMAIL_CLAIM_KEY = "preferred_username";

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
    public void changeRole(PromotionRequestDTO promotionRequestDTO) {
        /*Optional<User> userOpt = this.userRepository.findByAzureOidOptional(oid);

        if(userOpt.isEmpty())
            throw new NotFoundException("User with oid " + oid + " not found");

        User user = userOpt.get();

        if(newRole == Role.ADMIN || user.role == Role.ADMIN)
            throw new ForbiddenException("Cannot promote / demote admin users");

        user.role = newRole;
        this.userRepository.update(user);*/
    }

    @Override
    public User createBaseUser(String oid) {
        User user = new User();
        user.azureOid = oid;
        this.userRepository.persist(user);
        return user;
    }

    @Override
    public void synchronizeUser() {
        JsonWebToken jwt = this.getJwtFromSecurityIdentity();

        if(jwt == null)
            throw new RuntimeException("jwt is null");

        String oid = this.getOidFromJWT();
        Optional<User> userOpt = this.userRepository.findByAzureOidOptional(oid);

        if(userOpt.isEmpty())
            throw new RuntimeException("user is empty");

        User user = userOpt.get();
        this.syncUser(user);

        this.userRepository.update(user);
    }

    @Override
    public User getCurrentLoggedUser() {
        String oid = this.getOidFromJWT();
        Optional<User> userOpt = this.userRepository.findByAzureOidOptional(oid);
        if(userOpt.isEmpty())
            throw new NotFoundException("User with oid " + oid + " not found");
        return userOpt.get();
    }

    private void syncUser(User user) {
        String jwtName = this.getNameFromJWT();
        if(jwtName != null && !jwtName.equals(user.name))
            user.name = jwtName;

        String jwtEmail = this.getEmailFromJWT();
        if(jwtEmail != null && !jwtEmail.equals(user.email))
            user.email = jwtEmail;
        if(isAdminUser(user))
            user.role = Role.ADMIN;
        else if(user.role == Role.ADMIN)
            user.role = Role.STUDENT;
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

    private boolean isAdminUser(User user) {
        if(this.adminConfig.getAdminNames().contains(user.name))
            return this.adminConfig.getAdminEmails().contains(user.email);
        return false;
    }

    private JsonWebToken getJwtFromSecurityIdentity() {
        return (JsonWebToken) this.securityIdentity.getPrincipal();
    }
}
