package ch.supsi.model.dto.api.question;

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
public class MultipleChoiceQuestionDTOTest {
    @Test
    @DisplayName("Should create correctly MultipleChoiceQuestionDTO with constructor no parameters")
    void test01CreateMultipleChoiceQuestionDTO_ConstructorNoParameters() {
        MultipleChoiceQuestionDTO dto = new MultipleChoiceQuestionDTO();
        assertNull(dto.getId());
        assertNull(dto.getQuestionText());
        assertNull(dto.getQuestionBankId());
        assertEquals(QuestionType.MULTIPLE_CHOICE, dto.getType());
        assertEquals(1, dto.getPoints());
        assertNull(dto.getChoices());
        assertNull(dto.getCorrectAnswerIndexes());
    }

    @Test
    @DisplayName("Should all setters work correctly")
    void test02SettersWorkCorrectly() {
        String id = new ObjectId().toString();
        String questionText = "question text";
        String questionBankId = new ObjectId().toString();
        Integer points = 20;
        String choice1 = "choice1";
        String choice2 = "choice2";
        List<String> choices = List.of(choice1, choice2);
        Integer correctAnswerIndex = 1;
        List<Integer> correctAnswerIndexes = List.of(correctAnswerIndex);

        MultipleChoiceQuestionDTO dto = new MultipleChoiceQuestionDTO();
        dto.setId(id);
        dto.setQuestionText(questionText);
        dto.setQuestionBankId(questionBankId);
        dto.setPoints(points);
        dto.setChoices(choices);
        dto.setCorrectAnswerIndexes(correctAnswerIndexes);

        assertEquals(id, dto.getId());
        assertEquals(questionText, dto.getQuestionText());
        assertEquals(questionBankId, dto.getQuestionBankId());
        assertEquals(points, dto.getPoints());
        assertEquals(choices, dto.getChoices());
        assertEquals(correctAnswerIndexes, dto.getCorrectAnswerIndexes());
    }
}
