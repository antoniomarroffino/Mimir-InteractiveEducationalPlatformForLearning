package ch.supsi.mapper.course;

import ch.supsi.mapper.CourseMapper;
import ch.supsi.mapper.FolderMapper;
import ch.supsi.model.api.Course;
import ch.supsi.model.api.Folder;
import ch.supsi.model.dto.api.CourseDTO;
import ch.supsi.model.dto.api.FolderDTO;
import ch.supsi.service.course.CourseServiceTest;
import ch.supsi.service.folder.FolderServiceTest;
import io.quarkus.test.InjectMock;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@QuarkusTest
@TestMethodOrder(MethodOrderer.MethodName.class)
public class CourseMapperTest {
    @Inject
    CourseMapper courseMapper;

    @InjectMock
    FolderMapper folderMapper;

    @Test
    @DisplayName("Should return null because Course passed is null")
    void test01ToDTO_ReturnNull() {
        CourseDTO courseDTO = this.courseMapper.toDTO(null);
        assertNull(courseDTO);
        verify(this.folderMapper, never()).toDTO(any(Folder.class));
    }

    @Test
    @DisplayName("Should return CourseDTO from Course")
    void test02ToDTO_ReturnCourseDTO() {
        Folder folder = FolderServiceTest.createTestFolder("Folder");
        FolderDTO folderDTO = FolderServiceTest.convertToDTO(folder);

        Course course = CourseServiceTest.createTestCourse("Course", "Course");
        course.folders = List.of(folder);

        when(this.folderMapper.toDTO(folder)).thenReturn(folderDTO);

        CourseDTO courseDTO = this.courseMapper.toDTO(course);
        assertNotNull(courseDTO);
        assertEquals(course.id.toString(), courseDTO.getId());
        assertEquals(course.name, courseDTO.getName());
        assertEquals(1, courseDTO.getFolders().size());

        verify(this.folderMapper, times(1)).toDTO(any(Folder.class));
    }

    @Test
    @DisplayName("Should return null because CourseDTO passed is null")
    void test03ToEntity_ReturnNull() {
        Course course = this.courseMapper.toEntity(null);
        assertNull(course);
        verify(this.folderMapper, never()).toEntity(any(FolderDTO.class));
    }

    @Test
    @DisplayName("Should return Course from CourseDTO")
    void test04ToEntity_ReturnCourse() {
        Folder folder = FolderServiceTest.createTestFolder("Folder");
        FolderDTO folderDTO = FolderServiceTest.convertToDTO(folder);

        CourseDTO courseDTO = new CourseDTO("Test");
        courseDTO.setId(new ObjectId().toString());
        courseDTO.setFolders(List.of(folderDTO));

        when(this.folderMapper.toEntity(folderDTO)).thenReturn(folder);

        Course course_retrieved = this.courseMapper.toEntity(courseDTO);
        assertNotNull(course_retrieved);
        assertEquals(courseDTO.getId(), course_retrieved.id.toString());
        assertEquals(courseDTO.getName(), course_retrieved.name);
        assertEquals(1, course_retrieved.folders.size());

        verify(this.folderMapper, times(1)).toEntity(folderDTO);
    }
}
