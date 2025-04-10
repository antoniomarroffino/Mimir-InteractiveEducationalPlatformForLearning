package ch.supsi.model.dto.api.response;

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
public class TrueFalseQuestionResponseDTOTest {
    @Test
    @DisplayName("Should create TrueFalseQuestionResponseDTO with constructor no parameters")
    void test01CreateTrueFalseQuestionResponseDTO_ConstructorWithNoParameters() {
        TrueFalseQuestionResponseDTO question = new TrueFalseQuestionResponseDTO();
        assertEquals(QuestionType.TRUE_FALSE, question.getResponseType());
        assertNull(question.getSelectedAnswer());
        assertNull(question.getId());
        assertNull(question.getQuestionId());
    }

    @Test
    @DisplayName("Should set all fields correctly")
    void test02SetAllFieldsCorrectly() {
        String id = new ObjectId().toString();
        String questionId = new ObjectId().toString();

        TrueFalseQuestionResponseDTO question = new TrueFalseQuestionResponseDTO();
        question.setId(id);
        question.setQuestionId(questionId);
        question.setSelectedAnswer(true);

        assertEquals(QuestionType.TRUE_FALSE, question.getResponseType());
        assertEquals(id, question.getId());
        assertEquals(questionId, question.getQuestionId());
        assertTrue(question.getSelectedAnswer());
    }
}
