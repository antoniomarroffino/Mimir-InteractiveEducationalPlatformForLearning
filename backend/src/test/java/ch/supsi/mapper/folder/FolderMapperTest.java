package ch.supsi.mapper.folder;

import ch.supsi.mapper.FolderMapper;
import ch.supsi.mapper.quiz.facade.IQuizMapperFacade;
import ch.supsi.model.api.Course;
import ch.supsi.model.api.Folder;
import ch.supsi.model.api.Quiz;
import ch.supsi.model.dto.api.CourseDTO;
import ch.supsi.model.dto.api.FolderDTO;
import ch.supsi.model.dto.api.QuizDTO;
import ch.supsi.service.course.CourseServiceTest;
import ch.supsi.service.folder.FolderServiceTest;
import ch.supsi.service.quiz.QuizServiceTest;
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
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.mockito.Mockito.times;

@QuarkusTest
@TestMethodOrder(MethodOrderer.MethodName.class)
public class FolderMapperTest {
    @Inject
    FolderMapper folderMapper;

    @InjectMock
    IQuizMapperFacade quizMapperFacade;

    @Test
    @DisplayName("Should return null because Folder passed is null")
    void test01ToDTO_ReturnNull() {
        FolderDTO folderDTO = this.folderMapper.toDTO(null);
        assertNull(folderDTO);
        verify(this.quizMapperFacade, never()).toDTO(any(Quiz.class));
    }

    @Test
    @DisplayName("Should return FolderDTO from Folder")
    void test02ToDTO_ReturnFolderDTO() {
        Quiz quiz = QuizServiceTest.createTestQuiz("Test Quiz", "");
        QuizDTO quizDTO = QuizServiceTest.convertToDTO(quiz);

        Folder folder = FolderServiceTest.createTestFolder("Test Folder");
        folder.quizzes = List.of(quiz);

        when(this.quizMapperFacade.toDTO(quiz)).thenReturn(quizDTO);

        FolderDTO folderDTO = this.folderMapper.toDTO(folder);
        assertNotNull(folderDTO);
        assertEquals(folder.id.toString(), folderDTO.getId());
        assertEquals(folder.name, folderDTO.getName());
        assertEquals(1, folderDTO.getQuizzes().size());

        verify(this.quizMapperFacade, times(1)).toDTO(any(Quiz.class));
    }

    @Test
    @DisplayName("Should return null because FolderDTO passed is null")
    void test03ToEntity_ReturnNull() {
        Folder folder = this.folderMapper.toEntity(null);
        assertNull(folder);
        verify(this.quizMapperFacade, never()).toEntity(any(QuizDTO.class));
    }

    @Test
    @DisplayName("Should return Folder from FolderDTO")
    void test04ToEntity_ReturnFolder() {
        Quiz quiz = QuizServiceTest.createTestQuiz("Test Quiz", "");
        QuizDTO quizDTO = QuizServiceTest.convertToDTO(quiz);

        FolderDTO folderDTO = new FolderDTO("Folder");
        folderDTO.setId(new ObjectId().toString());
        folderDTO.setQuizzes(List.of(quizDTO));

        when(this.quizMapperFacade.toEntity(quizDTO)).thenReturn(quiz);

        Folder folder_retrieved = this.folderMapper.toEntity(folderDTO);
        assertNotNull(folder_retrieved);
        assertEquals(folderDTO.getId(), folder_retrieved.id.toString());
        assertEquals(folderDTO.getName(), folder_retrieved.name);
        assertEquals(1, folder_retrieved.quizzes.size());

        verify(this.quizMapperFacade, times(1)).toEntity(quizDTO);
    }

    @Test
    @DisplayName("Should return Folder from FolderDTO with id build at construction time")
    void test05ToEntity_ReturnFolderWithIdNull() {
        FolderDTO folderDTO = new FolderDTO("Folder");
        folderDTO.setId(null);

        Folder folder_retrieved = this.folderMapper.toEntity(folderDTO);
        assertNotNull(folder_retrieved);
        assertNotNull(folder_retrieved.id);
        assertEquals(folderDTO.getName(), folder_retrieved.name);
        assertTrue(folder_retrieved.quizzes.isEmpty());

        verify(this.quizMapperFacade, never()).toEntity(any(QuizDTO.class));
    }
}
