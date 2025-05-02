package ch.supsi.service.quizattempt.points.strategy;

import ch.supsi.model.api.question.MultipleChoiceQuestion;
import ch.supsi.model.api.response.MultipleChoiceQuestionResponse;
import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

@QuarkusTest
@TestMethodOrder(MethodOrderer.MethodName.class)
public class MultipleChoicePointsCalculatorStrategyTest {
    private final MultipleChoicePointsCalculatorStrategy multipleChoicePointsCalculatorStrategy = new MultipleChoicePointsCalculatorStrategy();

    @Test
    @DisplayName("Should return 0 points if selected answer indexes are wrong, even one")
    void test01CalculatePoints_ReturnZeroPoints() {
        Integer correctAnswerIndex1 = 1;
        Integer correctAnswerIndex2 = 2;
        List<Integer> correctAnswerIndexes = List.of(correctAnswerIndex1, correctAnswerIndex2);

        Integer selectAnswerIndex = 1;
        List<Integer> selectAnswerIndexes = List.of(selectAnswerIndex);

        MultipleChoiceQuestion question = new MultipleChoiceQuestion();
        question.correctAnswerIndexes = correctAnswerIndexes;
        question.points = 10;

        MultipleChoiceQuestionResponse response = new MultipleChoiceQuestionResponse();
        response.selectedAnswerIndexes = selectAnswerIndexes;

        Integer calculatedPoints = this.multipleChoicePointsCalculatorStrategy.calculatePoints(response, question);
        assertEquals(0, calculatedPoints);
    }

    @Test
    @DisplayName("Should return all points for correct answer")
    void test02CalculatePoints_ReturnAllPoints() {
        Integer correctAnswerIndex1 = 1;
        Integer correctAnswerIndex2 = 2;
        List<Integer> correctAnswerIndexes = List.of(correctAnswerIndex1, correctAnswerIndex2);

        List<Integer> selectAnswerIndexes = List.of(correctAnswerIndex1, correctAnswerIndex2);

        MultipleChoiceQuestion question = new MultipleChoiceQuestion();
        question.correctAnswerIndexes = correctAnswerIndexes;
        question.points = 10;

        MultipleChoiceQuestionResponse response = new MultipleChoiceQuestionResponse();
        response.selectedAnswerIndexes = selectAnswerIndexes;

        Integer calculatedPoints = this.multipleChoicePointsCalculatorStrategy.calculatePoints(response, question);
        assertEquals(question.points, calculatedPoints);
    }
}
