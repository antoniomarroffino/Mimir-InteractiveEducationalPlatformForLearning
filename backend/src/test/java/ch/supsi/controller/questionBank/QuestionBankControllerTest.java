package ch.supsi.controller.questionBank;

import ch.supsi.model.api.QuestionBank;
import ch.supsi.model.dto.api.QuestionBankDTO;
import ch.supsi.model.dto.api.question.TrueFalseQuestionDTO;
import ch.supsi.service.question.IQuestionService;
import ch.supsi.service.questionBank.IQuestionBankService;
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

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@QuarkusTest
@TestMethodOrder(MethodOrderer.MethodName.class)
public class QuestionBankControllerTest {
    private static final String QUESTION_BANK_ID = new ObjectId().toString();
    private static final String NON_EXISTENT_ID = new ObjectId().toString();

    @Inject
    QuestionBankController questionBankController;

    @InjectMock
    IQuestionBankService questionBankService;

    @InjectMock
    IQuestionService questionService;

    @Test
    @DisplayName("Should get all question banks")
    @TestSecurity(user = "teacher", roles = "TEACHER")
    void test01GetQuestionBanks_Success() {
        QuestionBankDTO questionBankDTO1 = new QuestionBankDTO();
        QuestionBankDTO questionBankDTO2 = new QuestionBankDTO();
        List<QuestionBankDTO> questionBankDTOList = List.of(questionBankDTO1, questionBankDTO2);

        when(this.questionBankService.getAllQuestionBanks()).thenReturn(questionBankDTOList);

        Response response = this.questionBankController.getQuestionBanks();

        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        assertEquals(questionBankDTOList.size(), ((List<?>) response.getEntity()).size());

        verify(this.questionBankService, times(1)).getAllQuestionBanks();
    }

    @Test
    @DisplayName("Should return empty question banks list")
    @TestSecurity(user = "teacher", roles = "TEACHER")
    void test02GetQuestionBanks_Empty() {
        when(this.questionBankService.getAllQuestionBanks()).thenReturn(Collections.emptyList());

        Response response = this.questionBankController.getQuestionBanks();

        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        assertTrue(((List<?>) response.getEntity()).isEmpty());

        verify(this.questionBankService, times(1)).getAllQuestionBanks();
    }

    @Test
    @DisplayName("Should forbid non-teacher users")
    @TestSecurity(user = "student", roles = "STUDENT")
    void test03GetQuestionBanks_Forbidden() {
        assertThrows(
                io.quarkus.security.ForbiddenException.class,
                () -> this.questionBankController.getQuestionBanks()
        );

        verifyNoInteractions(this.questionBankService);
    }

    @Test
    @DisplayName("Should get question bank by id")
    @TestSecurity(user = "teacher", roles = "TEACHER")
    void test04GetQuestionBank_Success() {
        QuestionBankDTO questionBankDTO = new QuestionBankDTO();

        when(this.questionBankService.getQuestionBankById(any(ObjectId.class))).thenReturn(questionBankDTO);

        Response response = this.questionBankController.getQuestionBank(QUESTION_BANK_ID);

        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        assertEquals(questionBankDTO, response.getEntity());

        verify(this.questionBankService, times(1)).getQuestionBankById(any(ObjectId.class));
    }

    @Test
    @DisplayName("Should throw 404 for non-existent question bank")
    @TestSecurity(user = "teacher", roles = "TEACHER")
    void test05GetQuestionBank_NotFound() {
        when(this.questionBankService.getQuestionBankById(any(ObjectId.class)))
                .thenThrow(new NotFoundException());

        assertThrows(
                NotFoundException.class,
                () -> this.questionBankController.getQuestionBank(NON_EXISTENT_ID)
        );

        verify(this.questionBankService, times(1)).getQuestionBankById(any(ObjectId.class));
    }

    @Test
    @DisplayName("Should forbid non-teacher users")
    @TestSecurity(user = "student", roles = "STUDENT")
    void test06GetQuestionBank_Forbidden() {
        assertThrows(
                io.quarkus.security.ForbiddenException.class,
                () -> this.questionBankController.getQuestionBank(QUESTION_BANK_ID)
        );

        verifyNoInteractions(this.questionBankService);
    }

    @Test
    @DisplayName("Should create new question bank")
    @TestSecurity(user = "teacher", roles = "TEACHER")
    void test07CreateQuestionBank_Success() {
        QuestionBankDTO questionBankDTO = new QuestionBankDTO();

        when(this.questionBankService.createQuestionBank(any())).thenReturn(questionBankDTO);

        Response response = this.questionBankController.createQuestionBank(new QuestionBankDTO("Valid name"));

        assertEquals(Response.Status.CREATED.getStatusCode(), response.getStatus());
        assertEquals(questionBankDTO, response.getEntity());

        verify(this.questionBankService, times(1)).createQuestionBank(any(QuestionBankDTO.class));
    }

    @Test
    @DisplayName("Should validate question bank DTO")
    @TestSecurity(user = "teacher", roles = "TEACHER")
    void test08CreateQuestionBank_InvalidDTO() {
        QuestionBankDTO questionBankDTONameNull = new QuestionBankDTO(null);
        QuestionBankDTO questionBankDTONameEmpty = new QuestionBankDTO("");

        assertAll(
                () -> assertThrows(
                        ResteasyReactiveViolationException.class,
                        () -> this.questionBankController.createQuestionBank(questionBankDTONameNull)
                ),
                () -> assertThrows(
                        ResteasyReactiveViolationException.class,
                        () -> this.questionBankController.createQuestionBank(questionBankDTONameEmpty)
                )
        );
    }

    @Test
    @DisplayName("Should forbid non-teacher users")
    @TestSecurity(user = "student", roles = "STUDENT")
    void test09CreateQuestionBank_Forbidden() {
        assertThrows(
                io.quarkus.security.ForbiddenException.class,
                () -> this.questionBankController.createQuestionBank(new QuestionBankDTO())
        );

        verifyNoInteractions(this.questionBankService);
    }

    @Test
    @DisplayName("Should update question bank successfully")
    @TestSecurity(user = "teacher", roles = "TEACHER")
    void test10UpdateQuestionBank_Success() {
        QuestionBankDTO questionBankDTO = new QuestionBankDTO();

        when(this.questionBankService.updateQuestionBank(any(ObjectId.class), any(QuestionBankDTO.class))).thenReturn(questionBankDTO);

        Response response = this.questionBankController.updateQuestionBank(QUESTION_BANK_ID, new QuestionBankDTO("Valid name"));

        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        assertEquals(questionBankDTO, response.getEntity());

        verify(this.questionBankService, times(1)).updateQuestionBank(any(ObjectId.class), any(QuestionBankDTO.class));
    }

    @Test
    @DisplayName("Should throw 404 for non-existent update")
    @TestSecurity(user = "teacher", roles = "TEACHER")
    void test11UpdateQuestionBank_NotFound() {
        when(this.questionBankService.updateQuestionBank(any(ObjectId.class), any(QuestionBankDTO.class)))
                .thenThrow(new NotFoundException());

        assertThrows(
                NotFoundException.class,
                () -> this.questionBankController.updateQuestionBank(NON_EXISTENT_ID, new QuestionBankDTO("valid name"))
        );

        verify(this.questionBankService, times(1)).updateQuestionBank(any(ObjectId.class), any(QuestionBankDTO.class));
    }

    @Test
    @DisplayName("Should validate update DTO")
    @TestSecurity(user = "teacher", roles = "TEACHER")
    void test12UpdateQuestionBank_InvalidDTO() {
        QuestionBankDTO questionBankDTONameNull = new QuestionBankDTO(null);
        QuestionBankDTO questionBankDTONameEmpty = new QuestionBankDTO("");

        assertAll(
                () -> assertThrows(
                        ResteasyReactiveViolationException.class,
                        () -> this.questionBankController.updateQuestionBank(QUESTION_BANK_ID, questionBankDTONameNull)
                ),
                () -> assertThrows(
                        ResteasyReactiveViolationException.class,
                        () -> this.questionBankController.updateQuestionBank(QUESTION_BANK_ID, questionBankDTONameEmpty)
                )
        );
    }

    @Test
    @DisplayName("Should forbid unauthorized update")
    @TestSecurity(user = "student", roles = "STUDENT")
    void test13UpdateQuestionBank_Forbidden() {
        assertThrows(
                io.quarkus.security.ForbiddenException.class,
                () -> this.questionBankController.updateQuestionBank(QUESTION_BANK_ID, new QuestionBankDTO())
        );
        verifyNoInteractions(this.questionBankService);
    }

    @Test
    @DisplayName("Should delete question bank with questions")
    @TestSecurity(user = "teacher", roles = "TEACHER")
    void test14DeleteQuestionBank_Success() {
        QuestionBankDTO bankWithQuestions = new QuestionBankDTO();
        bankWithQuestions.setId(QUESTION_BANK_ID);
        bankWithQuestions.setQuestions(List.of(
                new TrueFalseQuestionDTO(),
                new TrueFalseQuestionDTO()
        ));

        bankWithQuestions.getQuestions().getFirst().setId(new ObjectId().toString());
        bankWithQuestions.getQuestions().get(1).setId(new ObjectId().toString());

        when(this.questionBankService.getQuestionBankById(any(ObjectId.class))).thenReturn(bankWithQuestions);

        Response response = this.questionBankController.deleteQuestionBank(QUESTION_BANK_ID);
        assertEquals(Response.Status.NO_CONTENT.getStatusCode(), response.getStatus());

        verify(this.questionService, times(bankWithQuestions.getQuestions().size())).deleteQuestion(any(ObjectId.class));
        verify(this.questionBankService, times(1)).deleteQuestionBank(any(ObjectId.class));
    }

    @Test
    @DisplayName("Should handle empty question bank deletion")
    @TestSecurity(user = "teacher", roles = "TEACHER")
    void test15DeleteQuestionBank_Empty() {
        when(this.questionBankService.getQuestionBankById(any(ObjectId.class))).thenReturn(new QuestionBankDTO("Valid name"));

        Response response = this.questionBankController.deleteQuestionBank(QUESTION_BANK_ID);
        assertEquals(Response.Status.NO_CONTENT.getStatusCode(), response.getStatus());

        verify(this.questionService, never()).deleteQuestion(any());
        verify(this.questionBankService, times(1)).deleteQuestionBank(any());
    }

    @Test
    @DisplayName("Should throw 404 for non-existent deletion")
    @TestSecurity(user = "teacher", roles = "TEACHER")
    void test16DeleteQuestionBank_NotFound() {
        when(this.questionBankService.getQuestionBankById(any()))
                .thenThrow(new NotFoundException());

        assertThrows(
                NotFoundException.class,
                () -> this.questionBankController.deleteQuestionBank(NON_EXISTENT_ID)
        );
    }

    @Test
    @DisplayName("Should forbid unauthorized deletion")
    @TestSecurity(user = "student", roles = "STUDENT")
    void test17DeleteQuestionBank_Forbidden() {
        assertThrows(
                io.quarkus.security.ForbiddenException.class,
                () -> this.questionBankController.deleteQuestionBank(QUESTION_BANK_ID)
        );
        verifyNoInteractions(this.questionBankService);
    }
}
