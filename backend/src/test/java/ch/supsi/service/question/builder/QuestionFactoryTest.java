package ch.supsi.service.question.builder;

import ch.supsi.model.api.question.QuestionType;
import ch.supsi.service.question.strategy.MultipleChoiceQuestionStrategy;
import ch.supsi.service.question.strategy.TrueFalseQuestionStrategy;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

import static org.junit.jupiter.api.Assertions.*;

@QuarkusTest
@TestMethodOrder(MethodOrderer.MethodName.class)
public class QuestionFactoryTest {
    @Inject
    QuestionFactory questionFactory;

    @Test
    @DisplayName("Should return TrueFalseStrategy given TrueFalse QuestionType")
    void test01GetStrategy_ShouldReturnTrueFalseStrategy_WhenTypeIsTrueFalse() {
        var strategy = this.questionFactory.getStrategy(QuestionType.TRUE_FALSE);

        assertInstanceOf(TrueFalseQuestionStrategy.class, strategy);
    }

    @Test
    @DisplayName("Should return MultipleChoiceStrategy given MultipleChoice QuestionType")
    void test02GetStrategy_ShouldReturnMultipleChoiceStrategy_WhenTypeIsMultipleChoice() {
        var strategy = this.questionFactory.getStrategy(QuestionType.MULTIPLE_CHOICE);

        assertInstanceOf(MultipleChoiceQuestionStrategy.class, strategy);
    }

    /*@Test
    @DisplayName("Should throw UnsupportedOperationError because question type is not supported")
    void test03GetStrategy_ShouldThrowException_WhenTypeIsNotSupported() {
        QuestionType unsupportedType = QuestionType.THIS_QUESTION_DOES_NOT_EXIST;

        UnsupportedOperationException exception = assertThrows(
                UnsupportedOperationException.class,
                () -> this.questionFactory.getStrategy(QuestionType)
        );

        assertEquals("Question type not supported: " + unsupportedType, exception.getMessage());
    }*/

    @Test
    @DisplayName("Should support all existing question types")
    void test03VerifyAllTypesAreSupported() {
        for (QuestionType type : QuestionType.values())
            assertDoesNotThrow(() -> this.questionFactory.getStrategy(type));
    }

    @Test
    @DisplayName("Should throw UnsupportedOperationError when give a null researching key")
    void getStrategy_ShouldThrowException_WhenTypeIsNull() {
        UnsupportedOperationException exception = assertThrows(
                UnsupportedOperationException.class,
                () -> this.questionFactory.getStrategy(null)
        );

        assertEquals("Question type not supported: null", exception.getMessage());
    }}
