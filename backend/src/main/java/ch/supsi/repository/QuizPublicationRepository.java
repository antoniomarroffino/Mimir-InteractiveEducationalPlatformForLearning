package ch.supsi.repository;

import ch.supsi.model.api.QuizPublication;
import io.quarkus.mongodb.panache.PanacheMongoRepository;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.Optional;

@ApplicationScoped
public class QuizPublicationRepository implements PanacheMongoRepository<QuizPublication> {
    public Optional<QuizPublication> findByCode(String code) {
        return find("publicationCode", code).firstResultOptional();
    }
}
