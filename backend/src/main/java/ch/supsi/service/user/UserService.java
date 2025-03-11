package ch.supsi.service.user;

import ch.supsi.auth.AdminConfig;
import ch.supsi.model.api.user.Role;
import ch.supsi.model.api.user.User;
import ch.supsi.repository.UserRepository;
import io.quarkus.security.identity.SecurityIdentity;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.ForbiddenException;
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
    public void changeRole(String oid, Role newRole) {
        Optional<User> userOpt = this.userRepository.findByAzureOidOptional(oid);

        if(userOpt.isEmpty())
            throw new NotFoundException("User with oid " + oid + " not found");

        User user = userOpt.get();

        if(newRole == Role.ADMIN || user.getRole() == Role.ADMIN)
            throw new ForbiddenException("Cannot promote / demote admin users");

        user.setRole(newRole);
        this.userRepository.update(user);
    }

    @Override
    public User createBaseUser(String oid) {
        User user = new User();
        user.setAzureOid(oid);
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
        if(jwtName != null && !jwtName.equals(user.getName()))
            user.setName(jwtName);

        String jwtEmail = this.getEmailFromJWT();
        if(jwtEmail != null && !jwtEmail.equals(user.getEmail()))
            user.setEmail(jwtEmail);

        if(isAdminUser(user))
            user.setRole(Role.ADMIN);
        else if(user.getRole() == Role.ADMIN)
            user.setRole(Role.STUDENT);
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
        if(this.adminConfig.getAdminNames().contains(user.getName()))
            return this.adminConfig.getAdminEmails().contains(user.getEmail());
        return false;
    }

    private JsonWebToken getJwtFromSecurityIdentity() {
        return (JsonWebToken) this.securityIdentity.getPrincipal();
    }
}
