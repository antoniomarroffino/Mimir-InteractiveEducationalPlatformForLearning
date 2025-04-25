package ch.supsi.model.api.quizAttempt;

import ch.supsi.model.api.QuizAttempt;
import ch.supsi.model.api.response.MultipleChoiceQuestionResponse;
import ch.supsi.model.api.response.QuestionResponse;
import ch.supsi.model.api.response.TrueFalseQuestionResponse;
import io.quarkus.test.junit.QuarkusTest;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@QuarkusTest
@TestMethodOrder(MethodOrderer.MethodName.class)
public class QuizAttemptTest {
    @Test
    @DisplayName("Should create new QuizAttempt with constructor no parameters")
    void test01CreateQuizAttempt_ConstructorWithNoParameters() {
        QuizAttempt quizAttempt = new QuizAttempt();
        assertNull(quizAttempt.id);
        assertNull(quizAttempt.quizPublicationId);
        assertNull(quizAttempt.userAzureOID);
        assertNull(quizAttempt.startedAt);
        assertNull(quizAttempt.completedAt);
        assertNotNull(quizAttempt.responses);
        assertTrue(quizAttempt.responses.isEmpty());
        assertNotNull(quizAttempt.badges);
        assertTrue(quizAttempt.badges.isEmpty());
        assertEquals(0, (long) quizAttempt.timeRemainingSeconds);
    }

    @Test
    @DisplayName("Should create new QuizAttempt with constructor with parameters")
    void test02CreateQuizAttempt_ConstructorWithParameters() {
        ObjectId publicationId = new ObjectId();
        String userAzureOID = "testUserAzureOID";
        LocalDateTime startedAt = LocalDateTime.now();
        LocalDateTime completedAt = LocalDateTime.now();

        TrueFalseQuestionResponse trueFalseQuestionResponse = new TrueFalseQuestionResponse();
        MultipleChoiceQuestionResponse multipleChoiceQuestionResponse = new MultipleChoiceQuestionResponse();
        List<QuestionResponse> questionResponseList = List.of(trueFalseQuestionResponse, multipleChoiceQuestionResponse);

        QuizAttempt quizAttempt = new QuizAttempt(publicationId, userAzureOID, startedAt, completedAt, questionResponseList);
        assertNull(quizAttempt.id);
        assertEquals(publicationId, quizAttempt.quizPublicationId);
        assertEquals(userAzureOID, quizAttempt.userAzureOID);
        assertEquals(startedAt, quizAttempt.startedAt);
        assertEquals(completedAt, quizAttempt.completedAt);
        assertEquals(questionResponseList.size(), quizAttempt.responses.size());
        assertEquals(trueFalseQuestionResponse.responseType, quizAttempt.responses.getFirst().responseType);
        assertEquals(multipleChoiceQuestionResponse.responseType, quizAttempt.responses.get(1).responseType);
        assertEquals(0, (long) quizAttempt.timeRemainingSeconds);
    }
}
