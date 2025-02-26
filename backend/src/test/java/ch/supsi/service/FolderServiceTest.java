package ch.supsi.service;

import ch.supsi.model.Folder;
import ch.supsi.service.testContainersResource.MongoTestResource;
import io.quarkus.test.common.QuarkusTestResource;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import org.junit.jupiter.api.*;


import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@QuarkusTest
@QuarkusTestResource(MongoTestResource.class)
@TestMethodOrder(MethodOrderer.MethodName.class)
public class FolderServiceTest {

    @Inject
    FolderService folderServiceTest;

    @BeforeEach
    @AfterEach
    void cleanup() {
        Folder.deleteAll();
    }

    @Test
    @DisplayName("Should get empty list of folders")
    void test01GetAllFolders_Empty() {
        List<Folder> folders = this.folderServiceTest.getAllFolders();
        assertTrue(folders.isEmpty());
    }

    @Test
    @DisplayName("Should add two folders and get them back")
    void test02GetAllFolders() {
        String folderName_1 = "Test Folder1";
        String folderName_2 = "Test Folder2";

        Folder folder1 = new Folder(folderName_1);
        Folder folder2 = new Folder(folderName_2);

        folder1.persist();
        folder2.persist();

        List<Folder> folders = this.folderServiceTest.getAllFolders();

        assertEquals(2, folders.size());

        Folder folder1Retrieved = folders.getFirst();
        assertNotNull(folder1Retrieved.id);
        assertEquals(folderName_1, folder1Retrieved.getName());

        Folder folder2Retrieved = folders.get(1);
        assertNotNull(folder2Retrieved.id);
        assertEquals(folderName_2, folder2Retrieved.getName());
    }

    @Test
    @DisplayName("Should create one folder")
    void test03CreateFolder() {
        String folderName = "Test Folder";
        Folder folder = new Folder(folderName);

        assertTrue(this.folderServiceTest.getAllFolders().isEmpty());

        this.folderServiceTest.createFolder(folder);

        assertEquals(1, Folder.listAll().size());

        Folder folderRetrieved = this.folderServiceTest.getAllFolders().getFirst();
        assertNotNull(folderRetrieved.id);
        assertEquals(folderName, folderRetrieved.getName());
    }
}