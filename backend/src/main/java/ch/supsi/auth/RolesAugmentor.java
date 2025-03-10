package ch.supsi.auth;

import ch.supsi.model.api.user.User;
import ch.supsi.service.user.IUserService;
import io.quarkus.security.identity.AuthenticationRequestContext;
import io.quarkus.security.identity.SecurityIdentity;
import io.quarkus.security.identity.SecurityIdentityAugmentor;
import io.quarkus.security.runtime.QuarkusSecurityIdentity;
import io.smallrye.mutiny.Uni;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.eclipse.microprofile.jwt.JsonWebToken;

import java.util.function.Supplier;

@ApplicationScoped
public class RolesAugmentor implements SecurityIdentityAugmentor {

    @Inject
    IUserService userService;

    @Override
    public Uni<SecurityIdentity> augment(SecurityIdentity identity, AuthenticationRequestContext authenticationRequestContext) {
        return Uni.createFrom().item(build(identity));
    }

    private Supplier<SecurityIdentity> build(SecurityIdentity identity) {
        if(identity.isAnonymous())
            return () -> identity;
        else {
            System.out.println("ENTRO QUI BELLA, " + identity.getPrincipal().getName());
            QuarkusSecurityIdentity.Builder builder = QuarkusSecurityIdentity.builder(identity);

            JsonWebToken jwt = (JsonWebToken) identity.getPrincipal();
            String oid = jwt.getClaim("oid");
            User user = this.userService.getUserByAzureOid(oid);

            if(user == null)
                user = this.userService.createBaseUser(oid);

            builder.addRole(user.getRole().name());
            return builder::build;
        }
    }
}
