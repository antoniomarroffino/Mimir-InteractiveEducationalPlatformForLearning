package ch.supsi.repository.quizAttempt;

import ch.supsi.model.api.QuizAttempt;
import ch.supsi.model.api.question.MultipleChoiceQuestion;
import ch.supsi.model.api.question.Question;
import ch.supsi.repository.QuizAttemptRepository;
import ch.supsi.testContainersResource.MongoTestResource;
import io.quarkus.test.common.QuarkusTestResource;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.*;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@QuarkusTest
@QuarkusTestResource(MongoTestResource.class)
@TestMethodOrder(MethodOrderer.MethodName.class)
public class QuizAttemptRepositoryTest {
    @Inject
    QuizAttemptRepository quizAttemptRepository;

    @BeforeEach
    void cleanup() {
        this.quizAttemptRepository.deleteAll();
    }

    @Test
    @DisplayName("Should persist one QuizAttempt and retrieve it by id")
    void test01ShouldPersistAndRetrieveQuizAttempt() {
        QuizAttempt attempt = new QuizAttempt();
        attempt.quizPublicationId = new ObjectId();

        this.quizAttemptRepository.persist(attempt);
        assertNotNull(attempt.id);

        QuizAttempt found = this.quizAttemptRepository.findById(attempt.id);
        assertEquals(attempt.quizPublicationId, found.quizPublicationId);

        List<QuizAttempt> allAttempts = this.quizAttemptRepository.listAll();
        assertEquals(1, allAttempts.size());
    }

    @Test
    @DisplayName("Should return null because not find quizAttempt due to non existing id")
    void test02ShouldHandleNonExistentAttempt() {
        assertNull(this.quizAttemptRepository.findById(new ObjectId()));
    }

    @Test
    @DisplayName("Should delete an existing QuizAttempt")
    void test03ShouldDeleteQuizAttempt() {
        QuizAttempt quizAttempt = new QuizAttempt();
        this.quizAttemptRepository.persist(quizAttempt);

        assertTrue(this.quizAttemptRepository.deleteById(quizAttempt.id));
        assertNull(this.quizAttemptRepository.findById(quizAttempt.id));
    }
}
