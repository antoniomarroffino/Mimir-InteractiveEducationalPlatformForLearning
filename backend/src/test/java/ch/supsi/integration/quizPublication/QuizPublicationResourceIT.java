package ch.supsi.integration.quizPublication;

import ch.supsi.JWTProducer.JwtProducer;
import ch.supsi.model.api.Course;
import ch.supsi.model.api.Folder;
import ch.supsi.model.api.Quiz;
import ch.supsi.model.api.QuizPublication;
import ch.supsi.model.api.question.TrueFalseQuestion;
import ch.supsi.model.api.user.Role;
import ch.supsi.model.api.user.User;
import ch.supsi.model.dto.api.QuizPublicationDTO;
import ch.supsi.repository.CourseRepository;
import ch.supsi.repository.QuestionRepository;
import ch.supsi.repository.QuizPublicationRepository;
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

import java.util.ArrayList;
import java.util.List;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.*;

@QuarkusTest
@QuarkusTestResource(MongoTestResource.class)
@Tag("integration")
@TestMethodOrder(MethodOrderer.MethodName.class)
public class QuizPublicationResourceIT {
    @Inject
    QuizPublicationRepository publicationRepository;

    @Inject
    UserRepository userRepository;

    @Inject
    CourseRepository courseRepository;

    @Inject
    QuestionRepository questionRepository;

    private static Course course;
    private static Folder folder;
    private static Quiz quiz;
    private static TrueFalseQuestion question;

    @BeforeEach
    public void beforeEach() {
        User user = new User();
        user.azureOid = JwtProducer.DEFAULT_OID;
        user.role = Role.TEACHER;
        this.userRepository.persist(user);

        course = new Course("Test Course", "Test Course Description");
        folder = new Folder("Test Folder");
        quiz = new Quiz("Test Quiz", "Test Quiz Description");

        question = new TrueFalseQuestion("Test Question", true);
        this.questionRepository.persist(question);

        course.folders.add(folder);
        folder.quizzes.add(quiz);
        quiz.questionsId.add(question.id);

        this.courseRepository.persist(course);
        this.userRepository.addCourseToUser(course.id.toString(), user.azureOid);
    }

    @AfterEach
    public void afterEach() {
        this.publicationRepository.deleteAll();
        this.userRepository.deleteAll();
        this.courseRepository.deleteAll();
        this.questionRepository.deleteAll();
    }

    @Test
    @DisplayName("Publish quiz successfully")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    @JwtSecurity(
            claims = {
                    @Claim(key = JwtProducer.OID_CLAIM_KEY, value = JwtProducer.DEFAULT_OID),
                    @Claim(key = JwtProducer.NAME_CLAIM_KEY, value = JwtProducer.DEFAULT_NAME),
                    @Claim(key = JwtProducer.EMAIL_CLAIM_KEY, value = JwtProducer.DEFAULT_PREFERRED_USERNAME)
            })
    void test01PublishQuiz_Success() {
        QuizPublicationDTO quizPublicationDTO = new QuizPublicationDTO();
        quizPublicationDTO.setCourseId(course.id.toString());
        quizPublicationDTO.setFolderId(folder.id.toString());
        quizPublicationDTO.setQuizId(quiz.id.toString());

        given()
                .contentType(ContentType.JSON)
                .body(quizPublicationDTO)
                .when()
                .post("/publications")
                .then()
                .statusCode(Response.Status.CREATED.getStatusCode())
                .body("id", notNullValue())
                .body("questions", hasSize(1))
                .body("publicationCode", notNullValue())
                .body("published", is(true))
                .body("anonymous", is(true));

        QuizPublication publication = this.publicationRepository.listAll().getFirst();
        assertNotNull(publication);
        assertEquals(question.id, publication.questions.getFirst().id);
        assertEquals(question.type, publication.questions.getFirst().type);
    }

    @Test
    @DisplayName("Publish quiz with invalid data - Course id is null")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    @JwtSecurity(
            claims = {
                    @Claim(key = JwtProducer.OID_CLAIM_KEY, value = JwtProducer.DEFAULT_OID),
                    @Claim(key = JwtProducer.NAME_CLAIM_KEY, value = JwtProducer.DEFAULT_NAME),
                    @Claim(key = JwtProducer.EMAIL_CLAIM_KEY, value = JwtProducer.DEFAULT_PREFERRED_USERNAME)
            })
    void test02PublishQuiz_InvalidData_CourseIdIsNull() {
        QuizPublicationDTO dto = new QuizPublicationDTO();
        dto.setCourseId(null);
        dto.setFolderId(folder.id.toString());
        dto.setQuizId(quiz.id.toString());

        given()
                .contentType(ContentType.JSON)
                .body(dto)
                .when()
                .post("/publications")
                .then()
                .statusCode(Response.Status.BAD_REQUEST.getStatusCode())
                .body("message", equalTo("Validation failed"));
    }

    @Test
    @DisplayName("Publish quiz with invalid data - Course id is empty")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    @JwtSecurity(
            claims = {
                    @Claim(key = JwtProducer.OID_CLAIM_KEY, value = JwtProducer.DEFAULT_OID),
                    @Claim(key = JwtProducer.NAME_CLAIM_KEY, value = JwtProducer.DEFAULT_NAME),
                    @Claim(key = JwtProducer.EMAIL_CLAIM_KEY, value = JwtProducer.DEFAULT_PREFERRED_USERNAME)
            })
    void test03PublishQuiz_InvalidData_CourseIdIsEmpty() {
        QuizPublicationDTO dto = new QuizPublicationDTO();
        dto.setCourseId("");
        dto.setFolderId(folder.id.toString());
        dto.setQuizId(quiz.id.toString());

        given()
                .contentType(ContentType.JSON)
                .body(dto)
                .when()
                .post("/publications")
                .then()
                .statusCode(Response.Status.BAD_REQUEST.getStatusCode())
                .body("message", equalTo("Validation failed"));
    }

    @Test
    @DisplayName("Publish quiz with invalid data - Folder id is null")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    @JwtSecurity(
            claims = {
                    @Claim(key = JwtProducer.OID_CLAIM_KEY, value = JwtProducer.DEFAULT_OID),
                    @Claim(key = JwtProducer.NAME_CLAIM_KEY, value = JwtProducer.DEFAULT_NAME),
                    @Claim(key = JwtProducer.EMAIL_CLAIM_KEY, value = JwtProducer.DEFAULT_PREFERRED_USERNAME)
            })
    void test04PublishQuiz_InvalidData_FolderIdIsNull() {
        QuizPublicationDTO dto = new QuizPublicationDTO();
        dto.setCourseId(course.id.toString());
        dto.setFolderId(null);
        dto.setQuizId(quiz.id.toString());

        given()
                .contentType(ContentType.JSON)
                .body(dto)
                .when()
                .post("/publications")
                .then()
                .statusCode(Response.Status.BAD_REQUEST.getStatusCode())
                .body("message", equalTo("Validation failed"));
    }

    @Test
    @DisplayName("Publish quiz with invalid data - Folder id is empty")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    @JwtSecurity(
            claims = {
                    @Claim(key = JwtProducer.OID_CLAIM_KEY, value = JwtProducer.DEFAULT_OID),
                    @Claim(key = JwtProducer.NAME_CLAIM_KEY, value = JwtProducer.DEFAULT_NAME),
                    @Claim(key = JwtProducer.EMAIL_CLAIM_KEY, value = JwtProducer.DEFAULT_PREFERRED_USERNAME)
            })
    void test05PublishQuiz_InvalidData_FolderIdIsEmpty() {
        QuizPublicationDTO dto = new QuizPublicationDTO();
        dto.setCourseId(course.id.toString());
        dto.setFolderId("");
        dto.setQuizId(quiz.id.toString());

        given()
                .contentType(ContentType.JSON)
                .body(dto)
                .when()
                .post("/publications")
                .then()
                .statusCode(Response.Status.BAD_REQUEST.getStatusCode())
                .body("message", equalTo("Validation failed"));
    }

    @Test
    @DisplayName("Publish quiz with invalid data - Quiz id is null")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    @JwtSecurity(
            claims = {
                    @Claim(key = JwtProducer.OID_CLAIM_KEY, value = JwtProducer.DEFAULT_OID),
                    @Claim(key = JwtProducer.NAME_CLAIM_KEY, value = JwtProducer.DEFAULT_NAME),
                    @Claim(key = JwtProducer.EMAIL_CLAIM_KEY, value = JwtProducer.DEFAULT_PREFERRED_USERNAME)
            })
    void test06PublishQuiz_InvalidData_QuizIdIsNull() {
        QuizPublicationDTO dto = new QuizPublicationDTO();
        dto.setCourseId(course.id.toString());
        dto.setFolderId(folder.id.toString());
        dto.setQuizId(null);

        given()
                .contentType(ContentType.JSON)
                .body(dto)
                .when()
                .post("/publications")
                .then()
                .statusCode(Response.Status.BAD_REQUEST.getStatusCode())
                .body("message", equalTo("Validation failed"));
    }

    @Test
    @DisplayName("Publish quiz with invalid data - Quiz id is empty")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    @JwtSecurity(
            claims = {
                    @Claim(key = JwtProducer.OID_CLAIM_KEY, value = JwtProducer.DEFAULT_OID),
                    @Claim(key = JwtProducer.NAME_CLAIM_KEY, value = JwtProducer.DEFAULT_NAME),
                    @Claim(key = JwtProducer.EMAIL_CLAIM_KEY, value = JwtProducer.DEFAULT_PREFERRED_USERNAME)
            })
    void test07PublishQuiz_InvalidData_QuizIdIsEmpty() {
        QuizPublicationDTO dto = new QuizPublicationDTO();
        dto.setCourseId(course.id.toString());
        dto.setFolderId(folder.id.toString());
        dto.setQuizId("");

        given()
                .contentType(ContentType.JSON)
                .body(dto)
                .when()
                .post("/publications")
                .then()
                .statusCode(Response.Status.BAD_REQUEST.getStatusCode())
                .body("message", equalTo("Validation failed"));
    }

    @Test
    @DisplayName("Get publication by ID by a teacher user")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    @JwtSecurity(
            claims = {
                    @Claim(key = JwtProducer.OID_CLAIM_KEY, value = JwtProducer.DEFAULT_OID),
                    @Claim(key = JwtProducer.NAME_CLAIM_KEY, value = JwtProducer.DEFAULT_NAME),
                    @Claim(key = JwtProducer.EMAIL_CLAIM_KEY, value = JwtProducer.DEFAULT_PREFERRED_USERNAME)
            })
    void test08GetPublicationById_UserTEACHER() {
        QuizPublication quizPublication = new QuizPublication();
        quizPublication.courseId = course.id;
        quizPublication.folderId = folder.id;
        quizPublication.quizId = quiz.id;
        quizPublication.questions = List.of(question);

        this.publicationRepository.persist(quizPublication);

        given()
                .pathParam("publicationID", quizPublication.id.toString())
                .when()
                .get("/publications/{publicationID}")
                .then()
                .statusCode(Response.Status.OK.getStatusCode())
                .body("id", equalTo(quizPublication.id.toString()));
    }

    @Test
    @DisplayName("Get publication by ID by student user")
    @TestSecurity(user = "testUser", roles = "STUDENT")
    @JwtSecurity(
            claims = {
                    @Claim(key = JwtProducer.OID_CLAIM_KEY, value = "student oid"),
                    @Claim(key = JwtProducer.NAME_CLAIM_KEY, value = "student name"),
                    @Claim(key = JwtProducer.EMAIL_CLAIM_KEY, value = "student@email.com")
            })
    void test09GetPublicationById_UserSTUDENT() {
        QuizPublication quizPublication = new QuizPublication();
        quizPublication.courseId = course.id;
        quizPublication.folderId = folder.id;
        quizPublication.quizId = quiz.id;
        quizPublication.questions = List.of(question);

        this.publicationRepository.persist(quizPublication);

        given()
                .pathParam("publicationID", quizPublication.id.toString())
                .when()
                .get("/publications/{publicationID}")
                .then()
                .statusCode(Response.Status.OK.getStatusCode())
                .body("id", equalTo(quizPublication.id.toString()));
    }

    @Test
    @DisplayName("Should return 404 not found because QuizPublication does not exist")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    @JwtSecurity(
            claims = {
                    @Claim(key = JwtProducer.OID_CLAIM_KEY, value = JwtProducer.DEFAULT_OID),
                    @Claim(key = JwtProducer.NAME_CLAIM_KEY, value = JwtProducer.DEFAULT_NAME),
                    @Claim(key = JwtProducer.EMAIL_CLAIM_KEY, value = JwtProducer.DEFAULT_PREFERRED_USERNAME)
            })
    void test10GetPublicationById_NotFound() {
        ObjectId nonExistingQuizPublicationId = new ObjectId();

        given()
                .pathParam("publicationID", nonExistingQuizPublicationId.toString())
                .when()
                .get("/publications/{publicationID}")
                .then()
                .statusCode(Response.Status.NOT_FOUND.getStatusCode())
                .body("message", equalTo("Quiz publication with id " + nonExistingQuizPublicationId + " not found"));
    }

    @Test
    @DisplayName("Get publication by code")
    @TestSecurity(user = "testUser", roles = "STUDENT")
    @JwtSecurity(
            claims = {
                    @Claim(key = JwtProducer.OID_CLAIM_KEY, value = "student-oid"),
                    @Claim(key = JwtProducer.NAME_CLAIM_KEY, value = "Student User"),
                    @Claim(key = JwtProducer.EMAIL_CLAIM_KEY, value = "student@test.com")
            })
    void test10GetPublicationByCode() {
        QuizPublication quizPublication = new QuizPublication();
        quizPublication.courseId = course.id;
        quizPublication.folderId = folder.id;
        quizPublication.quizId = quiz.id;
        quizPublication.questions = List.of(question);
        quizPublication.publicationCode = "test_publication_code";

        this.publicationRepository.persist(quizPublication);

        given()
                .pathParam("code", quizPublication.publicationCode)
                .when()
                .get("/publications/byCode/{code}")
                .then()
                .statusCode(Response.Status.OK.getStatusCode())
                .body("id", equalTo(quizPublication.id.toString()))
                .body("publicationCode", equalTo(quizPublication.publicationCode));
    }

    @Test
    @DisplayName("Get publication by code without auth")
    void test11GetPublicationByCode_AnonymousPublication() {
        QuizPublication quizPublication = new QuizPublication();
        quizPublication.courseId = course.id;
        quizPublication.folderId = folder.id;
        quizPublication.quizId = quiz.id;
        quizPublication.questions = List.of(question);
        quizPublication.publicationCode = "test_publication_code";

        this.publicationRepository.persist(quizPublication);

        given()
                .pathParam("code", quizPublication.publicationCode)
                .when()
                .get("/publications/byCode/{code}")
                .then()
                .statusCode(Response.Status.OK.getStatusCode())
                .body("id", equalTo(quizPublication.id.toString()))
                .body("publicationCode", equalTo(quizPublication.publicationCode));
    }

    @Test
    @DisplayName("Should return 404 not found because publicationCode does not exist")
    @TestSecurity(user = "testUser", roles = "STUDENT")
    @JwtSecurity(
            claims = {
                    @Claim(key = JwtProducer.OID_CLAIM_KEY, value = "student-oid"),
                    @Claim(key = JwtProducer.NAME_CLAIM_KEY, value = "Student User"),
                    @Claim(key = JwtProducer.EMAIL_CLAIM_KEY, value = "student@test.com")
            })
    void test12GetPublicationByCode_NotFound() {
        String nonExistingPublicationCode = "non_existing_publication_code";

        given()
                .pathParam("code", nonExistingPublicationCode)
                .when()
                .get("/publications/byCode/{code}")
                .then()
                .statusCode(Response.Status.NOT_FOUND.getStatusCode())
                .body("message", equalTo("Quiz publication with code " + nonExistingPublicationCode + " not found"));
    }

    @Test
    @DisplayName("Deactivate publication")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    @JwtSecurity(
            claims = {
                    @Claim(key = JwtProducer.OID_CLAIM_KEY, value = JwtProducer.DEFAULT_OID),
                    @Claim(key = JwtProducer.NAME_CLAIM_KEY, value = JwtProducer.DEFAULT_NAME),
                    @Claim(key = JwtProducer.EMAIL_CLAIM_KEY, value = JwtProducer.DEFAULT_PREFERRED_USERNAME)
            })
    void test13DeactivatePublication() {
        QuizPublication quizPublication = new QuizPublication();
        quizPublication.courseId = course.id;
        quizPublication.folderId = folder.id;
        quizPublication.quizId = quiz.id;
        quizPublication.questions = List.of(question);
        quizPublication.publicationCode = "test_publication_code";
        quizPublication.published = true;

        this.publicationRepository.persist(quizPublication);

        given()
                .pathParam("publicationId", quizPublication.id.toString())
                .when()
                .put("/publications/deactivate/{publicationId}")
                .then()
                .statusCode(Response.Status.OK.getStatusCode())
                .body("published", is(false))
                .body("closedAt", notNullValue());

        quizPublication = this.publicationRepository.findById(quizPublication.id);

        assertFalse(quizPublication.published);
        assertNotNull(quizPublication.closedAt);
    }

    @Test
    @DisplayName("Deactivate publication return 404 because quizPublication does not exist")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    @JwtSecurity(
            claims = {
                    @Claim(key = JwtProducer.OID_CLAIM_KEY, value = JwtProducer.DEFAULT_OID),
                    @Claim(key = JwtProducer.NAME_CLAIM_KEY, value = JwtProducer.DEFAULT_NAME),
                    @Claim(key = JwtProducer.EMAIL_CLAIM_KEY, value = JwtProducer.DEFAULT_PREFERRED_USERNAME)
            })
    void test14DeactivatePublication_NotFound() {
        ObjectId nonExistingQuizPublicationId = new ObjectId();

        given()
                .pathParam("publicationId", nonExistingQuizPublicationId.toString())
                .when()
                .put("/publications/deactivate/{publicationId}")
                .then()
                .statusCode(Response.Status.NOT_FOUND.getStatusCode())
                .body("message", equalTo("Quiz publication with id " + nonExistingQuizPublicationId + " not found"));
    }

    @Test
    @DisplayName("Delete publication")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    @JwtSecurity(
            claims = {
                    @Claim(key = JwtProducer.OID_CLAIM_KEY, value = JwtProducer.DEFAULT_OID),
                    @Claim(key = JwtProducer.NAME_CLAIM_KEY, value = JwtProducer.DEFAULT_NAME),
                    @Claim(key = JwtProducer.EMAIL_CLAIM_KEY, value = JwtProducer.DEFAULT_PREFERRED_USERNAME)
            })
    void test15DeletePublication() {
        QuizPublication quizPublication = new QuizPublication();
        quizPublication.courseId = course.id;
        quizPublication.folderId = folder.id;
        quizPublication.quizId = quiz.id;
        quizPublication.questions = List.of(question);
        quizPublication.publicationCode = "test_publication_code";

        this.publicationRepository.persist(quizPublication);

        given()
                .pathParam("id", quizPublication.id.toString())
                .when()
                .delete("/publications/{id}")
                .then()
                .statusCode(Response.Status.NO_CONTENT.getStatusCode());

        assertFalse(this.publicationRepository.findByIdOptional(quizPublication.id).isPresent());
    }

    @Test
    @DisplayName("Delete publication failed because QuizPublication does not exist")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    @JwtSecurity(
            claims = {
                    @Claim(key = JwtProducer.OID_CLAIM_KEY, value = JwtProducer.DEFAULT_OID),
                    @Claim(key = JwtProducer.NAME_CLAIM_KEY, value = JwtProducer.DEFAULT_NAME),
                    @Claim(key = JwtProducer.EMAIL_CLAIM_KEY, value = JwtProducer.DEFAULT_PREFERRED_USERNAME)
            })
    void test16DeletePublication_NotFound() {
        QuizPublication quizPublication = new QuizPublication();
        quizPublication.courseId = course.id;
        quizPublication.folderId = folder.id;
        quizPublication.quizId = quiz.id;
        quizPublication.questions = List.of(question);
        quizPublication.publicationCode = "test_publication_code";

        this.publicationRepository.persist(quizPublication);

        ObjectId nonExistingQuizPublicationId = new ObjectId();

        given()
                .pathParam("id", nonExistingQuizPublicationId.toString())
                .when()
                .delete("/publications/{id}")
                .then()
                .statusCode(Response.Status.NOT_FOUND.getStatusCode())
                .body("message", equalTo("Quiz publication with id " + nonExistingQuizPublicationId + " not found"));

        assertTrue(this.publicationRepository.findByIdOptional(quizPublication.id).isPresent());
    }

    @Test
    @DisplayName("Get publications by quiz ID")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    @JwtSecurity(
            claims = {
                    @Claim(key = JwtProducer.OID_CLAIM_KEY, value = JwtProducer.DEFAULT_OID),
                    @Claim(key = JwtProducer.NAME_CLAIM_KEY, value = JwtProducer.DEFAULT_NAME),
                    @Claim(key = JwtProducer.EMAIL_CLAIM_KEY, value = JwtProducer.DEFAULT_PREFERRED_USERNAME)
            })
    void test17GetPublicationsByQuizId() {
        QuizPublication quizPublication1 = new QuizPublication();
        quizPublication1.courseId = course.id;
        quizPublication1.folderId = folder.id;
        quizPublication1.quizId = quiz.id;
        quizPublication1.questions = List.of(question);
        quizPublication1.publicationCode = "test_publication_code_1";
        quizPublication1.published = true;

        QuizPublication quizPublication2 = new QuizPublication();
        quizPublication2.courseId = course.id;
        quizPublication2.folderId = folder.id;
        quizPublication2.quizId = quiz.id;
        quizPublication2.questions = new ArrayList<>();
        quizPublication2.publicationCode = "test_publication_code_2";
        quizPublication2.published = false;

        this.publicationRepository.persist(quizPublication1);
        this.publicationRepository.persist(quizPublication2);

        given()
                .pathParam("quizId", quiz.id.toString())
                .when()
                .get("/publications/byQuizId/{quizId}")
                .then()
                .statusCode(Response.Status.OK.getStatusCode())
                .body("$", hasSize(2))
                .body("[0].id", equalTo(quizPublication1.id.toString()))
                .body("[0].published", is(true))
                .body("[0].questions", hasSize(1))
                .body("[1].id", equalTo(quizPublication2.id.toString()))
                .body("[1].published", is(false))
                .body("[1].questions", empty());
    }

    @Test
    @DisplayName("Get publications by quiz ID return empty list")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    @JwtSecurity(
            claims = {
                    @Claim(key = JwtProducer.OID_CLAIM_KEY, value = JwtProducer.DEFAULT_OID),
                    @Claim(key = JwtProducer.NAME_CLAIM_KEY, value = JwtProducer.DEFAULT_NAME),
                    @Claim(key = JwtProducer.EMAIL_CLAIM_KEY, value = JwtProducer.DEFAULT_PREFERRED_USERNAME)
            })
    void test18GetPublicationsByQuizId_emptyList() {
        QuizPublication quizPublication1 = new QuizPublication();
        quizPublication1.courseId = course.id;
        quizPublication1.folderId = folder.id;
        quizPublication1.quizId = new ObjectId();
        quizPublication1.questions = List.of(question);
        quizPublication1.publicationCode = "test_publication_code_1";
        quizPublication1.published = true;

        QuizPublication quizPublication2 = new QuizPublication();
        quizPublication2.courseId = course.id;
        quizPublication2.folderId = folder.id;
        quizPublication2.quizId = new ObjectId();
        quizPublication2.publicationCode = "test_publication_code_2";
        quizPublication2.published = false;

        this.publicationRepository.persist(quizPublication1);
        this.publicationRepository.persist(quizPublication2);

        given()
                .pathParam("quizId", quiz.id.toString())
                .when()
                .get("/publications/byQuizId/{quizId}")
                .then()
                .statusCode(Response.Status.OK.getStatusCode())
                .body("$", empty());
    }
}
