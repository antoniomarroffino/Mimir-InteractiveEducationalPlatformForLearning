package ch.supsi.controller.quiz;

import ch.supsi.model.dto.api.CourseDTO;
import ch.supsi.model.dto.api.QuizDTO;
import ch.supsi.service.course.ICourseService;
import ch.supsi.service.quiz.IQuizService;
import io.quarkus.hibernate.validator.runtime.jaxrs.ResteasyReactiveViolationException;
import io.quarkus.test.InjectMock;
import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.security.TestSecurity;
import jakarta.inject.Inject;
import jakarta.ws.rs.NotFoundException;
import jakarta.ws.rs.core.Response;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@QuarkusTest
@TestMethodOrder(MethodOrderer.MethodName.class)
public class QuizControllerTest {
    private static final String COURSE_ID = new ObjectId().toString();
    private static final String FOLDER_ID = new ObjectId().toString();
    private static final String QUIZ_ID = new ObjectId().toString();
    private static final String NON_EXISTENT_ID = new ObjectId().toString();

    @Inject
    QuizController quizController;

    @InjectMock
    IQuizService quizService;

    @InjectMock
    ICourseService courseService;

    @Test
    @DisplayName("Should get all quizzes in folder")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    void test01GetQuizzes_Success() {
        QuizDTO quiz1 = new QuizDTO();
        QuizDTO quiz2 = new QuizDTO();

        when(this.courseService.getCourseById(any(ObjectId.class))).thenReturn(new CourseDTO());
        when(this.quizService.getQuizzesInFolder(any(CourseDTO.class), any(ObjectId.class)))
                .thenReturn(List.of(quiz1, quiz2));

        Response response = this.quizController.getQuizzes(COURSE_ID, FOLDER_ID);

        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        assertEquals(2, ((List<?>) response.getEntity()).size());

        verify(this.courseService, times(1)).getCourseById(any(ObjectId.class));
        verify(this.quizService, times(1)).getQuizzesInFolder(any(CourseDTO.class), any(ObjectId.class));
    }

    @Test
    @DisplayName("Should return empty quiz list")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    void test02GetQuizzes_Empty() {
        when(this.courseService.getCourseById(any(ObjectId.class))).thenReturn(new CourseDTO());
        when(this.quizService.getQuizzesInFolder(any(CourseDTO.class), any(ObjectId.class))).thenReturn(Collections.emptyList());

        Response response = this.quizController.getQuizzes(COURSE_ID, FOLDER_ID);

        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        assertTrue(((List<?>) response.getEntity()).isEmpty());

        verify(this.courseService, times(1)).getCourseById(any(ObjectId.class));
        verify(this.quizService, times(1)).getQuizzesInFolder(any(CourseDTO.class), any(ObjectId.class));
    }

    @Test
    @DisplayName("Should throw 404 when course not found")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    void test03GetQuizzes_CourseNotFound() {
        when(this.courseService.getCourseById(any(ObjectId.class))).thenThrow(new NotFoundException());

        assertThrows(
                NotFoundException.class,
                () -> this.quizController.getQuizzes(NON_EXISTENT_ID, FOLDER_ID)
        );
    }

    @Test
    @DisplayName("Should get quiz by id")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    void test04GetQuiz_Success() {
        QuizDTO quiz = new QuizDTO();

        when(this.courseService.getCourseById(any(ObjectId.class))).thenReturn(new CourseDTO());
        when(this.quizService.getQuizInFolder(any(CourseDTO.class), any(ObjectId.class), any(ObjectId.class))).thenReturn(quiz);

        Response response = this.quizController.getQuiz(COURSE_ID, FOLDER_ID, QUIZ_ID);

        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        assertEquals(quiz, response.getEntity());

        verify(this.courseService, times(1)).getCourseById(any(ObjectId.class));
        verify(this.quizService, times(1)).getQuizInFolder(any(CourseDTO.class), any(ObjectId.class), any(ObjectId.class));
    }

    @Test
    @DisplayName("Should throw 404 when quiz not found")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    void test05GetQuiz_NotFound() {
        when(this.courseService.getCourseById(any(ObjectId.class))).thenReturn(new CourseDTO());
        when(this.quizService.getQuizInFolder(any(CourseDTO.class), any(ObjectId.class), any(ObjectId.class))).thenThrow(new NotFoundException());

        assertThrows(
                NotFoundException.class,
                () -> this.quizController.getQuiz(COURSE_ID, FOLDER_ID, NON_EXISTENT_ID)
        );

        verify(this.courseService, times(1)).getCourseById(any(ObjectId.class));
        verify(this.quizService, times(1)).getQuizInFolder(any(CourseDTO.class), any(ObjectId.class), any(ObjectId.class));
    }

    @Test
    @DisplayName("Should throw 404 when course not found for quiz")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    void test06GetQuiz_CourseNotFound() {
        when(this.courseService.getCourseById(any(ObjectId.class))).thenThrow(new NotFoundException());

        assertThrows(
                NotFoundException.class,
                () -> this.quizController.getQuiz(NON_EXISTENT_ID, FOLDER_ID, QUIZ_ID)
        );
    }

    @Test
    @DisplayName("Should create new quiz")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    void test07CreateQuiz_Success() {
        QuizDTO newQuiz = new QuizDTO("Valid name");
        QuizDTO createdQuiz = new QuizDTO("Valid name");

        when(this.courseService.getCourseById(any(ObjectId.class))).thenReturn(new CourseDTO());
        when(this.quizService.addQuizToFolder(any(CourseDTO.class), any(ObjectId.class), any(QuizDTO.class))).thenReturn(createdQuiz);

        Response response = this.quizController.createQuiz(COURSE_ID, FOLDER_ID, newQuiz);

        assertEquals(Response.Status.CREATED.getStatusCode(), response.getStatus());
        assertEquals(createdQuiz, response.getEntity());

        verify(this.courseService, times(1)).getCourseById(any(ObjectId.class));
        verify(this.quizService, times(1)).addQuizToFolder(any(CourseDTO.class), any(ObjectId.class), any(QuizDTO.class));
    }

    @Test
    @DisplayName("Should throw validation error for invalid quiz because quizDTO name is null")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    void test08CreateQuiz_ValidationErrorQuizDTONameNull() {
        QuizDTO quizDTO = new QuizDTO();
        quizDTO.setName(null);

        assertThrows(
                ResteasyReactiveViolationException.class,
                () -> this.quizController.createQuiz(COURSE_ID, FOLDER_ID, quizDTO)
        );

        verifyNoInteractions(this.courseService, this.quizService);
    }

    @Test
    @DisplayName("Should throw validation error for invalid quiz because quizDTO name is blank")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    void test09CreateQuiz_ValidationErrorQuizDTONameBlank() {
        QuizDTO quizDTO = new QuizDTO();
        quizDTO.setName("");

        assertThrows(
                ResteasyReactiveViolationException.class,
                () -> this.quizController.createQuiz(COURSE_ID, FOLDER_ID, quizDTO)
        );

        verifyNoInteractions(this.courseService, this.quizService);
    }

    @Test
    @DisplayName("Should throw 404 when creating in non-existent course")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    void test10CreateQuiz_CourseNotFound() {
        when(this.courseService.getCourseById(any(ObjectId.class))).thenThrow(new NotFoundException());

        assertThrows(
                NotFoundException.class,
                () -> this.quizController.createQuiz(NON_EXISTENT_ID, FOLDER_ID, new QuizDTO("Valid name"))
        );
    }

    @Test
    @DisplayName("Should update quiz successfully")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    void test11UpdateQuiz_Success() {
        QuizDTO updateRequest = new QuizDTO("Valid name");
        QuizDTO updatedQuiz = new QuizDTO("Updated name");

        when(this.courseService.getCourseById(any(ObjectId.class))).thenReturn(new CourseDTO());
        when(this.quizService.updateQuizInFolder(any(CourseDTO.class), any(ObjectId.class), any(ObjectId.class), any(QuizDTO.class)))
                .thenReturn(updatedQuiz);

        Response response = this.quizController.updateQuiz(COURSE_ID, FOLDER_ID, QUIZ_ID, updateRequest);

        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        assertEquals(updatedQuiz, response.getEntity());

        verify(this.courseService, times(1)).getCourseById(any(ObjectId.class));
        verify(this.quizService, times(1)).updateQuizInFolder(any(CourseDTO.class), any(ObjectId.class), any(ObjectId.class), any(QuizDTO.class));
    }

    @Test
    @DisplayName("Should throw validation error for invalid update because quizDTO name is null")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    void test12UpdateQuiz_ValidationErrorQuizDTONameNull() {
        QuizDTO quizDTO = new QuizDTO();
        quizDTO.setName(null);

        assertThrows(
                ResteasyReactiveViolationException.class,
                () -> this.quizController.updateQuiz(COURSE_ID, FOLDER_ID, QUIZ_ID, quizDTO)
        );

        verifyNoInteractions(this.courseService, this.quizService);
    }

    @Test
    @DisplayName("Should throw validation error for invalid update because quizDTO name is blank")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    void test13UpdateQuiz_ValidationErrorQuizDTONameBlank() {
        QuizDTO quizDTO = new QuizDTO();
        quizDTO.setName("");

        assertThrows(
                ResteasyReactiveViolationException.class,
                () -> this.quizController.updateQuiz(COURSE_ID, FOLDER_ID, QUIZ_ID, quizDTO)
        );

        verifyNoInteractions(this.courseService, this.quizService);
    }

    @Test
    @DisplayName("Should throw 404 when updating non-existent quiz")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    void test14UpdateQuiz_NotFound() {
        QuizDTO updateRequest = new QuizDTO("Valid name");

        when(this.courseService.getCourseById(any(ObjectId.class))).thenReturn(new CourseDTO());
        when(this.quizService.updateQuizInFolder(any(), any(), any(), any()))
                .thenThrow(new NotFoundException());

        assertThrows(
                NotFoundException.class,
                () -> this.quizController.updateQuiz(COURSE_ID, FOLDER_ID, NON_EXISTENT_ID, updateRequest)
        );

        verify(this.courseService, times(1)).getCourseById(any(ObjectId.class));
        verify(this.quizService, times(1)).updateQuizInFolder(any(CourseDTO.class), any(ObjectId.class), any(ObjectId.class), any(QuizDTO.class));
    }

    @Test
    @DisplayName("Should throw 404 when course not found for update")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    void test15UpdateQuiz_CourseNotFound() {
        when(this.courseService.getCourseById(any(ObjectId.class))).thenThrow(new NotFoundException());

        assertThrows(
                NotFoundException.class,
                () -> this.quizController.updateQuiz(NON_EXISTENT_ID, FOLDER_ID, QUIZ_ID, new QuizDTO("Valid name"))
        );
    }

    @Test
    @DisplayName("Should delete quiz successfully")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    void test16DeleteQuiz_Success() {
        when(this.courseService.getCourseById(any(ObjectId.class))).thenReturn(new CourseDTO());

        Response response = this.quizController.deleteQuiz(COURSE_ID, FOLDER_ID, QUIZ_ID);

        assertEquals(Response.Status.NO_CONTENT.getStatusCode(), response.getStatus());

        verify(this.courseService, times(1)).getCourseById(any(ObjectId.class));
        verify(this.quizService).removeQuizFromFolder(any(CourseDTO.class), any(ObjectId.class), any(ObjectId.class));
    }

    @Test
    @DisplayName("Should throw 404 when deleting non-existent quiz")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    void test17DeleteQuiz_NotFound() {
        when(this.courseService.getCourseById(any(ObjectId.class))).thenReturn(new CourseDTO());
        doThrow(new NotFoundException())
                .when(this.quizService).removeQuizFromFolder(any(CourseDTO.class), any(ObjectId.class), any(ObjectId.class));

        assertThrows(
                NotFoundException.class,
                () -> this.quizController.deleteQuiz(COURSE_ID, FOLDER_ID, NON_EXISTENT_ID)
        );
    }

    @Test
    @DisplayName("Should throw 404 when course not found for deletion")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    void test18DeleteQuiz_CourseNotFound() {
        when(this.courseService.getCourseById(any(ObjectId.class))).thenThrow(new NotFoundException());

        assertThrows(
                NotFoundException.class,
                () -> this.quizController.deleteQuiz(NON_EXISTENT_ID, FOLDER_ID, QUIZ_ID)
        );
    }
}
