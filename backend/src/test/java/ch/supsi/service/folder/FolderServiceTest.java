package ch.supsi.service.folder;

import ch.supsi.mapper.CourseMapper;
import ch.supsi.mapper.FolderMapper;
import ch.supsi.model.api.Course;
import ch.supsi.model.api.Folder;
import ch.supsi.model.dto.api.CourseDTO;
import ch.supsi.model.dto.api.FolderDTO;
import ch.supsi.repository.CourseRepository;
import ch.supsi.service.course.CourseServiceTest;
import io.quarkus.test.InjectMock;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import jakarta.ws.rs.BadRequestException;
import jakarta.ws.rs.NotFoundException;
import jakarta.ws.rs.core.Response;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@QuarkusTest
@TestMethodOrder(MethodOrderer.MethodName.class)
public class FolderServiceTest {
    @Inject
    FolderService folderService;

    @InjectMock
    CourseRepository courseRepository;

    @InjectMock
    FolderMapper folderMapper;

    @InjectMock
    CourseMapper courseMapper;

    public static Folder createTestFolder(String name) {
        Folder folder = new Folder();
        folder.id = new ObjectId();
        folder.name = name;
        return folder;
    }

    public static FolderDTO convertToDTO(Folder folder) {
        FolderDTO folderDTO = new FolderDTO();
        folderDTO.setId(folder.id.toString());
        folderDTO.setName(folder.name);
        return folderDTO;
    }

    @Test
    @DisplayName("Should throw BadRequestError 400 because CourseDTO passed is null")
    void test01GetFoldersInCourse_ThrowBadRequestExceptionCourseDTOPassedIsNull() {
        BadRequestException exception = assertThrows(
                BadRequestException.class,
                () -> this.folderService.getFoldersInCourse(null)
        );

        assertEquals(Response.Status.BAD_REQUEST.getStatusCode(), exception.getResponse().getStatus());
        assertEquals("Course passed is null", exception.getMessage());

        verify(this.courseMapper, never()).toEntity(any(CourseDTO.class));
        verify(this.folderMapper, never()).toDTO(any(Folder.class));
    }

    @Test
    @DisplayName("Should return empty list")
    void test02GetFoldersInCourse_EmptyList() {
        Course course = CourseServiceTest.createTestCourse("Course", "Course");
        course.folders = List.of();

        when(this.courseMapper.toEntity(any(CourseDTO.class))).thenReturn(course);

        List<FolderDTO> folderDTOList = this.folderService.getFoldersInCourse(CourseServiceTest.convertToDTO(course));
        assertTrue(folderDTOList.isEmpty());

        verify(this.courseMapper, times(1)).toEntity(any(CourseDTO.class));
        verify(this.folderMapper, never()).toDTO(any(Folder.class));
    }

    @Test
    @DisplayName("Should return one Folder in list")
    void test03GetFoldersInCourse() {
        Folder folder = createTestFolder("Folder");
        FolderDTO folderDTO = convertToDTO(folder);

        Course course = CourseServiceTest.createTestCourse("Course", "Course");
        course.folders = List.of(folder);

        when(this.courseMapper.toEntity(any(CourseDTO.class))).thenReturn(course);
        when(this.folderMapper.toDTO(folder)).thenReturn(folderDTO);

        List<FolderDTO> folderDTOList = this.folderService.getFoldersInCourse(CourseServiceTest.convertToDTO(course));
        assertEquals(1, folderDTOList.size());
        assertEquals(folder.id.toString(), folderDTOList.getFirst().getId());
        assertEquals(folder.name, folderDTOList.getFirst().getName());

        verify(this.courseMapper, times(1)).toEntity(any(CourseDTO.class));
        verify(this.folderMapper, times(1)).toDTO(folder);
    }

    @Test
    @DisplayName("Should throw BadRequestError 400 because CourseDTO passed is null")
    void test04GetFolderInCourse_ThrowBadRequestExceptionCourseDTOPassedIsNull() {
        BadRequestException exception = assertThrows(
                BadRequestException.class,
                () -> this.folderService.getFolderInCourse(null, new ObjectId())
        );

        assertEquals(Response.Status.BAD_REQUEST.getStatusCode(), exception.getResponse().getStatus());
        assertEquals("Course passed is null", exception.getMessage());

        verify(this.courseMapper, never()).toEntity(any(CourseDTO.class));
        verify(this.folderMapper, never()).toDTO(any(Folder.class));
    }

    @Test
    @DisplayName("Should throw NotFoundError 404 because FolderId does not exist in Course")
    void test05GetFolderInCourse_ThrowNotFoundExceptionFolderIdDoesNotExistInCourse() {
        Course course = CourseServiceTest.createTestCourse("Course", "Course");
        CourseDTO courseDTO = CourseServiceTest.convertToDTO(course);

        Folder folder = FolderServiceTest.createTestFolder("Folder");
        FolderDTO folderDTO = convertToDTO(folder);

        when(this.courseMapper.toEntity(courseDTO)).thenReturn(course);

        NotFoundException exception = assertThrows(
                NotFoundException.class,
                () -> this.folderService.getFolderInCourse(courseDTO, folder.id)
        );

        assertEquals(Response.Status.NOT_FOUND.getStatusCode(), exception.getResponse().getStatus());
        assertEquals("Folder " + folder.id + " not found", exception.getMessage());

        verify(this.courseMapper, times(1)).toEntity(courseDTO);
        verify(this.folderMapper, never()).toDTO(folder);
    }

    @Test
    @DisplayName("Should return a FolderDTO given CourseDTO and folderId")
    void test06GetFolderInCourse() {
        Folder folder = createTestFolder("Folder");

        Course course = CourseServiceTest.createTestCourse("Course", "Course");
        course.folders = List.of(folder);

        when(this.folderMapper.toDTO(folder)).thenReturn(convertToDTO(folder));
        when(this.courseMapper.toEntity(any(CourseDTO.class))).thenReturn(course);

        FolderDTO folderDTO = this.folderService.getFolderInCourse(CourseServiceTest.convertToDTO(course), folder.id);

        assertEquals(folder.id.toString(), folderDTO.getId());
        assertEquals(folder.name, folderDTO.getName());

        verify(this.courseMapper, times(1)).toEntity(any(CourseDTO.class));
        verify(this.folderMapper, times(1)).toDTO(any(Folder.class));
    }

    @Test
    @DisplayName("Should throw BadRequestError 400 because CourseDTO passed is null")
    void test07AddFolderToCourse_ThrowBadRequestExceptionCourseDTOPassedIsNull() {
        BadRequestException exception = assertThrows(
                BadRequestException.class,
                () -> this.folderService.addFolderToCourse(null, new FolderDTO())
        );

        assertEquals(Response.Status.BAD_REQUEST.getStatusCode(), exception.getResponse().getStatus());
        assertEquals("Course passed is null", exception.getMessage());

        verify(this.courseMapper, never()).toEntity(any(CourseDTO.class));
        verify(this.folderMapper, never()).toEntity(any(FolderDTO.class));
        verify(this.courseRepository, never()).update(any(Course.class));
        verify(this.folderMapper, never()).toDTO(any(Folder.class));
    }

    @Test
    @DisplayName("Should throw BadRequestError 400 because FolderDTO passed is null")
    void test08AddFolderToCourse_ThrowBadRequestExceptionFolderDTOPassedIsNull() {
        BadRequestException exception = assertThrows(
                BadRequestException.class,
                () -> this.folderService.addFolderToCourse(new CourseDTO(), null)
        );

        assertEquals(Response.Status.BAD_REQUEST.getStatusCode(), exception.getResponse().getStatus());
        assertEquals("Folder data cannot be null", exception.getMessage());

        verify(this.courseMapper, times(1)).toEntity(any(CourseDTO.class));
        verify(this.folderMapper, never()).toEntity(any(FolderDTO.class));
        verify(this.courseRepository, never()).update(any(Course.class));
        verify(this.folderMapper, never()).toDTO(any(Folder.class));
    }

    @Test
    @DisplayName("Should throw BadRequestError 400 because FolderDTO has empty name")
    void test09AddFolderToCourse_ThrowBadRequestExceptionFolderDTONameIsEmpty() {
        Folder folder = createTestFolder("");

        BadRequestException exception = assertThrows(
                BadRequestException.class,
                () -> this.folderService.addFolderToCourse(new CourseDTO(), convertToDTO(folder))
        );

        assertEquals(Response.Status.BAD_REQUEST.getStatusCode(), exception.getResponse().getStatus());
        assertEquals("Folder name cannot be empty", exception.getMessage());

        verify(this.courseMapper, times(1)).toEntity(any(CourseDTO.class));
        verify(this.folderMapper, never()).toEntity(any(FolderDTO.class));
        verify(this.courseRepository, never()).update(any(Course.class));
        verify(this.folderMapper, never()).toDTO(any(Folder.class));
    }

    @Test
    @DisplayName("Should throw BadRequestError 400 because FolderDTO name is duplicated")
    void test10AddFolderToCourse_ThrowBadRequestExceptionFolderDTONameIsDuplicated() {
        Folder folder = createTestFolder("Folder");

        Course course = CourseServiceTest.createTestCourse("Course", "Course");
        course.folders = List.of(folder);

        CourseDTO courseDTO = CourseServiceTest.convertToDTO(course);

        Folder folder_duplicated = createTestFolder("Folder");
        FolderDTO folderDTO_duplicated = FolderServiceTest.convertToDTO(folder_duplicated);

        when(this.courseMapper.toEntity(courseDTO)).thenReturn(course);

        BadRequestException exception = assertThrows(
                BadRequestException.class,
                () -> this.folderService.addFolderToCourse(courseDTO, folderDTO_duplicated)
        );

        assertEquals(Response.Status.BAD_REQUEST.getStatusCode(), exception.getResponse().getStatus());
        assertEquals("Folder name " + folderDTO_duplicated.getName() + " already exists in this course", exception.getMessage());

        verify(this.courseMapper, times(1)).toEntity(courseDTO);
        verify(this.folderMapper, never()).toEntity(any(FolderDTO.class));
        verify(this.courseRepository, never()).update(any(Course.class));
        verify(this.folderMapper, never()).toDTO(any(Folder.class));
    }

    @Test
    @DisplayName("Should return Folder to Course and return FolderDTO added")
    void test11AddFolderToCourse() {
        Folder folder = createTestFolder("Folder");
        FolderDTO folderDTO = convertToDTO(folder);

        Course course = CourseServiceTest.createTestCourse("Course", "Course");
        CourseDTO courseDTO = CourseServiceTest.convertToDTO(course);

        when(this.courseMapper.toEntity(courseDTO)).thenReturn(course);
        when(this.folderMapper.toEntity(folderDTO)).thenReturn(folder);
        when(this.folderMapper.toDTO(folder)).thenReturn(folderDTO);

        int listSize = course.folders.size();
        FolderDTO folderDTO_added = this.folderService.addFolderToCourse(courseDTO, folderDTO);
        assertEquals(listSize + 1, course.folders.size());

        assertEquals(folder.id.toString(), folderDTO_added.getId());
        assertEquals(folder.name, folderDTO_added.getName());

        verify(this.courseMapper, times(1)).toEntity(courseDTO);
        verify(this.folderMapper, times(1)).toEntity(folderDTO);
        verify(this.courseRepository, times(1)).update(course);
        verify(this.folderMapper, times(1)).toDTO(folder);
    }

    @Test
    @DisplayName("Should throw BadRequestError 400 because CourseDTO passed is null")
    void test12UpdateFolder_ThrowBadRequestExceptionCourseDTOPassedIsNull() {
        BadRequestException exception = assertThrows(
                BadRequestException.class,
                () -> this.folderService.updateFolder(null, new ObjectId(), new FolderDTO())
        );

        assertEquals(Response.Status.BAD_REQUEST.getStatusCode(), exception.getResponse().getStatus());
        assertEquals("Course passed is null", exception.getMessage());

        verify(this.courseMapper, never()).toEntity(any(CourseDTO.class));
        verify(this.courseRepository, never()).update(any(Course.class));
        verify(this.folderMapper, never()).toDTO(any(Folder.class));
    }

    @Test
    @DisplayName("Should throw NotFoundError 404 because FolderId does not exist in Course")
    void test13UpdateFolder_ThrowNotFoundExceptionFolderIdDoesNotExistInCourse() {
        Course course = CourseServiceTest.createTestCourse("Course", "Course");
        CourseDTO courseDTO = CourseServiceTest.convertToDTO(course);

        Folder folder = FolderServiceTest.createTestFolder("Folder");

        when(this.courseMapper.toEntity(courseDTO)).thenReturn(course);

        NotFoundException exception = assertThrows(
                NotFoundException.class,
                () -> this.folderService.updateFolder(courseDTO, folder.id, new FolderDTO())
        );

        assertEquals(Response.Status.NOT_FOUND.getStatusCode(), exception.getResponse().getStatus());
        assertEquals("Folder " + folder.id + " not found", exception.getMessage());

        verify(this.courseMapper, times(1)).toEntity(courseDTO);
        verify(this.courseRepository, never()).update(any(Course.class));
        verify(this.folderMapper, never()).toDTO(any(Folder.class));
    }

    @Test
    @DisplayName("Should throw BadRequestError 404 because FolderDTO has duplicated name")
    void test14UpdateFolder_ThrowBadRequestExceptionFolderDTONameIsDuplicated() {
        Folder folder = FolderServiceTest.createTestFolder("Folder");

        Course course = CourseServiceTest.createTestCourse("Course", "Course");
        course.folders = List.of(folder);
        CourseDTO courseDTO = CourseServiceTest.convertToDTO(course);

        Folder folder_duplicated = FolderServiceTest.createTestFolder("Folder");
        FolderDTO folderDTO_duplicated = FolderServiceTest.convertToDTO(folder_duplicated);

        when(this.courseMapper.toEntity(courseDTO)).thenReturn(course);

        BadRequestException exception = assertThrows(
                BadRequestException.class,
                () -> this.folderService.updateFolder(courseDTO, folder.id, folderDTO_duplicated)
        );

        assertEquals(Response.Status.BAD_REQUEST.getStatusCode(), exception.getResponse().getStatus());
        assertEquals("Folder name " + folderDTO_duplicated.getName() + " already exists in this course", exception.getMessage());

        verify(this.courseMapper, times(1)).toEntity(courseDTO);
        verify(this.courseRepository, never()).update(any(Course.class));
        verify(this.folderMapper, never()).toDTO(any(Folder.class));
    }

    @Test
    @DisplayName("Should update folder and return updated FolderDTO")
    void test15UpdateFolder() {
        Folder folder = FolderServiceTest.createTestFolder("Folder");

        Course course = CourseServiceTest.createTestCourse("Course", "Course");
        course.folders = List.of(folder);
        CourseDTO courseDTO = CourseServiceTest.convertToDTO(course);

        Folder folder_updated = FolderServiceTest.createTestFolder("New Folder");
        FolderDTO folderDTO_updated = FolderServiceTest.convertToDTO(folder_updated);

        when(this.courseMapper.toEntity(courseDTO)).thenReturn(course);
        when(this.folderMapper.toDTO(folder)).thenReturn(folderDTO_updated);

        this.folderService.updateFolder(courseDTO, folder.id, folderDTO_updated);
        assertEquals(folder_updated.name, course.folders.getFirst().name);

        verify(this.courseMapper, times(1)).toEntity(courseDTO);
        verify(this.courseRepository, times(1)).update(course);
        verify(this.folderMapper, times(1)).toDTO(folder);
    }

    @Test
    @DisplayName("Should throw BadRequestError 400 because CourseDTO passed is null")
    void test16DeleteFolder_ThrowBadRequestExceptionCourseDTOPassedIsNull() {
        BadRequestException exception = assertThrows(
                BadRequestException.class,
                () -> this.folderService.deleteFolder(null, new ObjectId())
        );

        assertEquals(Response.Status.BAD_REQUEST.getStatusCode(), exception.getResponse().getStatus());
        assertEquals("Course passed is null", exception.getMessage());

        verify(this.courseMapper, never()).toEntity(any(CourseDTO.class));
        verify(this.courseRepository, never()).update(any(Course.class));
    }

    @Test
    @DisplayName("Should throw NotFoundError 404 because FolderId does not exist")
    void test17DeleteFolder_ThrowNotFoundExceptionFolderIdDoesNotExist() {
        Course course = CourseServiceTest.createTestCourse("Course", "Course");
        CourseDTO courseDTO = CourseServiceTest.convertToDTO(course);

        Folder folder = FolderServiceTest.createTestFolder("Folder");

        when(this.courseMapper.toEntity(courseDTO)).thenReturn(course);

        NotFoundException exception = assertThrows(
                NotFoundException.class,
                () -> this.folderService.deleteFolder(courseDTO, folder.id)
        );

        assertEquals(Response.Status.NOT_FOUND.getStatusCode(), exception.getResponse().getStatus());
        assertEquals("Folder " + folder.id + " not found", exception.getMessage());

        verify(this.courseMapper, times(1)).toEntity(courseDTO);
        verify(this.courseRepository, never()).update(any(Course.class));
    }

    @Test
    @DisplayName("Should delete a Folder")
    void test18DeleteFolder() {
        Folder folder = FolderServiceTest.createTestFolder("Folder");

        Course course = CourseServiceTest.createTestCourse("Course", "Course");
        CourseDTO courseDTO = CourseServiceTest.convertToDTO(course);
        course.folders = new ArrayList<>(List.of(folder));

        when(this.courseMapper.toEntity(courseDTO)).thenReturn(course);

        this.folderService.deleteFolder(courseDTO, folder.id);
        assertTrue(course.folders.isEmpty());

        verify(this.courseMapper, times(1)).toEntity(courseDTO);
        verify(this.courseRepository, times(1)).update(course);
    }
}