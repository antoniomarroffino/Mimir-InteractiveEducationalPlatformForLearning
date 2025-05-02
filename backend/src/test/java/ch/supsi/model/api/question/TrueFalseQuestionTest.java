package ch.supsi.model.api.question;

import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

import static org.junit.jupiter.api.Assertions.*;

@QuarkusTest
@TestMethodOrder(MethodOrderer.MethodName.class)
public class TrueFalseQuestionTest {
    @Test
    @DisplayName("Should create new TrueFalseQuestion with constructor no parameters")
    void test01CreateTrueFalseQuestion_ConstructorNoParameters() {
        TrueFalseQuestion question = new TrueFalseQuestion();
        assertNull(question.id);
        assertNull(question.questionText);
        assertNull(question.questionBankId);
        assertNull(question.correctAnswer);
        assertEquals(QuestionType.TRUE_FALSE, question.type);
    }

    @Test
    @DisplayName("Should create new TrueFalseQuestion passing questionText and correctAnswer to constructor")
    void test02CreateTrueFalseQuestion_ConstructorPassingQuestionTextAndCorrectAnswer() {
        String questionText = "This is a question";
        Boolean correctAnswer = true;
        TrueFalseQuestion question = new TrueFalseQuestion(questionText, correctAnswer);
        assertNull(question.id);
        assertEquals(questionText, question.questionText);
        assertTrue(question.correctAnswer);
        assertNull(question.questionBankId);
        assertEquals(QuestionType.TRUE_FALSE, question.type);
    }
}
