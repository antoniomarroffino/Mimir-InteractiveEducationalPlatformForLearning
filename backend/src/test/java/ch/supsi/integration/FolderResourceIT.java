package ch.supsi.integration;

import ch.supsi.model.api.Course;
import ch.supsi.model.api.Folder;
import ch.supsi.repository.CourseRepository;
import ch.supsi.service.testContainersResource.MongoTestResource;
import io.quarkus.test.common.QuarkusTestResource;
import io.quarkus.test.junit.QuarkusTest;
import io.restassured.http.ContentType;
import jakarta.inject.Inject;
import jakarta.ws.rs.core.Response;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.*;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;

@QuarkusTest
@QuarkusTestResource(MongoTestResource.class)
@Tag("integration")
public class FolderResourceIT {
    /*

    @Inject
    CourseRepository courseRepository;

    private Course testCourse;
    private ObjectId courseId;

    @BeforeEach
    void setup() {
        testCourse = new Course("Test Course");
        courseRepository.persist(testCourse);
        courseId = testCourse.getId();
    }

    @AfterEach
    void cleanup() {
        courseRepository.deleteAll();
    }

    @Test
    @DisplayName("Should return Response 200 (ok) with empty folders list")
    void testGetFolders_Empty() {
        given()
                .when().get("/courses/" + courseId + "/folders")
                .then()
                .statusCode(Response.Status.OK.getStatusCode())
                .body("$", empty());
    }

    @Test
    @DisplayName("Should return Response 200 (ok) with two folders in list")
    void testGetFolders() {
        String folderName1 = "Test Folder1";
        String folderName2 = "Test Folder2";

        testCourse.getFolders().add(new Folder(folderName1));
        testCourse.getFolders().add(new Folder(folderName2));
        courseRepository.update(testCourse);

        given()
                .when().get("/courses/" + courseId + "/folders")
                .then()
                .statusCode(Response.Status.OK.getStatusCode())
                .body("$", hasSize(2))
                .body("[0].id", notNullValue())
                .body("[0].name", equalTo(folderName1))
                .body("[1].id", notNullValue())
                .body("[1].name", equalTo(folderName2));
    }

    @Test
    @DisplayName("Should return Response 201 (created) when creating a folder")
    void testCreateFolder() {
        String folderName = "Test Folder";
        Folder folder = new Folder(folderName);

        given()
                .contentType(ContentType.JSON)
                .body(folder)
                .when()
                .post("/courses/" + courseId + "/folders")
                .then()
                .statusCode(Response.Status.CREATED.getStatusCode())
                .body("id", notNullValue())
                .body("name", equalTo(folderName));

        Course updatedCourse = courseRepository.findById(courseId);
        Assertions.assertEquals(1, updatedCourse.getFolders().size());
        Assertions.assertEquals(folderName, updatedCourse.getFolders().getFirst().getName());
    }

    @Test
    @DisplayName("Should return Response 400 (bad request) when folder name is null")
    void testCreateFolder_FolderNameIsNull() {
        Folder folderWithEmptyName = new Folder();

        given()
                .contentType(ContentType.JSON)
                .body(folderWithEmptyName)
                .when()
                .post("/courses/" + courseId + "/folders")
                .then()
                .statusCode(Response.Status.BAD_REQUEST.getStatusCode())
                .body("message", equalTo("Validation failed"));
    }

    @Test
    @DisplayName("Should return Response 400 (bad request) when folder name is empty")
    void testCreateFolder_FolderNameIsEmpty() {
        Folder folderWithEmptyName = new Folder("");

        given()
                .contentType(ContentType.JSON)
                .body(folderWithEmptyName)
                .when()
                .post("/courses/" + courseId + "/folders")
                .then()
                .statusCode(Response.Status.BAD_REQUEST.getStatusCode())
                .body("message", equalTo("Validation failed"));
    }

    @Test
    @DisplayName("Should return Response 404 (not found) when course doesn't exist")
    void testCreateFolder_CourseNotFound() {
        ObjectId nonExistentCourseId = new ObjectId();
        Folder folder = new Folder("Test Folder");

        given()
                .contentType(ContentType.JSON)
                .body(folder)
                .when()
                .post("/courses/" + nonExistentCourseId + "/folders")
                .then()
                .statusCode(Response.Status.NOT_FOUND.getStatusCode());
    }
    */
}