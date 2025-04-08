package ch.supsi.model.api.folder;

import ch.supsi.model.api.Folder;
import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

import static org.junit.jupiter.api.Assertions.*;

@QuarkusTest
@TestMethodOrder(MethodOrderer.MethodName.class)
public class FolderTest {
    @Test
    @DisplayName("Should crate new Folder with constructor no parameters")
    void test01CreateFolder_ConstructorNoParameters() {
        Folder folder = new Folder();
        assertNotNull(folder.id);
        assertNull(folder.name);
        assertNotNull(folder.quizzes);
        assertTrue(folder.quizzes.isEmpty());
    }

    @Test
    @DisplayName("Should create new Folder passing name to constructor")
    void test02CreateFolder_ConstructorNameParameter() {
        String name = "test";
        Folder folder = new Folder(name);
        assertNotNull(folder.id);
        assertEquals(name, folder.name);
        assertNotNull(folder.quizzes);
        assertTrue(folder.quizzes.isEmpty());
    }
}
