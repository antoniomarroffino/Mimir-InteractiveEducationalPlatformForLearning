package ch.supsi.model.api.quiz;

import ch.supsi.model.api.Quiz;
import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

import static org.junit.jupiter.api.Assertions.*;

@QuarkusTest
@TestMethodOrder(MethodOrderer.MethodName.class)
public class QuizTest {
    @Test
    @DisplayName("Should create new Quiz passing no parameters to constructor")
    void test01CreateQuiz_ConstructorWithNoParameters() {
        Quiz quiz = new Quiz();
        assertNotNull(quiz.id);
        assertNull(quiz.name);
        assertNull(quiz.description);
        assertNotNull(quiz.createdAt);
        assertNotNull(quiz.updatedAt);
        assertNotNull(quiz.questionsId);
        assertTrue(quiz.questionsId.isEmpty());
    }

    @Test
    @DisplayName("Should create new Quiz passing name to constructor")
    void test02CreateQuiz_PassingNameToConstructor() {
        String name = "test";
        Quiz quiz = new Quiz(name);
        assertNotNull(quiz.id);
        assertEquals(name, quiz.name);
        assertNull(quiz.description);
        assertNotNull(quiz.createdAt);
        assertNotNull(quiz.updatedAt);
        assertNotNull(quiz.questionsId);
        assertTrue(quiz.questionsId.isEmpty());
    }

    @Test
    @DisplayName("Should create new Quiz passing name and description to constructor")
    void test03CreateQuiz_PassingNameAndDescriptionToConstructor() {
        String name = "test";
        String description = "test";
        Quiz quiz = new Quiz(name, description);
        assertNotNull(quiz.id);
        assertEquals(name, quiz.name);
        assertEquals(description, quiz.description);
        assertNotNull(quiz.createdAt);
        assertNotNull(quiz.updatedAt);
        assertNotNull(quiz.questionsId);
        assertTrue(quiz.questionsId.isEmpty());
    }
}
