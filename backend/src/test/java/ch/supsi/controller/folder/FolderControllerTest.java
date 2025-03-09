package ch.supsi.controller.folder;

import ch.supsi.model.dto.api.FolderDTO;
import ch.supsi.service.folder.IFolderService;
import io.quarkus.test.InjectMock;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import jakarta.ws.rs.core.Response;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@QuarkusTest
public class FolderControllerTest {

    private static final String STR_FOR_OBJECT_ID = ObjectId.get().toString();
    @Inject
    FolderController folderController;
    @InjectMock
    IFolderService folderService;

    @Test
    @DisplayName("Should return Response 200 (ok) with empty list of folders")
    void test01GetFolders_Empty() {
        when(this.folderService.getFoldersInCourse(any(ObjectId.class))).thenReturn(Collections.emptyList());

        Response response = this.folderController.getFolders(STR_FOR_OBJECT_ID);

        assertNotNull(response);
        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        assertNotNull(response.getEntity());
        assertInstanceOf(List.class, response.getEntity());
        assertTrue(((List<?>) response.getEntity()).isEmpty());

        verify(this.folderService, times(1)).getFoldersInCourse(any(ObjectId.class));
    }

    @Test
    @DisplayName("Should return Response 200 (ok) with two folders")
    void test02GetFolders() {
        String folderName_1 = "Test Folder1";
        String folderName_2 = "Test Folder2";

        FolderDTO folder1 = new FolderDTO(folderName_1);
        FolderDTO folder2 = new FolderDTO(folderName_2);

        when(this.folderService.getFoldersInCourse(any(ObjectId.class))).thenReturn(List.of(folder1, folder2));

        Response response = this.folderController.getFolders(STR_FOR_OBJECT_ID);

        assertNotNull(response);
        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        assertNotNull(response.getEntity());
        assertInstanceOf(List.class, response.getEntity());

        List<FolderDTO> foldersRetrieved = ((List<?>) (response.getEntity()))
                .stream()
                .filter(obj -> FolderDTO.class.isAssignableFrom(obj.getClass()))
                .map(obj -> (FolderDTO) obj)
                .toList();

        assertEquals(2, foldersRetrieved.size());

        FolderDTO folder1Retrieved = foldersRetrieved.getFirst();
        assertEquals(folderName_1, folder1Retrieved.getName());

        FolderDTO folder2Retrieved = foldersRetrieved.get(1);
        assertEquals(folderName_2, folder2Retrieved.getName());

        verify(this.folderService, times(1)).getFoldersInCourse(any(ObjectId.class));
    }

    @Test
    @DisplayName("Should return Response 200 (ok) with one FolderDTO")
    void test03GetFolder() {
        String folderName = "Test Folder";
        FolderDTO folderDTO = new FolderDTO(folderName);

        when(this.folderService.getFolderInCourse(any(ObjectId.class), eq(folderDTO.getName()))).thenReturn(folderDTO);

        Response response = this.folderController.getFolder(STR_FOR_OBJECT_ID, folderDTO.getName());

        assertNotNull(response);
        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        assertNotNull(response.getEntity());
        assertInstanceOf(FolderDTO.class, response.getEntity());

        FolderDTO folderRetrieved = ((FolderDTO) response.getEntity());
        assertEquals(folderDTO.getName(), folderRetrieved.getName());

        verify(this.folderService, times(1)).getFolderInCourse(any(ObjectId.class), eq(folderDTO.getName()));
    }

    @Test
    @DisplayName("Should return Response 201 (created) one folder")
    void test04CreateFolder() {
        String folderName = "Test Folder";
        FolderDTO folderDTO = new FolderDTO(folderName);

        when(this.folderService.addFolderToCourse(any(ObjectId.class), eq(folderDTO))).thenReturn(folderDTO);

        Response response = this.folderController.createFolder(STR_FOR_OBJECT_ID, folderDTO);

        assertNotNull(response);
        assertEquals(Response.Status.CREATED.getStatusCode(), response.getStatus());
        assertNotNull(response.getEntity());
        assertInstanceOf(FolderDTO.class, response.getEntity());

        FolderDTO folderDTORetrieved = ((FolderDTO) response.getEntity());
        assertEquals(folderDTO.getName(), folderDTORetrieved.getName());

        verify(this.folderService, times(1)).addFolderToCourse(any(ObjectId.class), eq(folderDTO));
    }
}
