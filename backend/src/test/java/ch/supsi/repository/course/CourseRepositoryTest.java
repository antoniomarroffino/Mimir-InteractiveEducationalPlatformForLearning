package ch.supsi.repository.course;

import ch.supsi.model.api.Course;
import ch.supsi.repository.CourseRepository;
import ch.supsi.service.course.CourseServiceTest;
import ch.supsi.testContainersResource.MongoTestResource;
import io.quarkus.test.common.QuarkusTestResource;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import org.junit.jupiter.api.*;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@QuarkusTest
@QuarkusTestResource(MongoTestResource.class)
@TestMethodOrder(MethodOrderer.MethodName.class)
public class CourseRepositoryTest {
    @Inject
    CourseRepository courseRepository;

    @BeforeEach
    public void cleanup() {
        this.courseRepository.deleteAll();
    }

    @Test
    @DisplayName("Should return Optional of course founded in DB by Course's name")
    public void test01FindByNameOptionalFound() {
        String course_name = "Test Course";
        Course course = CourseServiceTest.createTestCourse(course_name, "");
        this.courseRepository.persist(course);

        Optional<Course> found = this.courseRepository.findByNameOptional(course_name);

        assertTrue(found.isPresent());
        assertEquals(course.name, found.get().name);
    }

    @Test
    @DisplayName("Should return Empty Optional of course founded in DB by Course's name")
    public void testFindByNameOptionalNotFound() {
        Optional<Course> found = this.courseRepository.findByNameOptional("This Course Does Not Exist");

        assertFalse(found.isPresent());
    }
}
