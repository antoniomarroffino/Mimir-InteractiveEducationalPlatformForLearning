package ch.supsi.integration.course;

import ch.supsi.JWTProducer.JwtProducer;
import ch.supsi.model.api.Course;
import ch.supsi.model.api.user.Role;
import ch.supsi.model.api.user.User;
import ch.supsi.model.dto.api.CourseDTO;
import ch.supsi.repository.CourseRepository;
import ch.supsi.repository.UserRepository;
import ch.supsi.testContainersResource.MongoTestResource;
import com.sun.jdi.ObjectCollectedException;
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
import static org.junit.jupiter.api.Assertions.*;

@QuarkusTest
@QuarkusTestResource(MongoTestResource.class)
@Tag("integration")
@TestMethodOrder(MethodOrderer.MethodName.class)
public class CourseResourceIT {
    @Inject
    CourseRepository courseRepository;

    @Inject
    UserRepository userRepository;

    @BeforeEach
    @AfterEach
    public void setup() {
        this.courseRepository.deleteAll();
        this.userRepository.deleteAll();
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
    @JwtSecurity(
            claims = {
                    @Claim(key = JwtProducer.OID_CLAIM_KEY, value = JwtProducer.DEFAULT_OID),
                    @Claim(key = JwtProducer.NAME_CLAIM_KEY, value = JwtProducer.DEFAULT_NAME),
                    @Claim(key = JwtProducer.EMAIL_CLAIM_KEY, value = JwtProducer.DEFAULT_PREFERRED_USERNAME)
            })
    void test03GetTeacherCourses() {
        User user = new User();
        user.azureOid = JwtProducer.DEFAULT_OID;
        user.role = Role.TEACHER;
        this.userRepository.persist(user);

        Course course1 = new Course("Course1");
        this.courseRepository.persist(course1);
        this.userRepository.addCourseToUser(course1.id.toString(), user.azureOid);

        given().when()
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

    @Test
    @DisplayName("Should return Response 201 (created) one course")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    @JwtSecurity(
            claims = {
                    @Claim(key = JwtProducer.OID_CLAIM_KEY, value = JwtProducer.DEFAULT_OID),
                    @Claim(key = JwtProducer.NAME_CLAIM_KEY, value = JwtProducer.DEFAULT_NAME),
                    @Claim(key = JwtProducer.EMAIL_CLAIM_KEY, value = JwtProducer.DEFAULT_PREFERRED_USERNAME)
            })
    void test06CreateCourse() {
        User user = new User();
        user.azureOid = JwtProducer.DEFAULT_OID;
        user.role = Role.TEACHER;
        this.userRepository.persist(user);

        CourseDTO courseDTO = new CourseDTO("Valid Course");
        courseDTO.setDescription("test description");

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
        user = this.userRepository.findByAzureOidOptional(user.azureOid).orElseThrow();

        assertNotNull(courseCreated);
        assertNotNull(courseCreated.id);
        assertEquals(courseDTO.getName(), courseCreated.name);
        assertEquals(courseDTO.getDescription(), courseCreated.description);
        assertTrue(user.coursesId.contains(courseCreated.id.toString()));
    }

    @Test
    @DisplayName("Should return Response 400 (bad request) course DTO passed is not valid")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    @JwtSecurity(
            claims = {
                    @Claim(key = JwtProducer.OID_CLAIM_KEY, value = JwtProducer.DEFAULT_OID),
                    @Claim(key = JwtProducer.NAME_CLAIM_KEY, value = JwtProducer.DEFAULT_NAME),
                    @Claim(key = JwtProducer.EMAIL_CLAIM_KEY, value = JwtProducer.DEFAULT_PREFERRED_USERNAME)
            })
    void test07CreateCourse_NotValidCourseDTOEmptyName() {
        User user = new User();
        user.azureOid = JwtProducer.DEFAULT_OID;
        user.role = Role.TEACHER;
        this.userRepository.persist(user);

        CourseDTO courseDTO = new CourseDTO("");

        given().
                contentType(ContentType.JSON)
                .body(courseDTO)
                .when()
                .post("/courses")
                .then()
                .statusCode(Response.Status.BAD_REQUEST.getStatusCode())
                .body("message", equalTo("Validation failed"));

        assertEquals(0, user.coursesId.size());
    }

    @Test
    @DisplayName("Should return Response 400 (bad request) course DTO passed is not valid")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    @JwtSecurity(
            claims = {
                    @Claim(key = JwtProducer.OID_CLAIM_KEY, value = JwtProducer.DEFAULT_OID),
                    @Claim(key = JwtProducer.NAME_CLAIM_KEY, value = JwtProducer.DEFAULT_NAME),
                    @Claim(key = JwtProducer.EMAIL_CLAIM_KEY, value = JwtProducer.DEFAULT_PREFERRED_USERNAME)
            })
    void test08CreateCourse_NotValidCourseDTONullName() {
        User user = new User();
        user.azureOid = JwtProducer.DEFAULT_OID;
        user.role = Role.TEACHER;
        this.userRepository.persist(user);

        CourseDTO courseDTO = new CourseDTO();

        given().
                contentType(ContentType.JSON)
                .body(courseDTO)
                .when()
                .post("/courses")
                .then()
                .statusCode(Response.Status.BAD_REQUEST.getStatusCode())
                .body("message", equalTo("Validation failed"));

        assertEquals(0, user.coursesId.size());
    }

    @Test
    @DisplayName("Should return Response 400 (bad request) courseDTO's name is duplicated")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    @JwtSecurity(
            claims = {
                    @Claim(key = JwtProducer.OID_CLAIM_KEY, value = JwtProducer.DEFAULT_OID),
                    @Claim(key = JwtProducer.NAME_CLAIM_KEY, value = JwtProducer.DEFAULT_NAME),
                    @Claim(key = JwtProducer.EMAIL_CLAIM_KEY, value = JwtProducer.DEFAULT_PREFERRED_USERNAME)
            })
    void test09CreateCourse_NotValidCourseNameIsDuplicated() {
        User user = new User();
        user.azureOid = JwtProducer.DEFAULT_OID;
        user.role = Role.TEACHER;
        this.userRepository.persist(user);

        String duplicatedName = "Test Course";

        Course course = new Course(duplicatedName);
        this.courseRepository.persist(course);

        CourseDTO courseDTO = new CourseDTO(duplicatedName);
        given()
                .contentType(ContentType.JSON)
                .body(courseDTO)
                .when()
                .post("/courses")
                .then()
                .statusCode(Response.Status.BAD_REQUEST.getStatusCode())
                .body("message", equalTo("Course name " + courseDTO.getName() + " already exists"));
    }

    @Test
    @DisplayName("Should return 200 ok when updating course successfully")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    @JwtSecurity(
            claims = {
                    @Claim(key = JwtProducer.OID_CLAIM_KEY, value = JwtProducer.DEFAULT_OID),
                    @Claim(key = JwtProducer.NAME_CLAIM_KEY, value = JwtProducer.DEFAULT_NAME),
                    @Claim(key = JwtProducer.EMAIL_CLAIM_KEY, value = JwtProducer.DEFAULT_PREFERRED_USERNAME)
            })
    void test10UpdateCourse_Success() {
        User user = new User();
        user.azureOid = JwtProducer.DEFAULT_OID;
        user.role = Role.TEACHER;
        this.userRepository.persist(user);

        Course course = new Course("Old Name");
        this.courseRepository.persist(course);
        this.userRepository.addCourseToUser(course.id.toString(), user.azureOid);

        CourseDTO updateDTO = new CourseDTO("New Name");
        updateDTO.setDescription("Updated Description");

        given()
                .contentType(ContentType.JSON)
                .body(updateDTO)
                .when()
                .put("/courses/" + course.id)
                .then()
                .statusCode(Response.Status.OK.getStatusCode())
                .body("name", equalTo("New Name"))
                .body("description", equalTo("Updated Description"));

        Course updatedCourse = this.courseRepository.findById(course.id);
        user = this.userRepository.findByAzureOidOptional(user.azureOid).orElseThrow();

        assertEquals("New Name", updatedCourse.name);
        assertEquals("Updated Description", updatedCourse.description);
        assertTrue(user.coursesId.contains(course.id.toString()));
    }

    @Test
    @DisplayName("Should return 400 when updating course with empty name")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    @JwtSecurity(
            claims = {
                    @Claim(key = JwtProducer.OID_CLAIM_KEY, value = JwtProducer.DEFAULT_OID),
                    @Claim(key = JwtProducer.NAME_CLAIM_KEY, value = JwtProducer.DEFAULT_NAME),
                    @Claim(key = JwtProducer.EMAIL_CLAIM_KEY, value = JwtProducer.DEFAULT_PREFERRED_USERNAME)
            })
    void test11UpdateCourse_EmptyName() {
        User user = new User();
        user.azureOid = JwtProducer.DEFAULT_OID;
        user.role = Role.TEACHER;
        this.userRepository.persist(user);

        Course course = new Course("Course");
        this.courseRepository.persist(course);
        this.userRepository.addCourseToUser(course.id.toString(), user.azureOid);

        CourseDTO updateDTO = new CourseDTO("");

        given()
                .contentType(ContentType.JSON)
                .body(updateDTO)
                .when()
                .put("/courses/" + course.id)
                .then()
                .statusCode(Response.Status.BAD_REQUEST.getStatusCode())
                .body("message", equalTo("Validation failed"));
    }

    @Test
    @DisplayName("Should return 400 when updating course with null name")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    @JwtSecurity(
            claims = {
                    @Claim(key = JwtProducer.OID_CLAIM_KEY, value = JwtProducer.DEFAULT_OID),
                    @Claim(key = JwtProducer.NAME_CLAIM_KEY, value = JwtProducer.DEFAULT_NAME),
                    @Claim(key = JwtProducer.EMAIL_CLAIM_KEY, value = JwtProducer.DEFAULT_PREFERRED_USERNAME)
            })
    void test12UpdateCourse_NullName() {
        User user = new User();
        user.azureOid = JwtProducer.DEFAULT_OID;
        user.role = Role.TEACHER;
        this.userRepository.persist(user);

        Course course = new Course("Course");
        this.courseRepository.persist(course);
        this.userRepository.addCourseToUser(course.id.toString(), user.azureOid);

        CourseDTO updateDTO = new CourseDTO(null);

        given()
                .contentType(ContentType.JSON)
                .body(updateDTO)
                .when()
                .put("/courses/" + course.id)
                .then()
                .statusCode(Response.Status.BAD_REQUEST.getStatusCode())
                .body("message", equalTo("Validation failed"));
    }

    @Test
    @DisplayName("Should return 403 when updating course not owned")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    @JwtSecurity(
            claims = {
                    @Claim(key = JwtProducer.OID_CLAIM_KEY, value = "another-oid"),
                    @Claim(key = JwtProducer.NAME_CLAIM_KEY, value = "Another User"),
                    @Claim(key = JwtProducer.EMAIL_CLAIM_KEY, value = "another@email.com")
            })
    void test13UpdateCourse_NotOwner() {
        User owner = new User();
        owner.azureOid = JwtProducer.DEFAULT_OID;
        owner.role = Role.TEACHER;
        this.userRepository.persist(owner);

        Course course = new Course("Course");
        this.courseRepository.persist(course);
        this.userRepository.addCourseToUser(course.id.toString(), owner.azureOid);

        User anotherUser = new User();
        anotherUser.azureOid = "another-oid";
        anotherUser.role = Role.TEACHER;
        this.userRepository.persist(anotherUser);

        CourseDTO updateDTO = new CourseDTO("New Name");

        given()
                .contentType(ContentType.JSON)
                .body(updateDTO)
                .when()
                .put("/courses/" + course.id)
                .then()
                .statusCode(Response.Status.FORBIDDEN.getStatusCode())
                .body("message", equalTo("You are not authorized to update or delete this course"));
    }

    @Test
    @DisplayName("Should return 204 when deleting course successfully")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    @JwtSecurity(
            claims = {
                    @Claim(key = JwtProducer.OID_CLAIM_KEY, value = JwtProducer.DEFAULT_OID),
                    @Claim(key = JwtProducer.NAME_CLAIM_KEY, value = JwtProducer.DEFAULT_NAME),
                    @Claim(key = JwtProducer.EMAIL_CLAIM_KEY, value = JwtProducer.DEFAULT_PREFERRED_USERNAME)
            })
    void test14DeleteCourse_Success() {
        User user = new User();
        user.azureOid = JwtProducer.DEFAULT_OID;
        user.role = Role.TEACHER;
        this.userRepository.persist(user);

        Course course = new Course("Course");
        this.courseRepository.persist(course);
        this.userRepository.addCourseToUser(course.id.toString(), user.azureOid);

        given()
                .when()
                .delete("/courses/" + course.id)
                .then()
                .statusCode(Response.Status.NO_CONTENT.getStatusCode());

        user = this.userRepository.findByAzureOidOptional(user.azureOid).orElseThrow();

        assertFalse(this.courseRepository.findByIdOptional(course.id).isPresent());
        assertFalse(user.coursesId.contains(course.id.toString()));
    }

    @Test
    @DisplayName("Should return 403 when deleting course not owned")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    @JwtSecurity(
            claims = {
                    @Claim(key = JwtProducer.OID_CLAIM_KEY, value = "another-oid"),
                    @Claim(key = JwtProducer.NAME_CLAIM_KEY, value = "Another User"),
                    @Claim(key = JwtProducer.EMAIL_CLAIM_KEY, value = "another@email.com")
            })
    void test15DeleteCourse_NotOwner() {
        User owner = new User();
        owner.azureOid = JwtProducer.DEFAULT_OID;
        owner.role = Role.TEACHER;
        this.userRepository.persist(owner);

        Course course = new Course("Course");
        this.courseRepository.persist(course);
        this.userRepository.addCourseToUser(course.id.toString(), owner.azureOid);

        User anotherUser = new User();
        anotherUser.azureOid = "another-oid";
        anotherUser.role = Role.TEACHER;
        this.userRepository.persist(anotherUser);

        given()
                .when()
                .delete("/courses/" + course.id)
                .then()
                .statusCode(Response.Status.FORBIDDEN.getStatusCode())
                .body("message", equalTo("You are not authorized to update or delete this course"));

        owner = this.userRepository.findByAzureOidOptional(owner.azureOid).orElseThrow();

        assertTrue(this.courseRepository.findByIdOptional(course.id).isPresent());
        assertTrue(owner.coursesId.contains(course.id.toString()));
    }

    @Test
    @DisplayName("Should return 404 when course is not found")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    @JwtSecurity(
            claims = {
                    @Claim(key = JwtProducer.OID_CLAIM_KEY, value = JwtProducer.DEFAULT_OID),
                    @Claim(key = JwtProducer.NAME_CLAIM_KEY, value = JwtProducer.DEFAULT_NAME),
                    @Claim(key = JwtProducer.EMAIL_CLAIM_KEY, value = JwtProducer.DEFAULT_PREFERRED_USERNAME)
            })
    void test16DeleteCourse_NotFoundCourse() {
        User owner = new User();
        owner.azureOid = JwtProducer.DEFAULT_OID;
        owner.role = Role.TEACHER;
        this.userRepository.persist(owner);

        Course course = new Course("Course");
        this.courseRepository.persist(course);
        this.userRepository.addCourseToUser(course.id.toString(), owner.azureOid);

        ObjectId nonExistingCourseId = new ObjectId();

        given()
                .when()
                .delete("/courses/" + nonExistingCourseId)
                .then()
                .statusCode(Response.Status.NOT_FOUND.getStatusCode())
                .body("message", equalTo("Course " + nonExistingCourseId + " not found"));

        owner = this.userRepository.findByAzureOidOptional(owner.azureOid).orElseThrow();

        assertTrue(this.courseRepository.findByIdOptional(course.id).isPresent());
        assertTrue(owner.coursesId.contains(course.id.toString()));
    }

    @Test
    @DisplayName("Should return 204 when assigning course to user")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    @JwtSecurity(
            claims = {
                    @Claim(key = JwtProducer.OID_CLAIM_KEY, value = JwtProducer.DEFAULT_OID),
                    @Claim(key = JwtProducer.NAME_CLAIM_KEY, value = JwtProducer.DEFAULT_NAME),
                    @Claim(key = JwtProducer.EMAIL_CLAIM_KEY, value = JwtProducer.DEFAULT_PREFERRED_USERNAME)
            })
    void test17AssignCourse_Success() {
        User user = new User();
        user.azureOid = JwtProducer.DEFAULT_OID;
        user.role = Role.TEACHER;
        this.userRepository.persist(user);

        Course course = new Course("Course");
        this.courseRepository.persist(course);

        given()
                .when()
                .put("/courses/assign/" + course.id)
                .then()
                .statusCode(Response.Status.NO_CONTENT.getStatusCode());

        User updatedUser = this.userRepository.findByAzureOidOptional(user.azureOid).orElseThrow();

        assertTrue(updatedUser.coursesId.contains(course.id.toString()));
    }

    @Test
    @DisplayName("Should return 404 when course is not founded")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    @JwtSecurity(
            claims = {
                    @Claim(key = JwtProducer.OID_CLAIM_KEY, value = JwtProducer.DEFAULT_OID),
                    @Claim(key = JwtProducer.NAME_CLAIM_KEY, value = JwtProducer.DEFAULT_NAME),
                    @Claim(key = JwtProducer.EMAIL_CLAIM_KEY, value = JwtProducer.DEFAULT_PREFERRED_USERNAME)
            })
    void test18AssignCourse_CourseNotFound() {
        User user = new User();
        user.azureOid = JwtProducer.DEFAULT_OID;
        user.role = Role.TEACHER;
        this.userRepository.persist(user);

        Course course = new Course("Course");
        this.courseRepository.persist(course);

        ObjectId nonExistingCourseId = new ObjectId();

        given()
                .when()
                .put("/courses/assign/" + nonExistingCourseId)
                .then()
                .statusCode(Response.Status.NOT_FOUND.getStatusCode())
                .body("message", equalTo("Course " + nonExistingCourseId + " not found"));

        User updatedUser = this.userRepository.findByAzureOidOptional(user.azureOid).orElseThrow();

        assertFalse(updatedUser.coursesId.contains(course.id.toString()));
    }

    @Test
    @DisplayName("Should return 204 when leaving course")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    @JwtSecurity(
            claims = {
                    @Claim(key = JwtProducer.OID_CLAIM_KEY, value = JwtProducer.DEFAULT_OID),
                    @Claim(key = JwtProducer.NAME_CLAIM_KEY, value = JwtProducer.DEFAULT_NAME),
                    @Claim(key = JwtProducer.EMAIL_CLAIM_KEY, value = JwtProducer.DEFAULT_PREFERRED_USERNAME)
            })
    void test19LeftCourse_Success() {
        User user = new User();
        user.azureOid = JwtProducer.DEFAULT_OID;
        user.role = Role.TEACHER;
        this.userRepository.persist(user);

        Course course = new Course("Course");
        this.courseRepository.persist(course);
        this.userRepository.addCourseToUser(course.id.toString(), user.azureOid);

        given()
                .when()
                .put("/courses/left/" + course.id)
                .then()
                .statusCode(Response.Status.NO_CONTENT.getStatusCode());

        User updatedUser = this.userRepository.findByAzureOidOptional(user.azureOid).orElseThrow();

        assertFalse(updatedUser.coursesId.contains(course.id.toString()));
    }

    @Test
    @DisplayName("Should return 404 when Course is not founded")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    @JwtSecurity(
            claims = {
                    @Claim(key = JwtProducer.OID_CLAIM_KEY, value = JwtProducer.DEFAULT_OID),
                    @Claim(key = JwtProducer.NAME_CLAIM_KEY, value = JwtProducer.DEFAULT_NAME),
                    @Claim(key = JwtProducer.EMAIL_CLAIM_KEY, value = JwtProducer.DEFAULT_PREFERRED_USERNAME)
            })
    void test20LeftCourse_CourseNotFound() {
        User user = new User();
        user.azureOid = JwtProducer.DEFAULT_OID;
        user.role = Role.TEACHER;
        this.userRepository.persist(user);

        Course course = new Course("Course");
        this.courseRepository.persist(course);
        this.userRepository.addCourseToUser(course.id.toString(), user.azureOid);

        ObjectId nonExistingCourseId = new ObjectId();

        given()
                .when()
                .put("/courses/left/" + nonExistingCourseId)
                .then()
                .statusCode(Response.Status.NOT_FOUND.getStatusCode())
                .body("message", equalTo("Course " + nonExistingCourseId + " not found"));

        User updatedUser = this.userRepository.findByAzureOidOptional(user.azureOid).orElseThrow();

        assertTrue(updatedUser.coursesId.contains(course.id.toString()));
    }
}
