package ch.supsi.repository;

import ch.supsi.model.api.question.Question;
import io.quarkus.mongodb.panache.PanacheMongoRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class QuestionRepository implements PanacheMongoRepository<Question> {
}