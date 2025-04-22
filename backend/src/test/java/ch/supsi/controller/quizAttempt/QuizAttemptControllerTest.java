package ch.supsi.controller.quizAttempt;

import ch.supsi.controller.quizattempt.QuizAttemptController;
import ch.supsi.model.api.badge.BadgeType;
import ch.supsi.model.api.user.Role;
import ch.supsi.model.dto.api.BadgeDTO;
import ch.supsi.model.dto.api.QuizAttemptDTO;
import ch.supsi.model.dto.api.UserWithoutCoursesDTO;
import ch.supsi.service.quizattempt.IQuizAttemptService;
import ch.supsi.service.user.IUserService;
import ch.supsi.service.user.microsoftGraph.IMicrosoftGraphService;
import com.microsoft.graph.models.User;
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
    private static final String VALID_ATTEMPT_ID = new ObjectId().toString();
    private static final String NON_EXISTENT_ATTEMPT_ID = new ObjectId().toString();
    private static final String VALID_PUBLICATION_ID = new ObjectId().toString();
    private static final String VALID_QUESTION_ID = new ObjectId().toString();
    private static final String VALID_USER_AZURE_OID = "user-azure-oid";
    private static final String BADGE_ASSIGNER_OID = "assigner-oid";
    @Inject
    QuizAttemptController quizAttemptController;
    @InjectMock
    IQuizAttemptService quizAttemptService;
    @InjectMock
    IUserService userService;
    @InjectMock
    IMicrosoftGraphService microsoftGraphService;

    @Test
    @DisplayName("Should get quiz attempts by user")
    @TestSecurity(user = "user", roles = "STUDENT")
    void test01GetQuizAttemptsByUser_Success() {
        UserWithoutCoursesDTO userWithoutCoursesDTO = new UserWithoutCoursesDTO();
        userWithoutCoursesDTO.setAzureOid(VALID_USER_AZURE_OID);

        BadgeDTO badge1 = new BadgeDTO();
        badge1.setAssignedBy(new UserWithoutCoursesDTO(BADGE_ASSIGNER_OID, "assigner", "assignerEmail", Role.TEACHER));
        BadgeDTO badge2 = new BadgeDTO();
        badge2.setAssignedBy(new UserWithoutCoursesDTO(BADGE_ASSIGNER_OID, "assigner", "assignerEmail", Role.TEACHER));

        QuizAttemptDTO attempt1 = new QuizAttemptDTO();
        attempt1.setQuizPublicationId(VALID_PUBLICATION_ID);
        attempt1.setUser(userWithoutCoursesDTO);
        attempt1.setBadges(List.of(badge1, badge2));
        QuizAttemptDTO attempt2 = new QuizAttemptDTO();
        attempt2.setQuizPublicationId(VALID_ATTEMPT_ID);
        attempt2.setUser(userWithoutCoursesDTO);
        attempt2.setBadges(Collections.emptyList());
        List<QuizAttemptDTO> attemptList = List.of(attempt1, attempt2);

        when(this.quizAttemptService.getQuizAttemptsByUser(VALID_USER_AZURE_OID)).thenReturn(attemptList);
        when(this.microsoftGraphService.getUserByOid(anyString())).thenReturn(new User());
        when(this.userService.buildUserWithoutCoursesDTO(any(User.class))).thenReturn(new UserWithoutCoursesDTO());

        Response response = this.quizAttemptController.getQuizAttemptsByUser(VALID_USER_AZURE_OID);

        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        assertEquals(attemptList.size(), ((List<?>) response.getEntity()).size());

        verify(this.quizAttemptService, times(1)).getQuizAttemptsByUser(VALID_USER_AZURE_OID);
        verify(this.microsoftGraphService, times(4)).getUserByOid(anyString());
        verify(this.userService, times(4)).buildUserWithoutCoursesDTO(any(User.class));
    }

    @Test
    @DisplayName("Should return empty list for quiz attempts by user")
    @TestSecurity(user = "user", roles = "STUDENT")
    void test02GetQuizAttemptsByUser_Empty() {
        when(this.quizAttemptService.getQuizAttemptsByUser(VALID_USER_AZURE_OID)).thenReturn(Collections.emptyList());

        Response response = this.quizAttemptController.getQuizAttemptsByUser(VALID_USER_AZURE_OID);

        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        assertTrue(((List<?>) response.getEntity()).isEmpty());

        verify(this.quizAttemptService, times(1)).getQuizAttemptsByUser(VALID_USER_AZURE_OID);
        verifyNoInteractions(this.microsoftGraphService, this.userService);
    }

    @Test
    @DisplayName("Should create a new quiz attempt")
    @TestSecurity(user = "user", roles = "STUDENT")
    void test03CreateQuizAttempt_Success() {
        UserWithoutCoursesDTO userWithoutCoursesDTO = new UserWithoutCoursesDTO();
        userWithoutCoursesDTO.setAzureOid(VALID_USER_AZURE_OID);

        BadgeDTO badge1 = new BadgeDTO();
        badge1.setAssignedBy(new UserWithoutCoursesDTO(BADGE_ASSIGNER_OID, "assigner", "assignerEmail", Role.TEACHER));
        BadgeDTO badge2 = new BadgeDTO();
        badge2.setAssignedBy(new UserWithoutCoursesDTO(BADGE_ASSIGNER_OID, "assigner", "assignerEmail", Role.TEACHER));

        QuizAttemptDTO inputDTO = new QuizAttemptDTO();
        inputDTO.setQuizPublicationId(VALID_PUBLICATION_ID);
        QuizAttemptDTO responseDTO = new QuizAttemptDTO();
        responseDTO.setQuizPublicationId(VALID_PUBLICATION_ID);
        responseDTO.setUser(userWithoutCoursesDTO);
        responseDTO.setBadges(List.of(badge1, badge2));

        when(this.quizAttemptService.createQuizAttempt(any(QuizAttemptDTO.class))).thenReturn(responseDTO);
        when(this.microsoftGraphService.getUserByOid(anyString())).thenReturn(new User());
        when(this.userService.buildUserWithoutCoursesDTO(any(User.class))).thenReturn(new UserWithoutCoursesDTO());

        Response response = this.quizAttemptController.createQuizAttempt(inputDTO);
        assertEquals(Response.Status.CREATED.getStatusCode(), response.getStatus());
        assertEquals(responseDTO, response.getEntity());

        verify(this.quizAttemptService, times(1)).createQuizAttempt(any(QuizAttemptDTO.class));
        verify(this.microsoftGraphService, times(3)).getUserByOid(anyString());
        verify(this.userService, times(3)).buildUserWithoutCoursesDTO(any(User.class));
    }

    @Test
    @DisplayName("Should return violation Validation Error because QuizAttempt is not valid")
    @TestSecurity(user = "user", roles = "STUDENT")
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
        UserWithoutCoursesDTO userWithoutCoursesDTO = new UserWithoutCoursesDTO();
        userWithoutCoursesDTO.setAzureOid(VALID_USER_AZURE_OID);

        BadgeDTO badge1 = new BadgeDTO();
        badge1.setAssignedBy(new UserWithoutCoursesDTO(BADGE_ASSIGNER_OID, "assigner", "assignerEmail", Role.TEACHER));
        BadgeDTO badge2 = new BadgeDTO();
        badge2.setAssignedBy(new UserWithoutCoursesDTO(BADGE_ASSIGNER_OID, "assigner", "assignerEmail", Role.TEACHER));

        QuizAttemptDTO attemptDTO = new QuizAttemptDTO();
        attemptDTO.setQuizPublicationId(VALID_PUBLICATION_ID);
        attemptDTO.setUser(userWithoutCoursesDTO);
        attemptDTO.setBadges(List.of(badge1, badge2));

        when(this.quizAttemptService.getQuizAttemptById(any(ObjectId.class))).thenReturn(attemptDTO);
        when(this.microsoftGraphService.getUserByOid(anyString())).thenReturn(new User());
        when(this.userService.buildUserWithoutCoursesDTO(any(User.class))).thenReturn(new UserWithoutCoursesDTO());

        Response response = this.quizAttemptController.getQuizAttemptById(VALID_ATTEMPT_ID);

        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        assertEquals(attemptDTO, response.getEntity());

        verify(this.quizAttemptService, times(1)).getQuizAttemptById(any(ObjectId.class));
        verify(this.microsoftGraphService, times(3)).getUserByOid(anyString());
        verify(this.userService, times(3)).buildUserWithoutCoursesDTO(any(User.class));
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
        UserWithoutCoursesDTO userWithoutCoursesDTO = new UserWithoutCoursesDTO();
        userWithoutCoursesDTO.setAzureOid(VALID_USER_AZURE_OID);

        BadgeDTO badge1 = new BadgeDTO();
        badge1.setAssignedBy(new UserWithoutCoursesDTO(BADGE_ASSIGNER_OID, "assigner", "assignerEmail", Role.TEACHER));
        BadgeDTO badge2 = new BadgeDTO();
        badge2.setAssignedBy(new UserWithoutCoursesDTO(BADGE_ASSIGNER_OID, "assigner", "assignerEmail", Role.TEACHER));

        QuizAttemptDTO attemptDTO = new QuizAttemptDTO();
        attemptDTO.setUser(userWithoutCoursesDTO);
        attemptDTO.setBadges(List.of(badge1, badge2));
        List<QuizAttemptDTO> attempts = List.of(attemptDTO);

        when(this.quizAttemptService.getQuizAttemptsByPublication(any(ObjectId.class))).thenReturn(attempts);
        when(this.microsoftGraphService.getUserByOid(anyString())).thenReturn(new User());
        when(this.userService.buildUserWithoutCoursesDTO(any(User.class))).thenReturn(new UserWithoutCoursesDTO());

        Response response = this.quizAttemptController.getQuizAttemptsByPublication(VALID_PUBLICATION_ID);

        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        assertEquals(attempts.size(), ((List<?>) response.getEntity()).size());

        verify(this.quizAttemptService, times(1)).getQuizAttemptsByPublication(any(ObjectId.class));
        verify(this.microsoftGraphService, times(3)).getUserByOid(anyString());
        verify(this.userService, times(3)).buildUserWithoutCoursesDTO(any(User.class));
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
        UserWithoutCoursesDTO userWithoutCoursesDTO = new UserWithoutCoursesDTO();
        userWithoutCoursesDTO.setAzureOid(VALID_USER_AZURE_OID);

        BadgeDTO badge1 = new BadgeDTO();
        badge1.setAssignedBy(new UserWithoutCoursesDTO(BADGE_ASSIGNER_OID, "assigner", "assignerEmail", Role.TEACHER));
        BadgeDTO badge2 = new BadgeDTO();
        badge2.setAssignedBy(new UserWithoutCoursesDTO(BADGE_ASSIGNER_OID, "assigner", "assignerEmail", Role.TEACHER));

        QuizAttemptDTO attemptDTO = new QuizAttemptDTO();
        attemptDTO.setUser(userWithoutCoursesDTO);
        attemptDTO.setBadges(List.of(badge1, badge2));
        List<QuizAttemptDTO> attempts = List.of(attemptDTO);

        when(this.quizAttemptService.getQuizAttemptsByPublicationAndQuestion(any(ObjectId.class), any(ObjectId.class)))
                .thenReturn(attempts);
        when(this.microsoftGraphService.getUserByOid(anyString())).thenReturn(new User());
        when(this.userService.buildUserWithoutCoursesDTO(any(User.class))).thenReturn(new UserWithoutCoursesDTO());

        Response response = this.quizAttemptController.getQuestionStats(VALID_PUBLICATION_ID, VALID_QUESTION_ID);

        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        assertEquals(attempts.size(), ((List<?>) response.getEntity()).size());

        verify(this.quizAttemptService, times(1))
                .getQuizAttemptsByPublicationAndQuestion(any(ObjectId.class), any(ObjectId.class));
        verify(this.microsoftGraphService, times(3)).getUserByOid(anyString());
        verify(this.userService, times(3)).buildUserWithoutCoursesDTO(any(User.class));
    }

    @Test
    @DisplayName("Should get question stats and UserDTO returned is null because quiz is anonymous")
    @TestSecurity(user = "teacher", roles = "TEACHER")
    void test11GetQuestionStats_SuccessAndUserIsNullAnonymous() {
        UserWithoutCoursesDTO userWithoutCoursesDTO = new UserWithoutCoursesDTO();
        userWithoutCoursesDTO.setAzureOid(null);

        BadgeDTO badge1 = new BadgeDTO();
        badge1.setAssignedBy(new UserWithoutCoursesDTO(BADGE_ASSIGNER_OID, "assigner", "assignerEmail", Role.TEACHER));
        BadgeDTO badge2 = new BadgeDTO();
        badge2.setAssignedBy(new UserWithoutCoursesDTO(BADGE_ASSIGNER_OID, "assigner", "assignerEmail", Role.TEACHER));

        QuizAttemptDTO attemptDTO = new QuizAttemptDTO();
        attemptDTO.setUser(userWithoutCoursesDTO);
        attemptDTO.setBadges(List.of(badge1, badge2));
        List<QuizAttemptDTO> attempts = List.of(attemptDTO);

        when(this.quizAttemptService.getQuizAttemptsByPublicationAndQuestion(any(ObjectId.class), any(ObjectId.class)))
                .thenReturn(attempts);
        when(this.microsoftGraphService.getUserByOid(anyString())).thenReturn(new User());
        when(this.userService.buildUserWithoutCoursesDTO(any(User.class))).thenReturn(new UserWithoutCoursesDTO());

        Response response = this.quizAttemptController.getQuestionStats(VALID_PUBLICATION_ID, VALID_QUESTION_ID);

        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        assertEquals(attempts.size(), ((List<?>) response.getEntity()).size());
        assertNull(((QuizAttemptDTO) ((List<?>) response.getEntity()).getFirst()).getUser());

        verify(this.quizAttemptService, times(1))
                .getQuizAttemptsByPublicationAndQuestion(any(ObjectId.class), any(ObjectId.class));
        verify(this.microsoftGraphService, times(2)).getUserByOid(anyString());
        verify(this.userService, times(2)).buildUserWithoutCoursesDTO(any(User.class));
    }

    @Test
    @DisplayName("Should forbid access to get quiz attempt by ID for non-TEACHER")
    @TestSecurity(user = "student", roles = "STUDENT")
    void test12GetQuestionStats_Forbidden() {
        assertThrows(
                io.quarkus.security.ForbiddenException.class, () ->
                        this.quizAttemptController.getQuestionStats(VALID_PUBLICATION_ID, VALID_QUESTION_ID)
        );
        verifyNoInteractions(this.quizAttemptService);
    }

    @Test
    @DisplayName("Should assign badge to quiz attempt")
    @TestSecurity(user = "teacher", roles = "TEACHER")
    void test13AssignBadge_Success() {
        when(this.userService.getOidFromJWT()).thenReturn(VALID_USER_AZURE_OID);

        Response response = this.quizAttemptController.assignBadge(VALID_ATTEMPT_ID, BadgeType.BEST_ATTEMPT);
        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());

        verify(this.quizAttemptService, times(1)).assignBadge(any(ObjectId.class), eq(BadgeType.BEST_ATTEMPT), eq(VALID_USER_AZURE_OID));
    }

    @Test
    @DisplayName("Should forbid badge assignment for non-TEACHER")
    @TestSecurity(user = "student", roles = "STUDENT")
    void test14AssignBadge_Forbidden() {
        assertThrows(
                io.quarkus.security.ForbiddenException.class, () ->
                        this.quizAttemptController.assignBadge(VALID_ATTEMPT_ID, BadgeType.BEST_ATTEMPT)
        );
        verifyNoInteractions(this.quizAttemptService);
    }

    @Test
    @DisplayName("Should update quiz attempt and return updated DTO")
    @TestSecurity(user = "student", roles = "STUDENT")
    void test15UpdateQuizAttempt_Success() {
        QuizAttemptDTO inputDTO = new QuizAttemptDTO();
        inputDTO.setQuizPublicationId(VALID_PUBLICATION_ID);
        inputDTO.setUser(new UserWithoutCoursesDTO(VALID_USER_AZURE_OID, "name", "email", Role.STUDENT));
        inputDTO.setBadges(Collections.emptyList());

        QuizAttemptDTO updatedDTO = new QuizAttemptDTO();
        updatedDTO.setQuizPublicationId(VALID_PUBLICATION_ID);
        updatedDTO.setUser(inputDTO.getUser());
        updatedDTO.setBadges(Collections.emptyList());

        when(quizAttemptService.updateQuizAttempt(any(ObjectId.class), eq(inputDTO))).thenReturn(updatedDTO);
        when(microsoftGraphService.getUserByOid(anyString())).thenReturn(new User());
        when(userService.buildUserWithoutCoursesDTO(any(User.class))).thenReturn(new UserWithoutCoursesDTO());

        Response response = quizAttemptController.updateQuizAttempt(VALID_ATTEMPT_ID, inputDTO);

        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        assertEquals(updatedDTO, response.getEntity());

        verify(quizAttemptService, times(1)).updateQuizAttempt(any(ObjectId.class), eq(inputDTO));
        verify(microsoftGraphService, times(1)).getUserByOid(anyString());
        verify(userService, times(1)).buildUserWithoutCoursesDTO(any(User.class));
    }

    @Test
    @DisplayName("Should submit quiz attempt and return submitted DTO")
    @TestSecurity(user = "student", roles = "STUDENT")
    void test16SubmitQuizAttempt_Success() {
        QuizAttemptDTO inputDTO = new QuizAttemptDTO();
        inputDTO.setQuizPublicationId(VALID_PUBLICATION_ID);
        inputDTO.setUser(new UserWithoutCoursesDTO(VALID_USER_AZURE_OID, "name", "email", Role.STUDENT));
        inputDTO.setBadges(Collections.emptyList());

        QuizAttemptDTO submittedDTO = new QuizAttemptDTO();
        submittedDTO.setQuizPublicationId(VALID_PUBLICATION_ID);
        submittedDTO.setUser(inputDTO.getUser());
        submittedDTO.setBadges(Collections.emptyList());

        when(quizAttemptService.submitQuizAttempt(any(ObjectId.class), eq(inputDTO))).thenReturn(submittedDTO);
        when(microsoftGraphService.getUserByOid(anyString())).thenReturn(new User());
        when(userService.buildUserWithoutCoursesDTO(any(User.class))).thenReturn(new UserWithoutCoursesDTO());

        Response response = quizAttemptController.submitQuizAttempt(VALID_ATTEMPT_ID, inputDTO);

        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        assertEquals(submittedDTO, response.getEntity());

        verify(quizAttemptService, times(1)).submitQuizAttempt(any(ObjectId.class), eq(inputDTO));
        verify(microsoftGraphService, times(1)).getUserByOid(anyString());
        verify(userService, times(1)).buildUserWithoutCoursesDTO(any(User.class));
    }


}
