package ch.supsi.service.question;

import ch.supsi.mapper.IBaseMapper;
import ch.supsi.mapper.question.MultipleChoiceQuestionMapper;
import ch.supsi.mapper.question.TrueFalseQuestionMapper;
import ch.supsi.mapper.question.builder.QuestionMapperBuilder;
import ch.supsi.model.api.QuestionBank;
import ch.supsi.model.api.question.MultipleChoiceQuestion;
import ch.supsi.model.api.question.Question;
import ch.supsi.model.api.question.QuestionType;
import ch.supsi.model.api.question.TrueFalseQuestion;
import ch.supsi.model.dto.api.question.MultipleChoiceQuestionDTO;
import ch.supsi.model.dto.api.question.QuestionDTO;
import ch.supsi.model.dto.api.question.TrueFalseQuestionDTO;
import ch.supsi.repository.QuestionBankRepository;
import ch.supsi.repository.QuestionRepository;
import ch.supsi.service.question.builder.QuestionFactory;
import ch.supsi.service.question.strategy.IQuestionCreationStrategy;
import ch.supsi.service.question.strategy.MultipleChoiceQuestionStrategy;
import ch.supsi.service.question.strategy.TrueFalseQuestionStrategy;
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

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@QuarkusTest
@TestMethodOrder(MethodOrderer.MethodName.class)
@SuppressWarnings("unchecked")
public class QuestionServiceTest {
    private static final ObjectId TEST_QUESTION_ID = new ObjectId();
    private static final String TEST_QUESTION_BANK_ID = new ObjectId().toString();
    @Inject
    QuestionService questionService;
    @InjectMock
    QuestionRepository questionRepository;
    @InjectMock
    QuestionBankRepository questionBankRepository;
    @InjectMock
    QuestionFactory questionFactory;
    @InjectMock
    QuestionMapperBuilder questionMapperBuilder;

    @Test
    @DisplayName("Should create a TrueFalseQuestion template")
    void test01CreateQuestionTemplate_TrueFalseQuestion() {
        TrueFalseQuestionMapper mapper = mock(TrueFalseQuestionMapper.class);
        TrueFalseQuestionStrategy strategy = mock(TrueFalseQuestionStrategy.class);

        when(this.questionFactory.getStrategy(QuestionType.TRUE_FALSE)).thenReturn((IQuestionCreationStrategy) strategy);
        when(strategy.createQuestion()).thenReturn(new TrueFalseQuestion());
        when(this.questionMapperBuilder.getQuestionDTOMapper(QuestionType.TRUE_FALSE)).thenReturn((IBaseMapper) mapper);
        when(mapper.toDTO(any(TrueFalseQuestion.class))).thenReturn(new TrueFalseQuestionDTO());

        InOrder inOrder = inOrder(this.questionMapperBuilder, mapper, this.questionFactory, strategy);

        this.questionService.createQuestionTemplate(QuestionType.TRUE_FALSE);

        inOrder.verify(this.questionFactory, times(1)).getStrategy(QuestionType.TRUE_FALSE);
        inOrder.verify(strategy, times(1)).createQuestion();
        inOrder.verify(this.questionMapperBuilder, times(1)).getQuestionDTOMapper(QuestionType.TRUE_FALSE);
        inOrder.verify(mapper, times(1)).toDTO(any(TrueFalseQuestion.class));
    }

    @Test
    @DisplayName("Should create a MultipleChoiceQuestion template")
    void test02CreateQuestionTemplate_MultipleChoiceQuestion() {
        MultipleChoiceQuestionMapper mapper = mock(MultipleChoiceQuestionMapper.class);
        MultipleChoiceQuestionStrategy strategy = mock(MultipleChoiceQuestionStrategy.class);

        when(this.questionFactory.getStrategy(QuestionType.MULTIPLE_CHOICE)).thenReturn((IQuestionCreationStrategy) strategy);
        when(strategy.createQuestion()).thenReturn(new MultipleChoiceQuestion());

        when(this.questionMapperBuilder.getQuestionDTOMapper(QuestionType.MULTIPLE_CHOICE)).thenReturn((IBaseMapper) mapper);
        when(mapper.toDTO(any(MultipleChoiceQuestion.class))).thenReturn(new MultipleChoiceQuestionDTO());

        InOrder inOrder = inOrder(this.questionMapperBuilder, mapper, this.questionFactory, strategy);

        this.questionService.createQuestionTemplate(QuestionType.MULTIPLE_CHOICE);

        inOrder.verify(this.questionFactory).getStrategy(QuestionType.MULTIPLE_CHOICE);
        inOrder.verify(strategy, times(1)).createQuestion();
        inOrder.verify(this.questionMapperBuilder).getQuestionDTOMapper(QuestionType.MULTIPLE_CHOICE);
        inOrder.verify(mapper, times(1)).toDTO(any(MultipleChoiceQuestion.class));
    }

    @Test
    @DisplayName("Should throw BadRequestError because questionDTO passed is null")
    void test03CreateQuestionInBank_NullDTO() {
        BadRequestException exception = assertThrows(
                BadRequestException.class,
                () -> this.questionService.createQuestionInQuestionBank(null)
        );
        assertEquals("QuestionDTO is null", exception.getMessage());

        verify(this.questionBankRepository, never()).findByIdOptional(any(ObjectId.class));
        verify(this.questionMapperBuilder, never()).getQuestionDTOMapper(any(QuestionType.class));
        verify(this.questionRepository, never()).persist(any(Question.class));
        verify(this.questionBankRepository, never()).addQuestionToQuestionBank(anyString(), any(ObjectId.class));
    }

    @Test
    @DisplayName("Should throw NotFoundError because questionBank is not found by its id")
    void test04CreateQuestionInBank_QuestionBankNotFound() {
        TrueFalseQuestionDTO dto = new TrueFalseQuestionDTO();
        dto.setQuestionBankId(TEST_QUESTION_BANK_ID);

        when(this.questionBankRepository.findByIdOptional(any(ObjectId.class)))
                .thenReturn(Optional.empty());

        NotFoundException exception = assertThrows(
                NotFoundException.class,
                () -> this.questionService.createQuestionInQuestionBank(dto)
        );
        assertEquals("Question bank with id " + dto.getId() + " not found", exception.getMessage());

        verify(this.questionBankRepository, times(1)).findByIdOptional(any(ObjectId.class));
        verify(this.questionMapperBuilder, never()).getQuestionDTOMapper(any(QuestionType.class));
        verify(this.questionRepository, never()).persist(any(Question.class));
        verify(this.questionBankRepository, never()).addQuestionToQuestionBank(anyString(), any(ObjectId.class));
    }

    @Test
    @DisplayName("Should create correctly new Question")
    void test05CreateQuestionInBank_Success() {
        TrueFalseQuestionMapper mapperMock = mock(TrueFalseQuestionMapper.class);

        TrueFalseQuestionDTO dto = new TrueFalseQuestionDTO();
        dto.setQuestionBankId(TEST_QUESTION_BANK_ID);

        QuestionBank bank = new QuestionBank();
        bank.id = new ObjectId(TEST_QUESTION_BANK_ID);

        TrueFalseQuestion question = new TrueFalseQuestion();
        question.id = TEST_QUESTION_ID;
        question.questionBankId = TEST_QUESTION_BANK_ID;

        when(this.questionBankRepository.findByIdOptional(any(ObjectId.class))).thenReturn(Optional.of(bank));
        when(this.questionMapperBuilder.getQuestionDTOMapper(dto.getType())).thenReturn((IBaseMapper) mapperMock);
        when(mapperMock.toEntity(dto)).thenReturn(question);
        when(mapperMock.toDTO(any(TrueFalseQuestion.class))).thenReturn(new TrueFalseQuestionDTO());

        QuestionDTO result = this.questionService.createQuestionInQuestionBank(dto);
        assertNotNull(result);

        verify(this.questionBankRepository, times(1)).findByIdOptional(any(ObjectId.class));
        verify(this.questionMapperBuilder, times(2)).getQuestionDTOMapper(dto.getType());
        verify(mapperMock, times(1)).toDTO(any(TrueFalseQuestion.class));
        verify(this.questionRepository, times(1)).persist(any(Question.class));
        verify(this.questionBankRepository, times(1)).addQuestionToQuestionBank(anyString(), any(ObjectId.class));
        verify(mapperMock, times(1)).toDTO(any(TrueFalseQuestion.class));
    }

    @Test
    @DisplayName("Should throw BadRequestError because questionDTO passed is null")
    void test06UpdateQuestion_NullDTO() {
        BadRequestException exception = assertThrows(
                BadRequestException.class,
                () -> this.questionService.updateQuestion(TEST_QUESTION_ID, null)
        );
        assertEquals("QuestionDTO is null", exception.getMessage());

        verify(this.questionRepository, never()).findByIdOptional(TEST_QUESTION_ID);
        verify(this.questionFactory, never()).getStrategy(any(QuestionType.class));
        verify(this.questionRepository, never()).update(any(Question.class));
        verify(this.questionMapperBuilder, never()).getQuestionDTOMapper(any(QuestionType.class));
    }

    @Test
    @DisplayName("Should throw NotFoundError because question does not exist")
    void test07UpdateQuestion_NotFound() {
        when(this.questionRepository.findByIdOptional(TEST_QUESTION_ID))
                .thenReturn(Optional.empty());

        NotFoundException exception = assertThrows(
                NotFoundException.class,
                () -> this.questionService.updateQuestion(TEST_QUESTION_ID, new TrueFalseQuestionDTO())
        );

        assertEquals("Question with id " + TEST_QUESTION_ID + " not found", exception.getMessage());

        verify(this.questionRepository, times(1)).findByIdOptional(TEST_QUESTION_ID);
        verify(this.questionFactory, never()).getStrategy(any(QuestionType.class));
        verify(this.questionRepository, never()).update(any(Question.class));
        verify(this.questionMapperBuilder, never()).getQuestionDTOMapper(any(QuestionType.class));
    }

    @Test
    @DisplayName("Should update correctly a question")
    void test08UpdateQuestion_Success() {
        TrueFalseQuestionMapper mapperMock = mock(TrueFalseQuestionMapper.class);
        TrueFalseQuestionStrategy strategyMock = mock(TrueFalseQuestionStrategy.class);

        TrueFalseQuestion question = new TrueFalseQuestion();
        question.id = TEST_QUESTION_ID;

        TrueFalseQuestionDTO dto = new TrueFalseQuestionDTO();

        when(this.questionRepository.findByIdOptional(TEST_QUESTION_ID)).thenReturn(Optional.of(question));
        when(this.questionFactory.getStrategy(QuestionType.TRUE_FALSE)).thenReturn((IQuestionCreationStrategy) strategyMock);
        when(this.questionMapperBuilder.getQuestionDTOMapper(QuestionType.TRUE_FALSE)).thenReturn((IBaseMapper) mapperMock);
        when(mapperMock.toDTO(question)).thenReturn(new TrueFalseQuestionDTO());

        QuestionDTO result = this.questionService.updateQuestion(TEST_QUESTION_ID, dto);
        assertNotNull(result);

        verify(this.questionRepository, times(1)).findByIdOptional(TEST_QUESTION_ID);
        verify(this.questionFactory, times(1)).getStrategy(QuestionType.TRUE_FALSE);
        verify(strategyMock, times(1)).updateQuestion(any(TrueFalseQuestion.class), any(TrueFalseQuestionDTO.class));
        verify(this.questionRepository, times(1)).update(any(Question.class));
        verify(this.questionMapperBuilder, times(1)).getQuestionDTOMapper(QuestionType.TRUE_FALSE);
        verify(mapperMock, times(1)).toDTO(question);
    }

    @Test
    @DisplayName("Should throw NotFoundError because Question is not founded by its id")
    void test09DeleteQuestion_NotFound() {
        when(this.questionRepository.findByIdOptional(TEST_QUESTION_ID))
                .thenReturn(Optional.empty());

        NotFoundException exception = assertThrows(
                NotFoundException.class,
                () -> this.questionService.deleteQuestion(TEST_QUESTION_ID)
        );
        assertEquals("Question with id " + TEST_QUESTION_ID + " not found", exception.getMessage());

        verify(this.questionRepository, times(1)).findByIdOptional(TEST_QUESTION_ID);
        verify(this.questionBankRepository, never()).findByIdOptional(any(ObjectId.class));
        verify(this.questionBankRepository, never()).removeQuestionFromQuestionBank(eq(TEST_QUESTION_ID.toString()), any(ObjectId.class));
        verify(this.questionRepository, never()).delete(any(Question.class));
    }

    @Test
    @DisplayName("Should throw NotFoundError because QuestionBank is not founded by its id")
    void test10DeleteQuestion_BankNotFound() {
        TrueFalseQuestion question = new TrueFalseQuestion();
        question.questionBankId = TEST_QUESTION_BANK_ID;

        when(this.questionRepository.findByIdOptional(TEST_QUESTION_ID))
                .thenReturn(Optional.of(question));
        when(this.questionBankRepository.findByIdOptional(any(ObjectId.class)))
                .thenReturn(Optional.empty());

        NotFoundException exception = assertThrows(
                NotFoundException.class,
                () -> this.questionService.deleteQuestion(TEST_QUESTION_ID)
        );
        assertEquals("Question bank with id " + TEST_QUESTION_BANK_ID + " not found", exception.getMessage());

        verify(this.questionRepository, times(1)).findByIdOptional(TEST_QUESTION_ID);
        verify(this.questionBankRepository, times(1)).findByIdOptional(any(ObjectId.class));
        verify(this.questionBankRepository, never()).removeQuestionFromQuestionBank(eq(TEST_QUESTION_ID.toString()), any(ObjectId.class));
        verify(this.questionRepository, never()).delete(any(Question.class));
    }

    @Test
    @DisplayName("Should delete correctly a Question")
    void test11DeleteQuestion_Success() {
        TrueFalseQuestion question = new TrueFalseQuestion();
        question.id = TEST_QUESTION_ID;
        question.questionBankId = TEST_QUESTION_BANK_ID;
        QuestionBank bank = new QuestionBank();

        when(this.questionRepository.findByIdOptional(TEST_QUESTION_ID))
                .thenReturn(Optional.of(question));
        when(this.questionBankRepository.findByIdOptional(any(ObjectId.class)))
                .thenReturn(Optional.of(bank));

        assertDoesNotThrow(() -> this.questionService.deleteQuestion(TEST_QUESTION_ID));

        verify(this.questionRepository, times(1)).findByIdOptional(TEST_QUESTION_ID);
        verify(this.questionBankRepository, times(1)).findByIdOptional(any(ObjectId.class));
        verify(this.questionBankRepository, times(1)).removeQuestionFromQuestionBank(eq(TEST_QUESTION_ID.toString()), any(ObjectId.class));
        verify(this.questionRepository, times(1)).delete(any(Question.class));
    }
}
