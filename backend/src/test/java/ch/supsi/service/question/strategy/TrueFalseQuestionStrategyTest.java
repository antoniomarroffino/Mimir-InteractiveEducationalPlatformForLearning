package ch.supsi.service.question.strategy;

import ch.supsi.model.api.question.Question;
import ch.supsi.model.api.question.TrueFalseQuestion;
import ch.supsi.model.dto.api.question.TrueFalseQuestionDTO;
import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

import static org.junit.jupiter.api.Assertions.*;

@QuarkusTest
@TestMethodOrder(MethodOrderer.MethodName.class)
public class TrueFalseQuestionStrategyTest {
    final TrueFalseQuestionStrategy strategy = new TrueFalseQuestionStrategy();

    @Test
    @DisplayName("Should return a TrueFalseQuestion")
    void test01CreateQuestion(){
        Question question = this.strategy.createQuestion();

        assertInstanceOf(TrueFalseQuestion.class, question);
    }

    @Test
    @DisplayName("Should not update anything because entity passed is null")
    void test02UpdateQuestion_NotUpdateEntityBecauseEntityPassedIsNull(){
        TrueFalseQuestion trueFalseQuestion = new TrueFalseQuestion();
        trueFalseQuestion.correctAnswer = false;
        trueFalseQuestion.questionText = "Question text";

        TrueFalseQuestionDTO trueFalseQuestionDTOUpdated = new TrueFalseQuestionDTO();
        trueFalseQuestionDTOUpdated.setCorrectAnswer(true);
        trueFalseQuestionDTOUpdated.setQuestionText("Updated question text");

        this.strategy.updateQuestion(null, trueFalseQuestionDTOUpdated);

        assertFalse(trueFalseQuestion.correctAnswer);
        assertEquals("Question text", trueFalseQuestion.questionText);
    }

    @Test
    @DisplayName("Should not update anything because DTO passed is null")
    void test03UpdateQuestion_NotUpdateEntityBecauseDTOPassedIsNull(){
        TrueFalseQuestion trueFalseQuestion = new TrueFalseQuestion();
        trueFalseQuestion.correctAnswer = false;
        trueFalseQuestion.questionText = "Question text";

        this.strategy.updateQuestion(trueFalseQuestion, null);

        assertFalse(trueFalseQuestion.correctAnswer);
        assertEquals("Question text", trueFalseQuestion.questionText);
    }

    @Test
    @DisplayName("Should update passed entity given new TrueFalseQuestionDTO")
    void test04UpdateQuestion(){
        TrueFalseQuestion trueFalseQuestion = new TrueFalseQuestion();
        trueFalseQuestion.correctAnswer = false;
        trueFalseQuestion.questionText = "Question text";

        TrueFalseQuestionDTO trueFalseQuestionDTOUpdated = new TrueFalseQuestionDTO();
        trueFalseQuestionDTOUpdated.setCorrectAnswer(true);
        trueFalseQuestionDTOUpdated.setQuestionText("Updated question text");

        this.strategy.updateQuestion(trueFalseQuestion, trueFalseQuestionDTOUpdated);

        assertTrue(trueFalseQuestion.correctAnswer);
        assertEquals("Updated question text", trueFalseQuestion.questionText);
    }
}
