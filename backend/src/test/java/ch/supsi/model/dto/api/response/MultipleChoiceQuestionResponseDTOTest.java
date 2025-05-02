package ch.supsi.model.dto.api.response;

import ch.supsi.model.api.question.QuestionType;
import io.quarkus.test.junit.QuarkusTest;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

@QuarkusTest
@TestMethodOrder(MethodOrderer.MethodName.class)
public class MultipleChoiceQuestionResponseDTOTest {
    @Test
    @DisplayName("Should create MultipleChoiceQuestionResponseDTO with constructor no parameters")
    void test01CreateMultipleChoiceQuestionResponseDTO_ConstructorWithNoParameters() {
        MultipleChoiceQuestionResponseDTO responseDTO = new MultipleChoiceQuestionResponseDTO();
        assertEquals(QuestionType.MULTIPLE_CHOICE, responseDTO.getResponseType());
        assertNull(responseDTO.getId());
        assertNull(responseDTO.getQuestionId());
        assertNull(responseDTO.getSelectedAnswerIndexes());
        assertEquals(0, responseDTO.getTimeSpent());
        assertEquals(0, responseDTO.getEarnedPoints());
    }

    @Test
    @DisplayName("Should all setters works correctly")
    void test02SetAllSettersCorrectly() {
        String id = new ObjectId().toString();
        String questionId = new ObjectId().toString();
        Integer selectedAnswerIndex = 1;
        Integer timeSpent = 10;
        Integer earnedPoints = 10;
        List<Integer> selectedAnswerIndexes = List.of(selectedAnswerIndex);

        MultipleChoiceQuestionResponseDTO responseDTO = new MultipleChoiceQuestionResponseDTO();
        responseDTO.setId(id);
        responseDTO.setQuestionId(questionId);
        responseDTO.setSelectedAnswerIndexes(selectedAnswerIndexes);
        responseDTO.setTimeSpent(timeSpent);
        responseDTO.setEarnedPoints(earnedPoints);

        assertEquals(QuestionType.MULTIPLE_CHOICE, responseDTO.getResponseType());
        assertEquals(id, responseDTO.getId());
        assertEquals(questionId, responseDTO.getQuestionId());
        assertEquals(selectedAnswerIndexes.size(), responseDTO.getSelectedAnswerIndexes().size());
        assertEquals(selectedAnswerIndex, responseDTO.getSelectedAnswerIndexes().getFirst());
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
