package ch.supsi.repository;

import ch.supsi.model.api.user.Role;
import ch.supsi.model.api.user.User;
import io.quarkus.mongodb.panache.PanacheMongoRepository;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;
import java.util.Optional;

@ApplicationScoped
public class UserRepository implements PanacheMongoRepository<User> {
    public Optional<User> findByAzureOidOptional(String oid) {
        return find("azureOid", oid).firstResultOptional();
    }

    public List<User> findNonAdminUsers() {
        return list("role != ?1", Role.ADMIN);
    }
}
