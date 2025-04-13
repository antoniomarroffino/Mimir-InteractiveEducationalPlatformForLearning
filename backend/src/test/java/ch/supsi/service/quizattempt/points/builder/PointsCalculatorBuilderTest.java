package ch.supsi.service.quizattempt.points.builder;

import ch.supsi.model.api.question.QuestionType;
import ch.supsi.service.question.strategy.MultipleChoiceQuestionStrategy;
import ch.supsi.service.question.strategy.TrueFalseQuestionStrategy;
import ch.supsi.service.quizattempt.points.strategy.MultipleChoicePointsCalculatorStrategy;
import ch.supsi.service.quizattempt.points.strategy.TrueFalsePointsCalculatorStrategy;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

import static org.junit.jupiter.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.assertEquals;

@QuarkusTest
@TestMethodOrder(MethodOrderer.MethodName.class)
public class PointsCalculatorBuilderTest {
    @Inject
    PointsCalculatorBuilder pointsCalculatorBuilder;

    @Test
    @DisplayName("Should return TrueFalsePointsCalculatorStrategy given TrueFalse QuestionType")
    void test01GetStrategy_ShouldReturnTrueFalsePointsCalculatorStrategy_WhenTypeIsTrueFalse() {
        var strategy = this.pointsCalculatorBuilder.getPointsCalculator(QuestionType.TRUE_FALSE);

        assertInstanceOf(TrueFalsePointsCalculatorStrategy.class, strategy);
    }

    @Test
    @DisplayName("Should return MultipleChoicePointsStrategy given MultipleChoice QuestionType")
    void test02GetStrategy_ShouldReturnMultipleChoicePointsStrategy_WhenTypeIsMultipleChoice() {
        var strategy = this.pointsCalculatorBuilder.getPointsCalculator(QuestionType.MULTIPLE_CHOICE);

        assertInstanceOf(MultipleChoicePointsCalculatorStrategy.class, strategy);
    }

    @Test
    @DisplayName("Should support all existing question types")
    void test03VerifyAllTypesAreSupported() {
        for (QuestionType type : QuestionType.values())
            assertDoesNotThrow(() -> this.pointsCalculatorBuilder.getPointsCalculator(type));
    }

    @Test
    @DisplayName("Should throw UnsupportedOperationError when give a null researching key")
    void getStrategy_ShouldThrowException_WhenTypeIsNull() {
        UnsupportedOperationException exception = assertThrows(
                UnsupportedOperationException.class,
                () -> this.pointsCalculatorBuilder.getPointsCalculator(null)
        );

        assertEquals("Question type not supported: null", exception.getMessage());
    }
}
