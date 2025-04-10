package ch.supsi.repository.questionBank;

import ch.supsi.model.api.QuestionBank;
import ch.supsi.repository.QuestionBankRepository;
import ch.supsi.service.questionBank.QuestionBankServiceTest;
import ch.supsi.testContainersResource.MongoTestResource;
import io.quarkus.test.common.QuarkusTestResource;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.*;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@QuarkusTest
@QuarkusTestResource(MongoTestResource.class)
@TestMethodOrder(MethodOrderer.MethodName.class)
public class QuestionBankRepositoryTest {

    @Inject
    QuestionBankRepository questionBankRepository;

    @BeforeEach
    public void cleanup() {
        this.questionBankRepository.deleteAll();
    }

    @Test
    @DisplayName("Should return Optional of QuestionBank found by name")
    void test01FindByNameOptional_Found() {
        String bankName = "Math Questions";
        QuestionBank qb = QuestionBankServiceTest.createTestQuestionBank(bankName);
        this.questionBankRepository.persist(qb);

        Optional<QuestionBank> found = this.questionBankRepository.findByNameOptional(bankName);

        assertTrue(found.isPresent());
        assertEquals(bankName, found.get().name);
    }

    @Test
    @DisplayName("Should return Empty Optional when QuestionBank not found by name")
    void test02FindByNameOptional_NotFound() {
        Optional<QuestionBank> found = this.questionBankRepository.findByNameOptional("Non-existent Bank");
        assertFalse(found.isPresent());
    }

    @Test
    @DisplayName("Should add question to QuestionBank")
    void test03AddQuestionToQuestionBank() {
        QuestionBank qb = QuestionBankServiceTest.createTestQuestionBank("Science Questions");
        this.questionBankRepository.persist(qb);

        ObjectId questionId = new ObjectId();

        this.questionBankRepository.addQuestionToQuestionBank(questionId.toString(), qb.id);

        QuestionBank updated = this.questionBankRepository.findById(qb.id);
        assertTrue(updated.questions.contains(questionId.toString()));
    }

    @Test
    @DisplayName("Should remove question from QuestionBank")
    void test04RemoveQuestionFromQuestionBank() {
        ObjectId questionId = new ObjectId();
        QuestionBank qb = QuestionBankServiceTest.createTestQuestionBank("History Questions");
        qb.questions.add(questionId.toString());
        this.questionBankRepository.persist(qb);

        this.questionBankRepository.removeQuestionFromQuestionBank(questionId.toString(), qb.id);

        QuestionBank updated = this.questionBankRepository.findById(qb.id);
        assertFalse(updated.questions.contains(questionId.toString()));
    }
}