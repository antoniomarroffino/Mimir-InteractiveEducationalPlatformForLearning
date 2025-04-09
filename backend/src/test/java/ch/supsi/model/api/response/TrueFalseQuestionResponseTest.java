package ch.supsi.model.api.response;

import ch.supsi.model.api.question.QuestionType;
import io.quarkus.test.junit.QuarkusTest;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

import static org.junit.jupiter.api.Assertions.*;

@QuarkusTest
@TestMethodOrder(MethodOrderer.MethodName.class)
public class TrueFalseQuestionResponseTest {
    @Test
    @DisplayName("Should create new TrueFalseQuestionResponse with constructor no parameters")
    void test01CreateTrueFalseQuestionResponse_ConstructorWithNoParameters() {
        TrueFalseQuestionResponse response = new TrueFalseQuestionResponse();
        assertNotNull(response.id);
        assertNull(response.questionId);
        assertNull(response.selectedAnswer);
        assertEquals(QuestionType.TRUE_FALSE, response.responseType);
    }

    @Test
    @DisplayName("Should create new TrueFalseQuestionResponse passing questionId to constructor")
    void test02CreateTrueFalseQuestionResponse_ConstructorWithParameters() {
        ObjectId questionId = new ObjectId();
        TrueFalseQuestionResponse response = new TrueFalseQuestionResponse(questionId);
        assertNotNull(response.id);
        assertEquals(questionId, response.questionId);
        assertNull(response.selectedAnswer);
        assertEquals(QuestionType.TRUE_FALSE, response.responseType);
    }

    @Test
    @DisplayName("Should create new TrueFalseQuestionResponse passing questionId and selected answer to constructor")
    void test03CreateTrueFalseQuestionResponse_ConstructorWithParametersQuestionIdAndSelectedAnswer() {
        ObjectId questionId = new ObjectId();
        TrueFalseQuestionResponse response = new TrueFalseQuestionResponse(true, questionId);
        assertNotNull(response.id);
        assertEquals(questionId, response.questionId);
        assertTrue(response.selectedAnswer);
        assertEquals(QuestionType.TRUE_FALSE, response.responseType);
    }
}
