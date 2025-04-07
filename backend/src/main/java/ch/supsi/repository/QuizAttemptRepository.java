package ch.supsi.repository;

import ch.supsi.model.api.QuizAttempt;
import io.quarkus.mongodb.panache.PanacheMongoRepository;
import jakarta.enterprise.context.ApplicationScoped;
import org.bson.types.ObjectId;

import java.util.List;

@ApplicationScoped
public class QuizAttemptRepository implements PanacheMongoRepository<QuizAttempt> {

    public List<QuizAttempt> findByUserAzureOID(String userAzureOID) {
        return find("userAzureOID = ?1", userAzureOID).list();
    }

    public List<QuizAttempt> findByPublicationId(ObjectId publicationId) {
        return find("quizPublicationId", publicationId).list();
    }

    public List<QuizAttempt> findByPublicationIdAndQuestionId(ObjectId publicationId, ObjectId questionId) {
        return find(
                "quizPublicationId = ?1 and 'responses.questionId' = ?2",
                publicationId,
                questionId
        ).list();
    }
}