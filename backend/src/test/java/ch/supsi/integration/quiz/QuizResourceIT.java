package ch.supsi.integration.quiz;

import ch.supsi.JWTProducer.JwtProducer;
import ch.supsi.model.api.Course;
import ch.supsi.model.api.Folder;
import ch.supsi.model.api.Quiz;
import ch.supsi.model.api.user.Role;
import ch.supsi.model.api.user.User;
import ch.supsi.model.dto.api.QuizDTO;
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

import java.util.Collections;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@QuarkusTest
@QuarkusTestResource(MongoTestResource.class)
@Tag("integration")
@TestMethodOrder(MethodOrderer.MethodName.class)
public class QuizResourceIT {
    private static Course course;
    private static Folder folder;
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
        folder = new Folder("Test Folder");

        course.folders.add(folder);
        this.courseRepository.persist(course);
        this.userRepository.addCourseToUser(course.id.toString(), user.azureOid);
    }

    @AfterEach
    public void afterEach() {
        this.userRepository.deleteAll();
        this.courseRepository.deleteAll();
    }

    @Test
    @DisplayName("Should return empty quiz list")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    @JwtSecurity(
            claims = {
                    @Claim(key = JwtProducer.OID_CLAIM_KEY, value = JwtProducer.DEFAULT_OID),
                    @Claim(key = JwtProducer.NAME_CLAIM_KEY, value = JwtProducer.DEFAULT_NAME),
                    @Claim(key = JwtProducer.EMAIL_CLAIM_KEY, value = JwtProducer.DEFAULT_PREFERRED_USERNAME)
            })
    void test01GetQuizzes_Empty() {
        given()
                .pathParam("courseId", course.id.toString())
                .pathParam("folderId", folder.id.toString())
                .when()
                .get("/courses/{courseId}/folders/{folderId}/quizzes")
                .then()
                .statusCode(Response.Status.OK.getStatusCode())
                .body("$", empty());
    }

    @Test
    @DisplayName("Should return quiz list with one item")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    @JwtSecurity(
            claims = {
                    @Claim(key = JwtProducer.OID_CLAIM_KEY, value = JwtProducer.DEFAULT_OID),
                    @Claim(key = JwtProducer.NAME_CLAIM_KEY, value = JwtProducer.DEFAULT_NAME),
                    @Claim(key = JwtProducer.EMAIL_CLAIM_KEY, value = JwtProducer.DEFAULT_PREFERRED_USERNAME)
            })
    void test02GetQuizzes_WithData() {
        Quiz quiz = new Quiz("Test Quiz", "Test Quiz Description");
        folder.quizzes.add(quiz);
        this.courseRepository.update(course);

        given()
                .pathParam("courseId", course.id.toString())
                .pathParam("folderId", folder.id.toString())
                .when()
                .get("/courses/{courseId}/folders/{folderId}/quizzes")
                .then()
                .statusCode(Response.Status.OK.getStatusCode())
                .body("$", hasSize(1))
                .body("[0].id", equalTo(quiz.id.toString()))
                .body("[0].name", equalTo("Test Quiz"))
                .body("[0].description", equalTo("Test Quiz Description"));
    }

    @Test
    @DisplayName("Should return quiz by id")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    @JwtSecurity(
            claims = {
                    @Claim(key = JwtProducer.OID_CLAIM_KEY, value = JwtProducer.DEFAULT_OID),
                    @Claim(key = JwtProducer.NAME_CLAIM_KEY, value = JwtProducer.DEFAULT_NAME),
                    @Claim(key = JwtProducer.EMAIL_CLAIM_KEY, value = JwtProducer.DEFAULT_PREFERRED_USERNAME)
            })
    void test03GetQuizById() {
        Quiz quiz = new Quiz("Test Quiz", "Test Quiz Description");
        folder.quizzes.add(quiz);
        this.courseRepository.update(course);

        given()
                .pathParam("courseId", course.id.toString())
                .pathParam("folderId", folder.id.toString())
                .pathParam("quizId", quiz.id.toString())
                .when()
                .get("/courses/{courseId}/folders/{folderId}/quizzes/{quizId}")
                .then()
                .statusCode(Response.Status.OK.getStatusCode())
                .body("id", equalTo(quiz.id.toString()))
                .body("name", equalTo("Test Quiz"))
                .body("description", equalTo("Test Quiz Description"));
    }

    @Test
    @DisplayName("Should return 404 for non-existent quiz")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    @JwtSecurity(
            claims = {
                    @Claim(key = JwtProducer.OID_CLAIM_KEY, value = JwtProducer.DEFAULT_OID),
                    @Claim(key = JwtProducer.NAME_CLAIM_KEY, value = JwtProducer.DEFAULT_NAME),
                    @Claim(key = JwtProducer.EMAIL_CLAIM_KEY, value = JwtProducer.DEFAULT_PREFERRED_USERNAME)
            })
    void test04GetQuizById_NotFound() {
        ObjectId nonExistingQuizId = new ObjectId();

        given()
                .pathParam("courseId", course.id.toString())
                .pathParam("folderId", folder.id.toString())
                .pathParam("quizId", nonExistingQuizId.toString())
                .when()
                .get("/courses/{courseId}/folders/{folderId}/quizzes/{quizId}")
                .then()
                .statusCode(Response.Status.NOT_FOUND.getStatusCode())
                .body("message", equalTo("Quiz with id " + nonExistingQuizId + " not found in folder"));
    }

    @Test
    @DisplayName("Should create new quiz successfully")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    @JwtSecurity(
            claims = {
                    @Claim(key = JwtProducer.OID_CLAIM_KEY, value = JwtProducer.DEFAULT_OID),
                    @Claim(key = JwtProducer.NAME_CLAIM_KEY, value = JwtProducer.DEFAULT_NAME),
                    @Claim(key = JwtProducer.EMAIL_CLAIM_KEY, value = JwtProducer.DEFAULT_PREFERRED_USERNAME)
            })
    void test05CreateQuiz_Success() {
        QuizDTO quizDTO = new QuizDTO();
        quizDTO.setName("New Quiz");
        quizDTO.setDescription("Quiz Description");
        quizDTO.setTimeLimitMinutes(30);

        given()
                .pathParam("courseId", course.id.toString())
                .pathParam("folderId", folder.id.toString())
                .contentType(ContentType.JSON)
                .body(quizDTO)
                .when()
                .post("/courses/{courseId}/folders/{folderId}/quizzes")
                .then()
                .statusCode(Response.Status.CREATED.getStatusCode())
                .body("id", notNullValue())
                .body("name", equalTo("New Quiz"))
                .body("description", equalTo("Quiz Description"))
                .body("timeLimitMinutes", equalTo(30));

        Course updatedCourse = this.courseRepository.findById(course.id);

        assertEquals(1, updatedCourse.folders.getFirst().quizzes.size());
    }

    @Test
    @DisplayName("Should return 400 for empty quiz name")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    @JwtSecurity(
            claims = {
                    @Claim(key = JwtProducer.OID_CLAIM_KEY, value = JwtProducer.DEFAULT_OID),
                    @Claim(key = JwtProducer.NAME_CLAIM_KEY, value = JwtProducer.DEFAULT_NAME),
                    @Claim(key = JwtProducer.EMAIL_CLAIM_KEY, value = JwtProducer.DEFAULT_PREFERRED_USERNAME)
            })
    void test06CreateQuiz_EmptyName() {
        QuizDTO quizDTO = new QuizDTO();
        quizDTO.setName("");

        given()
                .pathParam("courseId", course.id.toString())
                .pathParam("folderId", folder.id.toString())
                .contentType(ContentType.JSON)
                .body(quizDTO)
                .when()
                .post("/courses/{courseId}/folders/{folderId}/quizzes")
                .then()
                .statusCode(Response.Status.BAD_REQUEST.getStatusCode())
                .body("message", equalTo("Validation failed"));

        assertTrue(this.courseRepository.findById(course.id).folders.getFirst().quizzes.isEmpty());
    }

    @Test
    @DisplayName("Should return 400 for null quiz name")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    @JwtSecurity(
            claims = {
                    @Claim(key = JwtProducer.OID_CLAIM_KEY, value = JwtProducer.DEFAULT_OID),
                    @Claim(key = JwtProducer.NAME_CLAIM_KEY, value = JwtProducer.DEFAULT_NAME),
                    @Claim(key = JwtProducer.EMAIL_CLAIM_KEY, value = JwtProducer.DEFAULT_PREFERRED_USERNAME)
            })
    void test07CreateQuiz_NullName() {
        QuizDTO quizDTO = new QuizDTO();
        quizDTO.setName(null);

        given()
                .pathParam("courseId", course.id.toString())
                .pathParam("folderId", folder.id.toString())
                .contentType(ContentType.JSON)
                .body(quizDTO)
                .when()
                .post("/courses/{courseId}/folders/{folderId}/quizzes")
                .then()
                .statusCode(Response.Status.BAD_REQUEST.getStatusCode())
                .body("message", equalTo("Validation failed"));

        assertTrue(this.courseRepository.findById(course.id).folders.getFirst().quizzes.isEmpty());
    }

    @Test
    @DisplayName("Should update quiz successfully")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    @JwtSecurity(
            claims = {
                    @Claim(key = JwtProducer.OID_CLAIM_KEY, value = JwtProducer.DEFAULT_OID),
                    @Claim(key = JwtProducer.NAME_CLAIM_KEY, value = JwtProducer.DEFAULT_NAME),
                    @Claim(key = JwtProducer.EMAIL_CLAIM_KEY, value = JwtProducer.DEFAULT_PREFERRED_USERNAME)
            })
    void test08UpdateQuiz_Success() {
        Quiz quiz = new Quiz("Test Quiz", "Test Quiz Description");
        quiz.timeLimitMinutes = 30;
        folder.quizzes.add(quiz);
        this.courseRepository.update(course);

        QuizDTO updateDTO = new QuizDTO();
        updateDTO.setName("Updated Quiz");
        updateDTO.setDescription("New Description");
        updateDTO.setTimeLimitMinutes(45);
        updateDTO.setQuestions(Collections.emptyList());

        given()
                .pathParam("courseId", course.id.toString())
                .pathParam("folderId", folder.id.toString())
                .pathParam("quizId", quiz.id.toString())
                .contentType(ContentType.JSON)
                .body(updateDTO)
                .when()
                .put("/courses/{courseId}/folders/{folderId}/quizzes/{quizId}")
                .then()
                .statusCode(Response.Status.OK.getStatusCode())
                .body("name", equalTo("Updated Quiz"))
                .body("description", equalTo("New Description"))
                .body("timeLimitMinutes", equalTo(45));

        Course updatedCourse = this.courseRepository.findById(course.id);
        assertEquals("Updated Quiz", updatedCourse.folders.getFirst().quizzes.getFirst().name);
        assertEquals("New Description", updatedCourse.folders.getFirst().quizzes.getFirst().description);
        assertEquals(45, updatedCourse.folders.getFirst().quizzes.getFirst().timeLimitMinutes);
        assertTrue(updatedCourse.folders.getFirst().quizzes.getFirst().questionsId.isEmpty());
    }

    @Test
    @DisplayName("Should return 404 when updating non-existent quiz")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    @JwtSecurity(
            claims = {
                    @Claim(key = JwtProducer.OID_CLAIM_KEY, value = JwtProducer.DEFAULT_OID),
                    @Claim(key = JwtProducer.NAME_CLAIM_KEY, value = JwtProducer.DEFAULT_NAME),
                    @Claim(key = JwtProducer.EMAIL_CLAIM_KEY, value = JwtProducer.DEFAULT_PREFERRED_USERNAME)
            })
    void test09UpdateQuiz_NotFound() {
        ObjectId nonExistingQuizId = new ObjectId();
        QuizDTO updateDTO = new QuizDTO();
        updateDTO.setName("Updated Quiz");

        given()
                .pathParam("courseId", course.id.toString())
                .pathParam("folderId", folder.id.toString())
                .pathParam("quizId", nonExistingQuizId.toString())
                .contentType(ContentType.JSON)
                .body(updateDTO)
                .when()
                .put("/courses/{courseId}/folders/{folderId}/quizzes/{quizId}")
                .then()
                .statusCode(Response.Status.NOT_FOUND.getStatusCode())
                .body("message", equalTo("Quiz with id " + nonExistingQuizId + " not found in folder"));
    }

    @Test
    @DisplayName("Should return 400 because quizDTO has empty name")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    @JwtSecurity(
            claims = {
                    @Claim(key = JwtProducer.OID_CLAIM_KEY, value = JwtProducer.DEFAULT_OID),
                    @Claim(key = JwtProducer.NAME_CLAIM_KEY, value = JwtProducer.DEFAULT_NAME),
                    @Claim(key = JwtProducer.EMAIL_CLAIM_KEY, value = JwtProducer.DEFAULT_PREFERRED_USERNAME)
            })
    void test10UpdateQuiz_EmptyName() {
        Quiz quiz = new Quiz("Test Quiz", "Test Quiz Description");
        folder.quizzes.add(quiz);
        this.courseRepository.update(course);

        QuizDTO updateDTO = new QuizDTO();
        updateDTO.setName("");

        given()
                .pathParam("courseId", course.id.toString())
                .pathParam("folderId", folder.id.toString())
                .pathParam("quizId", quiz.id.toString())
                .contentType(ContentType.JSON)
                .body(updateDTO)
                .when()
                .put("/courses/{courseId}/folders/{folderId}/quizzes/{quizId}")
                .then()
                .statusCode(Response.Status.BAD_REQUEST.getStatusCode())
                .body("message", equalTo("Validation failed"));
    }

    @Test
    @DisplayName("Should return 400 because quizDTO has null name")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    @JwtSecurity(
            claims = {
                    @Claim(key = JwtProducer.OID_CLAIM_KEY, value = JwtProducer.DEFAULT_OID),
                    @Claim(key = JwtProducer.NAME_CLAIM_KEY, value = JwtProducer.DEFAULT_NAME),
                    @Claim(key = JwtProducer.EMAIL_CLAIM_KEY, value = JwtProducer.DEFAULT_PREFERRED_USERNAME)
            })
    void test11UpdateQuiz_NullName() {
        Quiz quiz = new Quiz("Test Quiz", "Test Quiz Description");
        folder.quizzes.add(quiz);
        this.courseRepository.update(course);

        QuizDTO updateDTO = new QuizDTO();
        updateDTO.setName(null);

        given()
                .pathParam("courseId", course.id.toString())
                .pathParam("folderId", folder.id.toString())
                .pathParam("quizId", quiz.id.toString())
                .contentType(ContentType.JSON)
                .body(updateDTO)
                .when()
                .put("/courses/{courseId}/folders/{folderId}/quizzes/{quizId}")
                .then()
                .statusCode(Response.Status.BAD_REQUEST.getStatusCode())
                .body("message", equalTo("Validation failed"));
    }

    @Test
    @DisplayName("Should delete quiz successfully")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    @JwtSecurity(
            claims = {
                    @Claim(key = JwtProducer.OID_CLAIM_KEY, value = JwtProducer.DEFAULT_OID),
                    @Claim(key = JwtProducer.NAME_CLAIM_KEY, value = JwtProducer.DEFAULT_NAME),
                    @Claim(key = JwtProducer.EMAIL_CLAIM_KEY, value = JwtProducer.DEFAULT_PREFERRED_USERNAME)
            })
    void test12DeleteQuiz_Success() {
        Quiz quiz = new Quiz("Test Quiz", "Test Quiz Description");
        folder.quizzes.add(quiz);
        this.courseRepository.update(course);

        given()
                .pathParam("courseId", course.id.toString())
                .pathParam("folderId", folder.id.toString())
                .pathParam("quizId", quiz.id.toString())
                .when()
                .delete("/courses/{courseId}/folders/{folderId}/quizzes/{quizId}")
                .then()
                .statusCode(Response.Status.NO_CONTENT.getStatusCode());

        Course updatedCourse = this.courseRepository.findById(course.id);
        assertTrue(updatedCourse.folders.getFirst().quizzes.isEmpty());
    }

    @Test
    @DisplayName("Should return 404 when deleting non-existent quiz")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    @JwtSecurity(
            claims = {
                    @Claim(key = JwtProducer.OID_CLAIM_KEY, value = JwtProducer.DEFAULT_OID),
                    @Claim(key = JwtProducer.NAME_CLAIM_KEY, value = JwtProducer.DEFAULT_NAME),
                    @Claim(key = JwtProducer.EMAIL_CLAIM_KEY, value = JwtProducer.DEFAULT_PREFERRED_USERNAME)
            })
    void test13DeleteQuiz_NotFound() {
        ObjectId nonExistingQuizId = new ObjectId();

        given()
                .pathParam("courseId", course.id.toString())
                .pathParam("folderId", folder.id.toString())
                .pathParam("quizId", nonExistingQuizId.toString())
                .when()
                .delete("/courses/{courseId}/folders/{folderId}/quizzes/{quizId}")
                .then()
                .statusCode(Response.Status.NOT_FOUND.getStatusCode())
                .body("message", equalTo("Quiz with id " + nonExistingQuizId + " not found in folder"));
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
    void test14CourseNotFound() {
        ObjectId invalidCourseId = new ObjectId();

        given()
                .pathParam("courseId", invalidCourseId.toString())
                .pathParam("folderId", folder.id.toString())
                .when()
                .get("/courses/{courseId}/folders/{folderId}/quizzes")
                .then()
                .statusCode(Response.Status.NOT_FOUND.getStatusCode());
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
    void test15FolderNotFound() {
        ObjectId invalidFolderId = new ObjectId();

        given()
                .pathParam("courseId", course.id.toString())
                .pathParam("folderId", invalidFolderId.toString())
                .when()
                .get("/courses/{courseId}/folders/{folderId}/quizzes")
                .then()
                .statusCode(Response.Status.NOT_FOUND.getStatusCode());
    }
}
