package ch.supsi.repository;

import ch.supsi.model.api.BadgeHolder;
import io.quarkus.mongodb.panache.PanacheMongoRepository;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.Optional;

@ApplicationScoped
public class BadgeHolderRepository implements PanacheMongoRepository<BadgeHolder> {
    public Optional<BadgeHolder> findByAzureOIDOptional(String azureOID) {
        return find("{'azureOID': ?1}", azureOID).firstResultOptional();
    }
}