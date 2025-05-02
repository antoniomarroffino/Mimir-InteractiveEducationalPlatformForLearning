package ch.supsi.controller.course;

import ch.supsi.model.api.user.User;
import ch.supsi.model.dto.api.CourseDTO;
import ch.supsi.service.course.ICourseService;
import ch.supsi.service.user.IUserService;
import io.quarkus.hibernate.validator.runtime.jaxrs.ResteasyReactiveViolationException;
import io.quarkus.test.InjectMock;
import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.security.TestSecurity;
import jakarta.inject.Inject;
import jakarta.ws.rs.ForbiddenException;
import jakarta.ws.rs.InternalServerErrorException;
import jakarta.ws.rs.NotFoundException;
import jakarta.ws.rs.core.Response;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@QuarkusTest
@TestMethodOrder(MethodOrderer.MethodName.class)
public class CourseControllerTest {
    private static final String STR_FOR_OBJECT_ID = ObjectId.get().toString();
    private static final String STR_NON_EXISTENT_ID = ObjectId.get().toString();

    @Inject
    CourseController courseController;

    @InjectMock
    ICourseService courseService;

    @InjectMock
    IUserService userService;

    @Test
    @DisplayName("Should return empty list of all courses")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    void test01GetCourses_Empty() {
        when(this.courseService.getAllCourses()).thenReturn(Collections.emptyList());

        Response response = this.courseController.getCourses();

        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        assertTrue(((List<?>) response.getEntity()).isEmpty());

        verify(this.courseService, times(1)).getAllCourses();
    }

    @Test
    @DisplayName("Should return all courses Not empty")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    void test02GetCourses_WithResults() {
        CourseDTO course1 = new CourseDTO("Course 1");
        CourseDTO course2 = new CourseDTO("Course 2");
        when(this.courseService.getAllCourses()).thenReturn(List.of(course1, course2));

        Response response = this.courseController.getCourses();

        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        assertEquals(2, ((List<?>) response.getEntity()).size());

        verify(this.courseService, times(1)).getAllCourses();
    }

    @Test
    @DisplayName("Should return courses of a teacher (logged)")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    void test03GetTeacherCourses_Success() {
        User user = new User();
        List<CourseDTO> expectedCourses = List.of(new CourseDTO("My Course"));

        when(this.userService.getCurrentLoggedUser()).thenReturn(user);
        when(this.courseService.getTeacherCourses(user)).thenReturn(expectedCourses);

        Response response = this.courseController.getTeacherCourses();

        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        assertEquals(expectedCourses, response.getEntity());

        verify(this.userService, times(1)).getCurrentLoggedUser();
        verify(this.courseService, times(1)).getTeacherCourses(user);
    }

    @Test
    @DisplayName("Should throw 500 when user is not authenticated")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    void test04GetTeacherCourses_InternalError() {
        when(this.userService.getCurrentLoggedUser()).thenReturn(null);
        when(this.courseService.getTeacherCourses(null)).thenThrow(new InternalServerErrorException());

        assertThrows(
                InternalServerErrorException.class,
                () -> this.courseController.getTeacherCourses()
        );
    }

    @Test
    @DisplayName("Should return course founded by id")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    void test05GetCourseById_Success() {
        CourseDTO mockCourse = new CourseDTO("Test Course");
        when(this.courseService.getCourseById(any(ObjectId.class))).thenReturn(mockCourse);

        Response response = this.courseController.getCourse(STR_FOR_OBJECT_ID);

        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        assertEquals(mockCourse, response.getEntity());

        verify(this.courseService, times(1)).getCourseById(any(ObjectId.class));
    }

    @Test
    @DisplayName("Should throw NotFoundException because course id does not exist")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    void test06GetCourseById_NotFound() {
        when(this.courseService.getCourseById(any(ObjectId.class))).thenThrow(new NotFoundException());

        assertThrows(
                NotFoundException.class,
                () -> this.courseController.getCourse(STR_NON_EXISTENT_ID)
        );
    }

    @Test
    @DisplayName("Should create new Course and return newest CourseDTO")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    void test07CreateCourse_Success() {
        User user = new User();
        CourseDTO newCourse = new CourseDTO("New Course");
        when(this.userService.getCurrentLoggedUser()).thenReturn(user);
        when(this.courseService.createCourse(any(CourseDTO.class), eq(user))).thenReturn(newCourse);

        Response response = this.courseController.createCourse(newCourse);

        assertEquals(Response.Status.CREATED.getStatusCode(), response.getStatus());
        assertEquals(newCourse, response.getEntity());

        verify(this.userService, times(1)).getCurrentLoggedUser();
        verify(this.courseService, times(1)).createCourse(any(CourseDTO.class), eq(user));
    }

    @Test
    @DisplayName("Should throw ViolationError because course dto passed is not valid")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    void test08CreateCourse_ValidationViolationError() {
        CourseDTO invalidCourse = new CourseDTO("");

        assertThrows(
                ResteasyReactiveViolationException.class,
                () -> this.courseController.createCourse(invalidCourse)
        );

        verifyNoInteractions(this.userService, this.courseService);
    }

    @Test
    @DisplayName("Should throw 500 when user is not authenticated")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    void test09CreateCourse_InternalError() {
        when(this.userService.getCurrentLoggedUser()).thenReturn(null);
        when(this.courseService.createCourse(any(), any())).thenThrow(new InternalServerErrorException());

        assertThrows(
                InternalServerErrorException.class,
                () -> this.courseController.createCourse(new CourseDTO("New Course"))
        );
    }

    @Test
    @DisplayName("Should update an existing course and return updated CourseDTO")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    void test10UpdateCourse_Success() {
        User user = new User();
        CourseDTO updatedCourse = new CourseDTO("Updated Course");
        when(this.userService.getCurrentLoggedUser()).thenReturn(user);
        when(this.courseService.updateCourse(any(ObjectId.class), any(CourseDTO.class), eq(user))).thenReturn(updatedCourse);

        Response response = this.courseController.updateCourse(STR_FOR_OBJECT_ID, updatedCourse);

        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        assertEquals(updatedCourse, response.getEntity());

        verify(this.userService, times(1)).getCurrentLoggedUser();
        verify(this.courseService, times(1)).updateCourse(any(ObjectId.class), any(CourseDTO.class), eq(user));
    }

    @Test
    @DisplayName("Should throw 403 when updating unauthorized course")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    void test11UpdateCourse_Forbidden() {
        User user = new User();
        CourseDTO updateRequest = new CourseDTO("Unauthorized Update");

        when(this.userService.getCurrentLoggedUser()).thenReturn(user);
        when(this.courseService.updateCourse(any(), any(), any()))
                .thenThrow(new ForbiddenException("Not authorized"));

        assertThrows(
                ForbiddenException.class,
                () -> this.courseController.updateCourse(STR_FOR_OBJECT_ID, updateRequest)
        );
    }

    @Test
    @DisplayName("Should throw 500 when user is not authenticated")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    void test12UpdateCourse_InternalError() {
        when(this.userService.getCurrentLoggedUser()).thenReturn(null);
        when(this.courseService.updateCourse(any(), any(), any())).thenThrow(new InternalServerErrorException());

        assertThrows(
                InternalServerErrorException.class,
                () -> this.courseController.updateCourse(STR_FOR_OBJECT_ID, new CourseDTO("New Course"))
        );
    }

    @Test
    @DisplayName("Should throw ViolationError because course dto passed is not valid")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    void test13UpdateCourse_ValidationViolationError() {
        CourseDTO invalidCourse = new CourseDTO("");

        assertThrows(
                ResteasyReactiveViolationException.class,
                () -> this.courseController.updateCourse(STR_FOR_OBJECT_ID, invalidCourse)
        );

        verifyNoInteractions(this.userService, this.courseService);
    }

    @Test
    @DisplayName("Should delete new Course")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    void test14DeleteCourse_Success() {
        User user = new User();
        when(this.userService.getCurrentLoggedUser()).thenReturn(user);

        Response response = this.courseController.deleteCourse(STR_FOR_OBJECT_ID);

        assertEquals(Response.Status.NO_CONTENT.getStatusCode(), response.getStatus());

        verify(this.userService, times(1)).getCurrentLoggedUser();
        verify(this.courseService).deleteCourse(any(ObjectId.class), eq(user));
    }

    @Test
    @DisplayName("Should throw 403 when deleting unauthorized course")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    void test15DeleteCourse_Forbidden() {
        User user = new User();
        when(this.userService.getCurrentLoggedUser()).thenReturn(user);
        doThrow(new ForbiddenException("Not authorized"))
                .when(this.courseService).deleteCourse(any(), any());

        assertThrows(
                ForbiddenException.class,
                () -> this.courseController.deleteCourse(STR_FOR_OBJECT_ID)
        );
    }

    @Test
    @DisplayName("Should throw 500 when user is not authenticated")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    void test16DeleteCourse_InternalError() {
        when(this.userService.getCurrentLoggedUser()).thenReturn(null);
        doThrow(new InternalServerErrorException()).when(this.courseService).deleteCourse(any(), any());

        assertThrows(
                InternalServerErrorException.class,
                () -> this.courseController.deleteCourse(STR_FOR_OBJECT_ID)
        );
    }

    @Test
    @DisplayName("Should assign new Course")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    void test17AssignCourse_Success() {
        User user = new User();
        when(this.userService.getCurrentLoggedUser()).thenReturn(user);

        Response response = this.courseController.assignCourse(STR_FOR_OBJECT_ID);

        assertEquals(Response.Status.NO_CONTENT.getStatusCode(), response.getStatus());

        verify(this.userService, times(1)).getCurrentLoggedUser();
        verify(this.courseService).assignCourse(any(ObjectId.class), eq(user));
    }

    @Test
    @DisplayName("Should throw 404 when assigning non-existent course")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    void test18AssignCourse_NotFound() {
        User user = new User();
        when(this.userService.getCurrentLoggedUser()).thenReturn(user);
        doThrow(new NotFoundException())
                .when(this.courseService).assignCourse(any(), any());

        assertThrows(
                NotFoundException.class,
                () -> this.courseController.assignCourse(STR_NON_EXISTENT_ID)
        );
    }

    @Test
    @DisplayName("Should throw 500 when user is not authenticated")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    void test19AssignCourse_InternalError() {
        when(this.userService.getCurrentLoggedUser()).thenReturn(null);
        doThrow(new InternalServerErrorException()).when(this.courseService).assignCourse(any(), any());

        assertThrows(
                InternalServerErrorException.class,
                () -> this.courseController.assignCourse(STR_FOR_OBJECT_ID)
        );
    }

    @Test
    @DisplayName("Should leave a course")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    void test20LeftCourse_Success() {
        User user = new User();
        when(this.userService.getCurrentLoggedUser()).thenReturn(user);

        Response response = this.courseController.leftCourse(STR_FOR_OBJECT_ID);

        assertEquals(Response.Status.NO_CONTENT.getStatusCode(), response.getStatus());

        verify(this.userService, times(1)).getCurrentLoggedUser();
        verify(this.courseService).leftCourse(any(ObjectId.class), eq(user));
    }

    @Test
    @DisplayName("Should throw 404 when leaving non-existent course")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    void test21LeftCourse_NotFound() {
        User user = new User();
        when(this.userService.getCurrentLoggedUser()).thenReturn(user);
        doThrow(new NotFoundException())
                .when(this.courseService).leftCourse(any(), any());

        assertThrows(
                NotFoundException.class,
                () -> this.courseController.leftCourse(STR_NON_EXISTENT_ID)
        );
    }

    @Test
    @DisplayName("Should throw 500 when user is not authenticated")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    void test22LeftCourse_InternalError() {
        when(this.userService.getCurrentLoggedUser()).thenReturn(null);
        doThrow(new InternalServerErrorException()).when(this.courseService).leftCourse(any(), any());

        assertThrows(
                InternalServerErrorException.class,
                () -> this.courseController.leftCourse(STR_FOR_OBJECT_ID)
        );
    }
}
