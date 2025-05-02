package ch.supsi.model.api.question;

import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@QuarkusTest
@TestMethodOrder(MethodOrderer.MethodName.class)
public class MultipleChoiceQuestionTest {
    @Test
    @DisplayName("Should create new MultipleChoiceQuestion with constructor no parameters")
    void test01CreateMultipleChoiceQuestion_ConstructorNoParameters() {
        MultipleChoiceQuestion question = new MultipleChoiceQuestion();
        assertNull(question.id);
        assertNull(question.questionText);
        assertNull(question.questionBankId);
        assertNotNull(question.choices);
        assertTrue(question.choices.isEmpty());
        assertNotNull(question.correctAnswerIndexes);
        assertTrue(question.correctAnswerIndexes.isEmpty());
        assertEquals(QuestionType.MULTIPLE_CHOICE, question.type);
    }

    @Test
    @DisplayName("Should create new MultipleChoiceQuestion passing parameters to constructor")
    void test02CreateMultipleChoiceQuestion_ConstructorParameters() {
        String questionText = "This is a question";
        String choice1 = "Choice 1";
        String choice2 = "Choice 2";
        List<String> choices = List.of(choice1, choice2);
        Integer correctAnswerIndex = 1;
        List<Integer> correctAnswerIndexes = List.of(correctAnswerIndex);

        MultipleChoiceQuestion question = new MultipleChoiceQuestion(questionText, choices, correctAnswerIndexes);

        assertNull(question.id);
        assertNull(question.questionBankId);
        assertNotNull(question.choices);
        assertEquals(questionText, question.questionText);
        assertEquals(choices.size(), question.choices.size());
        assertEquals(choice1, question.choices.getFirst());
        assertEquals(choice2, question.choices.get(1));
        assertEquals(correctAnswerIndexes.size(), question.correctAnswerIndexes.size());
        assertEquals(correctAnswerIndex, correctAnswerIndexes.getFirst());
        assertEquals(QuestionType.MULTIPLE_CHOICE, question.type);
    }
}
