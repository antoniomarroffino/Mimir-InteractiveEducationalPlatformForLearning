package ch.supsi.controller.folder;

import ch.supsi.model.api.Course;
import ch.supsi.model.dto.api.CourseDTO;
import ch.supsi.model.dto.api.FolderDTO;
import ch.supsi.service.course.CourseServiceTest;
import ch.supsi.service.course.ICourseService;
import ch.supsi.service.folder.IFolderService;
import io.quarkus.hibernate.validator.runtime.jaxrs.ResteasyReactiveViolationException;
import io.quarkus.test.InjectMock;
import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.security.TestSecurity;
import jakarta.inject.Inject;
import jakarta.ws.rs.NotFoundException;
import jakarta.ws.rs.core.Response;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.*;

import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@QuarkusTest
@TestMethodOrder(MethodOrderer.MethodName.class)
public class FolderControllerTest {
    private static final String COURSE_ID = new ObjectId().toString();
    private static final String FOLDER_ID = new ObjectId().toString();
    private static final String NON_EXISTENT_ID = new ObjectId().toString();

    @Inject
    FolderController folderController;

    @InjectMock
    ICourseService courseService;

    @InjectMock
    IFolderService folderService;


    @Test
    @DisplayName("Should return all folders in course")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    void test01GetFolders_Success() {
        FolderDTO folder1 = new FolderDTO("Folder 1");
        FolderDTO folder2 = new FolderDTO("Folder 2");

        when(this.courseService.getCourseById(any(ObjectId.class))).thenReturn(new CourseDTO());
        when(this.folderService.getFoldersInCourse(any(CourseDTO.class))).thenReturn(List.of(folder1, folder2));

        Response response = this.folderController.getFolders(COURSE_ID);

        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        assertEquals(2, ((List<?>) response.getEntity()).size());

        verify(this.courseService, times(1)).getCourseById(any(ObjectId.class));
        verify(this.folderService, times(1)).getFoldersInCourse(any(CourseDTO.class));
    }

    @Test
    @DisplayName("Should return empty folder list")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    void test02GetFolders_Empty() {
        when(this.courseService.getCourseById(any(ObjectId.class))).thenReturn(new CourseDTO());
        when(this.folderService.getFoldersInCourse(any(CourseDTO.class))).thenReturn(Collections.emptyList());

        Response response = this.folderController.getFolders(COURSE_ID);

        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        assertTrue(((List<?>) response.getEntity()).isEmpty());

        verify(this.courseService, times(1)).getCourseById(any(ObjectId.class));
        verify(this.folderService, times(1)).getFoldersInCourse(any(CourseDTO.class));
    }

    @Test
    @DisplayName("Should throw 404 when course not found")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    void test03GetFolders_CourseNotFound() {
        when(this.courseService.getCourseById(any(ObjectId.class))).thenThrow(new NotFoundException());

        assertThrows(
                NotFoundException.class,
                () -> this.folderController.getFolders(NON_EXISTENT_ID)
        );
    }

    @Test
    @DisplayName("Should get folder by id")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    void test04GetFolder_Success() {
        FolderDTO folder = new FolderDTO("Test Folder");

        when(this.courseService.getCourseById(any(ObjectId.class))).thenReturn(new CourseDTO());
        when(this.folderService.getFolderInCourse(any(CourseDTO.class), any(ObjectId.class))).thenReturn(folder);

        Response response = this.folderController.getFolder(COURSE_ID, FOLDER_ID);

        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        assertEquals(folder, response.getEntity());

        verify(this.courseService, times(1)).getCourseById(any(ObjectId.class));
        verify(this.folderService, times(1)).getFolderInCourse(any(CourseDTO.class), any(ObjectId.class));
    }

    @Test
    @DisplayName("Should throw 404 when folder not found")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    void test05GetFolder_NotFound() {
        when(this.courseService.getCourseById(any(ObjectId.class))).thenReturn(new CourseDTO());
        when(this.folderService.getFolderInCourse(any(), any())).thenThrow(new NotFoundException());

        assertThrows(
                NotFoundException.class,
                () -> this.folderController.getFolder(COURSE_ID, NON_EXISTENT_ID)
        );

        verify(this.courseService, times(1)).getCourseById(any(ObjectId.class));
        verify(this.folderService, times(1)).getFolderInCourse(any(CourseDTO.class), any(ObjectId.class));
    }

    @Test
    @DisplayName("Should throw 404 when course not found for folder")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    void test06GetFolder_CourseNotFound() {
        when(this.courseService.getCourseById(any(ObjectId.class))).thenThrow(new NotFoundException());

        assertThrows(
                NotFoundException.class,
                () -> this.folderController.getFolder(NON_EXISTENT_ID, FOLDER_ID)
        );
    }

    @Test
    @DisplayName("Should create new folder")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    void test07CreateFolder_Success() {
        FolderDTO createdFolder = new FolderDTO("New Folder");

        when(this.courseService.getCourseById(any(ObjectId.class))).thenReturn(new CourseDTO());
        when(this.folderService.addFolderToCourse(any(CourseDTO.class), any(FolderDTO.class))).thenReturn(createdFolder);

        Response response = this.folderController.createFolder(COURSE_ID, new FolderDTO("New Folder"));

        assertEquals(Response.Status.CREATED.getStatusCode(), response.getStatus());
        assertEquals(createdFolder, response.getEntity());

        verify(this.courseService, times(1)).getCourseById(any(ObjectId.class));
        verify(this.folderService, times(1)).addFolderToCourse(any(CourseDTO.class), any(FolderDTO.class));
    }

    @Test
    @DisplayName("Should throw validation error for invalid folder because FolderDTO name is null")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    void test08CreateFolder_ValidationErrorFolderDTONameNull() {
        FolderDTO createdFolder = new FolderDTO();
        createdFolder.setName(null);

        assertThrows(
                ResteasyReactiveViolationException.class,
                () -> this.folderController.createFolder(COURSE_ID, createdFolder)
        );

        verifyNoInteractions(this.courseService, this.folderService);
    }

    @Test
    @DisplayName("Should throw validation error for invalid folder because FolderDTO name is blank")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    void test09CreateFolder_ValidationErrorFolderDTONameBlank() {
        assertThrows(
                ResteasyReactiveViolationException.class,
                () -> this.folderController.createFolder(COURSE_ID, new FolderDTO(""))
        );

        verifyNoInteractions(this.courseService, this.folderService);
    }

    @Test
    @DisplayName("Should throw 404 when creating in non-existent course")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    void test10CreateFolder_CourseNotFound() {
        when(this.courseService.getCourseById(any(ObjectId.class))).thenThrow(new NotFoundException());

        assertThrows(
                NotFoundException.class,
                () -> this.folderController.createFolder(NON_EXISTENT_ID, new FolderDTO("Test"))
        );
    }

    @Test
    @DisplayName("Should update folder successfully")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    void test11UpdateFolder_Success() {
        FolderDTO updateRequest = new FolderDTO("Updated Folder");
        FolderDTO updatedFolder = new FolderDTO("Updated Folder");

        when(this.courseService.getCourseById(any(ObjectId.class))).thenReturn(new CourseDTO());
        when(this.folderService.updateFolder(any(CourseDTO.class), any(ObjectId.class), eq(updateRequest))).thenReturn(updatedFolder);

        Response response = this.folderController.updateFolder(COURSE_ID, FOLDER_ID, updateRequest);

        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        assertEquals(updatedFolder, response.getEntity());

        verify(this.courseService, times(1)).getCourseById(any(ObjectId.class));
        verify(this.folderService, times(1)).updateFolder(any(CourseDTO.class), any(ObjectId.class), eq(updateRequest));
    }

    @Test
    @DisplayName("Should throw validation error for invalid update because FolderDTO name is null")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    void test12UpdateFolder_ValidationErrorFolderDTONameNull() {
        FolderDTO folderDTO = new FolderDTO();
        folderDTO.setName(null);

        assertThrows(ResteasyReactiveViolationException.class,
                () -> this.folderController.updateFolder(COURSE_ID, FOLDER_ID, folderDTO));

        verifyNoInteractions(this.courseService, this.folderService);
    }

    @Test
    @DisplayName("Should throw validation error for invalid update because FolderDTO name is blank")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    void test13UpdateFolder_ValidationErrorFolderDTONameIsBlank() {
        assertThrows(ResteasyReactiveViolationException.class,
                () -> this.folderController.updateFolder(COURSE_ID, FOLDER_ID, new FolderDTO("")));

        verifyNoInteractions(this.courseService, this.folderService);
    }

    @Test
    @DisplayName("Should throw 404 when updating non-existent folder")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    void test14UpdateFolder_NotFound() {
        FolderDTO updateRequest = new FolderDTO("Update");

        when(this.courseService.getCourseById(any(ObjectId.class))).thenReturn(new CourseDTO());
        when(this.folderService.updateFolder(any(), any(), any())).thenThrow(new NotFoundException());

        assertThrows(
                NotFoundException.class,
                () -> this.folderController.updateFolder(COURSE_ID, NON_EXISTENT_ID, updateRequest)
        );

        verify(this.courseService, times(1)).getCourseById(any(ObjectId.class));
        verify(this.folderService, times(1)).updateFolder(any(CourseDTO.class), any(ObjectId.class), eq(updateRequest));
    }

    @Test
    @DisplayName("Should throw 404 when course not found for update")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    void test15UpdateFolder_CourseNotFound() {
        when(this.courseService.getCourseById(any(ObjectId.class))).thenThrow(new NotFoundException());

        assertThrows(
                NotFoundException.class,
                () -> this.folderController.updateFolder(NON_EXISTENT_ID, FOLDER_ID, new FolderDTO("Test"))
        );
    }

    @Test
    @DisplayName("Should delete folder successfully")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    void test16DeleteFolder_Success() {
        when(this.courseService.getCourseById(any(ObjectId.class))).thenReturn(new CourseDTO());

        Response response = this.folderController.deleteFolder(COURSE_ID, FOLDER_ID);

        assertEquals(Response.Status.NO_CONTENT.getStatusCode(), response.getStatus());

        verify(this.courseService, times(1)).getCourseById(any(ObjectId.class));
        verify(this.folderService, times(1)).deleteFolder(any(CourseDTO.class), eq(new ObjectId(FOLDER_ID)));
    }

    @Test
    @DisplayName("Should throw 404 when deleting non-existent folder")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    void test17DeleteFolder_NotFound() {
        when(this.courseService.getCourseById(any(ObjectId.class))).thenReturn(new CourseDTO());
        doThrow(new NotFoundException()).when(this.folderService).deleteFolder(any(), any());

        assertThrows(
                NotFoundException.class,
                () -> this.folderController.deleteFolder(COURSE_ID, NON_EXISTENT_ID)
        );

        verify(this.courseService, times(1)).getCourseById(any(ObjectId.class));
        verify(this.folderService, times(1)).deleteFolder(any(CourseDTO.class), any(ObjectId.class));
    }

    @Test
    @DisplayName("Should throw 404 when course not found for deletion")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    void test18DeleteFolder_CourseNotFound() {
        when(this.courseService.getCourseById(any(ObjectId.class))).thenThrow(new NotFoundException());

        assertThrows(
                NotFoundException.class,
                () -> this.folderController.deleteFolder(NON_EXISTENT_ID, FOLDER_ID)
        );
    }
}
