package ch.supsi.repository;

import ch.supsi.model.api.user.User;
import io.quarkus.mongodb.panache.PanacheMongoRepository;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.Optional;

@ApplicationScoped
public class UserRepository implements PanacheMongoRepository<User> {
    public Optional<User> findByAzureOidOptional(String oid) {
        return Optional.ofNullable(find("azureOid", oid).firstResult());
    }

    public Optional<User> findByEmailOptional(String email) {
        return Optional.ofNullable(find("email", email).firstResult());
    }
}
