package ch.supsi.mapper.quizAttempt;

import ch.supsi.model.api.QuizAttempt;
import ch.supsi.model.api.badge.Badge;
import ch.supsi.model.api.response.MultipleChoiceQuestionResponse;
import ch.supsi.model.api.response.QuestionResponse;
import ch.supsi.model.api.response.TrueFalseQuestionResponse;
import ch.supsi.model.api.user.Role;
import ch.supsi.model.dto.api.BadgeDTO;
import ch.supsi.model.dto.api.QuizAttemptDTO;
import ch.supsi.model.dto.api.UserWithoutCoursesDTO;
import ch.supsi.model.dto.api.response.MultipleChoiceQuestionResponseDTO;
import ch.supsi.model.dto.api.response.QuestionResponseDTO;
import ch.supsi.model.dto.api.response.TrueFalseQuestionResponseDTO;
import ch.supsi.service.quizattempt.QuizAttemptServiceTest;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@QuarkusTest
@TestMethodOrder(MethodOrderer.MethodName.class)
public class QuizAttemptMapperTest {
    @Inject
    QuizAttemptMapper quizAttemptMapper;

    @Test
    @DisplayName("Should return new QuizAttemptDTO given QuizAttemptEntity, List of QuestionResponseDTO and List of BadgeDTO")
    void test01ToDTO_ReturnQuizDTO() {
        QuizAttempt quizAttempt = QuizAttemptServiceTest.createTestQuizAttempt("TEST-OID", new ObjectId(), new ArrayList<>());
        quizAttempt.completedAt = LocalDateTime.now();
        quizAttempt.timeRemainingSeconds = 10L;

        TrueFalseQuestionResponseDTO trueFalseQuestionResponseDTO = new TrueFalseQuestionResponseDTO();
        MultipleChoiceQuestionResponseDTO multipleChoiceQuestionResponseDTO = new MultipleChoiceQuestionResponseDTO();
        List<QuestionResponseDTO> questionResponseDTOList = List.of(trueFalseQuestionResponseDTO, multipleChoiceQuestionResponseDTO);

        BadgeDTO badgeDTO = new BadgeDTO();
        List<BadgeDTO> badgeDTOList = List.of(badgeDTO);

        QuizAttemptDTO quizAttemptDTO = this.quizAttemptMapper.toDTO(quizAttempt, questionResponseDTOList, badgeDTOList);

        assertNotNull(quizAttemptDTO);
        assertEquals(quizAttempt.id.toString(), quizAttemptDTO.getId());
        assertEquals(quizAttempt.userAzureOID, quizAttemptDTO.getUser().getAzureOid());
        assertEquals(quizAttempt.quizPublicationId.toString(), quizAttemptDTO.getQuizPublicationId());
        assertEquals(quizAttempt.startedAt, quizAttemptDTO.getStartedAt());
        assertEquals(quizAttempt.completedAt, quizAttemptDTO.getCompletedAt());
        assertEquals(questionResponseDTOList.size(), quizAttemptDTO.getResponses().size());
        assertEquals(badgeDTOList.size(), quizAttemptDTO.getBadges().size());
        assertEquals(quizAttempt.timeRemainingSeconds, quizAttemptDTO.getTimeRemainingSeconds());
    }

    @Test
    @DisplayName("Should return new QuizAttempt given QuizAttemptDTO, List of QuestionResponse and List of Badge, and QuizAttemptDTO id is null and User null")
    void test02ToEntity_ReturnQuizAttemptWithIdDifferentFromQuizAttemptDTO_UserPassedIsNullAnonymous() {
        QuizAttemptDTO quizAttemptDTO = new QuizAttemptDTO();
        quizAttemptDTO.setId(null);
        quizAttemptDTO.setUser(null);
        quizAttemptDTO.setQuizPublicationId(new ObjectId().toString());
        quizAttemptDTO.setStartedAt(LocalDateTime.now());
        quizAttemptDTO.setCompletedAt(LocalDateTime.now());
        quizAttemptDTO.setTimeRemainingSeconds(null);

        TrueFalseQuestionResponse trueFalseQuestionResponse = new TrueFalseQuestionResponse();
        MultipleChoiceQuestionResponse multipleChoiceQuestionResponse = new MultipleChoiceQuestionResponse();
        List<QuestionResponse> questionResponseList = List.of(trueFalseQuestionResponse, multipleChoiceQuestionResponse);

        Badge badge = new Badge();
        List<Badge> badgeList = List.of(badge);

        QuizAttempt quizAttempt = this.quizAttemptMapper.toEntity(quizAttemptDTO, questionResponseList, badgeList);
        assertNotNull(quizAttempt);
        assertNull(quizAttempt.id);
        assertNull(quizAttempt.userAzureOID);
        assertEquals(new ObjectId(quizAttemptDTO.getQuizPublicationId()), quizAttempt.quizPublicationId);
        assertEquals(quizAttemptDTO.getStartedAt(), quizAttempt.startedAt);
        assertEquals(quizAttemptDTO.getCompletedAt(), quizAttempt.completedAt);
        assertEquals(questionResponseList.size(), quizAttempt.responses.size());
        assertEquals(badgeList.size(), quizAttempt.badges.size());
        assertEquals(0, (long) quizAttempt.timeRemainingSeconds);
    }

    @Test
    @DisplayName("Should return new QuizAttempt given QuizAttemptDTO, List of QuestionResponse and List of Badge, and QuizAttemptDTO id is not null")
    void test03ToEntity_ReturnQuizAttemptWithIdEqualFromQuizAttemptDTO() {
        QuizAttemptDTO quizAttemptDTO = new QuizAttemptDTO();
        quizAttemptDTO.setId(new ObjectId().toString());
        quizAttemptDTO.setUser(new UserWithoutCoursesDTO("TEST-OID", "name", "email@email.com", Role.STUDENT));
        quizAttemptDTO.setQuizPublicationId(new ObjectId().toString());
        quizAttemptDTO.setStartedAt(LocalDateTime.now());
        quizAttemptDTO.setCompletedAt(LocalDateTime.now());
        quizAttemptDTO.setTimeRemainingSeconds(10L);

        TrueFalseQuestionResponse trueFalseQuestionResponse = new TrueFalseQuestionResponse();
        MultipleChoiceQuestionResponse multipleChoiceQuestionResponse = new MultipleChoiceQuestionResponse();
        List<QuestionResponse> questionResponseList = List.of(trueFalseQuestionResponse, multipleChoiceQuestionResponse);

        Badge badge = new Badge();
        List<Badge> badgeList = List.of(badge);

        QuizAttempt quizAttempt = this.quizAttemptMapper.toEntity(quizAttemptDTO, questionResponseList, badgeList);
        assertNotNull(quizAttempt);
        assertEquals(quizAttemptDTO.getId(), quizAttempt.id.toString());
        assertEquals(quizAttemptDTO.getUser().getAzureOid(), quizAttempt.userAzureOID);
        assertEquals(quizAttemptDTO.getQuizPublicationId(), quizAttempt.quizPublicationId.toString());
        assertEquals(quizAttemptDTO.getStartedAt(), quizAttempt.startedAt);
        assertEquals(quizAttemptDTO.getCompletedAt(), quizAttempt.completedAt);
        assertEquals(questionResponseList.size(), quizAttempt.responses.size());
        assertEquals(badgeList.size(), quizAttempt.badges.size());
        assertEquals(quizAttemptDTO.getTimeRemainingSeconds(), quizAttempt.timeRemainingSeconds);
    }
}
