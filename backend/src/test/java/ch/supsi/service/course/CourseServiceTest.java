package ch.supsi.service.course;

import ch.supsi.model.api.Course;
import ch.supsi.model.api.Folder;
import ch.supsi.model.dto.api.CourseDTO;
import ch.supsi.repository.CourseRepository;
import io.quarkus.test.InjectMock;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import jakarta.ws.rs.BadRequestException;
import jakarta.ws.rs.NotFoundException;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@QuarkusTest
@TestMethodOrder(MethodOrderer.MethodName.class)
public class CourseServiceTest {
    @Inject
    CourseService courseService;

    @InjectMock
    CourseRepository courseRepository;

    /*
    @Test
    @DisplayName("Should get empty list of courses")
    void test01GetAllCourses_Empty() {
        when(this.courseRepository.listAll()).thenReturn(Collections.emptyList());

        List<CourseDTO> courses = this.courseService.getAllCourses();
        assertTrue(courses.isEmpty());

        verify(this.courseRepository, times(1)).listAll();
    }

    @Test
    @DisplayName("Should get list of two courses")
    void test02GetAllCourses() {
        Course course1 = new Course("course1");
        Course course2 = new Course("course2");

        Folder folder1 = new Folder("folder1");
        course1.getFolders().add(folder1);

        when(this.courseRepository.listAll()).thenReturn(List.of(course1, course2));

        List<CourseDTO> courses = this.courseService.getAllCourses();
        assertEquals(2, courses.size());

        CourseDTO course1RetrievedDTO = courses.getFirst();
        assertEquals(course1.getName(), course1RetrievedDTO.getName());
        assertEquals(1, course1RetrievedDTO.getFolders().size());
        assertEquals(folder1.getName(), course1RetrievedDTO.getFolders().getFirst().getName());

        CourseDTO course2RetrievedDTO = courses.get(1);
        assertEquals(course2.getName(), course2RetrievedDTO.getName());
        assertEquals(0, course2RetrievedDTO.getFolders().size());

        verify(this.courseRepository, times(1)).listAll();
    }

    @Test
    @DisplayName("Should get one course given course id")
    void test03GetCourseById() {
        Course course = new Course("course1");

        Folder folder1 = new Folder("folder1");
        course.getFolders().add(folder1);

        when(this.courseRepository.findByIdOptional(any(ObjectId.class))).thenReturn(Optional.of(course));

        CourseDTO courseDTO = this.courseService.getCourseById(new ObjectId());
        assertEquals(course.getName(), courseDTO.getName());
        assertEquals(1, courseDTO.getFolders().size());
        assertEquals(folder1.getName(), courseDTO.getFolders().getFirst().getName());


        verify(this.courseRepository, times(1)).findByIdOptional(any(ObjectId.class));
    }

    @Test
    @DisplayName("Should throw NotFoundException: course not found")
    void test04GetCourseById_ThrowNotFoundExceptionCourseNotFound() {
        ObjectId courseId = new ObjectId();

        when(this.courseRepository.findByIdOptional(any(ObjectId.class))).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> this.courseService.getCourseById(new ObjectId()));

        verify(this.courseRepository, times(1)).findByIdOptional(any(ObjectId.class));

        try {
            this.courseService.getCourseById(courseId);
        } catch (NotFoundException e) {
            assertEquals(e.getMessage(), "Course " + courseId + " not found");
        }
    }

    @Test
    @DisplayName("Should create a course")
    void test05CreateCourse() {
        CourseDTO courseDTO = new CourseDTO("course");

        CourseDTO courseRetrievedDTO = this.courseService.createCourse(courseDTO);
        assertEquals(courseDTO.getName(), courseRetrievedDTO.getName());

        verify(this.courseRepository, times(1)).persist(any(Course.class));
        verify(this.courseRepository, times(1)).listAll();
    }

    @Test
    @DisplayName("Should throw BadRequestException: courseDTO passed is null")
    void test06CreateCourse_BadRequestExceptionCourseDTOIsNull() {
        assertThrows(BadRequestException.class, () -> this.courseService.createCourse(null));

        verify(this.courseRepository, never()).persist(any(Course.class));
        verify(this.courseRepository, never()).listAll();

        try {
            this.courseService.createCourse(null);
        } catch (BadRequestException e) {
            assertEquals("Course is null", e.getMessage());
        }
    }

    @Test
    @DisplayName("Should throw BadRequestException: courseDTO passed is duplicated")
    void test07CreateCourse_BadRequestExceptionCourseDTOIsDuplicated() {
        String courseName = "course1";
        CourseDTO courseDTO = new CourseDTO(courseName);

        Course course = new Course(courseName);

        when(this.courseRepository.listAll()).thenReturn(List.of(course));

        assertThrows(BadRequestException.class, () -> this.courseService.createCourse(courseDTO));

        verify(this.courseRepository, never()).persist(any(Course.class));
        verify(this.courseRepository, times(1)).listAll();

        try {
            this.courseService.createCourse(courseDTO);
        } catch (BadRequestException e) {
            assertEquals("Course name " + courseName + " already existing", e.getMessage());
        }
    }
    */
}
