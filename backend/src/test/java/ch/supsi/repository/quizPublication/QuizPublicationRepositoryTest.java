package ch.supsi.repository.quizPublication;

import ch.supsi.model.api.QuizPublication;
import ch.supsi.repository.QuizPublicationRepository;
import ch.supsi.service.quizPublication.QuizPublicationServiceTest;
import ch.supsi.testContainersResource.MongoTestResource;
import io.quarkus.test.common.QuarkusTestResource;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.*;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@QuarkusTest
@QuarkusTestResource(MongoTestResource.class)
@TestMethodOrder(MethodOrderer.MethodName.class)
public class QuizPublicationRepositoryTest {
    @Inject
    QuizPublicationRepository quizPublicationRepository;

    @BeforeEach
    public void cleanup() {
        this.quizPublicationRepository.deleteAll();
    }

    @Test
    @DisplayName("Should return Optional of QuizPublication found by publicationCode")
    public void test01FindByCodeOptional_Found() {
        ObjectId quizId = new ObjectId();
        String publicationCode = "PUB-123";
        QuizPublication qp = QuizPublicationServiceTest.createTestQuizPublication(quizId, publicationCode);
        this.quizPublicationRepository.persist(qp);

        Optional<QuizPublication> found = this.quizPublicationRepository.findByCodeOptional(publicationCode);

        assertTrue(found.isPresent());
        assertEquals(publicationCode, found.get().publicationCode);
    }

    @Test
    @DisplayName("Should return Empty Optional when QuizPublication not found by publicationCode")
    public void test02FindByCodeOptional_NotFound() {
        Optional<QuizPublication> found = this.quizPublicationRepository.findByCodeOptional("NON_EXISTENT_CODE");

        assertFalse(found.isPresent());
    }

    @Test
    @DisplayName("Should return list of QuizPublications found by quizId")
    public void test03FindPublicationsByQuizId() {
        ObjectId quizId = new ObjectId();
        String publicationCode1 = "PUB-111";
        String publicationCode2 = "PUB-222";

        QuizPublication qp1 = QuizPublicationServiceTest.createTestQuizPublication(quizId, publicationCode1);
        QuizPublication qp2 = QuizPublicationServiceTest.createTestQuizPublication(quizId, publicationCode2);
        QuizPublication qp3 = QuizPublicationServiceTest.createTestQuizPublication(new ObjectId(), "PUB-333");

        this.quizPublicationRepository.persist(qp1);
        this.quizPublicationRepository.persist(qp2);
        this.quizPublicationRepository.persist(qp3);

        List<QuizPublication> publications = this.quizPublicationRepository.findPublicationsByQuizId(quizId);

        assertNotNull(publications);
        assertEquals(2, publications.size());
        publications.forEach(qp -> assertEquals(quizId, qp.quizId));
    }
}
