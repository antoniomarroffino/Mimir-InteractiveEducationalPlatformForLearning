package ch.supsi.service.questionBank;

import ch.supsi.mapper.questionBank.facade.IQuestionBankMapperFacade;
import ch.supsi.model.api.QuestionBank;
import ch.supsi.model.dto.api.QuestionBankDTO;
import ch.supsi.repository.QuestionBankRepository;
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

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@QuarkusTest
@TestMethodOrder(MethodOrderer.MethodName.class)
public class QuestionBankServiceTest {
    @Inject
    QuestionBankService questionBankService;

    @InjectMock
    QuestionBankRepository questionBankRepository;

    @InjectMock
    IQuestionBankMapperFacade questionBankMapperFacade;

    public static QuestionBank createTestQuestionBank(String name) {
        QuestionBank qb = new QuestionBank();
        qb.name = name;
        qb.questions = new HashSet<>();
        return qb;
    }

    @Test
    @DisplayName("Should return empty list of Question Banks")
    void test01GetAllQuestionBanks_EmptyList() {
        when(this.questionBankRepository.listAll()).thenReturn(Collections.emptyList());

        List<QuestionBankDTO> questionBanks = this.questionBankService.getAllQuestionBanks();
        assertTrue(questionBanks.isEmpty());

        verify(this.questionBankRepository, times(1)).listAll();
        verify(this.questionBankMapperFacade, never()).toDTO(any(QuestionBank.class));
    }

    @Test
    @DisplayName("Should return list of Question Banks")
    void test02GetAllQuestionBanks() {
        QuestionBank questionBank = createTestQuestionBank("Test");

        when(this.questionBankRepository.listAll()).thenReturn(List.of(questionBank));

        List<QuestionBankDTO> questionBanks = this.questionBankService.getAllQuestionBanks();
        assertEquals(1, questionBanks.size());

        verify(this.questionBankRepository, times(1)).listAll();
        verify(this.questionBankMapperFacade, times(questionBanks.size())).toDTO(any(QuestionBank.class));
    }

    @Test
    @DisplayName("Should throw NotFoundError because QuestionBank's id does not exist")
    void test03GetQuestionBankById_IdDoesNotExist() {
        ObjectId id = new ObjectId();

        when(this.questionBankRepository.findByIdOptional(any(ObjectId.class))).thenReturn(Optional.empty());

        NotFoundException exception = assertThrows(
                NotFoundException.class,
                () -> this.questionBankService.getQuestionBankById(id)
        );
        assertEquals("Question bank with id " + id + " not found", exception.getMessage());

        verify(this.questionBankRepository, times(1)).findByIdOptional(any(ObjectId.class));
        verify(this.questionBankMapperFacade, never()).toDTO(any(QuestionBank.class));
    }

    @Test
    @DisplayName("Should return question bank founded by its id")
    void test04GetQuestionBankById() {
        QuestionBank questionBank = createTestQuestionBank("Test");

        when(this.questionBankRepository.findByIdOptional(questionBank.id)).thenReturn(Optional.of(questionBank));
        when(this.questionBankMapperFacade.toDTO(questionBank)).thenReturn(new QuestionBankDTO());

        QuestionBankDTO questionBankDTO = this.questionBankService.getQuestionBankById(questionBank.id);
        assertNotNull(questionBankDTO);

        verify(this.questionBankRepository, times(1)).findByIdOptional(questionBank.id);
        verify(this.questionBankMapperFacade, times(1)).toDTO(questionBank);
    }

    @Test
    @DisplayName("Should throw BadRequestError because questionBankDTO passed is null")
    void test05CreateQuestionBank_ThrowBadRequestErrorQuestionBankIsNull() {
        BadRequestException exception = assertThrows(
                BadRequestException.class,
                () -> this.questionBankService.createQuestionBank(null)
        );
        assertEquals("QuestionBankDTO is null", exception.getMessage());

        verify(this.questionBankRepository, never()).findByNameOptional(anyString());
        verify(this.questionBankMapperFacade, never()).toEntity(any(QuestionBankDTO.class));
        verify(this.questionBankRepository, never()).persist(any(QuestionBank.class));
        verify(this.questionBankMapperFacade, never()).toDTO(any(QuestionBank.class));
    }

    @Test
    @DisplayName("Should throw BadRequestError because questionBankDTO's name is empty")
    void test06CreateQuestionBank_ThrowBadRequestErrorQuestionBankNameIsEmpty() {
        BadRequestException exception = assertThrows(
                BadRequestException.class,
                () -> this.questionBankService.createQuestionBank(new QuestionBankDTO(""))
        );
        assertEquals("QuestionBankDTO name is empty", exception.getMessage());

        verify(this.questionBankRepository, never()).findByNameOptional(anyString());
        verify(this.questionBankMapperFacade, never()).toEntity(any(QuestionBankDTO.class));
        verify(this.questionBankRepository, never()).persist(any(QuestionBank.class));
        verify(this.questionBankMapperFacade, never()).toDTO(any(QuestionBank.class));
    }

    @Test
    @DisplayName("Should throw BadRequestError because questionBankDTO's name is duplicated")
    void test07CreateQuestionBank_ThrowBadRequestErrorQuestionBankNameIsDuplicated() {
        when(this.questionBankRepository.findByNameOptional(anyString())).thenReturn(Optional.of(new QuestionBank("Test")));

        BadRequestException exception = assertThrows(
                BadRequestException.class,
                () -> this.questionBankService.createQuestionBank(new QuestionBankDTO("Test"))
        );
        assertEquals("QuestionBankDTO name already exists", exception.getMessage());

        verify(this.questionBankRepository, times(1)).findByNameOptional(anyString());
        verify(this.questionBankMapperFacade, never()).toEntity(any(QuestionBankDTO.class));
        verify(this.questionBankRepository, never()).persist(any(QuestionBank.class));
        verify(this.questionBankMapperFacade, never()).toDTO(any(QuestionBank.class));
    }

    @Test
    @DisplayName("Should create correctly new QuestionBank")
    void test08CreateQuestionBank() {
        QuestionBankDTO dto = new QuestionBankDTO("New Question Bank");

        when(this.questionBankRepository.findByNameOptional(anyString())).thenReturn(Optional.empty());
        when(this.questionBankMapperFacade.toEntity(dto)).thenReturn(new QuestionBank());
        when(this.questionBankMapperFacade.toDTO(any(QuestionBank.class))).thenReturn(new QuestionBankDTO());

        QuestionBankDTO questionBankDTO = this.questionBankService.createQuestionBank(dto);
        assertNotNull(questionBankDTO);

        verify(this.questionBankRepository, times(1)).findByNameOptional(anyString());
        verify(this.questionBankMapperFacade, times(1)).toEntity(dto);
        verify(this.questionBankRepository, times(1)).persist(any(QuestionBank.class));
        verify(this.questionBankMapperFacade, times(1)).toDTO(any(QuestionBank.class));
    }

    @Test
    @DisplayName("Should throw BadRequestError because questionBankDTO passed is null")
    void test09UpdateQuestionBank_ThrowBadRequestErrorQuestionBankIsNull() {
        BadRequestException exception = assertThrows(
                BadRequestException.class,
                () -> this.questionBankService.updateQuestionBank(new ObjectId(), null)
        );
        assertEquals("QuestionBankDTO is null", exception.getMessage());

        verify(this.questionBankRepository, never()).findByNameOptional(anyString());
        verify(this.questionBankRepository, never()).findByIdOptional(any(ObjectId.class));
        verify(this.questionBankRepository, never()).update(any(QuestionBank.class));
        verify(this.questionBankMapperFacade, never()).toDTO(any(QuestionBank.class));
    }

    @Test
    @DisplayName("Should throw BadRequestError because questionBankDTO's name is empty")
    void test10UpdateQuestionBank_ThrowBadRequestErrorQuestionBankNameIsEmpty() {
        BadRequestException exception = assertThrows(
                BadRequestException.class,
                () -> this.questionBankService.updateQuestionBank(new ObjectId(), new QuestionBankDTO(""))
        );
        assertEquals("QuestionBankDTO name is empty", exception.getMessage());

        verify(this.questionBankRepository, never()).findByNameOptional(anyString());
        verify(this.questionBankRepository, never()).findByIdOptional(any(ObjectId.class));
        verify(this.questionBankRepository, never()).update(any(QuestionBank.class));
        verify(this.questionBankMapperFacade, never()).toDTO(any(QuestionBank.class));
    }

    @Test
    @DisplayName("Should throw BadRequestError because questionBankDTO's name is duplicated")
    void test11UpdateQuestionBank_ThrowBadRequestErrorQuestionBankNameIsDuplicated() {
        when(this.questionBankRepository.findByNameOptional(anyString())).thenReturn(Optional.of(new QuestionBank("Test")));

        BadRequestException exception = assertThrows(
                BadRequestException.class,
                () -> this.questionBankService.updateQuestionBank(new ObjectId(), new QuestionBankDTO("Test"))
        );
        assertEquals("QuestionBankDTO name already exists", exception.getMessage());

        verify(this.questionBankRepository, times(1)).findByNameOptional(anyString());
        verify(this.questionBankRepository, never()).findByIdOptional(any(ObjectId.class));
        verify(this.questionBankRepository, never()).update(any(QuestionBank.class));
        verify(this.questionBankMapperFacade, never()).toDTO(any(QuestionBank.class));
    }

    @Test
    @DisplayName("Should throw NotFoundError because QuestionBank does not exist")
    void test12UpdateQuestionBank_ThrowNotFoundErrorQuestionBankDoesNotExist() {
        ObjectId id = new ObjectId();

        when(this.questionBankRepository.findByIdOptional(any(ObjectId.class))).thenReturn(Optional.empty());

        NotFoundException exception = assertThrows(
                NotFoundException.class,
                () -> this.questionBankService.updateQuestionBank(id, new QuestionBankDTO("Test"))
        );
        assertEquals("Question bank with id " + id + " not found", exception.getMessage());

        verify(this.questionBankRepository, times(1)).findByNameOptional(anyString());
        verify(this.questionBankRepository, times(1)).findByIdOptional(any(ObjectId.class));
        verify(this.questionBankRepository, never()).update(any(QuestionBank.class));
        verify(this.questionBankMapperFacade, never()).toDTO(any(QuestionBank.class));
    }

    @Test
    @DisplayName("Should update correctly questionBank")
    void test13UpdateQuestionBank() {
        QuestionBank questionBank = createTestQuestionBank("Test");
        questionBank.id = new ObjectId();
        LocalDateTime lastModified = questionBank.lastModified;

        QuestionBankDTO questionBankDTO_updated = new QuestionBankDTO("Test updated");

        when(this.questionBankRepository.findByNameOptional(anyString())).thenReturn(Optional.empty());
        when(this.questionBankRepository.findByIdOptional(questionBank.id)).thenReturn(Optional.of(questionBank));
        when(this.questionBankMapperFacade.toDTO(questionBank)).thenReturn(new QuestionBankDTO());

        QuestionBankDTO questionBankDTO = this.questionBankService.updateQuestionBank(questionBank.id, questionBankDTO_updated);
        assertNotNull(questionBankDTO);
        assertNotEquals(lastModified.getNano(), questionBank.lastModified.getNano());

        verify(this.questionBankRepository, times(1)).findByNameOptional(anyString());
        verify(this.questionBankRepository, times(1)).findByIdOptional(questionBank.id);
        verify(this.questionBankRepository, times(1)).update(questionBank);
        verify(this.questionBankMapperFacade, times(1)).toDTO(questionBank);
    }

    @Test
    @DisplayName("Should throw NotFoundError because QuestionBank does not exist")
    void test14DeleteQuestionBank_ThrowNotFoundErrorQuestionBankDoesNotExist() {
        ObjectId id = new ObjectId();

        when(this.questionBankRepository.findByIdOptional(any(ObjectId.class))).thenReturn(Optional.empty());

        NotFoundException exception = assertThrows(
                NotFoundException.class,
                () -> this.questionBankService.deleteQuestionBank(id)
        );
        assertEquals("Question bank with id " + id + " not found", exception.getMessage());

        verify(this.questionBankRepository, times(1)).findByIdOptional(id);
        verify(this.questionBankRepository, never()).delete(any(QuestionBank.class));
    }

    @Test
    @DisplayName("Should delete correctly questionBank")
    void test15DeleteQuestionBank() {
        QuestionBank questionBank = createTestQuestionBank("Test");
        questionBank.id = new ObjectId();

        when(this.questionBankRepository.findByIdOptional(questionBank.id)).thenReturn(Optional.of(questionBank));

        this.questionBankService.deleteQuestionBank(questionBank.id);

        verify(this.questionBankRepository, times(1)).findByIdOptional(questionBank.id);
        verify(this.questionBankRepository, times(1)).delete(questionBank);
    }
}
