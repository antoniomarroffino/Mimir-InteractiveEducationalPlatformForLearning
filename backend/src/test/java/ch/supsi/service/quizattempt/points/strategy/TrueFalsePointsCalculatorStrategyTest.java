package ch.supsi.service.quizattempt.points.strategy;

import ch.supsi.model.api.question.TrueFalseQuestion;
import ch.supsi.model.api.response.TrueFalseQuestionResponse;
import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

import static org.junit.jupiter.api.Assertions.assertEquals;

@QuarkusTest
@TestMethodOrder(MethodOrderer.MethodName.class)
public class TrueFalsePointsCalculatorStrategyTest {
    private final TrueFalsePointsCalculatorStrategy trueFalsePointsCalculatorStrategy = new TrueFalsePointsCalculatorStrategy();

    @Test
    @DisplayName("Should return 0 points if selected answer is not equal to correct one")
    void test01CalculatePoints_ReturnZeroPoints() {
        TrueFalseQuestion question = new TrueFalseQuestion();
        question.correctAnswer = true;
        question.points = 10;

        TrueFalseQuestionResponse response = new TrueFalseQuestionResponse();
        response.selectedAnswer = false;

        Integer calculatedPoints = this.trueFalsePointsCalculatorStrategy.calculatePoints(response, question);
        assertEquals(0, calculatedPoints);
    }

    @Test
    @DisplayName("Should return all points for correct answer")
    void test02CalculatePoints_ReturnAllPoints() {
        TrueFalseQuestion question = new TrueFalseQuestion();
        question.correctAnswer = true;
        question.points = 10;

        TrueFalseQuestionResponse response = new TrueFalseQuestionResponse();
        response.selectedAnswer = question.correctAnswer;

        Integer calculatedPoints = this.trueFalsePointsCalculatorStrategy.calculatePoints(response, question);
        assertEquals(question.points, calculatedPoints);
    }
}
