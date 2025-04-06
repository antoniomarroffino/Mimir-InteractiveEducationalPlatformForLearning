package ch.supsi.service.quiz;

import ch.supsi.mapper.CourseMapper;
import ch.supsi.mapper.FolderMapper;
import ch.supsi.mapper.quiz.facade.QuizMapperFacade;
import ch.supsi.model.api.Course;
import ch.supsi.model.api.Folder;
import ch.supsi.model.api.Quiz;
import ch.supsi.model.dto.api.CourseDTO;
import ch.supsi.model.dto.api.FolderDTO;
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

import java.time.LocalDateTime;
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
    FolderMapper folderMapper;

    @InjectMock
    CourseMapper courseMapper;

    @Test
    @DisplayName("Should return empty quiz list for empty folder")
    void test01GetQuizzesInFolder_EmptyList() {
        FolderDTO folderDTO = new FolderDTO();
        Folder folderEntity = new Folder();

        when(this.folderMapper.toEntity(folderDTO)).thenReturn(folderEntity);

        List<QuizDTO> result = quizService.getQuizzesInFolder(folderDTO);
        assertTrue(result.isEmpty());

        verify(this.folderMapper, times(1)).toEntity(folderDTO);
        verify(this.quizMapperFacade, never()).toDTO(any(Quiz.class));
    }

    @Test
    @DisplayName("Should return quiz list with correct mapping")
    void test02GetQuizzesInFolder_WithQuizzes() {
        Quiz quiz = createTestQuiz("Test", "");

        Folder folderEntity = new Folder();
        folderEntity.quizzes = List.of(quiz);

        when(this.folderMapper.toEntity(any(FolderDTO.class))).thenReturn(folderEntity);
        when(this.quizMapperFacade.toDTO(quiz)).thenReturn(new QuizDTO());

        List<QuizDTO> result = quizService.getQuizzesInFolder(new FolderDTO());
        assertEquals(1, result.size());

        verify(this.folderMapper, times(1)).toEntity(any(FolderDTO.class));
        verify(this.quizMapperFacade, times(1)).toDTO(any(Quiz.class));
    }

    @Test
    @DisplayName("Should throw BadRequestError because FolderDTO passed is null")
    void test03GetQuizzesInFolder_ThrowBadRequestErrorFolderDTOIsNull() {
        BadRequestException exception = assertThrows(
                BadRequestException.class,
                () -> this.quizService.getQuizzesInFolder(null)
        );

        assertEquals("Folder passed is null", exception.getMessage());

        verify(this.folderMapper, never()).toEntity(any(FolderDTO.class));
        verify(this.quizMapperFacade, never()).toDTO(any(Quiz.class));
    }

    @Test
    @DisplayName("Should find existing quiz in folder")
    void test04GetQuizInFolder_Found() {
        Quiz quiz = createTestQuiz("Test", "");
        Folder folderEntity = new Folder();
        folderEntity.quizzes = List.of(quiz);

        when(this.folderMapper.toEntity(any(FolderDTO.class))).thenReturn(folderEntity);
        when(this.quizMapperFacade.toDTO(quiz)).thenReturn(convertToDTO(quiz));

        QuizDTO result = this.quizService.getQuizInFolder(new FolderDTO(), quiz.id);

        assertEquals(quiz.id.toString(), result.getId());

        verify(this.folderMapper, times(1)).toEntity(any(FolderDTO.class));
        verify(this.quizMapperFacade, times(1)).toDTO(quiz);
    }

    @Test
    @DisplayName("Should throw NotFoundError when quiz not found in folder")
    void test05GetQuizInFolder_NotFound() {
        ObjectId quizId = new ObjectId();

        when(this.folderMapper.toEntity(any())).thenReturn(new Folder());

        NotFoundException exception = assertThrows(
                NotFoundException.class,
                () -> this.quizService.getQuizInFolder(new FolderDTO(), quizId)
        );

        assertEquals("Quiz with id " + quizId + " not found in folder", exception.getMessage());

        verify(this.folderMapper, times(1)).toEntity(any(FolderDTO.class));
        verify(this.quizMapperFacade, never()).toDTO(any(Quiz.class));
    }

    @Test
    @DisplayName("Should throw BadRequestError because FolderDTO passed is null")
    void test06GetQuizInFolder_ThrowBadRequestErrorFolderDTOIsNull() {
        BadRequestException exception = assertThrows(
                BadRequestException.class,
                () -> this.quizService.getQuizInFolder(null, new ObjectId())
        );

        assertEquals("Folder passed is null", exception.getMessage());

        verify(this.folderMapper, never()).toEntity(any(FolderDTO.class));
        verify(this.quizMapperFacade, never()).toDTO(any(Quiz.class));
    }

    @Test
    @DisplayName("Should add quiz to folder and update course")
    void test07AddQuizToFolder_Success() {
        Course course = CourseServiceTest.createTestCourse("Test", "");
        CourseDTO courseDTO = CourseServiceTest.convertToDTO(course);
        courseDTO.setId(new ObjectId().toString());

        Folder folder = FolderServiceTest.createTestFolder("Test");
        FolderDTO folderDTO = FolderServiceTest.convertToDTO(folder);
        folderDTO.setId(new ObjectId().toString());

        QuizDTO quizDTO = new QuizDTO();

        when(this.courseMapper.toEntity(courseDTO)).thenReturn(course);
        when(this.folderMapper.toEntity(folderDTO)).thenReturn(folder);
        when(this.quizMapperFacade.toEntity(quizDTO)).thenReturn(new Quiz());
        when(this.quizMapperFacade.toDTO(any(Quiz.class))).thenReturn(quizDTO);

        InOrder inOrder = inOrder(this.courseMapper, this.folderMapper, this.quizMapperFacade, this.courseRepository);

        QuizDTO result = this.quizService.addQuizToFolder(courseDTO, folderDTO, quizDTO);
        assertNotNull(result);
        assertEquals(1, folder.quizzes.size());

        inOrder.verify(this.courseMapper, times(1)).toEntity(courseDTO);
        inOrder.verify(this.folderMapper, times(1)).toEntity(folderDTO);
        inOrder.verify(this.quizMapperFacade, times(1)).toEntity(quizDTO);
        inOrder.verify(this.courseRepository, times(1)).update(course);
        inOrder.verify(this.quizMapperFacade, times(1)).toDTO(any(Quiz.class));
    }

    @Test
    @DisplayName("Should validate input parameters on add")
    void test08AddQuizToFolder_ValidationOfDTOsPassed() {
        assertAll(
                () -> assertThrows(
                        BadRequestException.class,
                        () -> this.quizService.addQuizToFolder(null, new FolderDTO(), new QuizDTO())
                ),
                () -> assertThrows(
                        BadRequestException.class,
                        () -> this.quizService.addQuizToFolder(new CourseDTO(), null, new QuizDTO())
                )
        );

        verify(this.courseMapper, never()).toEntity(any(CourseDTO.class));
        verify(this.folderMapper, never()).toEntity(any(FolderDTO.class));
        verify(this.quizMapperFacade, never()).toEntity(any(QuizDTO.class));
        verify(this.courseRepository, never()).update(any(Course.class));
        verify(this.quizMapperFacade, never()).toDTO(any(Quiz.class));
    }

    @Test
    @DisplayName("Should update existing quiz with new data")
    void test09UpdateQuizInFolder_Success() {
        Quiz existingQuiz = createTestQuiz("Test", "");
        LocalDateTime testTime = existingQuiz.updatedAt;
        QuizDTO updateDTO = convertToDTO(createTestQuiz("Updated", ""));

        Folder folderEntity = FolderServiceTest.createTestFolder("Test");
        folderEntity.quizzes = new ArrayList<>(List.of(existingQuiz));

        Course courseEntity = CourseServiceTest.createTestCourse("Test", "");
        QuestionDTO questionDTO = new TrueFalseQuestionDTO();
        questionDTO.setId(new ObjectId().toString());
        updateDTO.setQuestions(List.of(questionDTO));

        when(this.courseMapper.toEntity(any(CourseDTO.class))).thenReturn(courseEntity);
        when(this.folderMapper.toEntity(any(FolderDTO.class))).thenReturn(folderEntity);
        when(this.quizMapperFacade.toEntity(any(QuizDTO.class))).thenReturn(existingQuiz);
        when(this.quizMapperFacade.toDTO(existingQuiz)).thenReturn(updateDTO);

        QuizDTO result = this.quizService.updateQuizInFolder(
                new CourseDTO(), new FolderDTO(), existingQuiz.id, updateDTO
        );

        assertNotNull(result);

        verify(this.courseMapper, times(1)).toEntity(any(CourseDTO.class));
        verify(this.folderMapper, times(1)).toEntity(any(FolderDTO.class));
        verify(this.quizMapperFacade, times(1)).toEntity(any(QuizDTO.class));
        verify(this.courseRepository, times(1)).update(courseEntity);
        verify(this.quizMapperFacade, times(1)).toDTO(existingQuiz);
    }

    @Test
    @DisplayName("Should throw NotFoundError because quiz does not exist in folder")
    void test10UpdateQuizInFolder_NotFound() {
        ObjectId id = new ObjectId();

        when(this.folderMapper.toEntity(any())).thenReturn(new Folder());

        NotFoundException exception = assertThrows(
                NotFoundException.class,
                () -> this.quizService.updateQuizInFolder(new CourseDTO(), new FolderDTO(), id, new QuizDTO())
        );

        assertEquals("Quiz with id " + id + " not found in folder", exception.getMessage());

        verify(this.courseMapper, times(1)).toEntity(any(CourseDTO.class));
        verify(this.folderMapper, times(1)).toEntity(any(FolderDTO.class));
        verify(this.quizMapperFacade, never()).toEntity(any(QuizDTO.class));
        verify(this.courseRepository, never()).update(any(Course.class));
        verify(this.quizMapperFacade, never()).toDTO(any(Quiz.class));
    }

    @Test
    @DisplayName("Should validate input parameters on add")
    void test11UpdateQuizInFolder_ValidationOfDTOsPassed() {
        assertAll(
                () -> assertThrows(
                        BadRequestException.class,
                        () -> this.quizService.updateQuizInFolder(null, new FolderDTO(), new ObjectId(), new QuizDTO())
                ),
                () -> assertThrows(
                        BadRequestException.class,
                        () -> this.quizService.updateQuizInFolder(new CourseDTO(), null, new ObjectId(), new QuizDTO())
                ),
                () -> assertThrows(
                        BadRequestException.class,
                        () -> this.quizService.updateQuizInFolder(new CourseDTO(), new FolderDTO(), new ObjectId(), null)
                )
        );

        verify(this.courseMapper, never()).toEntity(any(CourseDTO.class));
        verify(this.folderMapper, never()).toEntity(any(FolderDTO.class));
        verify(this.quizMapperFacade, never()).toEntity(any(QuizDTO.class));
        verify(this.courseRepository, never()).update(any(Course.class));
        verify(this.quizMapperFacade, never()).toDTO(any(Quiz.class));
    }

    @Test
    @DisplayName("Should remove quiz from folder")
    void test12RemoveQuizFromFolder_Success() {
        Quiz quiz = createTestQuiz("Test", "");
        Folder folderEntity = FolderServiceTest.createTestFolder("Test");
        folderEntity.quizzes = new ArrayList<>(List.of(quiz));
        Course courseEntity = CourseServiceTest.createTestCourse("Test", "");

        when(this.courseMapper.toEntity(any(CourseDTO.class))).thenReturn(courseEntity);
        when(this.folderMapper.toEntity(any(FolderDTO.class))).thenReturn(folderEntity);

        this.quizService.removeQuizFromFolder(new CourseDTO(), new FolderDTO(), quiz.id);

        assertTrue(folderEntity.quizzes.isEmpty());

        verify(this.courseMapper, times(1)).toEntity(any(CourseDTO.class));
        verify(this.folderMapper, times(1)).toEntity(any(FolderDTO.class));
        verify(this.courseRepository, times(1)).update(courseEntity);
    }

    @Test
    @DisplayName("Should throw NotFoundError because quiz is not founded")
    void test13RemoveQuizFromFolder_NotFound() {
        ObjectId id = new ObjectId();

        when(this.folderMapper.toEntity(any())).thenReturn(new Folder());

        NotFoundException exception = assertThrows(
                NotFoundException.class,
                () -> this.quizService.removeQuizFromFolder(new CourseDTO(), new FolderDTO(), id)
        );

        assertEquals("Quiz with id " + id + " not found in folder", exception.getMessage());

        verify(this.courseMapper, times(1)).toEntity(any(CourseDTO.class));
        verify(this.folderMapper, times(1)).toEntity(any(FolderDTO.class));
        verify(this.courseRepository, never()).update(any(Course.class));
    }

    @Test
    @DisplayName("Should validate input parameters on remove")
    void test13RemoveQuizFromFolder_Validation() {
        assertAll(
                () -> assertThrows(BadRequestException.class,
                        () -> this.quizService.removeQuizFromFolder(null, new FolderDTO(), new ObjectId())),

                () -> assertThrows(BadRequestException.class,
                        () -> this.quizService.removeQuizFromFolder(new CourseDTO(), null, new ObjectId()))
        );
    }

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
}
