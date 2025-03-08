package ch.supsi.controller;

import ch.supsi.controller.folder.FolderController;
import ch.supsi.model.api.Folder;
import ch.supsi.service.folder.IFolderService;
import io.quarkus.test.InjectMock;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import jakarta.ws.rs.core.Response;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@QuarkusTest
public class FolderControllerTest {
    /*
    @Inject
    FolderController folderController;

    @InjectMock
    IFolderService folderService;

    @Test
    @DisplayName("Should return Response 200 (ok) with empty list of folders")
    void test01GetFolders_Empty() {
        when(this.folderService.getAllFolders()).thenReturn(Collections.emptyList());

        Response response = this.folderController.getFolders();

        assertNotNull(response);
        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        assertNotNull(response.getEntity());
        assertInstanceOf(List.class, response.getEntity());
        assertTrue(((List<?>) response.getEntity()).isEmpty());

        verify(this.folderService, times(1)).getAllFolders();
    }

    @Test
    @DisplayName("Should return Response 200 (ok) with two folders")
    void test02GetFolders() {
        String folderName_1 = "Test Folder1";
        String folderName_2 = "Test Folder2";

        Folder folder1 = new Folder(folderName_1);
        Folder folder2 = new Folder(folderName_2);

        when(this.folderService.getAllFolders()).thenReturn(List.of(folder1, folder2));

        Response response = this.folderController.getFolders();

        assertNotNull(response);
        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        assertNotNull(response.getEntity());
        assertInstanceOf(List.class, response.getEntity());

        List<Folder> foldersRetrieved = ((List<?>)(response.getEntity()))
                .stream()
                .filter(obj -> Folder.class.isAssignableFrom(obj.getClass()))
                .map(obj -> (Folder)obj)
                .toList();

        assertEquals(2, foldersRetrieved.size());

        Folder folder1Retrieved = foldersRetrieved.getFirst();
        assertEquals(folderName_1, folder1Retrieved.getName());

        Folder folder2Retrieved = foldersRetrieved.get(1);
        assertEquals(folderName_2, folder2Retrieved.getName());

        verify(this.folderService, times(1)).getAllFolders();
    }

    @Test
    @DisplayName("Should return Response 201 (created) one folder")
    void test03CreateFolder() {
        String folderName = "Test Folder";
        Folder folder = new Folder(folderName);
        when(this.folderService.createFolder(folder)).thenReturn(folder);

        Response response = this.folderController.createFolder(folder);

        assertNotNull(response);
        assertEquals(Response.Status.CREATED.getStatusCode(), response.getStatus());
        assertNotNull(response.getEntity());
        assertInstanceOf(Folder.class, response.getEntity());

        Folder folderRetrieved = (Folder) response.getEntity();
        assertEquals(folderName, folderRetrieved.getName());

        verify(this.folderService, times(1)).createFolder(folder);
    }

     */
}
