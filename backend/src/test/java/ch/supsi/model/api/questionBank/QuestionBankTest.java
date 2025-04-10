package ch.supsi.model.api.questionBank;

import ch.supsi.model.api.QuestionBank;
import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

import static org.junit.jupiter.api.Assertions.*;

@QuarkusTest
@TestMethodOrder(MethodOrderer.MethodName.class)
public class QuestionBankTest {
    @Test
    @DisplayName("Should create new QuestionBank with constructor no parameters")
    void test01CreateQuestionBank_ConstructorNoParameters() {
        QuestionBank questionBank = new QuestionBank();
        assertNull(questionBank.id);
        assertNull(questionBank.name);
        assertNotNull(questionBank.lastModified);
        assertNotNull(questionBank.questions);
        assertTrue(questionBank.questions.isEmpty());
    }

    @Test
    @DisplayName("Should create new QuestionBank passing name to constructor")
    void test02CreateQuestionBank_ConstructorPassingNameToConstructor() {
        String name = "test";
        QuestionBank questionBank = new QuestionBank(name);
        assertNull(questionBank.id);
        assertEquals(name, questionBank.name);
        assertNotNull(questionBank.lastModified);
        assertNotNull(questionBank.questions);
        assertTrue(questionBank.questions.isEmpty());
    }
}
