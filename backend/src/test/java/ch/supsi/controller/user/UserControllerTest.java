package ch.supsi.controller.user;

import ch.supsi.model.api.user.Role;
import ch.supsi.model.api.user.User;
import ch.supsi.model.dto.api.PromotionRequestDTO;
import ch.supsi.model.dto.api.UserWithoutCoursesDTO;
import ch.supsi.service.user.IUserService;
import ch.supsi.service.user.microsoftGraph.IMicrosoftGraphService;
import io.quarkus.hibernate.validator.runtime.jaxrs.ResteasyReactiveViolationException;
import io.quarkus.test.InjectMock;
import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.security.TestSecurity;
import jakarta.inject.Inject;
import jakarta.ws.rs.BadRequestException;
import jakarta.ws.rs.ForbiddenException;
import jakarta.ws.rs.NotFoundException;
import jakarta.ws.rs.core.Response;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@QuarkusTest
@TestMethodOrder(MethodOrderer.MethodName.class)
public class UserControllerTest {
    private static final String TEST_OID = "test-oid-123";
    private static final String TEST_EMAIL = "user@example.com";
    private static final Role TEST_ROLE = Role.TEACHER;

    @Inject
    UserController userController;

    @InjectMock
    IUserService userService;

    @InjectMock
    IMicrosoftGraphService microsoftGraphService;

    @Test
    @DisplayName("Should get all teachers as admin")
    @TestSecurity(user = "admin", roles = "ADMIN")
    void test01GetTeachers_Success() {
        User teacher = new User();
        teacher.azureOid = TEST_OID;
        UserWithoutCoursesDTO dto = new UserWithoutCoursesDTO(TEST_OID, "Teacher", "teacher@example.com", Role.TEACHER);

        List<User> teacherList = List.of(teacher);

        when(this.userService.getTeachers()).thenReturn(teacherList);
        when(this.microsoftGraphService.getUserByOid(TEST_OID)).thenReturn(new com.microsoft.graph.models.User());
        when(this.userService.buildUserWithoutCoursesDTO(any(com.microsoft.graph.models.User.class))).thenReturn(dto);

        Response response = this.userController.getTeachers();

        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        assertEquals(teacherList.size(), ((List<?>) response.getEntity()).size());
        assertEquals(dto, ((List<?>) response.getEntity()).getFirst());

        verify(this.userService, times(1)).getTeachers();
        verify(this.microsoftGraphService, times(teacherList.size())).getUserByOid(anyString());
        verify(this.userService, times(teacherList.size())).buildUserWithoutCoursesDTO(any(com.microsoft.graph.models.User.class));
    }

    @Test
    @DisplayName("Should forbid non-admin users from getting teachers")
    @TestSecurity(user = "teacher", roles = "TEACHER")
    void test02GetTeachers_Forbidden() {
        assertThrows(
                io.quarkus.security.ForbiddenException.class,
                () -> this.userController.getTeachers()
        );
    }

    @Test
    @DisplayName("Should return empty teachers list")
    @TestSecurity(user = "admin", roles = "ADMIN")
    void test03GetTeachers_Empty() {
        when(this.userService.getTeachers()).thenReturn(List.of());

        Response response = this.userController.getTeachers();
        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        assertTrue(((List<?>) response.getEntity()).isEmpty());

        verify(this.userService, times(1)).getTeachers();
        verify(this.microsoftGraphService, never()).getUserByOid(anyString());
        verify(this.userService, never()).buildUserWithoutCoursesDTO(any(com.microsoft.graph.models.User.class));
    }

    @Test
    @DisplayName("Should promote user successfully")
    @TestSecurity(user = "admin", roles = "ADMIN")
    void test04PromoteUser_Success() {
        PromotionRequestDTO request = new PromotionRequestDTO(TEST_EMAIL, TEST_ROLE);

        when(this.microsoftGraphService.getUserByEmail(TEST_EMAIL)).thenReturn(new com.microsoft.graph.models.User());

        Response response = this.userController.promoteDemoteUser(request);

        assertEquals(Response.Status.NO_CONTENT.getStatusCode(), response.getStatus());

        verify(this.microsoftGraphService, times(1)).getUserByEmail(TEST_EMAIL);
        verify(this.userService, times(1)).changeRole(any(com.microsoft.graph.models.User.class), eq(TEST_ROLE));
    }

    @Test
    @DisplayName("Should throw 404 for non-existent user in promotion")
    @TestSecurity(user = "admin", roles = "ADMIN")
    void test05PromoteUser_NotFound() {
        PromotionRequestDTO request = new PromotionRequestDTO(TEST_EMAIL, TEST_ROLE);

        when(this.microsoftGraphService.getUserByEmail(TEST_EMAIL)).thenThrow(new NotFoundException());

        assertThrows(
                NotFoundException.class,
                () -> this.userController.promoteDemoteUser(request)
        );
    }

    @Test
    @DisplayName("Should throw 400 for invalid PromotionRole")
    @TestSecurity(user = "admin", roles = "ADMIN")
    void test06PromoteUser_InvalidPromotionRole() {
        PromotionRequestDTO promotionRequestDTORoleNull = new PromotionRequestDTO(TEST_EMAIL, null);
        PromotionRequestDTO promotionRequestDTOEmailNull = new PromotionRequestDTO(null, Role.STUDENT);
        PromotionRequestDTO promotionRequestDTOEmailBlank = new PromotionRequestDTO("", Role.TEACHER);
        PromotionRequestDTO promotionRequestDTOEmailInvalid = new PromotionRequestDTO("this is not an email", Role.STUDENT);

        assertAll(
                () -> assertThrows(
                        ResteasyReactiveViolationException.class,
                        () -> this.userController.promoteDemoteUser(promotionRequestDTORoleNull)
                ),
                () -> assertThrows(
                        ResteasyReactiveViolationException.class,
                        () -> this.userController.promoteDemoteUser(promotionRequestDTOEmailNull)
                ),
                () -> assertThrows(
                        ResteasyReactiveViolationException.class,
                        () -> this.userController.promoteDemoteUser(promotionRequestDTOEmailBlank)
                ),
                () -> assertThrows(
                        ResteasyReactiveViolationException.class,
                        () -> this.userController.promoteDemoteUser(promotionRequestDTOEmailInvalid)
                )
        );
    }

    @Test
    @DisplayName("Should forbid non-admin from promoting users")
    @TestSecurity(user = "teacher", roles = "TEACHER")
    void test07PromoteUser_Forbidden() {
        assertThrows(
                io.quarkus.security.ForbiddenException.class,
                () -> this.userController.promoteDemoteUser(new PromotionRequestDTO())
        );
    }

    @Test
    @DisplayName("Should get current user details")
    @TestSecurity(user = "user", roles = "TEACHER")
    void test08GetCurrentUser_Success() {
        UserWithoutCoursesDTO dto = new UserWithoutCoursesDTO(TEST_OID, "User", "user@example.com", Role.STUDENT);

        when(this.userService.getOidFromJWT()).thenReturn(TEST_OID);
        when(this.microsoftGraphService.getUserByOid(TEST_OID)).thenReturn(new com.microsoft.graph.models.User());
        when(this.userService.buildUserWithoutCoursesDTO(any(com.microsoft.graph.models.User.class))).thenReturn(dto);

        Response response = this.userController.getUser();

        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        assertEquals(dto, response.getEntity());

        verify(this.userService, times(1)).getOidFromJWT();
        verify(this.microsoftGraphService, times(1)).getUserByOid(TEST_OID);
        verify(this.userService, times(1)).buildUserWithoutCoursesDTO(any(com.microsoft.graph.models.User.class));
    }

    @Test
    @DisplayName("Should throw 404 for non-existent current user")
    @TestSecurity(user = "user", roles = "STUDENT")
    void test09GetCurrentUser_NotFound() {
        when(this.userService.getOidFromJWT()).thenReturn(TEST_OID);
        when(this.microsoftGraphService.getUserByOid(TEST_OID)).thenThrow(new NotFoundException());

        assertThrows(
                NotFoundException.class,
                () -> this.userController.getUser()
        );
    }

    @Test
    @DisplayName("Should forbid unauthenticated access to current user")
    @TestSecurity(user = "anonymous")
    void test10GetCurrentUser_Unauthorized() {
        assertThrows(
                io.quarkus.security.ForbiddenException.class,
                () -> this.userController.getUser()
        );
    }
}
