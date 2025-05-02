package ch.supsi.repository.quizAttempt;

import ch.supsi.model.api.AttemptStatus;
import ch.supsi.model.api.QuizAttempt;
import ch.supsi.model.api.response.QuestionResponse;
import ch.supsi.model.api.response.TrueFalseQuestionResponse;
import ch.supsi.repository.QuizAttemptRepository;
import ch.supsi.service.quizattempt.QuizAttemptServiceTest;
import ch.supsi.testContainersResource.MongoTestResource;
import io.quarkus.test.common.QuarkusTestResource;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

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
    @DisplayName("Should find QuizAttempts by userAzureOID")
    public void test01FindByUserAzureOID_Found() {
        String userOid = "user-123";
        QuizAttempt qa1 = QuizAttemptServiceTest.createTestQuizAttempt(userOid, new ObjectId(), List.of());
        QuizAttempt qa2 = QuizAttemptServiceTest.createTestQuizAttempt(userOid, new ObjectId(), List.of());
        QuizAttempt qa3 = QuizAttemptServiceTest.createTestQuizAttempt("other-user", new ObjectId(), List.of());

        this.quizAttemptRepository.persist(qa1);
        this.quizAttemptRepository.persist(qa2);
        this.quizAttemptRepository.persist(qa3);

        List<QuizAttempt> attempts = this.quizAttemptRepository.findByUserAzureOID(userOid);

        assertEquals(2, attempts.size());
        attempts.forEach(quizAttempt -> assertEquals(userOid, quizAttempt.userAzureOID));
    }

    @Test
    @DisplayName("Should return empty list when no QuizAttempts found for userAzureOID")
    public void test02FindByUserAzureOID_NotFound() {
        List<QuizAttempt> attempts = this.quizAttemptRepository.findByUserAzureOID("non-existent-oid");
        assertTrue(attempts.isEmpty());
    }

    @Test
    @DisplayName("Should find QuizAttempts by publicationId")
    public void test03FindByPublicationId_Found() {
        ObjectId publicationId = new ObjectId();
        QuizAttempt qa1 = QuizAttemptServiceTest.createTestQuizAttempt("user-1", publicationId, List.of());
        QuizAttempt qa2 = QuizAttemptServiceTest.createTestQuizAttempt("user-2", publicationId, List.of());
        QuizAttempt qa3 = QuizAttemptServiceTest.createTestQuizAttempt("user-3", new ObjectId(), List.of());

        this.quizAttemptRepository.persist(qa1);
        this.quizAttemptRepository.persist(qa2);
        this.quizAttemptRepository.persist(qa3);

        List<QuizAttempt> attempts = this.quizAttemptRepository.findByPublicationId(publicationId);

        assertEquals(2, attempts.size());
        attempts.forEach(quizAttempt -> assertEquals(publicationId, quizAttempt.quizPublicationId));
    }

    @Test
    @DisplayName("Should return empty list when no QuizAttempts found for publicationId")
    public void test04FindByPublicationId_NotFound() {
        List<QuizAttempt> attempts = this.quizAttemptRepository.findByPublicationId(new ObjectId());
        assertTrue(attempts.isEmpty());
    }

    @Test
    @DisplayName("Should find QuizAttempts by publicationId and questionId")
    public void test05FindByPublicationIdAndQuestionId_Found() {
        ObjectId publicationId = new ObjectId();
        ObjectId questionId = new ObjectId();

        QuestionResponse questionResponse = new TrueFalseQuestionResponse();
        questionResponse.questionId = questionId;

        QuestionResponse questionResponseWithAnotherQuestion = new TrueFalseQuestionResponse();
        questionResponseWithAnotherQuestion.questionId = new ObjectId();

        QuizAttempt qa1 = QuizAttemptServiceTest.createTestQuizAttempt(
                "user-1",
                publicationId,
                List.of(questionResponse)
        );

        QuizAttempt qa2 = QuizAttemptServiceTest.createTestQuizAttempt(
                "user-2",
                publicationId,
                List.of(questionResponseWithAnotherQuestion)
        );

        QuizAttempt qa3 = QuizAttemptServiceTest.createTestQuizAttempt(
                "user-3",
                new ObjectId(),
                List.of(questionResponse)
        );

        this.quizAttemptRepository.persist(qa1);
        this.quizAttemptRepository.persist(qa2);
        this.quizAttemptRepository.persist(qa3);

        List<QuizAttempt> attempts = this.quizAttemptRepository.findByPublicationIdAndQuestionId(
                publicationId,
                questionId
        );

        assertEquals(1, attempts.size());
        QuizAttempt attempt = attempts.getFirst();
        assertEquals(publicationId, attempt.quizPublicationId);
        assertTrue(attempt.responses.stream()
                .anyMatch(r -> questionId.equals(r.questionId)));
    }

    @Test
    @DisplayName("Should return empty list when no QuizAttempts found for publicationId and questionId")
    public void test06FindByPublicationIdAndQuestionId_NotFound() {
        List<QuizAttempt> attempts = this.quizAttemptRepository.findByPublicationIdAndQuestionId(
                new ObjectId(),
                new ObjectId()
        );
        assertTrue(attempts.isEmpty());
    }

    @Test
    @DisplayName("Should find latest QuizAttempt by user, publication and status")
    public void test07FindByUserAndPublicationAndStatusOptional_Found() {
        String userOid = "user-xyz";
        ObjectId publicationId = new ObjectId();

        QuizAttempt recentAttempt = QuizAttemptServiceTest.createTestQuizAttempt(userOid, publicationId, List.of());
        recentAttempt.status = AttemptStatus.IN_PROGRESS;
        recentAttempt.startedAt = LocalDateTime.now().minusMinutes(2);

        QuizAttempt otherStatus = QuizAttemptServiceTest.createTestQuizAttempt(userOid, publicationId, List.of());
        otherStatus.status = AttemptStatus.TERMINATED;
        otherStatus.startedAt = LocalDateTime.now().minusMinutes(1);

        this.quizAttemptRepository.persist(recentAttempt);
        this.quizAttemptRepository.persist(otherStatus);

        Optional<QuizAttempt> opt = this.quizAttemptRepository
                .findByUserAndPublicationAndStatusOptional(
                        userOid,
                        publicationId,
                        AttemptStatus.IN_PROGRESS
                );

        assertTrue(opt.isPresent());
        QuizAttempt found = opt.get();
        assertEquals(recentAttempt.id, found.id);
        assertEquals(AttemptStatus.IN_PROGRESS, found.status);
    }

    @Test
    @DisplayName("Should return empty Optional when no matching QuizAttempt by user, publication and status")
    public void test08FindByUserAndPublicationAndStatusOptional_NotFound() {
        String userOid = "no-user";
        ObjectId publicationId = new ObjectId();

        QuizAttempt qa = QuizAttemptServiceTest.createTestQuizAttempt("other-user", publicationId, List.of());
        qa.status = AttemptStatus.IN_PROGRESS;
        qa.startedAt = LocalDateTime.now();
        this.quizAttemptRepository.persist(qa);

        Optional<QuizAttempt> opt = this.quizAttemptRepository
                .findByUserAndPublicationAndStatusOptional(
                        userOid,
                        publicationId,
                        AttemptStatus.IN_PROGRESS
                );

        assertTrue(opt.isEmpty());
    }
}
