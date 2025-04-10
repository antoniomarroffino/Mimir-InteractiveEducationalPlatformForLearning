package ch.supsi.model.api.response;

import ch.supsi.model.api.question.QuestionType;
import io.quarkus.test.junit.QuarkusTest;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@QuarkusTest
@TestMethodOrder(MethodOrderer.MethodName.class)
public class MultipleChoiceQuestionResponseTest {
    @Test
    @DisplayName("Should create new MultipleChoiceQuestionResponse with constructor not parameters")
    void test01CreateMultipleChoiceQuestionResponse_ConstructorWithNoParameters() {
        MultipleChoiceQuestionResponse multipleChoiceQuestionResponse = new MultipleChoiceQuestionResponse();
        assertNotNull(multipleChoiceQuestionResponse.id);
        assertNull(multipleChoiceQuestionResponse.questionId);
        assertNull(multipleChoiceQuestionResponse.selectedAnswerIndexes);
        assertEquals(QuestionType.MULTIPLE_CHOICE, multipleChoiceQuestionResponse.responseType);
    }

    @Test
    @DisplayName("Should create new MultipleChoiceQuestionResponse passing questionId to constructor")
    void test02CreateMultipleChoiceQuestionResponse_PassingQuestionIdToConstructor() {
        ObjectId questionId = new ObjectId();
        MultipleChoiceQuestionResponse multipleChoiceQuestionResponse = new MultipleChoiceQuestionResponse(questionId);
        assertNotNull(multipleChoiceQuestionResponse.id);
        assertEquals(questionId, multipleChoiceQuestionResponse.questionId);
        assertNull(multipleChoiceQuestionResponse.selectedAnswerIndexes);
        assertEquals(QuestionType.MULTIPLE_CHOICE, multipleChoiceQuestionResponse.responseType);
    }

    @Test
    @DisplayName("Should create new MultipleChoiceQuestionResponse passing all parameters to constructor")
    void test03CreateMultipleChoiceQuestionResponse_PassingAllParametersToConstructor() {
        ObjectId questionId = new ObjectId();
        Integer correctAnswerIndex = 1;
        List<Integer> selectedAnswerIndexes = List.of(correctAnswerIndex);
        MultipleChoiceQuestionResponse multipleChoiceQuestionResponse = new MultipleChoiceQuestionResponse(selectedAnswerIndexes, questionId);
        assertNotNull(multipleChoiceQuestionResponse.id);
        assertEquals(questionId, multipleChoiceQuestionResponse.questionId);
        assertEquals(selectedAnswerIndexes.size(), multipleChoiceQuestionResponse.selectedAnswerIndexes.size());
        assertEquals(correctAnswerIndex, multipleChoiceQuestionResponse.selectedAnswerIndexes.getFirst());
        assertEquals(QuestionType.MULTIPLE_CHOICE, multipleChoiceQuestionResponse.responseType);
    }
}
