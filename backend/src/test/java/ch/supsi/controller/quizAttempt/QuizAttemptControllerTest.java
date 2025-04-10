package ch.supsi.controller.quizAttempt;

import ch.supsi.controller.quizattempt.QuizAttemptController;
import ch.supsi.model.api.badge.BadgeType;
import ch.supsi.model.dto.api.QuizAttemptDTO;
import ch.supsi.service.quizattempt.IQuizAttemptService;
import ch.supsi.service.user.IUserService;
import io.quarkus.hibernate.validator.runtime.jaxrs.ResteasyReactiveViolationException;
import io.quarkus.test.InjectMock;
import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.security.TestSecurity;
import jakarta.inject.Inject;
import jakarta.ws.rs.NotFoundException;
import jakarta.ws.rs.core.Response;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@QuarkusTest
@TestMethodOrder(MethodOrderer.MethodName.class)
public class QuizAttemptControllerTest {
    @Inject
    QuizAttemptController quizAttemptController;

    @InjectMock
    IQuizAttemptService quizAttemptService;

    @InjectMock
    IUserService userService;

    private static final String VALID_ATTEMPT_ID = new ObjectId().toString();
    private static final String NON_EXISTENT_ATTEMPT_ID = new ObjectId().toString();
    private static final String VALID_PUBLICATION_ID = new ObjectId().toString();
    private static final String VALID_QUESTION_ID = new ObjectId().toString();
    private static final String VALID_USER_AZURE_OID = "user-azure-oid";


    @Test
    @DisplayName("Should get quiz attempts by user")
    @TestSecurity(user = "user", roles = "USER")
    void test01GetQuizAttemptsByUser_Success() {
        QuizAttemptDTO attempt1 = new QuizAttemptDTO();
        attempt1.setQuizPublicationId(VALID_PUBLICATION_ID);
        QuizAttemptDTO attempt2 = new QuizAttemptDTO();
        attempt2.setQuizPublicationId(VALID_ATTEMPT_ID);
        List<QuizAttemptDTO> attemptList = List.of(attempt1, attempt2);

        when(this.quizAttemptService.getQuizAttemptsByUser(VALID_USER_AZURE_OID)).thenReturn(attemptList);

        Response response = this.quizAttemptController.getQuizAttemptsByUser(VALID_USER_AZURE_OID);

        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        assertEquals(attemptList.size(), ((List<?>) response.getEntity()).size());

        verify(this.quizAttemptService, times(1)).getQuizAttemptsByUser(VALID_USER_AZURE_OID);
    }

    @Test
    @DisplayName("Should return empty list for quiz attempts by user")
    @TestSecurity(user = "user", roles = "USER")
    void test02GetQuizAttemptsByUser_Empty() {
        when(this.quizAttemptService.getQuizAttemptsByUser(VALID_USER_AZURE_OID)).thenReturn(Collections.emptyList());

        Response response = this.quizAttemptController.getQuizAttemptsByUser(VALID_USER_AZURE_OID);

        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        assertTrue(((List<?>) response.getEntity()).isEmpty());

        verify(this.quizAttemptService, times(1)).getQuizAttemptsByUser(VALID_USER_AZURE_OID);
    }

    @Test
    @DisplayName("Should create a new quiz attempt")
    @TestSecurity(user = "user", roles = "USER")
    void test03CreateQuizAttempt_Success() {
        QuizAttemptDTO inputDTO = new QuizAttemptDTO();
        inputDTO.setQuizPublicationId(VALID_PUBLICATION_ID);
        QuizAttemptDTO responseDTO = new QuizAttemptDTO();
        responseDTO.setQuizPublicationId(VALID_PUBLICATION_ID);

        when(this.quizAttemptService.createQuizAttempt(any(QuizAttemptDTO.class))).thenReturn(responseDTO);

        Response response = this.quizAttemptController.createQuizAttempt(inputDTO);
        assertEquals(Response.Status.CREATED.getStatusCode(), response.getStatus());
        assertEquals(responseDTO, response.getEntity());

        verify(this.quizAttemptService, times(1)).createQuizAttempt(any(QuizAttemptDTO.class));
    }

    @Test
    @DisplayName("Should return violation Validation Error because QuizAttempt is not valid")
    @TestSecurity(user = "user", roles = "USER")
    void test04CreateQuizAttempt_ValidationError() {
        QuizAttemptDTO quizAttemptDTO = new QuizAttemptDTO();
        quizAttemptDTO.setQuizPublicationId(null);

        assertAll(
                () -> assertThrows(
                        ResteasyReactiveViolationException.class,
                        () -> this.quizAttemptController.createQuizAttempt(quizAttemptDTO)
                )
        );

        verifyNoInteractions(this.quizAttemptService);
    }

    @Test
    @DisplayName("Should get quiz attempt by ID")
    @TestSecurity(user = "teacher", roles = "TEACHER")
    void test05GetQuizAttemptById_Success() {
        QuizAttemptDTO attemptDTO = new QuizAttemptDTO();
        attemptDTO.setQuizPublicationId(VALID_PUBLICATION_ID);
        when(this.quizAttemptService.getQuizAttemptById(any(ObjectId.class))).thenReturn(attemptDTO);

        Response response = this.quizAttemptController.getQuizAttemptById(VALID_ATTEMPT_ID);
        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        assertEquals(attemptDTO, response.getEntity());

        verify(this.quizAttemptService, times(1)).getQuizAttemptById(any(ObjectId.class));
    }

    @Test
    @DisplayName("Should throw 404 for non-existent quiz attempt")
    @TestSecurity(user = "teacher", roles = "TEACHER")
    void test06GetQuizAttemptById_NotFound() {
        when(this.quizAttemptService.getQuizAttemptById(any(ObjectId.class)))
                .thenThrow(new NotFoundException());

        assertThrows(
                NotFoundException.class, () ->
                this.quizAttemptController.getQuizAttemptById(NON_EXISTENT_ATTEMPT_ID)
        );

        verify(this.quizAttemptService, times(1)).getQuizAttemptById(any(ObjectId.class));
    }

    @Test
    @DisplayName("Should forbid access to get quiz attempt by ID for non-TEACHER")
    @TestSecurity(user = "student", roles = "STUDENT")
    void test07GetQuizAttemptById_Forbidden() {
        assertThrows(
                io.quarkus.security.ForbiddenException.class, () ->
                this.quizAttemptController.getQuizAttemptById(VALID_ATTEMPT_ID)
        );
        verifyNoInteractions(this.quizAttemptService);
    }

    @Test
    @DisplayName("Should get quiz attempts by publication")
    @TestSecurity(user = "teacher", roles = "TEACHER")
    void test08GetQuizAttemptsByPublication_Success() {
        QuizAttemptDTO attemptDTO = new QuizAttemptDTO();
        List<QuizAttemptDTO> attempts = List.of(attemptDTO);

        when(this.quizAttemptService.getQuizAttemptsByPublication(any(ObjectId.class))).thenReturn(attempts);

        Response response = this.quizAttemptController.getQuizAttemptsByPublication(VALID_PUBLICATION_ID);
        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        assertEquals(attempts.size(), ((List<?>) response.getEntity()).size());

        verify(this.quizAttemptService, times(1)).getQuizAttemptsByPublication(any(ObjectId.class));
    }

    @Test
    @DisplayName("Should forbid access to get quiz attempt by ID for non-TEACHER")
    @TestSecurity(user = "student", roles = "STUDENT")
    void test09GetQuizAttemptsByPublication_Forbidden() {
        assertThrows(
                io.quarkus.security.ForbiddenException.class, () ->
                        this.quizAttemptController.getQuizAttemptsByPublication(VALID_PUBLICATION_ID)
        );
        verifyNoInteractions(this.quizAttemptService);
    }

    @Test
    @DisplayName("Should get question stats")
    @TestSecurity(user = "teacher", roles = "TEACHER")
    void test10GetQuestionStats_Success() {
        QuizAttemptDTO attemptDTO = new QuizAttemptDTO();
        List<QuizAttemptDTO> attempts = List.of(attemptDTO);

        when(this.quizAttemptService.getQuizAttemptsByPublicationAndQuestion(any(ObjectId.class), any(ObjectId.class)))
                .thenReturn(attempts);

        Response response = this.quizAttemptController.getQuestionStats(VALID_PUBLICATION_ID, VALID_QUESTION_ID);

        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        assertEquals(attempts.size(), ((List<?>) response.getEntity()).size());

        verify(this.quizAttemptService, times(1))
                .getQuizAttemptsByPublicationAndQuestion(any(ObjectId.class), any(ObjectId.class));
    }

    @Test
    @DisplayName("Should forbid access to get quiz attempt by ID for non-TEACHER")
    @TestSecurity(user = "student", roles = "STUDENT")
    void test11GetQuestionStats_Forbidden() {
        assertThrows(
                io.quarkus.security.ForbiddenException.class, () ->
                        this.quizAttemptController.getQuestionStats(VALID_PUBLICATION_ID, VALID_QUESTION_ID)
        );
        verifyNoInteractions(this.quizAttemptService);
    }

    @Test
    @DisplayName("Should assign badge to quiz attempt")
    @TestSecurity(user = "teacher", roles = "TEACHER")
    void test12AssignBadge_Success() {
        when(this.userService.getOidFromJWT()).thenReturn(VALID_USER_AZURE_OID);

        Response response = this.quizAttemptController.assignBadge(VALID_ATTEMPT_ID, BadgeType.BEST_ATTEMPT);
        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());

        verify(this.quizAttemptService, times(1)).assignBadge(any(ObjectId.class), eq(BadgeType.BEST_ATTEMPT), eq(VALID_USER_AZURE_OID));
    }

    @Test
    @DisplayName("Should forbid badge assignment for non-TEACHER")
    @TestSecurity(user = "student", roles = "STUDENT")
    void test13AssignBadge_Forbidden() {
        assertThrows(
                io.quarkus.security.ForbiddenException.class, () ->
                        this.quizAttemptController.assignBadge(VALID_ATTEMPT_ID, BadgeType.BEST_ATTEMPT)
        );
        verifyNoInteractions(this.quizAttemptService);
    }
}
