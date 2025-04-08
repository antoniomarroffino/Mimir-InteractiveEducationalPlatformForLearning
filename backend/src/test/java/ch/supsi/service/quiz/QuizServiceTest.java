package ch.supsi.service.quiz;

import ch.supsi.mapper.CourseMapper;
import ch.supsi.mapper.quiz.facade.QuizMapperFacade;
import ch.supsi.model.api.Course;
import ch.supsi.model.api.Folder;
import ch.supsi.model.api.Quiz;
import ch.supsi.model.dto.api.CourseDTO;
import ch.supsi.model.dto.api.QuizDTO;
import ch.supsi.model.dto.api.question.QuestionDTO;
import ch.supsi.model.dto.api.question.TrueFalseQuestionDTO;
import ch.supsi.repository.CourseRepository;
import ch.supsi.service.course.CourseServiceTest;
import ch.supsi.service.folder.FolderServiceTest;
import io.quarkus.test.InjectMock;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import jakarta.ws.rs.BadRequestException;
import jakarta.ws.rs.NotFoundException;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.mockito.InOrder;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@QuarkusTest
@TestMethodOrder(MethodOrderer.MethodName.class)
public class QuizServiceTest {
    @Inject
    QuizService quizService;

    @InjectMock
    CourseRepository courseRepository;

    @InjectMock
    QuizMapperFacade quizMapperFacade;

    @InjectMock
    CourseMapper courseMapper;

    public static Quiz createTestQuiz(String name, String description) {
        Quiz quiz = new Quiz();
        quiz.name = name;
        quiz.description = description;
        return quiz;
    }

    public static QuizDTO convertToDTO(Quiz quiz) {
        QuizDTO quizDTO = new QuizDTO();
        quizDTO.setId(quiz.id.toString());
        quizDTO.setName(quiz.name);
        quizDTO.setDescription(quiz.description);
        quizDTO.setUpdatedAt(quiz.updatedAt);
        quizDTO.setCreatedAt(quiz.createdAt);
        return quizDTO;
    }

    @Test
    @DisplayName("Should return empty quiz list for empty folder")
    void test01GetQuizzesInFolder_EmptyList() {
        ObjectId folderId = new ObjectId();
        Course course = CourseServiceTest.createTestCourse("Test", "");
        Folder folder = FolderServiceTest.createTestFolder("Test");
        CourseDTO courseDTO = CourseServiceTest.convertToDTO(course);
        folder.id = folderId;
        course.folders = List.of(folder);

        when(this.courseMapper.toEntity(courseDTO)).thenReturn(course);

        List<QuizDTO> result = this.quizService.getQuizzesInFolder(courseDTO, folderId);
        assertTrue(result.isEmpty());

        verify(this.courseMapper, times(1)).toEntity(courseDTO);
        verify(this.quizMapperFacade, never()).toDTO(any());
    }

    @Test
    @DisplayName("Should return quiz list with correct mapping")
    void test02GetQuizzesInFolder_WithQuizzes() {
        ObjectId folderId = new ObjectId();
        Course course = CourseServiceTest.createTestCourse("Test", "");
        Folder folder = FolderServiceTest.createTestFolder("Test");
        CourseDTO courseDTO = CourseServiceTest.convertToDTO(course);
        folder.id = folderId;
        Quiz quiz = createTestQuiz("Test", "");
        folder.quizzes = List.of(quiz);
        course.folders = List.of(folder);

        when(this.courseMapper.toEntity(courseDTO)).thenReturn(course);
        when(this.quizMapperFacade.toDTO(quiz)).thenReturn(new QuizDTO());

        List<QuizDTO> result = this.quizService.getQuizzesInFolder(courseDTO, folderId);
        assertEquals(folder.quizzes.size(), result.size());

        verify(this.courseMapper, times(1)).toEntity(courseDTO);
        verify(this.quizMapperFacade, times(folder.quizzes.size())).toDTO(quiz);
    }

    @Test
    @DisplayName("Should throw NotFoundError because folder id does not exist in course")
    void test03GetQuizzesInFolder_ThrowNotFoundErrorFolderNotFound() {
        ObjectId folderId = new ObjectId();

        when(this.courseMapper.toEntity(any(CourseDTO.class))).thenReturn(new Course());

        NotFoundException exception = assertThrows(
                NotFoundException.class,
                () -> this.quizService.getQuizzesInFolder(new CourseDTO(), folderId)
        );

        assertEquals("Folder with id " + folderId + " not found in course", exception.getMessage());

        verify(this.courseMapper, times(1)).toEntity(any(CourseDTO.class));
        verifyNoInteractions(this.quizMapperFacade);
    }

    @Test
    @DisplayName("Should find existing quiz in folder")
    void test04GetQuizInFolder_Found() {
        Course course = CourseServiceTest.createTestCourse("Test", "");
        Folder folder = FolderServiceTest.createTestFolder("Test");
        CourseDTO courseDTO = CourseServiceTest.convertToDTO(course);
        Quiz quiz = createTestQuiz("Test", "");
        folder.quizzes = List.of(quiz);
        course.folders = List.of(folder);

        when(this.courseMapper.toEntity(courseDTO)).thenReturn(course);
        when(this.quizMapperFacade.toDTO(quiz)).thenReturn(new QuizDTO());

        QuizDTO result = this.quizService.getQuizInFolder(courseDTO, folder.id, quiz.id);
        assertNotNull(result);

        verify(this.courseMapper, times(1)).toEntity(courseDTO);
        verify(this.quizMapperFacade, times(1)).toDTO(quiz);
    }

    @Test
    @DisplayName("Should throw NotFoundError when quiz not found in folder")
    void test05GetQuizInFolder_NotFound() {
        Course course = CourseServiceTest.createTestCourse("Test", "");
        CourseDTO courseDTO = CourseServiceTest.convertToDTO(course);
        Folder folder = FolderServiceTest.createTestFolder("Test");
        course.folders = List.of(folder);

        ObjectId quizId = new ObjectId();

        when(this.courseMapper.toEntity(courseDTO)).thenReturn(course);

        NotFoundException exception = assertThrows(
                NotFoundException.class,
                () -> this.quizService.getQuizInFolder(courseDTO, folder.id, quizId)
        );

        assertEquals("Quiz with id " + quizId + " not found in folder", exception.getMessage());

        verify(this.courseMapper, times(1)).toEntity(any(CourseDTO.class));
        verify(this.quizMapperFacade, never()).toDTO(any(Quiz.class));
    }

    @Test
    @DisplayName("Should throw NotFoundError because folder id does not exist in course")
    void test06GetQuizInFolder_ThrowNotFoundErrorFolderNotFound() {
        ObjectId folderId = new ObjectId();

        when(this.courseMapper.toEntity(any(CourseDTO.class))).thenReturn(new Course());

        NotFoundException exception = assertThrows(
                NotFoundException.class,
                () -> this.quizService.getQuizInFolder(new CourseDTO(), folderId, new ObjectId())
        );

        assertEquals("Folder with id " + folderId + " not found in course", exception.getMessage());

        verify(this.courseMapper, times(1)).toEntity(any(CourseDTO.class));
        verifyNoInteractions(this.quizMapperFacade);
    }

    @Test
    @DisplayName("Should add quiz to folder and update course")
    void test07AddQuizToFolder_Success() {
        Course course = CourseServiceTest.createTestCourse("Test", "");
        CourseDTO courseDTO = CourseServiceTest.convertToDTO(course);

        Folder folder = FolderServiceTest.createTestFolder("Test");
        course.folders.add(folder);

        QuizDTO quizDTO = new QuizDTO();

        when(this.courseMapper.toEntity(courseDTO)).thenReturn(course);
        when(this.quizMapperFacade.toEntity(quizDTO)).thenReturn(new Quiz());
        when(this.quizMapperFacade.toDTO(any(Quiz.class))).thenReturn(quizDTO);

        InOrder inOrder = inOrder(this.courseMapper, this.quizMapperFacade, this.courseRepository);

        QuizDTO result = this.quizService.addQuizToFolder(courseDTO, folder.id, quizDTO);
        assertNotNull(result);
        assertEquals(1, folder.quizzes.size());

        inOrder.verify(this.courseMapper, times(1)).toEntity(courseDTO);
        inOrder.verify(this.quizMapperFacade, times(1)).toEntity(quizDTO);
        inOrder.verify(this.courseRepository, times(1)).update(course);
        inOrder.verify(this.quizMapperFacade, times(1)).toDTO(any(Quiz.class));
    }

    @Test
    @DisplayName("Should throw NotFoundError because folder id does not exist in course")
    void test08AddQuizToFolder_ThrowNotFoundErrorFolderNotFound() {
        ObjectId folderId = new ObjectId();

        when(this.courseMapper.toEntity(any(CourseDTO.class))).thenReturn(new Course());

        NotFoundException exception = assertThrows(
                NotFoundException.class,
                () -> this.quizService.addQuizToFolder(new CourseDTO(), folderId, new QuizDTO())
        );

        assertEquals("Folder with id " + folderId + " not found in course", exception.getMessage());

        verify(this.courseMapper, times(1)).toEntity(any(CourseDTO.class));
        verify(this.quizMapperFacade, never()).toEntity(any(QuizDTO.class));
        verify(this.courseRepository, never()).update(any(Course.class));
        verify(this.quizMapperFacade, never()).toDTO(any(Quiz.class));
    }

    @Test
    @DisplayName("Should update existing quiz with new data")
    void test09UpdateQuizInFolder_Success() {
        Quiz existingQuiz = createTestQuiz("Test", "");
        QuizDTO updateDTO = convertToDTO(createTestQuiz("Updated", ""));

        Folder folderEntity = FolderServiceTest.createTestFolder("Test");
        folderEntity.quizzes = new ArrayList<>(List.of(existingQuiz));

        Course courseEntity = CourseServiceTest.createTestCourse("Test", "");
        courseEntity.folders.add(folderEntity);
        QuestionDTO questionDTO = new TrueFalseQuestionDTO();
        questionDTO.setId(new ObjectId().toString());
        updateDTO.setQuestions(List.of(questionDTO));

        CourseDTO courseDTO = CourseServiceTest.convertToDTO(courseEntity);

        when(this.courseMapper.toEntity(any(CourseDTO.class))).thenReturn(courseEntity);
        when(this.quizMapperFacade.toEntity(any(QuizDTO.class))).thenReturn(existingQuiz);
        when(this.quizMapperFacade.toDTO(existingQuiz)).thenReturn(updateDTO);

        QuizDTO result = this.quizService.updateQuizInFolder(
                courseDTO, folderEntity.id, existingQuiz.id, updateDTO
        );

        assertNotNull(result);

        verify(this.courseMapper, times(1)).toEntity(courseDTO);
        verify(this.quizMapperFacade, times(1)).toEntity(any(QuizDTO.class));
        verify(this.courseRepository, times(1)).update(courseEntity);
        verify(this.quizMapperFacade, times(1)).toDTO(existingQuiz);
    }

    @Test
    @DisplayName("Should throw NotFoundError when quiz not found in folder")
    void test10UpdateQuizInFolder_NotFound() {
        Course course = CourseServiceTest.createTestCourse("Test", "");
        CourseDTO courseDTO = CourseServiceTest.convertToDTO(course);
        Folder folder = FolderServiceTest.createTestFolder("Test");
        course.folders = List.of(folder);

        ObjectId quizId = new ObjectId();

        when(this.courseMapper.toEntity(courseDTO)).thenReturn(course);

        NotFoundException exception = assertThrows(
                NotFoundException.class,
                () -> this.quizService.updateQuizInFolder(courseDTO, folder.id, quizId, new QuizDTO())
        );

        assertEquals("Quiz with id " + quizId + " not found in folder", exception.getMessage());

        verify(this.courseMapper, times(1)).toEntity(any(CourseDTO.class));
        verify(this.quizMapperFacade, never()).toEntity(any(QuizDTO.class));
        verify(this.courseRepository, never()).update(any(Course.class));
        verify(this.quizMapperFacade, never()).toDTO(any(Quiz.class));
    }

    @Test
    @DisplayName("Should validate input QuizDTO")
    void test11UpdateQuizInFolder_ValidationOfDTOPassed() {
        BadRequestException exception = assertThrows(
                BadRequestException.class,
                () -> this.quizService.updateQuizInFolder(new CourseDTO(), new ObjectId(), new ObjectId(), null)
        );

        assertEquals("QuizDTO is null", exception.getMessage());

        verify(this.courseMapper, never()).toEntity(any(CourseDTO.class));
        verify(this.quizMapperFacade, never()).toEntity(any(QuizDTO.class));
        verify(this.courseRepository, never()).update(any(Course.class));
        verify(this.quizMapperFacade, never()).toDTO(any(Quiz.class));
    }

    @Test
    @DisplayName("Should throw NotFoundError because folder id does not exist in course")
    void test12UpdateQuizInFolder_ThrowNotFoundErrorFolderNotFound() {
        ObjectId folderId = new ObjectId();

        when(this.courseMapper.toEntity(any(CourseDTO.class))).thenReturn(new Course());

        NotFoundException exception = assertThrows(
                NotFoundException.class,
                () -> this.quizService.updateQuizInFolder(new CourseDTO(), folderId, new ObjectId(), new QuizDTO())
        );

        assertEquals("Folder with id " + folderId + " not found in course", exception.getMessage());

        verify(this.courseMapper, times(1)).toEntity(any(CourseDTO.class));
        verify(this.quizMapperFacade, never()).toEntity(any(QuizDTO.class));
        verify(this.courseRepository, never()).update(any(Course.class));
        verify(this.quizMapperFacade, never()).toDTO(any(Quiz.class));
    }

    @Test
    @DisplayName("Should remove quiz from folder")
    void test13RemoveQuizFromFolder_Success() {
        Quiz quiz = createTestQuiz("Test", "");
        Folder folderEntity = FolderServiceTest.createTestFolder("Test");
        folderEntity.quizzes.add(quiz);
        Course courseEntity = CourseServiceTest.createTestCourse("Test", "");
        courseEntity.folders.add(folderEntity);

        when(this.courseMapper.toEntity(any(CourseDTO.class))).thenReturn(courseEntity);

        this.quizService.removeQuizFromFolder(new CourseDTO(), folderEntity.id, quiz.id);

        assertTrue(folderEntity.quizzes.isEmpty());

        verify(this.courseMapper, times(1)).toEntity(any(CourseDTO.class));
        verify(this.courseRepository, times(1)).update(courseEntity);
    }

    @Test
    @DisplayName("Should throw NotFoundError when quiz not found in folder")
    void test14RemoveQuizFromFolder_NotFound() {
        Course course = CourseServiceTest.createTestCourse("Test", "");
        Folder folder = FolderServiceTest.createTestFolder("Test");
        course.folders = List.of(folder);

        ObjectId quizId = new ObjectId();

        when(this.courseMapper.toEntity(any(CourseDTO.class))).thenReturn(course);

        NotFoundException exception = assertThrows(
                NotFoundException.class,
                () -> this.quizService.removeQuizFromFolder(new CourseDTO(), folder.id, quizId)
        );

        assertEquals("Quiz with id " + quizId + " not found in folder", exception.getMessage());

        verify(this.courseMapper, times(1)).toEntity(any(CourseDTO.class));
        verify(this.courseRepository, never()).update(any(Course.class));
    }

    @Test
    @DisplayName("Should throw NotFoundError because folder id does not exist in course")
    void test15RemoveQuizFromFolder_ThrowNotFoundErrorFolderNotFound() {
        ObjectId folderId = new ObjectId();

        when(this.courseMapper.toEntity(any(CourseDTO.class))).thenReturn(new Course());

        NotFoundException exception = assertThrows(
                NotFoundException.class,
                () -> this.quizService.removeQuizFromFolder(new CourseDTO(), folderId, new ObjectId())
        );

        assertEquals("Folder with id " + folderId + " not found in course", exception.getMessage());

        verify(this.courseMapper, times(1)).toEntity(any(CourseDTO.class));
        verify(this.courseRepository, never()).update(any(Course.class));
    }
}
