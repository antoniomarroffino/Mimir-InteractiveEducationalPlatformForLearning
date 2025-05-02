package ch.supsi.integration.user;

import ch.supsi.JWTProducer.JwtProducer;
import ch.supsi.model.api.user.Role;
import ch.supsi.model.api.user.User;
import ch.supsi.model.dto.api.PromotionRequestDTO;
import ch.supsi.repository.UserRepository;
import ch.supsi.service.user.microsoftGraph.IMicrosoftGraphService;
import ch.supsi.testContainersResource.MongoTestResource;
import io.quarkus.test.InjectMock;
import io.quarkus.test.common.QuarkusTestResource;
import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.security.TestSecurity;
import io.quarkus.test.security.jwt.Claim;
import io.quarkus.test.security.jwt.JwtSecurity;
import jakarta.inject.Inject;
import jakarta.ws.rs.core.Response;
import org.junit.jupiter.api.*;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@QuarkusTest
@QuarkusTestResource(MongoTestResource.class)
@Tag("integration")
@TestMethodOrder(MethodOrderer.MethodName.class)
public class UserResourceIT {
    @Inject
    UserRepository userRepository;

    @InjectMock
    IMicrosoftGraphService microsoftGraphService;

    @BeforeEach
    @AfterEach
    public void cleanUp() {
        this.userRepository.deleteAll();
    }

    @Test
    @DisplayName("Should return teacher list")
    @TestSecurity(user = "admin", roles = "ADMIN")
    void test01GetTeachers_EmptyList() {
        given()
                .when()
                .get("/users/teachers")
                .then()
                .statusCode(Response.Status.OK.getStatusCode())
                .body("$", empty());

        verifyNoInteractions(this.microsoftGraphService);
    }

    @Test
    @DisplayName("Should return teacher list")
    @TestSecurity(user = "admin", roles = "ADMIN")
    void test02GetTeachers_Success() {
        com.microsoft.graph.models.User mockMicrosoftUser = createMockMicrosoftUser();

        when(this.microsoftGraphService.getUserByOid(anyString())).thenReturn(mockMicrosoftUser);

        User teacher = new User();
        teacher.azureOid = mockMicrosoftUser.id;
        teacher.role = Role.TEACHER;

        this.userRepository.persist(teacher);

        given()
                .when()
                .get("/users/teachers")
                .then()
                .statusCode(Response.Status.OK.getStatusCode())
                .body("$", hasSize(1))
                .body("[0].role", equalTo(Role.TEACHER.name()));

        verify(this.microsoftGraphService, times(1)).getUserByOid(anyString());
    }

    @Test
    @DisplayName("Should promote user from Student to Teacher")
    @TestSecurity(user = "admin", roles = "ADMIN")
    void test03PromoteDemoteUser_Success_StudentToTeacher() {
        com.microsoft.graph.models.User mockUser = createMockMicrosoftUser();

        when(this.microsoftGraphService.getUserByEmail(JwtProducer.DEFAULT_PREFERRED_USERNAME)).thenReturn(mockUser);

        PromotionRequestDTO request = new PromotionRequestDTO();
        request.setEmail(JwtProducer.DEFAULT_PREFERRED_USERNAME);
        request.setRole(Role.TEACHER);

        given()
                .contentType("application/json")
                .body(request)
                .when()
                .put("/users/promote")
                .then()
                .statusCode(Response.Status.NO_CONTENT.getStatusCode());

        verify(this.microsoftGraphService, times(1)).getUserByEmail(JwtProducer.DEFAULT_PREFERRED_USERNAME);

        assertEquals(1, this.userRepository.findTeacherUsers().size());
    }

    @Test
    @DisplayName("Should demote user from Teacher to Student")
    @TestSecurity(user = "admin", roles = "ADMIN")
    void test04PromoteDemoteUser_Success_TeacherToStudent() {
        com.microsoft.graph.models.User mockUser = createMockMicrosoftUser();

        User user = new User();
        user.azureOid = mockUser.id;
        user.role = Role.TEACHER;
        this.userRepository.persist(user);

        when(this.microsoftGraphService.getUserByEmail(JwtProducer.DEFAULT_PREFERRED_USERNAME)).thenReturn(mockUser);

        PromotionRequestDTO request = new PromotionRequestDTO();
        request.setEmail(JwtProducer.DEFAULT_PREFERRED_USERNAME);
        request.setRole(Role.STUDENT);

        given()
                .contentType("application/json")
                .body(request)
                .when()
                .put("/users/promote")
                .then()
                .statusCode(Response.Status.NO_CONTENT.getStatusCode());

        verify(this.microsoftGraphService, times(1)).getUserByEmail(JwtProducer.DEFAULT_PREFERRED_USERNAME);

        assertTrue(this.userRepository.findTeacherUsers().isEmpty());
    }

    @Test
    @DisplayName("Should demote user to Admin")
    @TestSecurity(user = "admin", roles = "ADMIN")
    void test05PromoteDemoteUser_Forbidden_UserToAdmin() {
        com.microsoft.graph.models.User mockUser = createMockMicrosoftUser();

        User user = new User();
        user.azureOid = mockUser.id;
        user.role = Role.TEACHER;
        this.userRepository.persist(user);

        when(this.microsoftGraphService.getUserByEmail(JwtProducer.DEFAULT_PREFERRED_USERNAME)).thenReturn(mockUser);

        PromotionRequestDTO request = new PromotionRequestDTO();
        request.setEmail(JwtProducer.DEFAULT_PREFERRED_USERNAME);
        request.setRole(Role.ADMIN);

        given()
                .contentType("application/json")
                .body(request)
                .when()
                .put("/users/promote")
                .then()
                .statusCode(Response.Status.FORBIDDEN.getStatusCode())
                .body("message", equalTo("Cannot change role to admin"));

        verify(this.microsoftGraphService, times(1)).getUserByEmail(JwtProducer.DEFAULT_PREFERRED_USERNAME);

        assertEquals(1, this.userRepository.findTeacherUsers().size());
    }

    @Test
    @DisplayName("Should return 400 bad request because promotion request dto has null role")
    @TestSecurity(user = "admin", roles = "ADMIN")
    void test06PromoteDemoteUser_ValidationFailed_RoleIsNull() {
        PromotionRequestDTO request = new PromotionRequestDTO();
        request.setEmail(JwtProducer.DEFAULT_PREFERRED_USERNAME);
        request.setRole(null);

        given()
                .contentType("application/json")
                .body(request)
                .when()
                .put("/users/promote")
                .then()
                .statusCode(Response.Status.BAD_REQUEST.getStatusCode())
                .body("message", equalTo("Validation failed"));

        verifyNoInteractions(this.microsoftGraphService);
    }

    @Test
    @DisplayName("Should return 400 bad request because promotion request dto has null email")
    @TestSecurity(user = "admin", roles = "ADMIN")
    void test07PromoteDemoteUser_ValidationFailed_EmailIsNull() {
        PromotionRequestDTO request = new PromotionRequestDTO();
        request.setEmail(null);
        request.setRole(Role.STUDENT);

        given()
                .contentType("application/json")
                .body(request)
                .when()
                .put("/users/promote")
                .then()
                .statusCode(Response.Status.BAD_REQUEST.getStatusCode())
                .body("message", equalTo("Validation failed"));

        verifyNoInteractions(this.microsoftGraphService);
    }

    @Test
    @DisplayName("Should return 400 bad request because promotion request dto has empty email")
    @TestSecurity(user = "admin", roles = "ADMIN")
    void test08PromoteDemoteUser_ValidationFailed_EmailIsEmpty() {
        PromotionRequestDTO request = new PromotionRequestDTO();
        request.setEmail("");
        request.setRole(Role.STUDENT);

        given()
                .contentType("application/json")
                .body(request)
                .when()
                .put("/users/promote")
                .then()
                .statusCode(Response.Status.BAD_REQUEST.getStatusCode())
                .body("message", equalTo("Validation failed"));

        verifyNoInteractions(this.microsoftGraphService);
    }

    @Test
    @DisplayName("Should return 400 bad request because promotion request dto has non valid email")
    @TestSecurity(user = "admin", roles = "ADMIN")
    void test09PromoteDemoteUser_ValidationFailed_EmailIsInvalid() {
        PromotionRequestDTO request = new PromotionRequestDTO();
        request.setEmail("thats not a correct email");
        request.setRole(Role.STUDENT);

        given()
                .contentType("application/json")
                .body(request)
                .when()
                .put("/users/promote")
                .then()
                .statusCode(Response.Status.BAD_REQUEST.getStatusCode())
                .body("message", equalTo("Validation failed"));

        verifyNoInteractions(this.microsoftGraphService);
    }

    @Test
    @DisplayName("Should return logged user is student")
    @TestSecurity(user = "user", roles = "STUDENT")
    @JwtSecurity(
            claims = {
                    @Claim(key = JwtProducer.OID_CLAIM_KEY, value = JwtProducer.DEFAULT_OID),
                    @Claim(key = JwtProducer.NAME_CLAIM_KEY, value = JwtProducer.DEFAULT_NAME),
                    @Claim(key = JwtProducer.EMAIL_CLAIM_KEY, value = JwtProducer.DEFAULT_PREFERRED_USERNAME)
            })
    void test10GetUserMe_Success_Student() {
        com.microsoft.graph.models.User mockUser = createMockMicrosoftUser();
        when(this.microsoftGraphService.getUserByOid(JwtProducer.DEFAULT_OID)).thenReturn(mockUser);

        given()
                .when()
                .get("/users/me")
                .then()
                .statusCode(Response.Status.OK.getStatusCode())
                .body("azureOid", equalTo(JwtProducer.DEFAULT_OID))
                .body("name", equalTo(JwtProducer.DEFAULT_NAME))
                .body("email", equalTo(JwtProducer.DEFAULT_PREFERRED_USERNAME))
                .body("role", equalTo(Role.STUDENT.name()));


        verify(this.microsoftGraphService, times(1)).getUserByOid(JwtProducer.DEFAULT_OID);
    }

    @Test
    @DisplayName("Should return logged user is teacher")
    @TestSecurity(user = "user", roles = "TEACHER")
    @JwtSecurity(
            claims = {
                    @Claim(key = JwtProducer.OID_CLAIM_KEY, value = JwtProducer.DEFAULT_OID),
                    @Claim(key = JwtProducer.NAME_CLAIM_KEY, value = JwtProducer.DEFAULT_NAME),
                    @Claim(key = JwtProducer.EMAIL_CLAIM_KEY, value = JwtProducer.DEFAULT_PREFERRED_USERNAME)
            })
    void test11GetUserMe_Success_Teacher() {
        com.microsoft.graph.models.User mockUser = createMockMicrosoftUser();

        User user = new User();
        user.azureOid = mockUser.id;
        user.role = Role.TEACHER;

        this.userRepository.persist(user);

        when(this.microsoftGraphService.getUserByOid(JwtProducer.DEFAULT_OID)).thenReturn(mockUser);

        given()
                .when()
                .get("/users/me")
                .then()
                .statusCode(Response.Status.OK.getStatusCode())
                .body("azureOid", equalTo(JwtProducer.DEFAULT_OID))
                .body("name", equalTo(JwtProducer.DEFAULT_NAME))
                .body("email", equalTo(JwtProducer.DEFAULT_PREFERRED_USERNAME))
                .body("role", equalTo(Role.TEACHER.name()));

        verify(this.microsoftGraphService, times(1)).getUserByOid(JwtProducer.DEFAULT_OID);
    }

    @Test
    @DisplayName("Should return logged user is admin")
    @TestSecurity(user = "user", roles = "ADMIN")
    @JwtSecurity(
            claims = {
                    @Claim(key = JwtProducer.OID_CLAIM_KEY, value = JwtProducer.DEFAULT_OID),
                    @Claim(key = JwtProducer.NAME_CLAIM_KEY, value = JwtProducer.DEFAULT_NAME),
                    @Claim(key = JwtProducer.EMAIL_CLAIM_KEY, value = JwtProducer.DEFAULT_PREFERRED_USERNAME)
            })
    void test12GetUserMe_Success_Admin() {
        com.microsoft.graph.models.User mockUser = createMockMicrosoftUser();

        User user = new User();
        user.azureOid = mockUser.id;
        user.role = Role.ADMIN;

        this.userRepository.persist(user);

        when(this.microsoftGraphService.getUserByOid(JwtProducer.DEFAULT_OID)).thenReturn(mockUser);

        given()
                .when()
                .get("/users/me")
                .then()
                .statusCode(Response.Status.OK.getStatusCode())
                .body("azureOid", equalTo(JwtProducer.DEFAULT_OID))
                .body("name", equalTo(JwtProducer.DEFAULT_NAME))
                .body("email", equalTo(JwtProducer.DEFAULT_PREFERRED_USERNAME))
                .body("role", equalTo(Role.ADMIN.name()));

        verify(this.microsoftGraphService, times(1)).getUserByOid(JwtProducer.DEFAULT_OID);
    }


    private com.microsoft.graph.models.User createMockMicrosoftUser() {
        com.microsoft.graph.models.User user = new com.microsoft.graph.models.User();
        user.id = JwtProducer.DEFAULT_OID;
        user.displayName = JwtProducer.DEFAULT_NAME;
        user.userPrincipalName = JwtProducer.DEFAULT_PREFERRED_USERNAME;
        return user;
    }
}
