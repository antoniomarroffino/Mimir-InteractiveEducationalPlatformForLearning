package ch.supsi.service.folder;

import ch.supsi.exception.api.BadRequestException;
import ch.supsi.exception.api.NotFoundException;
import ch.supsi.model.api.Course;
import ch.supsi.model.api.Folder;
import ch.supsi.model.dto.api.FolderDTO;
import ch.supsi.repository.CourseRepository;
import io.quarkus.test.InjectMock;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.*;


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

    @Test
    @DisplayName("Should get empty list of folders")
    void test01GetFoldersInCourse_Empty() {
        Course courseWithEmptyFolders = new Course();
        when(this.courseRepository.findById(any(ObjectId.class))).thenReturn(courseWithEmptyFolders);

        List<FolderDTO> folders = this.folderService.getFoldersInCourse(new ObjectId());
        assertTrue(folders.isEmpty());

        verify(this.courseRepository, times(1)).findById(any(ObjectId.class));
    }

    @Test
    @DisplayName("Should get list of two folders")
    void test02GetFoldersInCourse() {
        Folder folder1 = new Folder("folder1");
        Folder folder2 = new Folder("folder2");
        Course courseWithTwoFolders = new Course();
        courseWithTwoFolders.getFolders().add(folder1);
        courseWithTwoFolders.getFolders().add(folder2);

        when(this.courseRepository.findById(any(ObjectId.class))).thenReturn(courseWithTwoFolders);

        List<FolderDTO> folders = this.folderService.getFoldersInCourse(new ObjectId());
        assertEquals(2, folders.size());

        FolderDTO folder1RetrievedDTO = folders.getFirst();
        assertEquals(folder1.getName(), folder1RetrievedDTO.getName());

        FolderDTO folder2RetrievedDTO = folders.get(1);
        assertEquals(folder2.getName(), folder2RetrievedDTO.getName());

        verify(this.courseRepository, times(1)).findById(any(ObjectId.class));
    }

    @Test
    @DisplayName("Should throw NotFoundException: Course not found")
    void test03GetFoldersInCourse_ThrowNotFoundExceptionCourseNotFound() {
        ObjectId courseId = new ObjectId();

        when(this.courseRepository.findById(any(ObjectId.class))).thenReturn(null);

        assertThrows(NotFoundException.class,() -> this.folderService.getFoldersInCourse(new ObjectId()));

        verify(this.courseRepository, times(1)).findById(any(ObjectId.class));

        try{
            this.folderService.getFoldersInCourse(courseId);
        }catch (NotFoundException e){
            assertEquals("Course " + courseId + " not found", e.getMessage());
        }
    }

    @Test
    @DisplayName("Should get folder given CourseID and FolderName")
    void test04GetFolderInCourse() {
        Folder folder1 = new Folder("folder1");

        Course courseWithOneFolder = new Course();
        courseWithOneFolder.getFolders().add(folder1);

        when(this.courseRepository.findById(any(ObjectId.class))).thenReturn(courseWithOneFolder);

        FolderDTO folderFoundedDTo = this.folderService.getFolderInCourse(new ObjectId(), "folder1");
        assertEquals(folder1.getName(), folderFoundedDTo.getName());

        verify(this.courseRepository, times(1)).findById(any(ObjectId.class));
    }

    @Test
    @DisplayName("Should throw NotFoundException: Course not found")
    void test05GetFolderInCourse_ThrowNotFoundExceptionCourseNotFound() {
        ObjectId courseId = new ObjectId();
        when(this.courseRepository.findById(any(ObjectId.class))).thenReturn(null);

        assertThrows(NotFoundException.class, () -> this.folderService.getFolderInCourse(new ObjectId(), ""));

        verify(this.courseRepository, times(1)).findById(any(ObjectId.class));

        try{
            this.folderService.getFolderInCourse(courseId, "");
        }catch (NotFoundException e){
            assertEquals("Course " + courseId + " not found", e.getMessage());
        }
    }

    @Test
    @DisplayName("Should throw BadRequestException: Folder name is null or empty")
    void test06GetFolderInCourse_ThrowBadRequestExceptionFolderNameIsNullOrEmpty() {
        Course course = new Course();
        when(this.courseRepository.findById(any(ObjectId.class))).thenReturn(course);

        assertThrows(BadRequestException.class, () -> this.folderService.getFolderInCourse(new ObjectId(), null));

        verify(this.courseRepository, times(1)).findById(any(ObjectId.class));

        reset(this.courseRepository);

        when(this.courseRepository.findById(any(ObjectId.class))).thenReturn(course);

        assertThrows(BadRequestException.class, () -> this.folderService.getFolderInCourse(new ObjectId(), ""));

        verify(this.courseRepository, times(1)).findById(any(ObjectId.class));

        try{
            this.folderService.getFolderInCourse(new ObjectId(), null);
        }catch (BadRequestException e){
            assertEquals("Folder name cannot be null or empty", e.getMessage());
        }

        try{
            this.folderService.getFolderInCourse(new ObjectId(), "");
        }catch (BadRequestException e){
            assertEquals("Folder name cannot be null or empty", e.getMessage());
        }
    }

    @Test
    @DisplayName("Should throw NotFoundException: Folder not found")
    void test07GetFolderInCourse_ThrowNotFoundExceptionFolderNotFound() {
        Folder folder1 = new Folder("folder1");
        Course courseWithOneFolder = new Course();
        courseWithOneFolder.getFolders().add(folder1);

        ObjectId courseId = new ObjectId();

        when(this.courseRepository.findById(any(ObjectId.class))).thenReturn(courseWithOneFolder);

        assertThrows(NotFoundException.class, () -> this.folderService.getFolderInCourse(courseId, "this is not a folder"));

        verify(this.courseRepository, times(1)).findById(any(ObjectId.class));

        try{
            this.folderService.getFoldersInCourse(new ObjectId());
        }catch (NotFoundException e){
            assertEquals("Folder this is not a folder not found in course: " + courseId, e.getMessage());
        }
    }

    @Test
    @DisplayName("Should add new Folder to Course given CourseID")
    void test08AddFolderToCourse() {
        FolderDTO folderDTO = new FolderDTO();
        folderDTO.setName("folder");

        Course course = new Course();

        when(this.courseRepository.findById(any(ObjectId.class))).thenReturn(course);

        FolderDTO folderRetrievedDTO = this.folderService.addFolderToCourse(new ObjectId(), folderDTO);
        assertEquals(folderDTO.getName(), folderRetrievedDTO.getName());
        assertEquals(1, course.getFolders().size());

        verify(this.courseRepository, times(1)).findById(any(ObjectId.class));
        verify(this.courseRepository, times(1)).update(any(Course.class));
    }

    @Test
    @DisplayName("Should Throw NotFoundException: Course not found")
    void test09AddFolderToCourse_ThrowNotFoundExceptionCourseNotFound() {
        ObjectId courseId = new ObjectId();
        when(this.courseRepository.findById(any(ObjectId.class))).thenReturn(null);

        assertThrows(NotFoundException.class, () -> this.folderService.addFolderToCourse(courseId, null));

        verify(this.courseRepository, times(1)).findById(any(ObjectId.class));
        verify(this.courseRepository, never()).update(any(Course.class));

        try{
            this.folderService.addFolderToCourse(courseId, null);
        }catch (NotFoundException e){
            assertEquals("Course " + courseId + " not found", e.getMessage());
        }
    }

    @Test
    @DisplayName("Should Throw BadRequestException: FolderDTO is null")
    void test10AddFolderToCourse_ThrowBadRequestExceptionFolderIsNull() {
        when(this.courseRepository.findById(any(ObjectId.class))).thenReturn(new Course());

        assertThrows(BadRequestException.class, () -> this.folderService.addFolderToCourse(new ObjectId(), null));

        verify(this.courseRepository, times(1)).findById(any(ObjectId.class));
        verify(this.courseRepository, never()).update(any(Course.class));

        try{
            this.folderService.addFolderToCourse(new ObjectId(), null);
        }catch (BadRequestException e){
            assertEquals("Folder is null", e.getMessage());
        }
    }

    @Test
    @DisplayName("Should Throw BadRequestException: FolderDTO name already existing in course")
    void test11AddFolderToCourse_ThrowBadRequestExceptionFolderIsDuplicated() {
        Folder folder = new Folder("folder");
        ObjectId courseId = new ObjectId();
        Course course = new Course();
        course.getFolders().add(folder);
        course.setId(courseId);

        FolderDTO folderNotValidDTO = new FolderDTO();
        folderNotValidDTO.setName("folder");

        when(this.courseRepository.findById(any(ObjectId.class))).thenReturn(course);

        assertThrows(BadRequestException.class, () -> this.folderService.addFolderToCourse(new ObjectId(), folderNotValidDTO));

        verify(this.courseRepository, times(1)).findById(any(ObjectId.class));
        verify(this.courseRepository, never()).update(any(Course.class));

        try{
            this.folderService.addFolderToCourse(courseId, folderNotValidDTO);
        }catch (BadRequestException e){
            assertEquals("Folder name " + folder.getName() + " already existing in course " + courseId, e.getMessage());
        }
    }
}