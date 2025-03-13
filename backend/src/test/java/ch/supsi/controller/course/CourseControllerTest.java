package ch.supsi.controller.course;

import ch.supsi.service.course.ICourseService;
import io.quarkus.test.InjectMock;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.TestMethodOrder;

@QuarkusTest
@TestMethodOrder(MethodOrderer.MethodName.class)
public class CourseControllerTest {
    private static final String STR_FOR_OBJECT_ID = ObjectId.get().toString();
    @Inject
    CourseController courseController;
    @InjectMock
    ICourseService courseService;
/*
    @Test
    @DisplayName("Should return Response 200 (ok) with empty list of courses DTO")
    public void test01GetCourses_Empty() {
        when(this.courseService.getAllCourses()).thenReturn(Collections.emptyList());

        Response response = this.courseController.getCourses();

        assertNotNull(response);
        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        assertNotNull(response.getEntity());
        assertInstanceOf(List.class, response.getEntity());
        assertTrue(((List<?>) response.getEntity()).isEmpty());

        verify(this.courseService, times(1)).getAllCourses();
    }

    @Test
    @DisplayName("Should return Response 200 (ok) with two courses DTO")
    public void test02GetCourses() {
        String courseName_1 = "Test Course 1";
        String courseName_2 = "Test Course 2";
        FolderDTO folder1 = new FolderDTO("folder1");

        CourseDTO courseDTO_1 = new CourseDTO(courseName_1);
        courseDTO_1.getFolders().add(folder1);

        CourseDTO courseDTO_2 = new CourseDTO(courseName_2);

        when(this.courseService.getAllCourses()).thenReturn(List.of(courseDTO_1, courseDTO_2));

        Response response = this.courseController.getCourses();

        assertNotNull(response);
        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        assertNotNull(response.getEntity());
        assertInstanceOf(List.class, response.getEntity());

        List<CourseDTO> coursesRetrieved = ((List<?>) (response.getEntity()))
                .stream()
                .filter(obj -> CourseDTO.class.isAssignableFrom(obj.getClass()))
                .map(obj -> (CourseDTO) obj)
                .toList();

        assertEquals(2, coursesRetrieved.size());

        CourseDTO courseDTO_1Retrieved = coursesRetrieved.getFirst();
        assertEquals(courseName_1, courseDTO_1Retrieved.getName());
        assertEquals(1, courseDTO_1Retrieved.getFolders().size());
        assertEquals(folder1.getName(), courseDTO_1Retrieved.getFolders().getFirst().getName());

        CourseDTO courseDTO_2Retrieved = coursesRetrieved.get(1);
        assertEquals(courseName_2, courseDTO_2Retrieved.getName());
        assertEquals(1, courseDTO_1Retrieved.getFolders().size());

        verify(this.courseService, times(1)).getAllCourses();
    }

    @Test
    @DisplayName("Should return Response 200 (ok) with one course DTO given courseID")
    public void test03GetCourseById() {
        FolderDTO folder1 = new FolderDTO("folder1");
        CourseDTO courseDTO = new CourseDTO("Test Course");
        courseDTO.getFolders().add(folder1);

        when(this.courseService.getCourseById(any(ObjectId.class))).thenReturn(courseDTO);

        Response response = this.courseController.getCourse(STR_FOR_OBJECT_ID);

        assertNotNull(response);
        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        assertNotNull(response.getEntity());
        assertInstanceOf(CourseDTO.class, response.getEntity());

        CourseDTO courseRetrievedDTO = (CourseDTO) response.getEntity();
        assertEquals(courseDTO.getName(), courseRetrievedDTO.getName());
        assertEquals(1, courseDTO.getFolders().size());
        assertEquals(folder1.getName(), courseRetrievedDTO.getFolders().getFirst().getName());

        verify(this.courseService, times(1)).getCourseById(any(ObjectId.class));
    }

    @Test
    @DisplayName("Should return Response 201 (created) one course")
    public void test04CreateCourse() {
        FolderDTO folder1 = new FolderDTO("folder1");
        CourseDTO courseDTO = new CourseDTO("Test Course");
        courseDTO.getFolders().add(folder1);

        when(this.courseService.createCourse(eq(courseDTO))).thenReturn(courseDTO);

        Response response = this.courseController.createCourse(courseDTO);

        assertNotNull(response);
        assertEquals(Response.Status.CREATED.getStatusCode(), response.getStatus());
        assertNotNull(response.getEntity());
        assertInstanceOf(CourseDTO.class, response.getEntity());

        CourseDTO courseRetrievedDTO = (CourseDTO) response.getEntity();
        assertEquals(courseDTO.getName(), courseRetrievedDTO.getName());
        assertEquals(1, courseDTO.getFolders().size());
        assertEquals(folder1.getName(), courseRetrievedDTO.getFolders().getFirst().getName());

        verify(this.courseService, times(1)).createCourse(eq(courseDTO));
    }*/
}
