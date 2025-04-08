package ch.supsi.service.question.strategy;

import ch.supsi.model.api.question.MultipleChoiceQuestion;
import ch.supsi.model.api.question.Question;
import ch.supsi.model.dto.api.question.MultipleChoiceQuestionDTO;
import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@QuarkusTest
@TestMethodOrder(MethodOrderer.MethodName.class)
public class MultipleChoiceQuestionStrategyTest {
    private static final List<String> CHOICES = List.of("a", "b", "c");
    private static final List<String> CHOICES_UPDATED = List.of("c", "b", "a");
    private static final List<Integer> CORRECT_INDEXES = List.of(1, 2);
    private static final List<Integer> CORRECT_INDEXES_UPDATED = List.of(3, 1);
    final MultipleChoiceQuestionStrategy strategy = new MultipleChoiceQuestionStrategy();

    @Test
    @DisplayName("Should return a MultipleChoiceQuestion")
    void test01CreateQuestion() {
        Question question = this.strategy.createQuestion();

        assertInstanceOf(MultipleChoiceQuestion.class, question);
    }

    @Test
    @DisplayName("Should not update anything because entity passed is null")
    void test02UpdateQuestion_NotUpdateEntityBecauseEntityPassedIsNull() {
        MultipleChoiceQuestion multipleChoiceQuestion = new MultipleChoiceQuestion();
        multipleChoiceQuestion.choices = CHOICES;
        multipleChoiceQuestion.correctAnswerIndexes = CORRECT_INDEXES;
        multipleChoiceQuestion.questionText = "Question text";

        MultipleChoiceQuestionDTO multipleChoiceQuestionDTOUpdated = new MultipleChoiceQuestionDTO();
        multipleChoiceQuestionDTOUpdated.setChoices(CHOICES_UPDATED);
        multipleChoiceQuestionDTOUpdated.setCorrectAnswerIndexes(CORRECT_INDEXES_UPDATED);
        multipleChoiceQuestionDTOUpdated.setQuestionText("Updated question text");

        this.strategy.updateQuestion(null, multipleChoiceQuestionDTOUpdated);

        assertIterableEquals(CHOICES, multipleChoiceQuestion.choices);
        assertIterableEquals(CORRECT_INDEXES, multipleChoiceQuestion.correctAnswerIndexes);
        assertEquals("Question text", multipleChoiceQuestion.questionText);
    }

    @Test
    @DisplayName("Should not update anything because DTO passed is null")
    void test03UpdateQuestion_NotUpdateEntityBecauseDTOPassedIsNull() {
        MultipleChoiceQuestion multipleChoiceQuestion = new MultipleChoiceQuestion();
        multipleChoiceQuestion.choices = CHOICES;
        multipleChoiceQuestion.correctAnswerIndexes = CORRECT_INDEXES;
        multipleChoiceQuestion.questionText = "Question text";

        this.strategy.updateQuestion(multipleChoiceQuestion, null);

        assertIterableEquals(CHOICES, multipleChoiceQuestion.choices);
        assertIterableEquals(CORRECT_INDEXES, multipleChoiceQuestion.correctAnswerIndexes);
        assertEquals("Question text", multipleChoiceQuestion.questionText);
    }

    @Test
    @DisplayName("Should update passed entity given new MultipleChoiceQuestionDTO")
    void test04UpdateQuestion() {
        MultipleChoiceQuestion multipleChoiceQuestion = new MultipleChoiceQuestion();
        multipleChoiceQuestion.choices = CHOICES;
        multipleChoiceQuestion.correctAnswerIndexes = CORRECT_INDEXES;
        multipleChoiceQuestion.questionText = "Question text";

        MultipleChoiceQuestionDTO multipleChoiceQuestionDTOUpdated = new MultipleChoiceQuestionDTO();
        multipleChoiceQuestionDTOUpdated.setChoices(CHOICES_UPDATED);
        multipleChoiceQuestionDTOUpdated.setCorrectAnswerIndexes(CORRECT_INDEXES_UPDATED);
        multipleChoiceQuestionDTOUpdated.setQuestionText("Updated question text");

        this.strategy.updateQuestion(multipleChoiceQuestion, multipleChoiceQuestionDTOUpdated);

        assertIterableEquals(CHOICES_UPDATED, multipleChoiceQuestion.choices);
        assertIterableEquals(CORRECT_INDEXES_UPDATED, multipleChoiceQuestion.correctAnswerIndexes);
        assertEquals("Updated question text", multipleChoiceQuestion.questionText);
    }
}
