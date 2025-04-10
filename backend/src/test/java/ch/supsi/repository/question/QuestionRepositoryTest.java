package ch.supsi.repository.question;

import ch.supsi.model.api.question.MultipleChoiceQuestion;
import ch.supsi.model.api.question.Question;
import ch.supsi.model.api.question.TrueFalseQuestion;
import ch.supsi.repository.QuestionRepository;
import ch.supsi.testContainersResource.MongoTestResource;
import io.quarkus.test.common.QuarkusTestResource;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.*;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@QuarkusTest
@QuarkusTestResource(MongoTestResource.class)
@TestMethodOrder(MethodOrderer.MethodName.class)
public class QuestionRepositoryTest {
    @Inject
    QuestionRepository questionRepository;

    @BeforeEach
    void cleanup() {
        this.questionRepository.deleteAll();
    }

    @Test
    @DisplayName("Should persist a Question and retrieve it by id")
    void test01ShouldPersistAndRetrieveQuestion() {
        Question question = new TrueFalseQuestion();
        question.questionText = "Test question";

        this.questionRepository.persist(question);
        assertNotNull(question.id);

        Question found = this.questionRepository.findById(question.id);
        assertEquals(question.questionText, found.questionText);

        List<Question> allQuestions = this.questionRepository.listAll();
        assertEquals(1, allQuestions.size());
    }

    @Test
    @DisplayName("Should return null Question because question id does not exist")
    void test02ShouldReturnNullForNonExistentId() {
        assertNull(this.questionRepository.findById(new ObjectId()));
    }

    @Test
    @DisplayName("Should delete an existing question")
    void test03ShouldDeleteQuestion() {
        Question question = new MultipleChoiceQuestion();
        this.questionRepository.persist(question);

        assertTrue(this.questionRepository.deleteById(question.id));
        assertNull(this.questionRepository.findById(question.id));
    }
}
