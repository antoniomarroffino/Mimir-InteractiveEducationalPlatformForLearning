package ch.supsi.model.dto.api.folder;

import ch.supsi.model.dto.api.FolderDTO;
import ch.supsi.model.dto.api.QuizDTO;
import io.quarkus.test.junit.QuarkusTest;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@QuarkusTest
@TestMethodOrder(MethodOrderer.MethodName.class)
public class FolderDTOTest {
    @Test
    @DisplayName("Should create correctly FolderDTO with constructor no parameters")
    void test01CreateFolderDTO_ConstructorNoParameters() {
        FolderDTO folderDTO = new FolderDTO();
        assertNull(folderDTO.getId());
        assertNull(folderDTO.getName());
        assertNotNull(folderDTO.getQuizzes());
        assertTrue(folderDTO.getQuizzes().isEmpty());
    }

    @Test
    @DisplayName("Should create correctly FolderDTO passing name to constructor")
    void test02CreateFolderDTO_PassingNameToConstructor() {
        String name = "test";
        FolderDTO folderDTO = new FolderDTO(name);
        assertNull(folderDTO.getId());
        assertEquals(name, folderDTO.getName());
        assertNotNull(folderDTO.getQuizzes());
        assertTrue(folderDTO.getQuizzes().isEmpty());
    }

    @Test
    @DisplayName("Should all setters work correctly")
    void test03SettersWorkCorrectly() {
        String id = new ObjectId().toString();
        String name = "test";
        QuizDTO quizDTO = new QuizDTO();
        List<QuizDTO> quizDTOS = List.of(quizDTO);

        FolderDTO folderDTO = new FolderDTO();
        folderDTO.setId(id);
        folderDTO.setName(name);
        folderDTO.setQuizzes(quizDTOS);

        assertEquals(id, folderDTO.getId());
        assertEquals(name, folderDTO.getName());
        assertEquals(quizDTOS, folderDTO.getQuizzes());

        folderDTO.setQuizzes(null);
        assertNotNull(folderDTO.getQuizzes());
        assertTrue(folderDTO.getQuizzes().isEmpty());
    }
}
