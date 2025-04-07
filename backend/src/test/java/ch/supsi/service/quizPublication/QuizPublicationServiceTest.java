package ch.supsi.service.quizPublication;

import ch.supsi.model.api.QuizPublication;
import ch.supsi.model.api.question.Question;
import io.quarkus.test.junit.QuarkusTest;
import org.bson.types.ObjectId;

import java.util.ArrayList;

@QuarkusTest
public class QuizPublicationServiceTest {

    public static QuizPublication createTestQuizPublication(ObjectId quizId, String publicationCode) {
        ObjectId courseId = new ObjectId();
        ObjectId folderId = new ObjectId();
        return new QuizPublication(courseId, folderId, quizId, new ArrayList<>(), publicationCode);
    }
}
