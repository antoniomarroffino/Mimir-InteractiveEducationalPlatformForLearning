package ch.supsi.repository;

import ch.supsi.model.api.QuizPublication;
import io.quarkus.mongodb.panache.PanacheMongoRepository;
import jakarta.enterprise.context.ApplicationScoped;
import org.bson.types.ObjectId;

import java.util.List;
import java.util.Optional;

@ApplicationScoped
public class QuizPublicationRepository implements PanacheMongoRepository<QuizPublication> {
    public Optional<QuizPublication> findByCodeOptional(String code) {
        return find("publicationCode", code).firstResultOptional();
    }

    public List<QuizPublication> findPublicationsByQuizId(ObjectId quizId) {
        return find("quizId", quizId).list();
    }

}
