package ch.supsi.service.course;

import ch.supsi.mapper.CourseMapper;
import ch.supsi.model.api.Course;
import ch.supsi.model.api.user.User;
import ch.supsi.model.dto.api.CourseDTO;
import ch.supsi.repository.CourseRepository;
import ch.supsi.repository.UserRepository;
import io.quarkus.test.InjectMock;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import jakarta.ws.rs.BadRequestException;
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
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@QuarkusTest
@TestMethodOrder(MethodOrderer.MethodName.class)
public class CourseServiceTest {
    @Inject
    CourseService courseService;

    @InjectMock
    CourseRepository courseRepositoryMocked;

    @InjectMock
    UserRepository userRepositoryMocked;

    @InjectMock
    CourseMapper courseMapperMocked;

    @Test
    @DisplayName("Should throw InternalServerError 500 because user logged is null")
    void test01GetTeacherCourses_ThrowInternalServerErrorUserIsNull() {
        InternalServerErrorException exception = assertThrows(
                InternalServerErrorException.class,
                () -> this.courseService.getTeacherCourses(null)
        );
        assertEquals(Response.Status.INTERNAL_SERVER_ERROR.getStatusCode(), exception.getResponse().getStatus());
        assertEquals("User logged is null", exception.getMessage());
    }

    @Test
    @DisplayName("Should return an empty list")
    void test02GetTeacherCourses_Empty() {
        User user = new User();
        user.coursesId = Set.of();

        List<CourseDTO> courses = this.courseService.getTeacherCourses(user);
        assertTrue(courses.isEmpty());

        verify(this.courseRepositoryMocked, never()).findByIdOptional(any(ObjectId.class));
        verify(this.courseMapperMocked, never()).toDTO(any(Course.class));
    }

    @Test
    @DisplayName("Should return one correct CourseDTO of a logged user")
    void test03GetTeacherCourses_OneCourseDTO() {
        User user = new User();

        String course_name = "Course";
        String course_description = "Course";
        Course course = createTestCourse(course_name, course_description);

        user.coursesId = Set.of(course.id.toString());

        CourseDTO course_DTO = convertToDTO(course);

        when(this.courseRepositoryMocked.findByIdOptional(course.id)).thenReturn(Optional.of(course));
        when(this.courseMapperMocked.toDTO(course)).thenReturn(course_DTO);

        List<CourseDTO> courses = this.courseService.getTeacherCourses(user);
        assertEquals(1, courses.size());
        assertEquals(course.id.toString(), courses.getFirst().getId());
        assertEquals(course_name, courses.getFirst().getName());
        assertEquals(course_description, courses.getFirst().getDescription());


        verify(this.courseRepositoryMocked, times(1)).findByIdOptional(course.id);
        verify(this.courseMapperMocked, times(1)).toDTO(course);
    }

    @Test
    @DisplayName("Should get empty list of courses")
    void test04GetAllCourses_Empty() {
        when(this.courseRepositoryMocked.listAll()).thenReturn(Collections.emptyList());

        List<CourseDTO> courses = this.courseService.getAllCourses();
        assertTrue(courses.isEmpty());

        verify(this.courseRepositoryMocked, times(1)).listAll();
        verify(this.courseMapperMocked, never()).toDTO(any(Course.class));
    }

    @Test
    @DisplayName("Should get list of one course")
    void test05GetAllCourses_OneCourseDTO() {
        String course_one_name = "Course";
        String course_one_description = "Course";
        Course course_one = createTestCourse(course_one_name, course_one_description);

        CourseDTO course_one_DTO = convertToDTO(course_one);

        when(this.courseRepositoryMocked.listAll()).thenReturn(List.of(course_one));
        when(this.courseMapperMocked.toDTO(course_one)).thenReturn(course_one_DTO);

        List<CourseDTO> courses = this.courseService.getAllCourses();
        assertEquals(1, courses.size());

        CourseDTO course1RetrievedDTO = courses.getFirst();
        assertEquals(course_one.id.toString(), course1RetrievedDTO.getId());
        assertEquals(course_one.name, course1RetrievedDTO.getName());
        assertEquals(course_one.description, course1RetrievedDTO.getDescription());

        verify(this.courseRepositoryMocked, times(1)).listAll();
        verify(this.courseMapperMocked, times(1)).toDTO(course_one);
    }

    @Test
    @DisplayName("Should throw NotFoundException 404 because course is not found by courseId")
    void test06GetCourseById_ThrowNotFoundExceptionCourseIdDoesNotExist() {
        ObjectId id = new ObjectId();

        when(this.courseRepositoryMocked.findByIdOptional(any(ObjectId.class))).thenReturn(Optional.empty());

        NotFoundException exception = assertThrows(
                NotFoundException.class,
                () -> this.courseService.getCourseById(id)
        );

        assertEquals(Response.Status.NOT_FOUND.getStatusCode(), exception.getResponse().getStatus());
        assertEquals("Course " + id + " not found", exception.getMessage());

        verify(this.courseRepositoryMocked, times(1)).findByIdOptional(any(ObjectId.class));
        verify(this.courseMapperMocked, never()).toDTO(any(Course.class));
    }

    @Test
    @DisplayName("Should return one course given courseId")
    void test07GetCourseById_ReturnOneCourseById() {
        String course_one_name = "Course";
        String course_one_description = "Course";
        Course course = createTestCourse(course_one_name, course_one_description);

        when(this.courseRepositoryMocked.findByIdOptional(course.id)).thenReturn(Optional.of(course));
        when(this.courseMapperMocked.toDTO(course)).thenReturn(convertToDTO(course));

        CourseDTO course_DTO = this.courseService.getCourseById(course.id);
        assertEquals(course.id.toString(), course_DTO.getId());
        assertEquals(course.name, course_DTO.getName());
        assertEquals(course.description, course_DTO.getDescription());

        verify(this.courseRepositoryMocked, times(1)).findByIdOptional(course.id);
        verify(this.courseMapperMocked, times(1)).toDTO(course);
    }

    @Test
    @DisplayName("Should throw InternalServerError 500 because logged user passed is null")
    void test08CreateCourse_ThrowInternalServerErrorUserIsNull() {
        InternalServerErrorException exception = assertThrows(
                InternalServerErrorException.class,
                () -> this.courseService.createCourse(new CourseDTO(), null)
        );

        assertEquals(Response.Status.INTERNAL_SERVER_ERROR.getStatusCode(), exception.getResponse().getStatus());
        assertEquals("User logged is null", exception.getMessage());

        verify(this.courseRepositoryMocked, never()).persist(any(Course.class));
        verify(this.courseRepositoryMocked, never()).findByNameOptional(anyString());
        verify(this.userRepositoryMocked, never()).addCourseToUser(anyString(), anyString());
        verify(this.courseMapperMocked, never()).toEntity(any(CourseDTO.class));
        verify(this.courseMapperMocked, never()).toDTO(any(Course.class));
    }

    @Test
    @DisplayName("Should throw BadRequestException 404 because CourseDTO passed is null")
    void test09CreateCourse_ThrowBadRequestExceptionCourseDTOIsNull() {
        BadRequestException exception = assertThrows(
                BadRequestException.class,
                () -> this.courseService.createCourse(null, new User())
        );

        assertEquals(Response.Status.BAD_REQUEST.getStatusCode(), exception.getResponse().getStatus());
        assertEquals("Course data cannot be null", exception.getMessage());

        verify(this.courseRepositoryMocked, never()).persist(any(Course.class));
        verify(this.courseRepositoryMocked, never()).findByNameOptional(anyString());
        verify(this.userRepositoryMocked, never()).addCourseToUser(anyString(), anyString());
        verify(this.courseMapperMocked, never()).toEntity(any(CourseDTO.class));
        verify(this.courseMapperMocked, never()).toDTO(any(Course.class));
    }

    @Test
    @DisplayName("Should throw BadRequestException 404 because CourseDTO passed has empty name")
    void test10CreateCourse_ThrowBadRequestExceptionCourseDTOHasEmptyName() {
        Course course = createTestCourse("", "");

        BadRequestException exception = assertThrows(
                BadRequestException.class,
                () -> this.courseService.createCourse(convertToDTO(course), new User())
        );

        assertEquals(Response.Status.BAD_REQUEST.getStatusCode(), exception.getResponse().getStatus());
        assertEquals("Course name cannot be empty", exception.getMessage());

        verify(this.courseRepositoryMocked, never()).persist(any(Course.class));
        verify(this.courseRepositoryMocked, never()).findByNameOptional(anyString());
        verify(this.userRepositoryMocked, never()).addCourseToUser(anyString(), anyString());
        verify(this.courseMapperMocked, never()).toEntity(any(CourseDTO.class));
        verify(this.courseMapperMocked, never()).toDTO(any(Course.class));
    }

    @Test
    @DisplayName("Should throw BadRequestException 404 because CourseDTO passed has duplicated name")
    void test11CreateCourse_ThrowBadRequestExceptionCourseDTOHasDuplicatedName() {
        CourseDTO courseDTO = new CourseDTO();
        courseDTO.setName("Course");

        when(this.courseRepositoryMocked.findByNameOptional(anyString())).thenReturn(Optional.of(new Course()));

        BadRequestException exception = assertThrows(
                BadRequestException.class,
                () -> this.courseService.createCourse(courseDTO, new User())
        );

        assertEquals(Response.Status.BAD_REQUEST.getStatusCode(), exception.getResponse().getStatus());
        assertEquals("Course name " + courseDTO.getName() + " already exists", exception.getMessage());

        verify(this.courseRepositoryMocked, never()).persist(any(Course.class));
        verify(this.courseRepositoryMocked, times(1)).findByNameOptional(anyString());
        verify(this.userRepositoryMocked, never()).addCourseToUser(anyString(), anyString());
        verify(this.courseMapperMocked, never()).toEntity(any(CourseDTO.class));
        verify(this.courseMapperMocked, never()).toDTO(any(Course.class));
    }

    @Test
    @DisplayName("Should create one Course and return one CourseDTO")
    void test12CreateCourse_CreateAndReturnOneCourse() {
        User user = new User();
        user.azureOid = "test";

        Course newCourse = createTestCourse("New Course", "");
        CourseDTO newCourseDTO = convertToDTO(newCourse);

        when(this.courseRepositoryMocked.findByNameOptional(anyString())).thenReturn(Optional.empty());
        when(this.courseMapperMocked.toEntity(newCourseDTO)).thenReturn(newCourse);
        when(this.courseMapperMocked.toDTO(newCourse)).thenReturn(newCourseDTO);

        this.courseService.createCourse(newCourseDTO, user);

        verify(this.courseRepositoryMocked, times(1)).persist(newCourse);
        verify(this.courseRepositoryMocked, times(1)).findByNameOptional(newCourseDTO.getName());
        verify(this.userRepositoryMocked, times(1)).addCourseToUser(newCourse.id.toString(), user.azureOid);
        verify(this.courseMapperMocked, times(1)).toEntity(newCourseDTO);
        verify(this.courseMapperMocked, times(1)).toDTO(newCourse);
    }

    @Test
    @DisplayName("Should throw InternalServerError 500 because user logged is null")
    void test13AssignCourse_ThrowInternalServerErrorUserLoggedIsNull() {
        InternalServerErrorException exception = assertThrows(
                InternalServerErrorException.class,
                () -> this.courseService.assignCourse(new ObjectId(), null)
        );

        assertEquals(Response.Status.INTERNAL_SERVER_ERROR.getStatusCode(), exception.getResponse().getStatus());
        assertEquals("User logged is null", exception.getMessage());

        verify(this.courseRepositoryMocked, never()).findByIdOptional(any(ObjectId.class));
        verify(this.userRepositoryMocked, never()).addCourseToUser(anyString(), anyString());
    }

    @Test
    @DisplayName("Should throw NotFoundError 404 because courseId does not exist")
    void test14AssignCourse_ThrowNotFoundExceptionCourseIdDoesNotExist() {
        ObjectId id = new ObjectId();

        when(this.courseRepositoryMocked.findByIdOptional(id)).thenReturn(Optional.empty());

        NotFoundException exception = assertThrows(
                NotFoundException.class,
                () -> this.courseService.assignCourse(id, new User())
        );

        assertEquals(Response.Status.NOT_FOUND.getStatusCode(), exception.getResponse().getStatus());
        assertEquals("Course " + id + " not found", exception.getMessage());

        verify(this.courseRepositoryMocked, times(1)).findByIdOptional(id);
        verify(this.userRepositoryMocked, never()).addCourseToUser(anyString(), anyString());
    }

    @Test
    @DisplayName("Should assign new courseId to user logged")
    void test15AssignCourse() {
        User user = new User();
        Course course = createTestCourse("New Course", "");

        when(this.courseRepositoryMocked.findByIdOptional(course.id)).thenReturn(Optional.of(course));

        this.courseService.assignCourse(course.id, user);

        verify(this.courseRepositoryMocked, times(1)).findByIdOptional(course.id);
        verify(this.userRepositoryMocked, times(1)).addCourseToUser(course.id.toString(), user.azureOid);
    }

    @Test
    @DisplayName("Should throw InternalServerError 500 because user logged is null")
    void test16LeftCourse_ThrowInternalServerErrorUserLoggedIsNull() {
        InternalServerErrorException exception = assertThrows(
                InternalServerErrorException.class,
                () -> this.courseService.leftCourse(new ObjectId(), null)
        );

        assertEquals(Response.Status.INTERNAL_SERVER_ERROR.getStatusCode(), exception.getResponse().getStatus());
        assertEquals("User logged is null", exception.getMessage());

        verify(this.courseRepositoryMocked, never()).findByIdOptional(any(ObjectId.class));
        verify(this.userRepositoryMocked, never()).removeCourseFromUser(anyString(), anyString());
    }

    @Test
    @DisplayName("Should throw NotFoundError 404 because courseId does not exist")
    void test17LeftCourse_ThrowNotFoundExceptionCourseIdDoesNotExist() {
        ObjectId id = new ObjectId();

        when(this.courseRepositoryMocked.findByIdOptional(id)).thenReturn(Optional.empty());

        NotFoundException exception = assertThrows(
                NotFoundException.class,
                () -> this.courseService.leftCourse(id, new User())
        );

        assertEquals(Response.Status.NOT_FOUND.getStatusCode(), exception.getResponse().getStatus());
        assertEquals("Course " + id + " not found", exception.getMessage());

        verify(this.courseRepositoryMocked, times(1)).findByIdOptional(id);
        verify(this.userRepositoryMocked, never()).removeCourseFromUser(anyString(), anyString());
    }

    @Test
    @DisplayName("Should assign new courseId to user logged")
    void test18LeftCourse() {
        User user = new User();
        Course course = createTestCourse("New Course", "");

        when(this.courseRepositoryMocked.findByIdOptional(course.id)).thenReturn(Optional.of(course));

        this.courseService.leftCourse(course.id, user);

        verify(this.courseRepositoryMocked, times(1)).findByIdOptional(course.id);
        verify(this.userRepositoryMocked, times(1)).removeCourseFromUser(course.id.toString(), user.azureOid);
    }

    @Test
    @DisplayName("Should throw InternalServerError 500 because user logged is null")
    void test19UpdateCourse_ThrowInternalServerErrorUserLoggedIsNull() {
        InternalServerErrorException exception = assertThrows(
                InternalServerErrorException.class,
                () -> this.courseService.updateCourse(new ObjectId(), new CourseDTO(), null)
        );

        assertEquals(Response.Status.INTERNAL_SERVER_ERROR.getStatusCode(), exception.getResponse().getStatus());
        assertEquals("User logged is null", exception.getMessage());

        verify(this.courseRepositoryMocked, never()).findByIdOptional(any(ObjectId.class));
        verify(this.courseRepositoryMocked, never()).update(any(Course.class));
        verify(this.courseMapperMocked, never()).toDTO(any(Course.class));
    }

    @Test
    @DisplayName("Should throw BadRequestException 404 because CourseDTO passed is null")
    void test20UpdateCourse_ThrowBadRequestExceptionCourseDTOIsNull() {
        BadRequestException exception = assertThrows(
                BadRequestException.class,
                () -> this.courseService.updateCourse(new ObjectId(), null, new User())
        );

        assertEquals(Response.Status.BAD_REQUEST.getStatusCode(), exception.getResponse().getStatus());
        assertEquals("Course data cannot be null", exception.getMessage());

        verify(this.courseRepositoryMocked, never()).findByIdOptional(any(ObjectId.class));
        verify(this.courseRepositoryMocked, never()).update(any(Course.class));
        verify(this.courseMapperMocked, never()).toDTO(any(Course.class));
    }

    @Test
    @DisplayName("Should throw BadRequestException 404 because CourseDTO passed has empty name")
    void test21UpdateCourse_ThrowBadRequestExceptionCourseDTOHasEmptyName() {
        Course course = createTestCourse("Test", "");

        User user = new User();
        user.coursesId.add(course.id.toString());

        when(this.courseRepositoryMocked.findByIdOptional(any(ObjectId.class))).thenReturn(Optional.of(course));

        BadRequestException exception = assertThrows(
                BadRequestException.class,
                () -> this.courseService.updateCourse(course.id, new CourseDTO(""), user)
        );

        assertEquals(Response.Status.BAD_REQUEST.getStatusCode(), exception.getResponse().getStatus());
        assertEquals("Course name cannot be empty", exception.getMessage());

        verify(this.courseRepositoryMocked, times(1)).findByIdOptional(any(ObjectId.class));
        verify(this.courseRepositoryMocked, never()).update(any(Course.class));
        verify(this.courseMapperMocked, never()).toDTO(any(Course.class));
    }

    @Test
    @DisplayName("Should throw BadRequestException 404 because CourseDTO passed has duplicated name")
    void test22UpdateCourse_ThrowBadRequestExceptionCourseDTOHasDuplicatedName() {
        Course course = createTestCourse("Course", "");

        CourseDTO courseDTO = new CourseDTO();
        courseDTO.setName("Course updated");

        User user = new User();
        user.coursesId.add(course.id.toString());

        when(this.courseRepositoryMocked.findByIdOptional(any(ObjectId.class))).thenReturn(Optional.of(course));
        when(this.courseRepositoryMocked.findByNameOptional(anyString())).thenReturn(Optional.of(new Course()));

        BadRequestException exception = assertThrows(
                BadRequestException.class,
                () -> this.courseService.updateCourse(course.id, courseDTO, user)
        );

        assertEquals(Response.Status.BAD_REQUEST.getStatusCode(), exception.getResponse().getStatus());
        assertEquals("Course name " + courseDTO.getName() + " already exists", exception.getMessage());

        verify(this.courseRepositoryMocked, times(1)).findByIdOptional(any(ObjectId.class));
        verify(this.courseRepositoryMocked, never()).update(any(Course.class));
        verify(this.courseMapperMocked, never()).toDTO(any(Course.class));
    }

    @Test
    @DisplayName("Should throw NotFoundError 404 because courseId does not exist")
    void test23UpdateCourse_ThrowNotFoundExceptionCourseIdDoesNotExist() {
        Course course = createTestCourse("New Course", "");

        CourseDTO courseDTO = convertToDTO(course);

        when(this.courseRepositoryMocked.findByNameOptional(anyString())).thenReturn(Optional.empty());
        when(this.courseRepositoryMocked.findByIdOptional(course.id)).thenReturn(Optional.empty());

        NotFoundException exception = assertThrows(
                NotFoundException.class,
                () -> this.courseService.updateCourse(course.id, courseDTO, new User())
        );

        assertEquals(Response.Status.NOT_FOUND.getStatusCode(), exception.getResponse().getStatus());
        assertEquals("Course " + course.id + " not found", exception.getMessage());

        verify(this.courseRepositoryMocked, times(1)).findByIdOptional(course.id);
        verify(this.courseRepositoryMocked, never()).update(any(Course.class));
        verify(this.courseMapperMocked, never()).toDTO(any(Course.class));
    }

    @Test
    @DisplayName("Should throw ForbiddenError 403 because user is not an owner")
    void test24UpdateCourse_ThrowForbiddenExceptionUserIsNotAuthorized() {
        Course course = createTestCourse("New Course", "");

        CourseDTO courseDTO = convertToDTO(course);

        User user = new User();
        user.coursesId = Set.of();

        when(this.courseRepositoryMocked.findByNameOptional(anyString())).thenReturn(Optional.empty());
        when(this.courseRepositoryMocked.findByIdOptional(course.id)).thenReturn(Optional.of(course));

        ForbiddenException exception = assertThrows(
                ForbiddenException.class,
                () -> this.courseService.updateCourse(course.id, courseDTO, user)
        );

        assertEquals(Response.Status.FORBIDDEN.getStatusCode(), exception.getResponse().getStatus());
        assertEquals("You are not authorized to update or delete this course", exception.getMessage());

        verify(this.courseRepositoryMocked, times(1)).findByIdOptional(course.id);
        verify(this.courseRepositoryMocked, never()).update(any(Course.class));
        verify(this.courseMapperMocked, never()).toDTO(any(Course.class));
    }

    @Test
    @DisplayName("Should return updated course")
    void test25UpdateCourse_ReturnUpdatedCourse() {
        Course existingCourse = createTestCourse("Course", "Course");

        String new_course_name = "New Course";
        String new_course_description = "New Description";
        CourseDTO courseDTO = new CourseDTO();
        courseDTO.setId(existingCourse.id.toString());
        courseDTO.setName(new_course_name);
        courseDTO.setDescription(new_course_description);

        User user = new User();
        user.coursesId = Set.of(existingCourse.id.toString());

        when(this.courseRepositoryMocked.findByNameOptional(anyString())).thenReturn(Optional.empty());
        when(this.courseRepositoryMocked.findByIdOptional(existingCourse.id)).thenReturn(Optional.of(existingCourse));
        when(this.courseMapperMocked.toDTO(existingCourse)).thenReturn(courseDTO);

        this.courseService.updateCourse(existingCourse.id, courseDTO, user);
        assertEquals(new_course_name, existingCourse.name);
        assertEquals(new_course_description, existingCourse.description);

        verify(this.courseRepositoryMocked, times(1)).findByIdOptional(existingCourse.id);
        verify(this.courseRepositoryMocked, times(1)).update(existingCourse);
        verify(this.courseMapperMocked, times(1)).toDTO(existingCourse);
    }

    @Test
    @DisplayName("Should throw InternalServerError 500 because user logged is null")
    void test26DeleteCourse_ThrowInternalServerErrorUserLoggedIsNull() {
        InternalServerErrorException exception = assertThrows(
                InternalServerErrorException.class,
                () -> this.courseService.deleteCourse(new ObjectId(), null)
        );

        assertEquals(Response.Status.INTERNAL_SERVER_ERROR.getStatusCode(), exception.getResponse().getStatus());
        assertEquals("User logged is null", exception.getMessage());

        verify(this.courseRepositoryMocked, never()).findByIdOptional(any(ObjectId.class));
        verify(this.courseRepositoryMocked, never()).delete(any(Course.class));
        verify(this.userRepositoryMocked, never()).removeCourseFromUser(anyString(), anyString());
    }

    @Test
    @DisplayName("Should throw NotFoundError 404 because courseId does not exist")
    void test27DeleteCourse_ThrowNotFoundExceptionCourseIdDoesNotExist() {
        Course course = createTestCourse("New Course", "");

        when(this.courseRepositoryMocked.findByIdOptional(course.id)).thenReturn(Optional.empty());

        NotFoundException exception = assertThrows(
                NotFoundException.class,
                () -> this.courseService.deleteCourse(course.id, new User())
        );

        assertEquals(Response.Status.NOT_FOUND.getStatusCode(), exception.getResponse().getStatus());
        assertEquals("Course " + course.id + " not found", exception.getMessage());

        verify(this.courseRepositoryMocked, times(1)).findByIdOptional(course.id);
        verify(this.courseRepositoryMocked, never()).delete(any(Course.class));
        verify(this.userRepositoryMocked, never()).removeCourseFromUser(anyString(), anyString());
    }

    @Test
    @DisplayName("Should throw ForbiddenError 403 because user is not an owner")
    void test28DeleteCourse_ThrowForbiddenExceptionUserIsNotAuthorized() {
        Course course = createTestCourse("New Course", "");

        User user = new User();
        user.coursesId = Set.of();

        when(this.courseRepositoryMocked.findByIdOptional(course.id)).thenReturn(Optional.of(course));

        ForbiddenException exception = assertThrows(
                ForbiddenException.class,
                () -> this.courseService.deleteCourse(course.id, user)
        );

        assertEquals(Response.Status.FORBIDDEN.getStatusCode(), exception.getResponse().getStatus());
        assertEquals("You are not authorized to update or delete this course", exception.getMessage());

        verify(this.courseRepositoryMocked, times(1)).findByIdOptional(course.id);
        verify(this.courseRepositoryMocked, never()).delete(any(Course.class));
        verify(this.userRepositoryMocked, never()).removeCourseFromUser(anyString(), anyString());
    }

    @Test
    @DisplayName("Should delete a course given id")
    void test29DeleteCourse() {
        Course course = createTestCourse("New Course", "");

        User user = new User();
        user.coursesId = Set.of(course.id.toString());

        when(this.courseRepositoryMocked.findByIdOptional(course.id)).thenReturn(Optional.of(course));

        this.courseService.deleteCourse(course.id, user);

        verify(this.courseRepositoryMocked, times(1)).findByIdOptional(course.id);
        verify(this.courseRepositoryMocked, times(1)).delete(any(Course.class));
        verify(this.userRepositoryMocked, times(1)).removeCourseFromUser(course.id.toString(), user.azureOid);
    }

    public static Course createTestCourse(String courseName, String description) {
        Course course = new Course();
        course.id = new ObjectId();
        course.name = courseName;
        course.description = description;
        return course;
    }

    public static CourseDTO convertToDTO(Course course) {
        CourseDTO courseDTO = new CourseDTO();
        courseDTO.setId(course.id.toString());
        courseDTO.setName(course.name);
        courseDTO.setDescription(course.description);
        return courseDTO;
    }
}
