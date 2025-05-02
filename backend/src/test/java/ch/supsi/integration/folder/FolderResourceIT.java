package ch.supsi.integration.folder;

import ch.supsi.JWTProducer.JwtProducer;
import ch.supsi.model.api.Course;
import ch.supsi.model.api.Folder;
import ch.supsi.model.api.user.Role;
import ch.supsi.model.api.user.User;
import ch.supsi.model.dto.api.FolderDTO;
import ch.supsi.repository.CourseRepository;
import ch.supsi.repository.UserRepository;
import ch.supsi.testContainersResource.MongoTestResource;
import io.quarkus.test.common.QuarkusTestResource;
import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.security.TestSecurity;
import io.quarkus.test.security.jwt.Claim;
import io.quarkus.test.security.jwt.JwtSecurity;
import io.restassured.http.ContentType;
import jakarta.inject.Inject;
import jakarta.ws.rs.core.Response;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.*;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@QuarkusTest
@QuarkusTestResource(MongoTestResource.class)
@Tag("integration")
@TestMethodOrder(MethodOrderer.MethodName.class)
public class FolderResourceIT {
    private static Course course;
    @Inject
    CourseRepository courseRepository;
    @Inject
    UserRepository userRepository;

    @BeforeEach
    public void beforeEach() {
        User user = new User();
        user.azureOid = JwtProducer.DEFAULT_OID;
        user.role = Role.TEACHER;
        this.userRepository.persist(user);

        course = new Course("Test Course", "Test Course Description");
        this.courseRepository.persist(course);
        this.userRepository.addCourseToUser(course.id.toString(), user.azureOid);
    }

    @AfterEach
    public void afterEach() {
        this.userRepository.deleteAll();
        this.courseRepository.deleteAll();
    }

    @Test
    @DisplayName("Should return empty folder list")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    @JwtSecurity(
            claims = {
                    @Claim(key = JwtProducer.OID_CLAIM_KEY, value = JwtProducer.DEFAULT_OID),
                    @Claim(key = JwtProducer.NAME_CLAIM_KEY, value = JwtProducer.DEFAULT_NAME),
                    @Claim(key = JwtProducer.EMAIL_CLAIM_KEY, value = JwtProducer.DEFAULT_PREFERRED_USERNAME)
            })
    void test01GetFolders_Empty() {
        given()
                .pathParam("courseId", course.id.toString())
                .when()
                .get("/courses/{courseId}/folders")
                .then()
                .statusCode(Response.Status.OK.getStatusCode())
                .body("$", empty());
    }

    @Test
    @DisplayName("Should return folder list with two items")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    @JwtSecurity(
            claims = {
                    @Claim(key = JwtProducer.OID_CLAIM_KEY, value = JwtProducer.DEFAULT_OID),
                    @Claim(key = JwtProducer.NAME_CLAIM_KEY, value = JwtProducer.DEFAULT_NAME),
                    @Claim(key = JwtProducer.EMAIL_CLAIM_KEY, value = JwtProducer.DEFAULT_PREFERRED_USERNAME)
            })
    void test02GetFolders_WithData() {
        course.folders.add(new Folder("Folder 1"));
        course.folders.add(new Folder("Folder 2"));
        this.courseRepository.update(course);

        given()
                .pathParam("courseId", course.id.toString())
                .when()
                .get("/courses/{courseId}/folders")
                .then()
                .statusCode(Response.Status.OK.getStatusCode())
                .body("$", hasSize(2))
                .body("name", containsInAnyOrder("Folder 1", "Folder 2"));
    }

    @Test
    @DisplayName("Should return 200 ok Folder founded by id")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    @JwtSecurity(
            claims = {
                    @Claim(key = JwtProducer.OID_CLAIM_KEY, value = JwtProducer.DEFAULT_OID),
                    @Claim(key = JwtProducer.NAME_CLAIM_KEY, value = JwtProducer.DEFAULT_NAME),
                    @Claim(key = JwtProducer.EMAIL_CLAIM_KEY, value = JwtProducer.DEFAULT_PREFERRED_USERNAME)
            })
    void test03GetFolderById() {
        course.folders.add(new Folder("Folder 1"));
        course.folders.add(new Folder("Folder 2"));
        this.courseRepository.update(course);

        given()
                .pathParam("courseId", course.id.toString())
                .pathParam("folderId", course.folders.getFirst().id.toString())
                .when()
                .get("/courses/{courseId}/folders/{folderId}")
                .then()
                .statusCode(Response.Status.OK.getStatusCode())
                .body("name", equalTo("Folder 1"));
    }

    @Test
    @DisplayName("Should return 404 not found because folder is not founded by id")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    @JwtSecurity(
            claims = {
                    @Claim(key = JwtProducer.OID_CLAIM_KEY, value = JwtProducer.DEFAULT_OID),
                    @Claim(key = JwtProducer.NAME_CLAIM_KEY, value = JwtProducer.DEFAULT_NAME),
                    @Claim(key = JwtProducer.EMAIL_CLAIM_KEY, value = JwtProducer.DEFAULT_PREFERRED_USERNAME)
            })
    void test04GetFolderById_NotFound() {
        ObjectId nonExistingFolderId = new ObjectId();

        given()
                .pathParam("courseId", course.id.toString())
                .when()
                .get("/courses/{courseId}/folders/" + nonExistingFolderId)
                .then()
                .statusCode(Response.Status.NOT_FOUND.getStatusCode())
                .body("message", equalTo("Folder " + nonExistingFolderId + " not found"));
    }

    @Test
    @DisplayName("Should create new folder successfully")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    @JwtSecurity(
            claims = {
                    @Claim(key = JwtProducer.OID_CLAIM_KEY, value = JwtProducer.DEFAULT_OID),
                    @Claim(key = JwtProducer.NAME_CLAIM_KEY, value = JwtProducer.DEFAULT_NAME),
                    @Claim(key = JwtProducer.EMAIL_CLAIM_KEY, value = JwtProducer.DEFAULT_PREFERRED_USERNAME)
            })
    void test05CreateFolder_Success() {
        FolderDTO folderDTO = new FolderDTO("New Folder");

        given()
                .pathParam("courseId", course.id.toString())
                .contentType(ContentType.JSON)
                .body(folderDTO)
                .when()
                .post("/courses/{courseId}/folders")
                .then()
                .statusCode(Response.Status.CREATED.getStatusCode())
                .body("id", notNullValue())
                .body("name", equalTo("New Folder"));

        Course updatedCourse = this.courseRepository.findById(course.id);

        assertEquals(1, updatedCourse.folders.size());
        assertEquals("New Folder", updatedCourse.folders.getFirst().name);
    }

    @Test
    @DisplayName("Should return 400 for empty folder name")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    @JwtSecurity(
            claims = {
                    @Claim(key = JwtProducer.OID_CLAIM_KEY, value = JwtProducer.DEFAULT_OID),
                    @Claim(key = JwtProducer.NAME_CLAIM_KEY, value = JwtProducer.DEFAULT_NAME),
                    @Claim(key = JwtProducer.EMAIL_CLAIM_KEY, value = JwtProducer.DEFAULT_PREFERRED_USERNAME)
            })
    void test06CreateFolder_EmptyName() {
        FolderDTO folderDTO = new FolderDTO("");

        given()
                .pathParam("courseId", course.id.toString())
                .contentType(ContentType.JSON)
                .body(folderDTO)
                .when()
                .post("/courses/{courseId}/folders")
                .then()
                .statusCode(Response.Status.BAD_REQUEST.getStatusCode())
                .body("message", equalTo("Validation failed"));

        assertEquals(0, this.courseRepository.findById(course.id).folders.size());
    }

    @Test
    @DisplayName("Should return 400 for null folder name")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    @JwtSecurity(
            claims = {
                    @Claim(key = JwtProducer.OID_CLAIM_KEY, value = JwtProducer.DEFAULT_OID),
                    @Claim(key = JwtProducer.NAME_CLAIM_KEY, value = JwtProducer.DEFAULT_NAME),
                    @Claim(key = JwtProducer.EMAIL_CLAIM_KEY, value = JwtProducer.DEFAULT_PREFERRED_USERNAME)
            })
    void test07CreateFolder_NullName() {
        FolderDTO folderDTO = new FolderDTO(null);

        given()
                .pathParam("courseId", course.id.toString())
                .contentType(ContentType.JSON)
                .body(folderDTO)
                .when()
                .post("/courses/{courseId}/folders")
                .then()
                .statusCode(Response.Status.BAD_REQUEST.getStatusCode())
                .body("message", equalTo("Validation failed"));

        assertEquals(0, this.courseRepository.findById(course.id).folders.size());
    }

    @Test
    @DisplayName("Should return 400 for duplicate folder name")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    @JwtSecurity(
            claims = {
                    @Claim(key = JwtProducer.OID_CLAIM_KEY, value = JwtProducer.DEFAULT_OID),
                    @Claim(key = JwtProducer.NAME_CLAIM_KEY, value = JwtProducer.DEFAULT_NAME),
                    @Claim(key = JwtProducer.EMAIL_CLAIM_KEY, value = JwtProducer.DEFAULT_PREFERRED_USERNAME)
            })
    void test08CreateFolder_DuplicateName() {
        course.folders.add(new Folder("Existing Folder"));
        this.courseRepository.update(course);

        FolderDTO folderDTO = new FolderDTO("Existing Folder");

        given()
                .pathParam("courseId", course.id.toString())
                .contentType(ContentType.JSON)
                .body(folderDTO)
                .when()
                .post("/courses/{courseId}/folders")
                .then()
                .statusCode(Response.Status.BAD_REQUEST.getStatusCode())
                .body("message", containsString("Folder name " + folderDTO.getName() + " already exists in this course"));

        assertEquals(1, this.courseRepository.findById(course.id).folders.size());
    }

    @Test
    @DisplayName("Should update folder successfully")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    @JwtSecurity(
            claims = {
                    @Claim(key = JwtProducer.OID_CLAIM_KEY, value = JwtProducer.DEFAULT_OID),
                    @Claim(key = JwtProducer.NAME_CLAIM_KEY, value = JwtProducer.DEFAULT_NAME),
                    @Claim(key = JwtProducer.EMAIL_CLAIM_KEY, value = JwtProducer.DEFAULT_PREFERRED_USERNAME)
            })
    void test09UpdateFolder_Success() {
        Folder folder = new Folder("Old Name");
        course.folders.add(folder);
        this.courseRepository.update(course);

        FolderDTO updateDTO = new FolderDTO("New Name");

        given()
                .pathParam("courseId", course.id.toString())
                .pathParam("folderId", folder.id.toString())
                .contentType(ContentType.JSON)
                .body(updateDTO)
                .when()
                .put("/courses/{courseId}/folders/{folderId}")
                .then()
                .statusCode(Response.Status.OK.getStatusCode())
                .body("name", equalTo("New Name"));

        Course updatedCourse = this.courseRepository.findById(course.id);

        assertEquals("New Name", updatedCourse.folders.getFirst().name);
    }

    @Test
    @DisplayName("Should return 404 for non-existent folder")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    @JwtSecurity(
            claims = {
                    @Claim(key = JwtProducer.OID_CLAIM_KEY, value = JwtProducer.DEFAULT_OID),
                    @Claim(key = JwtProducer.NAME_CLAIM_KEY, value = JwtProducer.DEFAULT_NAME),
                    @Claim(key = JwtProducer.EMAIL_CLAIM_KEY, value = JwtProducer.DEFAULT_PREFERRED_USERNAME)
            })
    void test10UpdateFolder_NotFound() {
        ObjectId nonExistingFolderId = new ObjectId();
        FolderDTO updateDTO = new FolderDTO("New Name");

        given()
                .pathParam("courseId", course.id.toString())
                .pathParam("folderId", nonExistingFolderId.toString())
                .contentType(ContentType.JSON)
                .body(updateDTO)
                .when()
                .put("/courses/{courseId}/folders/{folderId}")
                .then()
                .statusCode(Response.Status.NOT_FOUND.getStatusCode())
                .body("message", equalTo("Folder " + nonExistingFolderId + " not found"));
    }

    @Test
    @DisplayName("Should return 400 because folder dto has empty name")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    @JwtSecurity(
            claims = {
                    @Claim(key = JwtProducer.OID_CLAIM_KEY, value = JwtProducer.DEFAULT_OID),
                    @Claim(key = JwtProducer.NAME_CLAIM_KEY, value = JwtProducer.DEFAULT_NAME),
                    @Claim(key = JwtProducer.EMAIL_CLAIM_KEY, value = JwtProducer.DEFAULT_PREFERRED_USERNAME)
            })
    void test11UpdateFolder_EmptyName() {
        course.folders.add(new Folder("New Name"));
        this.courseRepository.update(course);
        FolderDTO updateDTO = new FolderDTO("");

        given()
                .pathParam("courseId", course.id.toString())
                .pathParam("folderId", course.folders.getFirst().id.toString())
                .contentType(ContentType.JSON)
                .body(updateDTO)
                .when()
                .put("/courses/{courseId}/folders/{folderId}")
                .then()
                .statusCode(Response.Status.BAD_REQUEST.getStatusCode())
                .body("message", equalTo("Validation failed"));
    }

    @Test
    @DisplayName("Should return 400 because folder dto has null name")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    @JwtSecurity(
            claims = {
                    @Claim(key = JwtProducer.OID_CLAIM_KEY, value = JwtProducer.DEFAULT_OID),
                    @Claim(key = JwtProducer.NAME_CLAIM_KEY, value = JwtProducer.DEFAULT_NAME),
                    @Claim(key = JwtProducer.EMAIL_CLAIM_KEY, value = JwtProducer.DEFAULT_PREFERRED_USERNAME)
            })
    void test12UpdateFolder_NullName() {
        course.folders.add(new Folder("New Name"));
        this.courseRepository.update(course);
        FolderDTO updateDTO = new FolderDTO(null);

        given()
                .pathParam("courseId", course.id.toString())
                .pathParam("folderId", course.folders.getFirst().id.toString())
                .contentType(ContentType.JSON)
                .body(updateDTO)
                .when()
                .put("/courses/{courseId}/folders/{folderId}")
                .then()
                .statusCode(Response.Status.BAD_REQUEST.getStatusCode())
                .body("message", equalTo("Validation failed"));
    }

    @Test
    @DisplayName("Should delete folder successfully")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    @JwtSecurity(
            claims = {
                    @Claim(key = JwtProducer.OID_CLAIM_KEY, value = JwtProducer.DEFAULT_OID),
                    @Claim(key = JwtProducer.NAME_CLAIM_KEY, value = JwtProducer.DEFAULT_NAME),
                    @Claim(key = JwtProducer.EMAIL_CLAIM_KEY, value = JwtProducer.DEFAULT_PREFERRED_USERNAME)
            })
    void test13DeleteFolder_Success() {
        Folder folder = new Folder("To Delete");
        course.folders.add(folder);
        this.courseRepository.update(course);

        given()
                .pathParam("courseId", course.id.toString())
                .pathParam("folderId", folder.id.toString())
                .when()
                .delete("/courses/{courseId}/folders/{folderId}")
                .then()
                .statusCode(Response.Status.NO_CONTENT.getStatusCode());

        Course updatedCourse = this.courseRepository.findById(course.id);
        assertTrue(updatedCourse.folders.isEmpty());
    }

    @Test
    @DisplayName("Should return 404 when deleting non-existent folder")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    @JwtSecurity(
            claims = {
                    @Claim(key = JwtProducer.OID_CLAIM_KEY, value = JwtProducer.DEFAULT_OID),
                    @Claim(key = JwtProducer.NAME_CLAIM_KEY, value = JwtProducer.DEFAULT_NAME),
                    @Claim(key = JwtProducer.EMAIL_CLAIM_KEY, value = JwtProducer.DEFAULT_PREFERRED_USERNAME)
            })
    void test14DeleteFolder_NotFound() {
        ObjectId nonExistingFolderId = new ObjectId();

        given()
                .pathParam("courseId", course.id.toString())
                .pathParam("folderId", nonExistingFolderId.toString())
                .when()
                .delete("/courses/{courseId}/folders/{folderId}")
                .then()
                .statusCode(Response.Status.NOT_FOUND.getStatusCode())
                .body("message", equalTo("Folder " + nonExistingFolderId + " not found"));
    }

    @Test
    @DisplayName("Should return 404 for non-existent course")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    @JwtSecurity(
            claims = {
                    @Claim(key = JwtProducer.OID_CLAIM_KEY, value = JwtProducer.DEFAULT_OID),
                    @Claim(key = JwtProducer.NAME_CLAIM_KEY, value = JwtProducer.DEFAULT_NAME),
                    @Claim(key = JwtProducer.EMAIL_CLAIM_KEY, value = JwtProducer.DEFAULT_PREFERRED_USERNAME)
            })
    void test15CourseNotFound() {
        ObjectId invalidCourseId = new ObjectId();
        given()
                .pathParam("courseId", invalidCourseId.toString())
                .when()
                .get("/courses/{courseId}/folders")
                .then()
                .statusCode(Response.Status.NOT_FOUND.getStatusCode());
    }
}