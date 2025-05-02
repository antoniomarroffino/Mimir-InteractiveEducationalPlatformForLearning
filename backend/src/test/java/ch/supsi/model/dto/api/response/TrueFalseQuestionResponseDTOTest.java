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
        TrueFalseQuestionResponseDTO responseDTO = new TrueFalseQuestionResponseDTO();
        assertEquals(QuestionType.TRUE_FALSE, responseDTO.getResponseType());
        assertNull(responseDTO.getSelectedAnswer());
        assertNull(responseDTO.getId());
        assertNull(responseDTO.getQuestionId());
        assertEquals(0, responseDTO.getTimeSpent());
        assertEquals(0, responseDTO.getEarnedPoints());
    }

    @Test
    @DisplayName("Should set all fields correctly")
    void test02SetAllFieldsCorrectly() {
        String id = new ObjectId().toString();
        String questionId = new ObjectId().toString();
        Integer timeSpent = 10;
        Integer earnedPoints = 10;

        TrueFalseQuestionResponseDTO responseDTO = new TrueFalseQuestionResponseDTO();
        responseDTO.setId(id);
        responseDTO.setQuestionId(questionId);
        responseDTO.setSelectedAnswer(true);
        responseDTO.setTimeSpent(timeSpent);
        responseDTO.setEarnedPoints(earnedPoints);

        assertEquals(QuestionType.TRUE_FALSE, responseDTO.getResponseType());
        assertEquals(id, responseDTO.getId());
        assertEquals(questionId, responseDTO.getQuestionId());
        assertTrue(responseDTO.getSelectedAnswer());
        assertEquals(timeSpent, responseDTO.getTimeSpent());
        assertEquals(earnedPoints, responseDTO.getEarnedPoints());

        responseDTO.setTimeSpent(null);
        assertEquals(0, responseDTO.getTimeSpent());
        responseDTO.setEarnedPoints(null);
        assertEquals(0, responseDTO.getEarnedPoints());

        responseDTO.setTimeSpent(-1);
        assertEquals(0, responseDTO.getTimeSpent());
        responseDTO.setEarnedPoints(-1);
        assertEquals(0, responseDTO.getEarnedPoints());
    }
}
