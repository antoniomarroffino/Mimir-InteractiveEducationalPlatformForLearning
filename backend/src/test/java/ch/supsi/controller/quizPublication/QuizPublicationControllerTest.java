package ch.supsi.controller.quizPublication;

import ch.supsi.controller.quizpublication.QuizPublicationController;
import ch.supsi.model.dto.api.CourseDTO;
import ch.supsi.model.dto.api.QuizDTO;
import ch.supsi.model.dto.api.QuizPublicationDTO;
import ch.supsi.service.course.ICourseService;
import ch.supsi.service.quiz.IQuizService;
import ch.supsi.service.quizpublication.IQuizPublicationService;
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
public class QuizPublicationControllerTest {
    private static final String PUBLICATION_ID = new ObjectId().toString();
    private static final String COURSE_ID = new ObjectId().toString();
    private static final String FOLDER_ID = new ObjectId().toString();
    private static final String QUIZ_ID = new ObjectId().toString();
    private static final String ACCESS_CODE = "TEST123";
    private static final String INVALID_ID = "invalid-id";

    @Inject
    QuizPublicationController quizPublicationController;

    @InjectMock
    IQuizPublicationService quizPublicationService;

    @InjectMock
    ICourseService courseService;

    @InjectMock
    IQuizService quizService;


    @Test
    @DisplayName("Should publish quiz successfully")
    @TestSecurity(user = "teacher", roles = "TEACHER")
    void test01PublishQuiz_Success() {
        QuizPublicationDTO request = this.validRequest();

        when(this.courseService.getCourseById(any(ObjectId.class))).thenReturn(new CourseDTO());
        when(this.quizService.getQuizInFolder(any(CourseDTO.class), any(ObjectId.class), any(ObjectId.class))).thenReturn(new QuizDTO());
        when(this.quizPublicationService.publishQuiz(any(QuizPublicationDTO.class))).thenReturn(request);

        Response response = this.quizPublicationController.publishQuiz(request);

        assertEquals(Response.Status.CREATED.getStatusCode(), response.getStatus());
        assertEquals(request, response.getEntity());

        verify(this.courseService, times(1)).getCourseById(any(ObjectId.class));
        verify(this.quizService, times(1)).getQuizInFolder(any(CourseDTO.class), any(ObjectId.class), any(ObjectId.class));
        verify(this.quizPublicationService, times(1)).publishQuiz(any(QuizPublicationDTO.class));
    }

    @Test
    @DisplayName("Should throw 400 for invalid publication data")
    @TestSecurity(user = "teacher", roles = "TEACHER")
    void test02PublishQuiz_InvalidDTO() {
        QuizPublicationDTO quizPublicationDTOCourseIdNull = new QuizPublicationDTO(PUBLICATION_ID, null, FOLDER_ID, QUIZ_ID, List.of(), "");
        QuizPublicationDTO quizPublicationDTOCourseIdEmpty = new QuizPublicationDTO(PUBLICATION_ID, "", FOLDER_ID, QUIZ_ID, List.of(), "");
        QuizPublicationDTO quizPublicationDTOFolderIdNull = new QuizPublicationDTO(PUBLICATION_ID, COURSE_ID, null, QUIZ_ID, List.of(), "");
        QuizPublicationDTO quizPublicationDTOFolderIdEmpty = new QuizPublicationDTO(PUBLICATION_ID, COURSE_ID, "", QUIZ_ID, List.of(), "");
        QuizPublicationDTO quizPublicationDTOIdNull = new QuizPublicationDTO(PUBLICATION_ID, COURSE_ID, FOLDER_ID, null, List.of(), "");
        QuizPublicationDTO quizPublicationDTOIdEmpty = new QuizPublicationDTO(PUBLICATION_ID, COURSE_ID, FOLDER_ID, "", List.of(), "");


        assertAll(
                () -> assertThrows(
                        ResteasyReactiveViolationException.class,
                        () -> this.quizPublicationController.publishQuiz(quizPublicationDTOCourseIdNull)
                ),
                () -> assertThrows(
                        ResteasyReactiveViolationException.class,
                        () -> this.quizPublicationController.publishQuiz(quizPublicationDTOCourseIdEmpty)
                ),
                () -> assertThrows(
                        ResteasyReactiveViolationException.class,
                        () -> this.quizPublicationController.publishQuiz(quizPublicationDTOFolderIdNull)
                ),
                () -> assertThrows(
                        ResteasyReactiveViolationException.class,
                        () -> this.quizPublicationController.publishQuiz(quizPublicationDTOFolderIdEmpty)
                ),
                () -> assertThrows(
                        ResteasyReactiveViolationException.class,
                        () -> this.quizPublicationController.publishQuiz(quizPublicationDTOIdNull)
                ),
                () -> assertThrows(
                        ResteasyReactiveViolationException.class,
                        () -> this.quizPublicationController.publishQuiz(quizPublicationDTOIdEmpty)
                )
        );

        verifyNoMoreInteractions(this.quizPublicationService, this.courseService, this.quizService);
    }

    @Test
    @DisplayName("Should throw 404 for non-existent course")
    @TestSecurity(user = "teacher", roles = "TEACHER")
    void test03PublishQuiz_CourseNotFound() {
        QuizPublicationDTO request = this.validRequest();

        when(this.courseService.getCourseById(any(ObjectId.class))).thenThrow(new NotFoundException());

        assertThrows(
                NotFoundException.class,
                () -> this.quizPublicationController.publishQuiz(request)
        );

        verify(this.courseService, times(1)).getCourseById(any(ObjectId.class));
        verify(this.quizService, never()).getQuizInFolder(any(CourseDTO.class), any(ObjectId.class), any(ObjectId.class));
        verify(this.quizPublicationService, never()).publishQuiz(any(QuizPublicationDTO.class));
    }

    @Test
    @DisplayName("Should forbid non-teacher users")
    @TestSecurity(user = "student", roles = "STUDENT")
    void test04PublishQuiz_Forbidden() {
        assertThrows(
                io.quarkus.security.ForbiddenException.class,
                () -> this.quizPublicationController.publishQuiz(new QuizPublicationDTO())
        );
        verifyNoMoreInteractions(this.quizPublicationService, this.courseService, this.quizService);
    }

    @Test
    @DisplayName("Should get publication by ID")
    @TestSecurity(user = "teacher", roles = "TEACHER")
    void test05GetPublicationById_Success() {
        QuizPublicationDTO quizPublicationDTO = this.validRequest();

        when(this.quizPublicationService.getQuizPublicationById(any(ObjectId.class))).thenReturn(quizPublicationDTO);

        Response response = this.quizPublicationController.getPublicationById(PUBLICATION_ID);
        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        assertEquals(quizPublicationDTO, response.getEntity());

        verify(this.quizPublicationService, times(1)).getQuizPublicationById(any(ObjectId.class));
    }

    @Test
    @DisplayName("Should throw 404 for non-existent publication")
    @TestSecurity(user = "teacher", roles = "TEACHER")
    void test06GetPublicationById_NotFound() {
        when(this.quizPublicationService.getQuizPublicationById(any(ObjectId.class))).thenThrow(new NotFoundException());

        assertThrows(
                NotFoundException.class,
                () -> this.quizPublicationController.getPublicationById(PUBLICATION_ID)
        );
    }

    @Test
    @DisplayName("Should forbid non-teacher users")
    @TestSecurity(user = "student", roles = "STUDENT")
    void test07GetPublicationById_Forbidden() {
        assertThrows(
                io.quarkus.security.ForbiddenException.class,
                () -> this.quizPublicationController.getPublicationById(PUBLICATION_ID)
        );
        verifyNoMoreInteractions(this.quizPublicationService);
    }

    @Test
    @DisplayName("Should get publication by Code")
    @TestSecurity(user = "teacher", roles = "TEACHER")
    void test08GetPublicationByCode_Success() {
        QuizPublicationDTO quizPublicationDTO = this.validRequest();

        when(this.quizPublicationService.getPublicationByCode(anyString())).thenReturn(quizPublicationDTO);

        Response response = this.quizPublicationController.getPublicationByCode(ACCESS_CODE);
        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        assertEquals(quizPublicationDTO, response.getEntity());

        verify(this.quizPublicationService, times(1)).getPublicationByCode(anyString());
    }

    @Test
    @DisplayName("Should throw 404 for non-existent publication")
    @TestSecurity(user = "teacher", roles = "TEACHER")
    void test09GetPublicationByCode_NotFound() {
        when(this.quizPublicationService.getPublicationByCode(anyString())).thenThrow(new NotFoundException());

        assertThrows(
                NotFoundException.class,
                () -> this.quizPublicationController.getPublicationByCode(ACCESS_CODE)
        );
    }

    @Test
    @DisplayName("Should update publication successfully")
    @TestSecurity(user = "teacher", roles = "TEACHER")
    void test10UpdatePublication_Success() {
        QuizPublicationDTO quizPublicationDTO = this.validRequest();
        when(this.quizPublicationService.updateQuizPublication(any(), any())).thenReturn(quizPublicationDTO);

        Response response = this.quizPublicationController.updateQuizPublication(PUBLICATION_ID, quizPublicationDTO);
        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        assertEquals(quizPublicationDTO, response.getEntity());

        verify(this.quizPublicationService, times(1)).updateQuizPublication(any(ObjectId.class), any(QuizPublicationDTO.class));
    }

    @Test
    @DisplayName("Should throw 404 for non-existent update")
    @TestSecurity(user = "teacher", roles = "TEACHER")
    void test11UpdatePublication_NotFound() {
        QuizPublicationDTO quizPublicationDTO = this.validRequest();

        when(this.quizPublicationService.updateQuizPublication(any(ObjectId.class), any(QuizPublicationDTO.class))).thenThrow(new NotFoundException());

        assertThrows(
                NotFoundException.class,
                () -> quizPublicationController.updateQuizPublication(PUBLICATION_ID, quizPublicationDTO)
        );

        verify(this.quizPublicationService, times(1)).updateQuizPublication(any(ObjectId.class), any(QuizPublicationDTO.class));
    }

    @Test
    @DisplayName("Should forbid unauthorized update")
    @TestSecurity(user = "student", roles = "STUDENT")
    void test12UpdatePublication_Forbidden() {
        QuizPublicationDTO quizPublicationDTO = this.validRequest();

        assertThrows(
                io.quarkus.security.ForbiddenException.class,
                () -> this.quizPublicationController.updateQuizPublication(PUBLICATION_ID, quizPublicationDTO)
        );

        verifyNoMoreInteractions(this.quizPublicationService);
    }

    @Test
    @DisplayName("Should throw 400 for invalid publication data")
    @TestSecurity(user = "teacher", roles = "TEACHER")
    void test13UpdatePublication_InvalidDTO() {
        QuizPublicationDTO quizPublicationDTOCourseIdNull = new QuizPublicationDTO(PUBLICATION_ID, null, FOLDER_ID, QUIZ_ID, List.of(), "");
        QuizPublicationDTO quizPublicationDTOCourseIdEmpty = new QuizPublicationDTO(PUBLICATION_ID, "", FOLDER_ID, QUIZ_ID, List.of(), "");
        QuizPublicationDTO quizPublicationDTOFolderIdNull = new QuizPublicationDTO(PUBLICATION_ID, COURSE_ID, null, QUIZ_ID, List.of(), "");
        QuizPublicationDTO quizPublicationDTOFolderIdEmpty = new QuizPublicationDTO(PUBLICATION_ID, COURSE_ID, "", QUIZ_ID, List.of(), "");
        QuizPublicationDTO quizPublicationDTOIdNull = new QuizPublicationDTO(PUBLICATION_ID, COURSE_ID, FOLDER_ID, null, List.of(), "");
        QuizPublicationDTO quizPublicationDTOIdEmpty = new QuizPublicationDTO(PUBLICATION_ID, COURSE_ID, FOLDER_ID, "", List.of(), "");


        assertAll(
                () -> assertThrows(
                        ResteasyReactiveViolationException.class,
                        () -> this.quizPublicationController.updateQuizPublication(PUBLICATION_ID, quizPublicationDTOCourseIdNull)
                ),
                () -> assertThrows(
                        ResteasyReactiveViolationException.class,
                        () -> this.quizPublicationController.updateQuizPublication(PUBLICATION_ID, quizPublicationDTOCourseIdEmpty)
                ),
                () -> assertThrows(
                        ResteasyReactiveViolationException.class,
                        () -> this.quizPublicationController.updateQuizPublication(PUBLICATION_ID, quizPublicationDTOFolderIdNull)
                ),
                () -> assertThrows(
                        ResteasyReactiveViolationException.class,
                        () -> this.quizPublicationController.updateQuizPublication(PUBLICATION_ID, quizPublicationDTOFolderIdEmpty)
                ),
                () -> assertThrows(
                        ResteasyReactiveViolationException.class,
                        () -> this.quizPublicationController.updateQuizPublication(PUBLICATION_ID, quizPublicationDTOIdNull)
                ),
                () -> assertThrows(
                        ResteasyReactiveViolationException.class,
                        () -> this.quizPublicationController.updateQuizPublication(PUBLICATION_ID, quizPublicationDTOIdEmpty)
                )
        );

        verifyNoMoreInteractions(this.quizPublicationService, this.courseService, this.quizService);
    }

    @Test
    @DisplayName("Should deactivate publication successfully")
    @TestSecurity(user = "teacher", roles = "TEACHER")
    void test14DeactivatePublication_Success() {
        QuizPublicationDTO quizPublicationDTO = this.validRequest();

        when(this.quizPublicationService.deactivateQuizPublication(any())).thenReturn(quizPublicationDTO);

        Response response = this.quizPublicationController.deactivateQuizPublication(PUBLICATION_ID);
        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        assertEquals(quizPublicationDTO, response.getEntity());

        verify(this.quizPublicationService, times(1)).deactivateQuizPublication(any(ObjectId.class));
    }

    @Test
    @DisplayName("Should throw 404 for non-existent deactivation")
    @TestSecurity(user = "teacher", roles = "TEACHER")
    void test15DeactivatePublication_NotFound() {
        when(this.quizPublicationService.deactivateQuizPublication(any(ObjectId.class))).thenThrow(new NotFoundException());

        assertThrows(
                NotFoundException.class,
                () -> this.quizPublicationController.deactivateQuizPublication(PUBLICATION_ID)
        );

        verify(this.quizPublicationService, times(1)).deactivateQuizPublication(any(ObjectId.class));
    }

    @Test
    @DisplayName("Should forbid unauthorized deactivation")
    @TestSecurity(user = "student", roles = "STUDENT")
    void test16DeactivatePublication_Forbidden() {
        assertThrows(
                io.quarkus.security.ForbiddenException.class,
                () -> this.quizPublicationController.deactivateQuizPublication(PUBLICATION_ID)
        );
        verifyNoMoreInteractions(this.quizPublicationService);
    }

    @Test
    @DisplayName("Should delete publication successfully")
    @TestSecurity(user = "teacher", roles = "TEACHER")
    void test17DeletePublication_Success() {
        Response response = this.quizPublicationController.deleteQuizPublication(PUBLICATION_ID);
        assertEquals(Response.Status.NO_CONTENT.getStatusCode(), response.getStatus());

        verify(this.quizPublicationService, times(1)).deleteQuizPublication(any(ObjectId.class));
    }

    @Test
    @DisplayName("Should throw 404 for non-existent deletion")
    @TestSecurity(user = "teacher", roles = "TEACHER")
    void test18DeletePublication_NotFound() {
        doThrow(new NotFoundException()).when(this.quizPublicationService).deleteQuizPublication(any(ObjectId.class));

        assertThrows(
                NotFoundException.class,
                () -> this.quizPublicationController.deleteQuizPublication(PUBLICATION_ID)
        );
    }

    @Test
    @DisplayName("Should forbid unauthorized deletion")
    @TestSecurity(user = "student", roles = "STUDENT")
    void test19DeletePublication_Forbidden() {
        assertThrows(
                io.quarkus.security.ForbiddenException.class,
                () -> this.quizPublicationController.deleteQuizPublication(PUBLICATION_ID)
        );
        verifyNoMoreInteractions(this.quizPublicationService);
    }

    @Test
    @DisplayName("Should get publications by quiz ID")
    @TestSecurity(user = "teacher", roles = "TEACHER")
    void test20GetPublicationsByQuizId_Success() {
        QuizPublicationDTO quizPublicationDTO = this.validRequest();

        when(this.quizPublicationService.getPublicationsByQuizId(any())).thenReturn(List.of(quizPublicationDTO));

        Response response = this.quizPublicationController.getPublicationsByQuizId(QUIZ_ID);
        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        assertEquals(1, ((List<?>) response.getEntity()).size());

        verify(this.quizPublicationService, times(1)).getPublicationsByQuizId(any(ObjectId.class));
    }

    @Test
    @DisplayName("Should return empty publications list")
    @TestSecurity(user = "teacher", roles = "TEACHER")
    void test21GetPublicationsByQuizId_Empty() {
        when(this.quizPublicationService.getPublicationsByQuizId(any())).thenReturn(Collections.emptyList());

        Response response = this.quizPublicationController.getPublicationsByQuizId(QUIZ_ID);
        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        assertTrue(((List<?>) response.getEntity()).isEmpty());

        verify(this.quizPublicationService, times(1)).getPublicationsByQuizId(any(ObjectId.class));
    }

    @Test
    @DisplayName("Should forbid unauthorized access")
    @TestSecurity(user = "student", roles = "STUDENT")
    void test22GetPublicationsByQuizId_Forbidden() {
        assertThrows(
                io.quarkus.security.ForbiddenException.class,
                () -> this.quizPublicationController.getPublicationsByQuizId(QUIZ_ID)
        );
    }

    private QuizPublicationDTO validRequest() {
        QuizPublicationDTO dto = new QuizPublicationDTO();
        dto.setCourseId(COURSE_ID);
        dto.setFolderId(FOLDER_ID);
        dto.setQuizId(QUIZ_ID);
        return dto;
    }
}
