package ch.supsi.repository;

import ch.supsi.model.api.QuizAttempt;
import io.quarkus.mongodb.panache.PanacheMongoRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class QuizAttemptRepository implements PanacheMongoRepository<QuizAttempt> {
}