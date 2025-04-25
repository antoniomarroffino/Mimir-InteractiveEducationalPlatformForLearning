package ch.supsi.model.dto.api.quizAttempt;

import ch.supsi.model.api.user.Role;
import ch.supsi.model.dto.api.BadgeDTO;
import ch.supsi.model.dto.api.QuizAttemptDTO;
import ch.supsi.model.dto.api.UserWithoutCoursesDTO;
import ch.supsi.model.dto.api.response.QuestionResponseDTO;
import ch.supsi.model.dto.api.response.TrueFalseQuestionResponseDTO;
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
public class QuizAttemptDTOTest {
    @Test
    @DisplayName("Should create correctly QuizAttemptDTO with constructor no parameters")
    void test01CreateQuizAttemptDTO_ConstructorWithNoParameters() {
        QuizAttemptDTO quizAttemptDTO = new QuizAttemptDTO();
        assertNull(quizAttemptDTO.getId());
        assertNull(quizAttemptDTO.getQuizPublicationId());
        assertNull(quizAttemptDTO.getUser());
        assertNull(quizAttemptDTO.getStartedAt());
        assertNull(quizAttemptDTO.getCompletedAt());
        assertNotNull(quizAttemptDTO.getResponses());
        assertTrue(quizAttemptDTO.getResponses().isEmpty());
        assertNotNull(quizAttemptDTO.getBadges());
        assertTrue(quizAttemptDTO.getBadges().isEmpty());
        assertEquals(0, (long) quizAttemptDTO.getTimeRemainingSeconds());
    }

    @Test
    @DisplayName("Should all setters work correctly")
    void test02SettersWorkCorrectly() {
        String id = new ObjectId().toString();
        String publicationId = new ObjectId().toString();
        UserWithoutCoursesDTO userWithoutCoursesDTO = new UserWithoutCoursesDTO("TEST-OID", "name", "email@email.com", Role.STUDENT);
        LocalDateTime startedAt = LocalDateTime.now();
        LocalDateTime completedAt = LocalDateTime.now();
        TrueFalseQuestionResponseDTO trueFalseQuestionResponseDTO = new TrueFalseQuestionResponseDTO();
        List<QuestionResponseDTO> questionResponseDTOs = List.of(trueFalseQuestionResponseDTO);
        BadgeDTO badgeDTO = new BadgeDTO();
        List<BadgeDTO> badgeDTOList = List.of(badgeDTO);
        Long timeUsed = 10L;

        QuizAttemptDTO quizAttemptDTO = new QuizAttemptDTO();
        quizAttemptDTO.setId(id);
        quizAttemptDTO.setQuizPublicationId(publicationId);
        quizAttemptDTO.setUser(userWithoutCoursesDTO);
        quizAttemptDTO.setStartedAt(startedAt);
        quizAttemptDTO.setCompletedAt(completedAt);
        quizAttemptDTO.setResponses(questionResponseDTOs);
        quizAttemptDTO.setBadges(badgeDTOList);
        quizAttemptDTO.setTimeRemainingSeconds(timeUsed);

        assertEquals(id, quizAttemptDTO.getId());
        assertEquals(publicationId, quizAttemptDTO.getQuizPublicationId());
        assertEquals(userWithoutCoursesDTO, quizAttemptDTO.getUser());
        assertEquals(startedAt, quizAttemptDTO.getStartedAt());
        assertEquals(completedAt, quizAttemptDTO.getCompletedAt());
        assertEquals(questionResponseDTOs, quizAttemptDTO.getResponses());
        assertEquals(badgeDTOList, quizAttemptDTO.getBadges());
        assertEquals(timeUsed, quizAttemptDTO.getTimeRemainingSeconds());

        quizAttemptDTO.setResponses(null);
        quizAttemptDTO.setBadges(null);
        quizAttemptDTO.setTimeRemainingSeconds(null);
        assertNotNull(quizAttemptDTO.getResponses());
        assertTrue(quizAttemptDTO.getResponses().isEmpty());
        assertNotNull(quizAttemptDTO.getBadges());
        assertTrue(quizAttemptDTO.getBadges().isEmpty());
        assertEquals(0, (long) quizAttemptDTO.getTimeRemainingSeconds());
    }
}
