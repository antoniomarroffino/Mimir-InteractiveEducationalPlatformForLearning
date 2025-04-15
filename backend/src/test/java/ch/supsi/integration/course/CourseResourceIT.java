package ch.supsi.integration.course;

import ch.supsi.model.api.Course;
import ch.supsi.model.api.user.Role;
import ch.supsi.model.api.user.User;
import ch.supsi.repository.CourseRepository;
import ch.supsi.repository.UserRepository;
import ch.supsi.testContainersResource.MongoTestResource;
import io.quarkus.test.common.QuarkusTestResource;
import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.security.TestSecurity;
import io.smallrye.jwt.build.Jwt;
import jakarta.inject.Inject;
import jakarta.ws.rs.core.Response;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.*;

import java.io.InputStream;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;

@QuarkusTest
@QuarkusTestResource(MongoTestResource.class)
@Tag("integration")
@TestMethodOrder(MethodOrderer.MethodName.class)
public class CourseResourceIT {
    /*@Inject
    CourseRepository courseRepository;

    @Inject
    UserRepository userRepository;

    @BeforeEach
    @AfterEach
    public void setup() {
        this.courseRepository.deleteAll();
        this.userRepository.deleteAll();
    }


    private String generateValidJwt(String oid, String name, String email) {
        return Jwt.issuer("https://login.microsoftonline.com/3cadd1a7-ce2c-43b6-8986-2f1b472fab3b/v2.0")
                .subject(oid)
                .upn(email)
                .preferredUserName(email + "@testforprojectsupsi.onmicrosoft.com")
                .claim("oid", oid)
                .claim("name", name)
                .claim("preferred_username", email)
                .sign();
    }


    @Test
    @DisplayName("Should return 200 ok empty list of courses")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    void test01GetCourses_Empty() {
        given().when()
                .get("/courses")
                .then()
                .statusCode(Response.Status.OK.getStatusCode())
                .body("$", empty());
    }

    @Test
    @DisplayName("Should return 200 ok list of two courses")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    void test02GetCourses_TwoCourses() {
        Course course1 = new Course("Course1");
        this.courseRepository.persist(course1);
        Course course2 = new Course("Course2");
        this.courseRepository.persist(course2);

        given().when()
                .get("/courses")
                .then()
                .statusCode(Response.Status.OK.getStatusCode())
                .body("$", hasSize(2))
                .body("name", containsInAnyOrder("Course1", "Course2"));
    }

    @Test
    @DisplayName("Should return 200 ok list of teacher courses")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    void test03GetTeacherCourses() {
        User user = new User();
        user.azureOid = "testUser";
        user.role = Role.TEACHER;
        this.userRepository.persist(user);

        Course course1 = new Course("Course1");
        this.courseRepository.persist(course1);
        this.userRepository.addCourseToUser(course1.id.toString(), user.azureOid);

        given().when()
                .auth().oauth2(this.generateValidJwt("testUser", "testUser", "testUser@onmicrosoft.com"))
                .get("/courses/teacher")
                .then()
                .statusCode(Response.Status.OK.getStatusCode())
                .body("$", hasSize(1))
                .body("[0].name", equalTo("Course1"));
    }

    @Test
    @DisplayName("Should return 200 ok Course founded by id")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    void test04GetCourseById_Found() {
        User user = new User();
        user.azureOid = "testUser";
        this.userRepository.persist(user);

        Course course = new Course("Course1");
        this.courseRepository.persist(course);

        given().when()
                .get("/courses/" + course.id)
                .then()
                .statusCode(Response.Status.OK.getStatusCode())
                .body("name", equalTo("Course1"));
    }

    @Test
    @DisplayName("Should return 404 not found because Course is not founded by its id")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    void test05GetCourseById_NotFound() {
        ObjectId nonExistentId = new ObjectId();
        given().when()
                .get("/courses/" + nonExistentId)
                .then()
                .statusCode(Response.Status.NOT_FOUND.getStatusCode())
                .body("message", equalTo("Course " + nonExistentId + " not found"));
    }

    /*
    @Test
    @DisplayName("Should return Response 200 (ok) with empty courses list")
    void test01GetCourses_Empty() {
        given().when()
                .get("/courses")
                .then()
                .statusCode(Response.Status.OK.getStatusCode())
                .body("$", empty());
    }

    @Test
    @DisplayName("Should return Response 200 (ok) with two courses")
    void test02GetCourses() {
        String courseName_1 = "Test Course1";
        String courseName_2 = "Test Course2";
        Course course1 = new Course(courseName_1);
        Course course2 = new Course(courseName_2);

        String folderName1 = "Folder 1";
        Folder folder = new Folder(folderName1);
        course1.getFolders().add(folder);

        this.courseRepository.persist(course1);
        this.courseRepository.persist(course2);

        given().when()
                .get("/courses")
                .then()
                .statusCode(Response.Status.OK.getStatusCode())
                .body("$", hasSize(2))
                .body("[0].name", equalTo(courseName_1))
                .body("[0].folders", hasSize(1))
                .body("[0].folders[0].name", equalTo(folderName1))
                .body("[1].name", equalTo(courseName_2))
                .body("[1].folders", hasSize(0));
    }

    @Test
    @DisplayName("Should return Response 200 (ok) with one course founded by Id")
    void test03GetCourse() {
        String courseName_1 = "Test Course1";
        Course course1 = new Course(courseName_1);

        String folderName1 = "Folder 1";
        Folder folder = new Folder(folderName1);
        course1.getFolders().add(folder);

        this.courseRepository.persist(course1);

        given().when()
                .get("/courses/" + course1.getId())
                .then()
                .statusCode(Response.Status.OK.getStatusCode())
                .body("name", equalTo(courseName_1))
                .body("folders", hasSize(1))
                .body("folders[0].name", equalTo(folderName1));
    }

    @Test
    @DisplayName("Should return Response 404 (not found) given not valid id")
    void test04GetCourse_CourseNotFound() {
        String courseName_1 = "Test Course1";
        Course course1 = new Course(courseName_1);

        String folderName1 = "Folder 1";
        Folder folder = new Folder(folderName1);
        course1.getFolders().add(folder);

        this.courseRepository.persist(course1);

        ObjectId nonExistentCourseId = new ObjectId();

        given().when()
                .get("/courses/" + nonExistentCourseId)
                .then()
                .statusCode(Response.Status.NOT_FOUND.getStatusCode())
                .body("message", equalTo("Not Found"))
                .body("details", hasSize(1))
                .body("details[0]", equalTo("Course " + nonExistentCourseId + " not found"));
    }

    @Test
    @DisplayName("Should return Response 201 (created) one course")
    void test05CreateCourse() {
        CourseDTO courseDTO = new CourseDTO("Valid Course");

        given().
                contentType(ContentType.JSON)
                .body(courseDTO)
                .when()
                .post("/courses")
                .then()
                .statusCode(Response.Status.CREATED.getStatusCode())
                .body("id", notNullValue())
                .body("name", equalTo(courseDTO.getName()))
                .body("folders", hasSize(0));

        Course courseCreated = this.courseRepository.listAll().getFirst();
        assertNotNull(courseCreated);
        assertNotNull(courseCreated.getId());
        assertEquals(courseDTO.getName(), courseCreated.getName());
    }

    @Test
    @DisplayName("Should return Response 400 (bad request) course DTO passed is not valid")
    void test06CreateCourse_NotValidCourseDTOEmptyName() {
        CourseDTO courseDTO = new CourseDTO("");

        given().
                contentType(ContentType.JSON)
                .body(courseDTO)
                .when()
                .post("/courses")
                .then()
                .statusCode(Response.Status.BAD_REQUEST.getStatusCode())
                .body("message", equalTo("Validation failed"));
    }

    @Test
    @DisplayName("Should return Response 400 (bad request) course DTO passed is not valid")
    void test07CreateCourse_NotValidCourseDTONullName() {
        CourseDTO courseDTO = new CourseDTO();

        given().
                contentType(ContentType.JSON)
                .body(courseDTO)
                .when()
                .post("/courses")
                .then()
                .statusCode(Response.Status.BAD_REQUEST.getStatusCode())
                .body("message", equalTo("Validation failed"));
    }

    @Test
    @DisplayName("Should return Response 400 (bad request) courseDTO's name is duplicated")
    void test08CreateCourse_NotValidCourseNameIsDuplicated() {
        Course course = new Course("Test Course");
        this.courseRepository.persist(course);

        CourseDTO courseDTO = new CourseDTO("Test Course");
        given()
                .contentType(ContentType.JSON)
                .body(courseDTO)
                .when()
                .post("/courses")
                .then()
                .statusCode(Response.Status.BAD_REQUEST.getStatusCode())
                .body("message", equalTo("Bad Request"))
                .body("details[0]", equalTo("Course name " + courseDTO.getName() + " already existing"));
    }*/
}
