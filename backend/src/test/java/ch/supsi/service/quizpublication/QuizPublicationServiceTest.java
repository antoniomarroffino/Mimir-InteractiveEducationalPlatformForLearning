package ch.supsi.service.quizpublication;

import ch.supsi.mapper.quizPublication.facade.IQuizPublicationMapperFacade;
import ch.supsi.model.api.QuizPublication;
import ch.supsi.model.api.question.MultipleChoiceQuestion;
import ch.supsi.model.api.question.TrueFalseQuestion;
import ch.supsi.model.dto.api.QuizPublicationDTO;
import ch.supsi.repository.QuizPublicationRepository;
import io.quarkus.test.InjectMock;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import jakarta.ws.rs.NotFoundException;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@QuarkusTest
@TestMethodOrder(MethodOrderer.MethodName.class)
public class QuizPublicationServiceTest {
    @Inject
    QuizPublicationService quizPublicationService;

    @InjectMock
    QuizPublicationRepository quizPublicationRepository;

    @InjectMock
    IQuizPublicationMapperFacade quizPublicationMapperFacade;

    @Test
    @DisplayName("Should publish new quiz and return a QuizPublicationDTO anonymous")
    void test01PublishQuiz_ReturnAQuizPublicationDTOAnonymous() {
        QuizPublication quizPublication = createTestQuizPublication();

        TrueFalseQuestion trueFalseQuestion = new TrueFalseQuestion();
        MultipleChoiceQuestion multipleChoiceQuestion = new MultipleChoiceQuestion();

        quizPublication.questions.add(trueFalseQuestion);
        quizPublication.questions.add(multipleChoiceQuestion);

        when(this.quizPublicationMapperFacade.toEntity(any(QuizPublicationDTO.class))).thenReturn(quizPublication);
        when(this.quizPublicationRepository.findByCodeOptional(any(String.class))).thenReturn(Optional.empty());
        when(this.quizPublicationMapperFacade.toDTO(quizPublication)).thenReturn(new QuizPublicationDTO());

        this.quizPublicationService.publishQuiz(new QuizPublicationDTO());
        QuizPublicationDTO publishedQuizPublication = convertToDTO(quizPublication);

        assertNotNull(publishedQuizPublication);
        assertTrue(publishedQuizPublication.getPublished());
        assertTrue(publishedQuizPublication.getAnonymous());
        assertFalse(publishedQuizPublication.getPublicationCode().isEmpty());


        verify(this.quizPublicationMapperFacade, times(1)).toEntity(any(QuizPublicationDTO.class));
        verify(this.quizPublicationRepository, times(1)).findByCodeOptional(any(String.class));
        verify(this.quizPublicationRepository, times(1)).persist(quizPublication);
        verify(this.quizPublicationMapperFacade, times(1)).toDTO(quizPublication);
    }

    @Test
    @DisplayName("Should return quizPublicationDTO founded by id")
    void test02GetQuizPublicationById_ReturnAQuizPublicationDTOFoundedById() {
        QuizPublication quizPublication = createTestQuizPublication();
        when(this.quizPublicationRepository.findByIdOptional(any(ObjectId.class))).thenReturn(Optional.of(quizPublication));
        when(this.quizPublicationMapperFacade.toDTO(quizPublication)).thenReturn(new QuizPublicationDTO());

        QuizPublicationDTO quizPublicationDTO = this.quizPublicationService.getQuizPublicationById(new ObjectId());
        assertNotNull(quizPublicationDTO);

        verify(this.quizPublicationRepository, times(1)).findByIdOptional(any(ObjectId.class));
        verify(this.quizPublicationMapperFacade, times(1)).toDTO(quizPublication);
    }

    @Test
    @DisplayName("Should throw NotFoundError because QuizPublication id does not exist")
    void test03GetQuizPublicationById_ThrowNotFoundErrorQuizPublicationIdDoesNotExist() {
        ObjectId quizPublicationId = new ObjectId();

        when(this.quizPublicationRepository.findByIdOptional(any(ObjectId.class))).thenReturn(Optional.empty());

        NotFoundException exception = assertThrows(
                NotFoundException.class,
                () -> this.quizPublicationService.getQuizPublicationById(quizPublicationId)
        );
        assertEquals("Quiz publication with id " + quizPublicationId + " not found", exception.getMessage());

        verify(this.quizPublicationRepository, times(1)).findByIdOptional(any(ObjectId.class));
        verify(this.quizPublicationMapperFacade, never()).toDTO(any(QuizPublication.class));
    }

    @Test
    @DisplayName("Should return QuizPublicationDTO founded by code")
    void test04GetPublicationByCode_ReturnAQuizPublicationDTOFoundedByCode() {
        QuizPublication quizPublication = createTestQuizPublication();
        String testCode = "testCode";

        when(this.quizPublicationRepository.findByCodeOptional(testCode)).thenReturn(Optional.of(quizPublication));
        when(this.quizPublicationMapperFacade.toDTO(quizPublication)).thenReturn(new QuizPublicationDTO());

        QuizPublicationDTO quizPublicationDTO = this.quizPublicationService.getPublicationByCode(testCode);
        assertNotNull(quizPublicationDTO);

        verify(this.quizPublicationRepository, times(1)).findByCodeOptional(testCode);
        verify(this.quizPublicationMapperFacade, times(1)).toDTO(quizPublication);
    }

    @Test
    @DisplayName("Should throw NotFoundError because QuizPublication code does not exist")
    void test05GetPublicationByCode_ThrowNotFoundErrorQuizPublicationCodeDoesNotExist() {
        String testCode = "testCode";

        when(this.quizPublicationRepository.findByCodeOptional(anyString())).thenReturn(Optional.empty());

        NotFoundException exception = assertThrows(
                NotFoundException.class,
                () -> this.quizPublicationService.getPublicationByCode(testCode)
        );
        assertEquals("Quiz publication with code " + testCode + " not found", exception.getMessage());

        verify(this.quizPublicationRepository, times(1)).findByCodeOptional(testCode);
        verify(this.quizPublicationMapperFacade, never()).toDTO(any(QuizPublication.class));
    }

    @Test
    @DisplayName("Should deactivate an active publication founded by id")
    void test06DeactivateQuizPublication() {
        QuizPublication quizPublication = createTestQuizPublication();
        quizPublication.published = true;

        when(this.quizPublicationRepository.findByIdOptional(quizPublication.id)).thenReturn(Optional.of(quizPublication));
        when(this.quizPublicationMapperFacade.toDTO(quizPublication)).thenReturn(new QuizPublicationDTO());

        this.quizPublicationService.deactivateQuizPublication(quizPublication.id);
        QuizPublicationDTO deactivatedQuizPublication = convertToDTO(quizPublication);

        assertNotNull(deactivatedQuizPublication);
        assertFalse(deactivatedQuizPublication.getPublished());
        assertNotNull(deactivatedQuizPublication.getClosedAt());

        verify(this.quizPublicationRepository, times(1)).findByIdOptional(quizPublication.id);
        verify(this.quizPublicationRepository, times(1)).update(quizPublication);
        verify(this.quizPublicationMapperFacade, times(1)).toDTO(quizPublication);
    }

    @Test
    @DisplayName("Should throw NotFoundError because QuizPublication id does not exist")
    void test07DeactivateQuizPublication_ThrowNotFoundErrorQuizPublicationIdDoesNotExist() {
        ObjectId id = new ObjectId();
        when(this.quizPublicationRepository.findByIdOptional(id)).thenReturn(Optional.empty());

        NotFoundException exception = assertThrows(
                NotFoundException.class,
                () -> this.quizPublicationService.deactivateQuizPublication(id)
        );
        assertEquals("Quiz publication with id " + id + " not found", exception.getMessage());

        verify(this.quizPublicationRepository, times(1)).findByIdOptional(id);
        verify(this.quizPublicationRepository, never()).update(any(QuizPublication.class));
        verify(this.quizPublicationMapperFacade, never()).toDTO(any(QuizPublication.class));
    }

    @Test
    @DisplayName("Should delete quizPublication founded by id")
    void test08DeleteQuizPublication() {
        QuizPublication quizPublication = createTestQuizPublication();

        when(this.quizPublicationRepository.findByIdOptional(quizPublication.id)).thenReturn(Optional.of(quizPublication));

        this.quizPublicationService.deleteQuizPublication(quizPublication.id);

        verify(this.quizPublicationRepository, times(1)).findByIdOptional(quizPublication.id);
        verify(this.quizPublicationRepository, times(1)).delete(any(QuizPublication.class));
    }

    @Test
    @DisplayName("Should throw NotFoundError because QuizPublication id does not exist")
    void test09DeleteQuizPublication_ThrowNotFoundErrorQuizPublicationIdDoesNotExist() {
        ObjectId id = new ObjectId();
        when(this.quizPublicationRepository.findByIdOptional(id)).thenReturn(Optional.empty());

        NotFoundException exception = assertThrows(
                NotFoundException.class,
                () -> this.quizPublicationService.deleteQuizPublication(id)
        );
        assertEquals("Quiz publication with id " + id + " not found", exception.getMessage());

        verify(this.quizPublicationRepository, times(1)).findByIdOptional(id);
        verify(this.quizPublicationRepository, never()).delete(any(QuizPublication.class));
    }

    @Test
    @DisplayName("Should return all QuizPublicationDTO in a quiz founded by quizId")
    void test10GetPublicationsByQuizId() {
        QuizPublication quizPublication1 = createTestQuizPublication();
        QuizPublication quizPublication2 = createTestQuizPublication();
        List<QuizPublication> quizPublications = List.of(quizPublication1, quizPublication2);

        when(this.quizPublicationRepository.findPublicationsByQuizId(any(ObjectId.class))).thenReturn(quizPublications);
        when(this.quizPublicationMapperFacade.toDTO(quizPublication1)).thenReturn(convertToDTO(quizPublication1));
        when(this.quizPublicationMapperFacade.toDTO(quizPublication2)).thenReturn(convertToDTO(quizPublication2));

        List<QuizPublicationDTO> quizPublicationDTOS = this.quizPublicationService.getPublicationsByQuizId(new ObjectId());
        assertNotNull(quizPublicationDTOS);
        assertEquals(quizPublications.size(), quizPublicationDTOS.size());

        verify(this.quizPublicationRepository, times(1)).findPublicationsByQuizId(any(ObjectId.class));
        verify(this.quizPublicationMapperFacade, times(quizPublications.size())).toDTO(any(QuizPublication.class));
    }

    @Test
    @DisplayName("Should return empty QuizPublicationDTO list")
    void test11GetPublicationsByQuizId_EmptyList() {
        when(this.quizPublicationRepository.findPublicationsByQuizId(any(ObjectId.class))).thenReturn(Collections.emptyList());

        List<QuizPublicationDTO> quizPublicationDTOS = this.quizPublicationService.getPublicationsByQuizId(new ObjectId());
        assertNotNull(quizPublicationDTOS);
        assertTrue(quizPublicationDTOS.isEmpty());

        verify(this.quizPublicationRepository, times(1)).findPublicationsByQuizId(any(ObjectId.class));
        verify(this.quizPublicationMapperFacade, never()).toDTO(any(QuizPublication.class));
    }

    @Test
    @DisplayName("Should generate unique code after collision")
    void test12GenerateUniqueCode_WithRetry() {
        String existingCode = "EXIST01";
        String newCode = "NEWCOD";

        QuizPublication existingPublication = createTestQuizPublication(new ObjectId(), existingCode);

        when(this.quizPublicationRepository.findByCodeOptional(anyString()))
                .thenReturn(Optional.of(existingPublication))
                .thenReturn(Optional.empty());

        String generatedCode = this.quizPublicationService.generateUniqueCode();

        verify(this.quizPublicationRepository, atLeast(2)).findByCodeOptional(anyString());

        assertEquals(newCode.length(), generatedCode.length());
    }

    @Test
    @DisplayName("Should generate valid code format")
    void test13GenerateUniqueCode_ValidFormat() {
        when(this.quizPublicationRepository.findByCodeOptional(anyString()))
                .thenReturn(Optional.empty());

        String code = this.quizPublicationService.generateUniqueCode();

        assertEquals(6, code.length());

        String validChars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        assertTrue(code.chars().allMatch(c -> validChars.indexOf(c) >= 0));
    }

    public static QuizPublication createTestQuizPublication() {
        ObjectId courseId = new ObjectId();
        ObjectId folderId = new ObjectId();
        ObjectId quizId = new ObjectId();

        QuizPublication quizPublication = new QuizPublication(
                courseId,
                folderId,
                quizId,
                new ArrayList<>(),
                ""
        );
        quizPublication.id = new ObjectId();

        return quizPublication;
    }

    public static QuizPublication createTestQuizPublication(ObjectId quizId, String publicationCode) {
        ObjectId courseId = new ObjectId();
        ObjectId folderId = new ObjectId();
        return new QuizPublication(courseId, folderId, quizId, new ArrayList<>(), publicationCode);
    }

    public static QuizPublicationDTO convertToDTO(QuizPublication quizPublication) {
        QuizPublicationDTO quizPublicationDTO = new QuizPublicationDTO();
        quizPublicationDTO.setId(quizPublication.id.toString());
        quizPublicationDTO.setCourseId(quizPublication.courseId.toString());
        quizPublicationDTO.setFolderId(quizPublication.folderId.toString());
        quizPublicationDTO.setQuizId(quizPublication.quizId.toString());
        quizPublicationDTO.setPublicationCode(quizPublication.publicationCode);
        quizPublicationDTO.setAnonymous(quizPublication.anonymous);
        quizPublicationDTO.setPublished(quizPublication.published);
        quizPublicationDTO.setCreatedAt(quizPublication.createdAt);
        quizPublicationDTO.setClosedAt(quizPublication.closedAt);
        return quizPublicationDTO;
    }
}
