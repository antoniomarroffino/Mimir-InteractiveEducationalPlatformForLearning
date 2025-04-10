package ch.supsi.controller.question;

import ch.supsi.model.api.question.QuestionType;
import ch.supsi.model.dto.api.question.QuestionDTO;
import ch.supsi.model.dto.api.question.TrueFalseQuestionDTO;
import ch.supsi.service.question.IQuestionService;
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

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@QuarkusTest
@TestMethodOrder(MethodOrderer.MethodName.class)
public class QuestionControllerTest {
    private static final String QUESTION_ID = new ObjectId().toString();
    private static final String NON_EXISTENT_ID = new ObjectId().toString();

    @Inject
    QuestionController questionController;

    @InjectMock
    IQuestionService questionService;

    @Test
    @DisplayName("Should create question template")
    @TestSecurity(user = "teacher", roles = "TEACHER")
    void test01CreateTemplate_Success() {
        TrueFalseQuestionDTO trueFalseQuestionDTO  = new TrueFalseQuestionDTO();

        when(this.questionService.createQuestionTemplate(any(QuestionType.class))).thenReturn(trueFalseQuestionDTO);

        Response response = this.questionController.createQuestionTemplate(QuestionType.TRUE_FALSE);

        assertEquals(Response.Status.CREATED.getStatusCode(), response.getStatus());
        assertEquals(trueFalseQuestionDTO, response.getEntity());

        verify(this.questionService).createQuestionTemplate(any(QuestionType.class));
    }

    @Test
    @DisplayName("Should forbid non-teacher users")
    @TestSecurity(user = "student", roles = "STUDENT")
    void test02CreateTemplate_Forbidden() {
        assertThrows(
                io.quarkus.security.ForbiddenException.class,
                () -> this.questionController.createQuestionTemplate(QuestionType.TRUE_FALSE)
        );

        verifyNoInteractions(this.questionService);
    }

    @Test
    @DisplayName("Should create question in bank")
    @TestSecurity(user = "teacher", roles = "TEACHER")
    void test03CreateQuestion_Success() {
        TrueFalseQuestionDTO trueFalseQuestionDTO = new TrueFalseQuestionDTO();
        trueFalseQuestionDTO.setCorrectAnswer(false);

        when(this.questionService.createQuestionInQuestionBank(any(QuestionDTO.class))).thenReturn(trueFalseQuestionDTO);

        Response response = this.questionController.createQuestionInQuestionBank(trueFalseQuestionDTO);

        assertEquals(Response.Status.CREATED.getStatusCode(), response.getStatus());
        assertEquals(trueFalseQuestionDTO, response.getEntity());

        verify(this.questionService, times(1)).createQuestionInQuestionBank(any(QuestionDTO.class));
    }

    @Test
    @DisplayName("Should forbid unauthorized update")
    @TestSecurity(user = "student", roles = "STUDENT")
    void test04CreateQuestion_Forbidden() {
        TrueFalseQuestionDTO trueFalseQuestionDTO = new TrueFalseQuestionDTO();
        trueFalseQuestionDTO.setCorrectAnswer(false);

        assertThrows(
                io.quarkus.security.ForbiddenException.class,
                () -> this.questionController.createQuestionInQuestionBank(trueFalseQuestionDTO)
        );
        verifyNoInteractions(this.questionService);
    }


    @Test
    @DisplayName("Should update question successfully")
    @TestSecurity(user = "teacher", roles = "TEACHER")
    void test05UpdateQuestion_Success() {
        TrueFalseQuestionDTO updated = new TrueFalseQuestionDTO();
        updated.setCorrectAnswer(true);

        when(this.questionService.updateQuestion(any(ObjectId.class), any(QuestionDTO.class))).thenReturn(updated);

        Response response = this.questionController.updateQuestion(QUESTION_ID, updated);

        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        assertEquals(updated, response.getEntity());

        verify(this.questionService, times(1)).updateQuestion(any(ObjectId.class), any(QuestionDTO.class));
    }

    @Test
    @DisplayName("Should throw 404 for non-existent question")
    @TestSecurity(user = "teacher", roles = "TEACHER")
    void test06UpdateQuestion_NotFound() {
        TrueFalseQuestionDTO questionDTO = new TrueFalseQuestionDTO();
        questionDTO.setCorrectAnswer(false);

        when(this.questionService.updateQuestion(any(), any()))
                .thenThrow(new NotFoundException());

        assertThrows(
                NotFoundException.class,
                () -> this.questionController.updateQuestion(NON_EXISTENT_ID, questionDTO)
        );

        verify(this.questionService, times(1)).updateQuestion(any(ObjectId.class), any(QuestionDTO.class));
    }

    @Test
    @DisplayName("Should forbid unauthorized update")
    @TestSecurity(user = "student", roles = "STUDENT")
    void test07UpdateQuestion_Forbidden() {
        TrueFalseQuestionDTO questionDTO = new TrueFalseQuestionDTO();
        questionDTO.setCorrectAnswer(false);

        assertThrows(
                io.quarkus.security.ForbiddenException.class,
                () -> this.questionController.updateQuestion(QUESTION_ID, questionDTO)
        );
        verifyNoInteractions(this.questionService);
    }

    @Test
    @DisplayName("Should delete question successfully")
    @TestSecurity(user = "teacher", roles = "TEACHER")
    void test08DeleteQuestion_Success() {
        Response response = this.questionController.deleteQuestion(QUESTION_ID);

        assertEquals(Response.Status.NO_CONTENT.getStatusCode(), response.getStatus());

        verify(this.questionService, times(1)).deleteQuestion(any(ObjectId.class));
    }

    @Test
    @DisplayName("Should throw 404 for non-existent question")
    @TestSecurity(user = "teacher", roles = "TEACHER")
    void test09DeleteQuestion_NotFound() {
        doThrow(new NotFoundException())
                .when(this.questionService).deleteQuestion(any());

        assertThrows(
                NotFoundException.class,
                () -> this.questionController.deleteQuestion(NON_EXISTENT_ID)
        );
        verify(this.questionService, times(1)).deleteQuestion(any(ObjectId.class));
    }

    @Test
    @DisplayName("Should forbid unauthorized deletion")
    @TestSecurity(user = "student", roles = "STUDENT")
    void test10DeleteQuestion_Forbidden() {
        assertThrows(
                io.quarkus.security.ForbiddenException.class,
                () -> this.questionController.deleteQuestion(QUESTION_ID)
        );

        verifyNoInteractions(this.questionService);
    }
}
