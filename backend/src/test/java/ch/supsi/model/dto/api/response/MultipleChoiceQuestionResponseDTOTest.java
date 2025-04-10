package ch.supsi.model.dto.api.response;

import ch.supsi.model.api.question.QuestionType;
import io.quarkus.test.junit.QuarkusTest;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

@QuarkusTest
@TestMethodOrder(MethodOrderer.MethodName.class)
public class MultipleChoiceQuestionResponseDTOTest {
    @Test
    @DisplayName("Should create MultipleChoiceQuestionResponseDTO with constructor no parameters")
    void test01CreateMultipleChoiceQuestionResponseDTO_ConstructorWithNoParameters() {
        MultipleChoiceQuestionResponseDTO multipleChoiceQuestionResponseDTO = new MultipleChoiceQuestionResponseDTO();
        assertEquals(QuestionType.MULTIPLE_CHOICE, multipleChoiceQuestionResponseDTO.getResponseType());
        assertNull(multipleChoiceQuestionResponseDTO.getId());
        assertNull(multipleChoiceQuestionResponseDTO.getQuestionId());
        assertNull(multipleChoiceQuestionResponseDTO.getSelectedAnswerIndexes());
    }

    @Test
    @DisplayName("Should all setters works correctly")
    void test02SetAllSettersCorrectly() {
        String id = new ObjectId().toString();
        String questionId = new ObjectId().toString();
        Integer selectedAnswerIndex = 1;
        Integer timeSpent = 10;
        List<Integer> selectedAnswerIndexes = List.of(selectedAnswerIndex);

        MultipleChoiceQuestionResponseDTO multipleChoiceQuestionResponseDTO = new MultipleChoiceQuestionResponseDTO();
        multipleChoiceQuestionResponseDTO.setId(id);
        multipleChoiceQuestionResponseDTO.setQuestionId(questionId);
        multipleChoiceQuestionResponseDTO.setSelectedAnswerIndexes(selectedAnswerIndexes);
        multipleChoiceQuestionResponseDTO.setTimeSpent(timeSpent);

        assertEquals(QuestionType.MULTIPLE_CHOICE, multipleChoiceQuestionResponseDTO.getResponseType());
        assertEquals(id, multipleChoiceQuestionResponseDTO.getId());
        assertEquals(questionId, multipleChoiceQuestionResponseDTO.getQuestionId());
        assertEquals(selectedAnswerIndexes.size(), multipleChoiceQuestionResponseDTO.getSelectedAnswerIndexes().size());
        assertEquals(selectedAnswerIndex, multipleChoiceQuestionResponseDTO.getSelectedAnswerIndexes().getFirst());
        assertEquals(timeSpent, multipleChoiceQuestionResponseDTO.getTimeSpent());
    }

}
