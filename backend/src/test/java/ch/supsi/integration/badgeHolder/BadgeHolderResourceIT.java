package ch.supsi.integration.badgeHolder;

import ch.supsi.JWTProducer.JwtProducer;
import ch.supsi.model.api.BadgeHolder;
import ch.supsi.model.api.badge.Badge;
import ch.supsi.model.api.badge.BadgeType;
import ch.supsi.model.api.user.Role;
import ch.supsi.model.api.user.User;
import ch.supsi.model.dto.api.BadgeDTO;
import ch.supsi.model.dto.api.UserWithoutCoursesDTO;
import ch.supsi.repository.BadgeHolderRepository;
import ch.supsi.repository.UserRepository;
import ch.supsi.service.user.microsoftGraph.IMicrosoftGraphService;
import ch.supsi.testContainersResource.MongoTestResource;
import io.quarkus.test.InjectMock;
import io.quarkus.test.common.QuarkusTestResource;
import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.security.TestSecurity;
import io.quarkus.test.security.jwt.JwtSecurity;
import jakarta.inject.Inject;
import jakarta.ws.rs.core.Response;
import org.junit.jupiter.api.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@QuarkusTest
@QuarkusTestResource(MongoTestResource.class)
@Tag("integration")
@TestMethodOrder(MethodOrderer.MethodName.class)
public class BadgeHolderResourceIT {
    @Inject
    BadgeHolderRepository badgeHolderRepository;

    @Inject
    UserRepository userRepository;

    @InjectMock
    IMicrosoftGraphService microsoftGraphService;

    @BeforeEach
    @AfterEach
    public void cleanUp() {
        this.badgeHolderRepository.deleteAll();
        this.userRepository.deleteAll();
    }

    @Test
    @DisplayName("Get all badge holders - empty list")
    @TestSecurity(user = "teacher", roles = "TEACHER")
    void test01GetAllBadgeHolders_Empty() {
        given()
                .when()
                .get("/badge-holders")
                .then()
                .statusCode(Response.Status.OK.getStatusCode())
                .body("$", empty());

        verifyNoInteractions(this.microsoftGraphService);
    }

    @Test
    @DisplayName("Get all badge holders with data")
    @TestSecurity(user = "teacher", roles = "TEACHER")
    void test02GetAllBadgeHolders_Success() {
        com.microsoft.graph.models.User mockTeacherUser = createMockMicrosoftUser();
        com.microsoft.graph.models.User mockStudentUser = createMockMicrosoftUser("Student oid", "student name", "student email");

        User teacher = new User();
        teacher.azureOid = mockTeacherUser.id;
        teacher.role = Role.TEACHER;
        this.userRepository.persist(teacher);

        BadgeHolder holder = new BadgeHolder(mockStudentUser.id);
        holder.badges = List.of(new Badge(BadgeType.BEST_ATTEMPT, teacher.azureOid));
        this.badgeHolderRepository.persist(holder);

        when(this.microsoftGraphService.getUserByOid(teacher.azureOid)).thenReturn(mockTeacherUser);
        when(this.microsoftGraphService.getUserByOid(mockStudentUser.id)).thenReturn(mockStudentUser);

        given()
                .when()
                .get("/badge-holders")
                .then()
                .statusCode(Response.Status.OK.getStatusCode())
                .body("$", hasSize(1))
                .body("[0].user.azureOid", equalTo(mockStudentUser.id))
                .body("[0].badges", hasSize(1))
                .body("[0].badges[0].type", equalTo(BadgeType.BEST_ATTEMPT.name()))
                .body("[0].badges[0].assignedBy.azureOid", equalTo(teacher.azureOid));

        verify(this.microsoftGraphService, times(2)).getUserByOid(anyString());
    }

    @Test
    @DisplayName("Get badge holder by Azure OID - found")
    @TestSecurity(user = "teacher", roles = "TEACHER")
    void test03GetBadgeHolderByOid_Found() {
        com.microsoft.graph.models.User mockTeacherUser = createMockMicrosoftUser();
        com.microsoft.graph.models.User mockStudentUser = createMockMicrosoftUser("Student oid", "student name", "student email");

        User teacher = new User();
        teacher.azureOid = mockTeacherUser.id;
        teacher.role = Role.TEACHER;
        this.userRepository.persist(teacher);

        when(this.microsoftGraphService.getUserByOid(teacher.azureOid)).thenReturn(mockTeacherUser);
        when(this.microsoftGraphService.getUserByOid(mockStudentUser.id)).thenReturn(mockStudentUser);

        BadgeHolder holder = new BadgeHolder(mockStudentUser.id);
        holder.badges = List.of(new Badge(BadgeType.BEST_ATTEMPT, teacher.azureOid));
        this.badgeHolderRepository.persist(holder);

        given()
                .pathParam("azureOID", mockStudentUser.id)
                .when()
                .get("/badge-holders/{azureOID}")
                .then()
                .statusCode(Response.Status.OK.getStatusCode())
                .body("user.azureOid", equalTo(mockStudentUser.id))
                .body("badges", hasSize(1));

        verify(this.microsoftGraphService, times(2)).getUserByOid(anyString());
    }

    @Test
    @DisplayName("Get badge holder by Azure OID - not found")
    @TestSecurity(user = "teacher", roles = "TEACHER")
    void test04GetBadgeHolderByOid_NotFound() {
        String nonExistingAzureOid = "non-existent-oid";

        given()
                .pathParam("azureOID", nonExistingAzureOid)
                .when()
                .get("/badge-holders/{azureOID}")
                .then()
                .statusCode(Response.Status.NOT_FOUND.getStatusCode())
                .body("message", equalTo("Badge holder with Azure OID " + nonExistingAzureOid + " not found"));

        verifyNoInteractions(this.microsoftGraphService);
    }

    @Test
    @DisplayName("Assign badge to holder - new holder")
    @TestSecurity(user = "teacher", roles = "TEACHER")
    void test05AssignBadge_NewHolder() {
        com.microsoft.graph.models.User mockTeacherUser = createMockMicrosoftUser();
        com.microsoft.graph.models.User mockStudentUser = createMockMicrosoftUser("Student oid", "student name", "student email");

        User teacher = new User();
        teacher.azureOid = mockTeacherUser.id;
        teacher.role = Role.TEACHER;
        this.userRepository.persist(teacher);

        when(this.microsoftGraphService.getUserByOid(teacher.azureOid)).thenReturn(mockTeacherUser);
        when(this.microsoftGraphService.getUserByOid(mockStudentUser.id)).thenReturn(mockStudentUser);

        UserWithoutCoursesDTO teacherDTO = new UserWithoutCoursesDTO();
        teacherDTO.setAzureOid(teacher.azureOid);

        BadgeDTO badgeDTO = new BadgeDTO();
        badgeDTO.setType(BadgeType.BEST_ATTEMPT);
        badgeDTO.setAssignedBy(teacherDTO);
        badgeDTO.setAssignedAt(LocalDateTime.now());

        given()
                .pathParam("azureOID", mockStudentUser.id)
                .contentType("application/json")
                .body(badgeDTO)
                .when()
                .post("/badge-holders/{azureOID}/badges")
                .then()
                .statusCode(Response.Status.NO_CONTENT.getStatusCode());

        BadgeHolder updatedHolder = this.badgeHolderRepository.findByAzureOIDOptional(mockStudentUser.id).orElseThrow();
        assertEquals(1, updatedHolder.badges.size());
        assertEquals(BadgeType.BEST_ATTEMPT, updatedHolder.badges.getFirst().type);
        assertEquals(teacher.azureOid, updatedHolder.badges.getFirst().assignedBy);
    }

    @Test
    @DisplayName("Assign badge to holder - existing holder")
    @TestSecurity(user = "teacher", roles = "TEACHER")
    void test06AssignBadge_ExistingHolder() {
        com.microsoft.graph.models.User mockTeacherUser = createMockMicrosoftUser();
        com.microsoft.graph.models.User mockStudentUser = createMockMicrosoftUser("Student oid", "student name", "student email");

        User teacher = new User();
        teacher.azureOid = mockTeacherUser.id;
        teacher.role = Role.TEACHER;
        this.userRepository.persist(teacher);

        BadgeHolder holder = new BadgeHolder(mockStudentUser.id);
        holder.badges = new ArrayList<>();
        holder.badges.add(new Badge(BadgeType.BEST_ATTEMPT, teacher.azureOid));
        this.badgeHolderRepository.persist(holder);

        when(this.microsoftGraphService.getUserByOid(teacher.azureOid)).thenReturn(mockTeacherUser);
        when(this.microsoftGraphService.getUserByOid(mockStudentUser.id)).thenReturn(mockStudentUser);

        UserWithoutCoursesDTO teacherDTO = new UserWithoutCoursesDTO();
        teacherDTO.setAzureOid(teacher.azureOid);

        BadgeDTO badgeDTO = new BadgeDTO();
        badgeDTO.setType(BadgeType.BEST_ATTEMPT);
        badgeDTO.setAssignedBy(teacherDTO);
        badgeDTO.setAssignedAt(LocalDateTime.now());

        given()
                .pathParam("azureOID", mockStudentUser.id)
                .contentType("application/json")
                .body(badgeDTO)
                .when()
                .post("/badge-holders/{azureOID}/badges")
                .then()
                .statusCode(Response.Status.NO_CONTENT.getStatusCode());

        BadgeHolder updatedHolder = this.badgeHolderRepository.findByAzureOIDOptional(mockStudentUser.id).orElseThrow();
        assertEquals(2, updatedHolder.badges.size());
    }

    @Test
    @DisplayName("Assign badge with invalid data - assignedBy user is null")
    @TestSecurity(user = "teacher", roles = "TEACHER")
    void test07AssignBadge_InvalidData_AssignedByIsNull() {
        BadgeDTO invalidBadge = new BadgeDTO();
        invalidBadge.setAssignedBy(null);

        given()
                .pathParam("azureOID", JwtProducer.DEFAULT_OID)
                .contentType("application/json")
                .body(invalidBadge)
                .when()
                .post("/badge-holders/{azureOID}/badges")
                .then()
                .statusCode(Response.Status.BAD_REQUEST.getStatusCode())
                .body("message", equalTo("Validation failed"));
    }

    private com.microsoft.graph.models.User createMockMicrosoftUser() {
        com.microsoft.graph.models.User user = new com.microsoft.graph.models.User();
        user.id = JwtProducer.DEFAULT_OID;
        user.displayName = JwtProducer.DEFAULT_NAME;
        user.userPrincipalName = JwtProducer.DEFAULT_PREFERRED_USERNAME;
        return user;
    }

    private com.microsoft.graph.models.User createMockMicrosoftUser(String oid, String name, String email) {
        com.microsoft.graph.models.User user = new com.microsoft.graph.models.User();
        user.id = oid;
        user.displayName = name;
        user.userPrincipalName = email;
        return user;
    }
}
