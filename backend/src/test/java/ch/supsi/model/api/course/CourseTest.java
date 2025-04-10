package ch.supsi.model.api.course;

import ch.supsi.model.api.Course;
import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

import static org.junit.jupiter.api.Assertions.*;

@QuarkusTest
@TestMethodOrder(MethodOrderer.MethodName.class)
public class CourseTest {
    @Test
    @DisplayName("Should create new Course with constructor no parameters")
    void test01CreateCourse_ConstructorWithNoParameters() {
        Course course = new Course();
        assertNull(course.id);
        assertNull(course.name);
        assertNull(course.description);
        assertNotNull(course.folders);
        assertTrue(course.folders.isEmpty());
    }

    @Test
    @DisplayName("Should create new Course passing name to constructor")
    void test02CreateCourse_ConstructorWithParameters() {
        String name = "test";
        Course course = new Course(name);
        assertNull(course.id);
        assertEquals(name, course.name);
        assertNull(course.description);
        assertNotNull(course.folders);
        assertTrue(course.folders.isEmpty());
    }

    @Test
    @DisplayName("Should create new Course passing name and description to constructor")
    void test03CreateCourse_ConstructorWithParametersAndDescription() {
        String name = "test";
        String description = "test";
        Course course = new Course(name, description);
        assertNull(course.id);
        assertEquals(name, course.name);
        assertEquals(description, course.description);
        assertNotNull(course.folders);
        assertTrue(course.folders.isEmpty());
    }
}
