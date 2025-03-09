package ch.supsi.integration.folder;

import ch.supsi.testContainersResource.MongoTestResource;
import ch.supsi.model.api.Course;
import ch.supsi.model.api.Folder;
import ch.supsi.model.dto.api.FolderDTO;
import ch.supsi.repository.CourseRepository;
import io.quarkus.test.common.QuarkusTestResource;
import io.quarkus.test.junit.QuarkusTest;
import io.restassured.http.ContentType;
import jakarta.inject.Inject;
import jakarta.ws.rs.core.Response;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.*;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.assertEquals;

@QuarkusTest
@QuarkusTestResource(MongoTestResource.class)
@Tag("integration")
public class FolderResourceIT {
    @Inject
    CourseRepository courseRepository;

    private Course testCourse;
    private ObjectId courseId;

    @BeforeEach
    void setup() {
        this.testCourse = new Course("Test Course");
        this.courseRepository.persist(this.testCourse);
        this.courseId = this.testCourse.getId();
    }

    @AfterEach
    void cleanup() {
        this.courseRepository.deleteAll();
    }

    @Test
    @DisplayName("Should return Response 200 (ok) with empty folders list")
    void test01GetFolders_Empty() {
        given().when()
                .get("/courses/" + this.courseId + "/folders")
                .then()
                .statusCode(Response.Status.OK.getStatusCode())
                .body("$", empty());
    }

    @Test
    @DisplayName("Should return Response 200 (ok) with two folders in list")
    void test02GetFolders() {
        String folderName1 = "Test Folder1";
        String folderName2 = "Test Folder2";

        this.testCourse.getFolders().add(new Folder(folderName1));
        this.testCourse.getFolders().add(new Folder(folderName2));
        this.courseRepository.update(testCourse);

        given().when()
                .get("/courses/" + this.courseId + "/folders")
                .then()
                .statusCode(Response.Status.OK.getStatusCode())
                .body("$", hasSize(2))
                .body("[0].name", equalTo(folderName1))
                .body("[1].name", equalTo(folderName2));
    }

    @Test
    @DisplayName("Should return Response 404 (not found) when course doesn't exist")
    void test03GetFolders_CourseNotFound() {
        ObjectId nonExistentCourseId = new ObjectId();

        given().when()
                .get("/courses/" + nonExistentCourseId + "/folders")
                .then()
                .statusCode(Response.Status.NOT_FOUND.getStatusCode())
                .body("message", equalTo("Not Found"))
                .body("details[0]", equalTo("Course " + nonExistentCourseId + " not found"));
    }

    @Test
    @DisplayName("Should return Response 200 (ok) with one folder")
    void test04GetFolder() {
        String folderName = "Test Folder";

        this.testCourse.getFolders().add(new Folder(folderName));
        this.courseRepository.update(this.testCourse);

        given().when()
                .get("/courses/" + this.courseId + "/folders/" + folderName)
                .then()
                .statusCode(Response.Status.OK.getStatusCode())
                .body("name", equalTo(folderName));
    }

    @Test
    @DisplayName("Should return Response 404 (not found) when course doesn't exist")
    void test05GetFolder_CourseNotFound() {
        ObjectId nonExistentCourseId = new ObjectId();
        String folderName = "Test Folder";

        given().when()
                .get("/courses/" + nonExistentCourseId + "/folders/" + folderName)
                .then()
                .statusCode(Response.Status.NOT_FOUND.getStatusCode())
                .body("message", equalTo("Not Found"))
                .body("details[0]", equalTo("Course " + nonExistentCourseId + " not found"));
    }

    @Test
    @DisplayName("Should return Response 404 (not found) when folder doesn't exist")
    void test06GetFolder_FolderNotFound() {
        String nonExistentFolderName = "test";

        given().when()
                .get("/courses/" + this.courseId + "/folders/" + nonExistentFolderName)
                .then()
                .statusCode(Response.Status.NOT_FOUND.getStatusCode())
                .body("message", equalTo("Not Found"))
                .body("details[0]", equalTo("Folder " + nonExistentFolderName + " not found in course: " + this.courseId));
    }

    @Test
    @DisplayName("Should return Response 201 (created) when creating a folder")
    void test07CreateFolder() {
        String folderName = "Test Folder";
        FolderDTO folderDTO = new FolderDTO(folderName);

        given()
                .contentType(ContentType.JSON)
                .body(folderDTO)
                .when()
                .post("/courses/" + this.courseId + "/folders")
                .then()
                .statusCode(Response.Status.CREATED.getStatusCode())
                .body("name", equalTo(folderName));

        Course updatedCourse = this.courseRepository.findById(courseId);
        assertEquals(1, updatedCourse.getFolders().size());
        assertEquals(folderName, updatedCourse.getFolders().getFirst().getName());
    }

    @Test
    @DisplayName("Should return Response 400 (bad request) when folder name is null")
    void test08CreateFolder_FolderNameIsNull() {
        FolderDTO folderWithNullNameDTO = new FolderDTO(null);

        given()
                .contentType(ContentType.JSON)
                .body(folderWithNullNameDTO)
                .when()
                .post("/courses/" + this.courseId + "/folders")
                .then()
                .statusCode(Response.Status.BAD_REQUEST.getStatusCode())
                .body("message", equalTo("Validation failed"));
    }

    @Test
    @DisplayName("Should return Response 400 (bad request) when folder name is empty")
    void test09CreateFolder_FolderNameIsEmpty() {
        FolderDTO folderWithEmptyNameDTO = new FolderDTO("");

        given()
                .contentType(ContentType.JSON)
                .body(folderWithEmptyNameDTO)
                .when()
                .post("/courses/" + this.courseId + "/folders")
                .then()
                .statusCode(Response.Status.BAD_REQUEST.getStatusCode())
                .body("message", equalTo("Validation failed"));
    }

    @Test
    @DisplayName("Should return Response 404 (not found) when course doesn't exist")
    void test10CreateFolder_CourseNotFound() {
        ObjectId nonExistentCourseId = new ObjectId();
        FolderDTO folderDTO = new FolderDTO("Test Folder");

        given()
                .contentType(ContentType.JSON)
                .body(folderDTO)
                .when()
                .post("/courses/" + nonExistentCourseId + "/folders")
                .then()
                .statusCode(Response.Status.NOT_FOUND.getStatusCode())
                .body("message", equalTo("Not Found"))
                .body("details[0]", equalTo("Course " + nonExistentCourseId + " not found"));
    }

    @Test
    @DisplayName("Should return Response 400 (bad request) folder name is null")
    void test11CreateFolder_FolderNameIsDuplicated() {
        Folder folder = new Folder("Test Folder");
        this.testCourse.getFolders().add(folder);
        this.courseRepository.update(this.testCourse);

        FolderDTO folderDTO = new FolderDTO("Test Folder");

        given()
                .contentType(ContentType.JSON)
                .body(folderDTO)
                .when()
                .post("/courses/" + this.courseId + "/folders")
                .then()
                .statusCode(Response.Status.BAD_REQUEST.getStatusCode())
                .body("message", equalTo("Bad Request"))
                .body("details[0]", equalTo("Folder name " + folderDTO.getName() + " already existing in course " + this.courseId));
    }
}