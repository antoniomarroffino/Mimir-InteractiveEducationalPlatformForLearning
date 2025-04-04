package ch.supsi.service.quizPublication;

import ch.supsi.model.api.QuizPublication;
import io.quarkus.test.junit.QuarkusTest;
import org.bson.types.ObjectId;

@QuarkusTest
public class QuizPublicationServiceTest {

    public static QuizPublication createTestQuizPublication(ObjectId quizId, String publicationCode) {
        ObjectId courseId = new ObjectId();
        ObjectId folderId = new ObjectId();
        return new QuizPublication(courseId, folderId, quizId, publicationCode);
    }
}
