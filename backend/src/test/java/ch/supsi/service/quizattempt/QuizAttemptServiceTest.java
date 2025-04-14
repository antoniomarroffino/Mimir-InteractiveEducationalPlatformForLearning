package ch.supsi.service.quizattempt;

import ch.supsi.mapper.quizAttempt.facade.IQuizAttemptMapperFacade;
import ch.supsi.model.api.QuizAttempt;
import ch.supsi.model.api.badge.Badge;
import ch.supsi.model.api.badge.BadgeType;
import ch.supsi.model.api.question.Question;
import ch.supsi.model.api.question.QuestionType;
import ch.supsi.model.api.question.TrueFalseQuestion;
import ch.supsi.model.api.response.QuestionResponse;
import ch.supsi.model.api.response.TrueFalseQuestionResponse;
import ch.supsi.model.api.user.Role;
import ch.supsi.model.dto.api.QuizAttemptDTO;
import ch.supsi.model.dto.api.UserWithoutCoursesDTO;
import ch.supsi.model.dto.api.response.QuestionResponseDTO;
import ch.supsi.model.dto.api.response.TrueFalseQuestionResponseDTO;
import ch.supsi.repository.QuestionRepository;
import ch.supsi.repository.QuizAttemptRepository;
import ch.supsi.service.quizattempt.points.builder.IPointsCalculatorBuilder;
import ch.supsi.service.quizattempt.points.strategy.IPointsCalculatorStrategy;
import ch.supsi.service.quizattempt.points.strategy.TrueFalsePointsCalculatorStrategy;
import io.quarkus.test.InjectMock;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import jakarta.ws.rs.BadRequestException;
import jakarta.ws.rs.InternalServerErrorException;
import jakarta.ws.rs.NotFoundException;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@QuarkusTest
@TestMethodOrder(MethodOrderer.MethodName.class)
public class QuizAttemptServiceTest {
    @Inject
    QuizAttemptService quizAttemptService;

    @InjectMock
    QuizAttemptRepository quizAttemptRepository;

    @InjectMock
    IQuizAttemptMapperFacade quizAttemptMapperFacade;

    @InjectMock
    QuestionRepository questionRepository;

    @InjectMock
    IPointsCalculatorBuilder pointsCalculatorBuilder;

    @Test
    @DisplayName("Should create new QuizAttempt and return new QuizAttemptDTO and calculate points")
    @SuppressWarnings("unchecked")
    void test01CreateNewQuizAttempt() {
        ObjectId questionId = new ObjectId();
        int expectedPoints = 10;

        QuizAttempt quizAttempt = createTestQuizAttempt();
        QuizAttemptDTO dto = convertToDTO(quizAttempt);

        TrueFalseQuestionResponseDTO trueFalseQuestionResponseDTO = new TrueFalseQuestionResponseDTO();
        trueFalseQuestionResponseDTO.setQuestionId(questionId.toString());
        dto.setResponses(List.of(trueFalseQuestionResponseDTO));

        TrueFalseQuestionResponse trueFalseQuestionResponse = new TrueFalseQuestionResponse();
        trueFalseQuestionResponse.questionId = questionId;

        quizAttempt.responses.add(trueFalseQuestionResponse);

        TrueFalsePointsCalculatorStrategy trueFalsePointsCalculatorStrategy = mock(TrueFalsePointsCalculatorStrategy.class);

        when(this.quizAttemptMapperFacade.toEntity(dto)).thenReturn(quizAttempt);
        when(this.quizAttemptMapperFacade.toDTO(quizAttempt)).thenReturn(new QuizAttemptDTO());
        when(this.questionRepository.findById(questionId)).thenReturn(new TrueFalseQuestion());
        when(this.pointsCalculatorBuilder.getPointsCalculator(trueFalseQuestionResponse.responseType)).thenReturn((IPointsCalculatorStrategy) trueFalsePointsCalculatorStrategy);
        when(trueFalsePointsCalculatorStrategy.calculatePoints(any(TrueFalseQuestionResponse.class), any(TrueFalseQuestion.class))).thenReturn(expectedPoints);

        this.quizAttemptService.createQuizAttempt(dto);
        QuizAttemptDTO createdQuizAttemptDTO = convertToDTO(quizAttempt);
        assertNotNull(createdQuizAttemptDTO);
        assertNotNull(createdQuizAttemptDTO.getCompletedAt());
        assertEquals(expectedPoints, quizAttempt.responses.getFirst().earnedPoints);

        verify(this.quizAttemptMapperFacade, times(1)).toEntity(any(QuizAttemptDTO.class));
        verify(this.questionRepository, times(quizAttempt.responses.size())).findById(any(ObjectId.class));
        verify(this.pointsCalculatorBuilder, times(quizAttempt.responses.size())).getPointsCalculator(any(QuestionType.class));
        verify(trueFalsePointsCalculatorStrategy, times(quizAttempt.responses.size())).calculatePoints(any(TrueFalseQuestionResponse.class), any(TrueFalseQuestion.class));
        verify(this.quizAttemptRepository, times(1)).persist(quizAttempt);
        verify(this.quizAttemptMapperFacade, times(1)).toDTO(quizAttempt);
    }

    @Test
    @DisplayName("Should verify if QuizAttemptDTO passed is valid")
    void test02CreateQuizAttempt_ThrowBadRequestErrorBecauseQuizAttemptDTOPassedIsNotValid() {
        QuizAttemptDTO quizAttemptDTOPublicationIdNull = new QuizAttemptDTO();
        quizAttemptDTOPublicationIdNull.setQuizPublicationId(null);

        QuizAttemptDTO quizAttemptDTOResponsesEmpty = new QuizAttemptDTO();
        quizAttemptDTOResponsesEmpty.setQuizPublicationId(new ObjectId().toString());
        quizAttemptDTOResponsesEmpty.setResponses(Collections.emptyList());

        assertAll(
                () -> assertThrows(
                        BadRequestException.class,
                        () -> this.quizAttemptService.createQuizAttempt(null)
                ),
                () -> assertThrows(
                        BadRequestException.class,
                        () -> this.quizAttemptService.createQuizAttempt(quizAttemptDTOPublicationIdNull)
                ),
                () -> assertThrows(
                        BadRequestException.class,
                        () -> this.quizAttemptService.createQuizAttempt(quizAttemptDTOResponsesEmpty)
                )
        );
    }

    @Test
    @DisplayName("Should return QuizAttemptDTO founded by id")
    void test03GetQuizAttemptById() {
        QuizAttempt quizAttempt = createTestQuizAttempt();

        when(this.quizAttemptRepository.findByIdOptional(quizAttempt.id)).thenReturn(Optional.of(quizAttempt));
        when(this.quizAttemptMapperFacade.toDTO(quizAttempt)).thenReturn(new QuizAttemptDTO());

        QuizAttemptDTO quizAttemptDTO = this.quizAttemptService.getQuizAttemptById(quizAttempt.id);
        assertNotNull(quizAttemptDTO);

        verify(this.quizAttemptRepository, times(1)).findByIdOptional(quizAttempt.id);
        verify(this.quizAttemptMapperFacade, times(1)).toDTO(quizAttempt);
    }

    @Test
    @DisplayName("Should throw NotFoundError because QuizAttempt id does not exist")
    void test04GetQuizAttemptById_ThrowNotFoundErrorQuizAttemptIdDoesNotExist() {
        ObjectId id = new ObjectId();

        when(this.quizAttemptRepository.findByIdOptional(any(ObjectId.class))).thenReturn(Optional.empty());

        NotFoundException exception = assertThrows(
                NotFoundException.class,
                () -> this.quizAttemptService.getQuizAttemptById(id)
        );
        assertEquals("Quiz attempt with id " + id + " not found", exception.getMessage());

        verify(this.quizAttemptRepository, times(1)).findByIdOptional(id);
        verify(this.quizAttemptMapperFacade, never()).toDTO(any(QuizAttempt.class));
    }

    @Test
    @DisplayName("Should throw InternalServerError because user azure oid cannot be null")
    void test05GetQuizAttemptsByUser_ThrowInternalServerErrorUserAzureOidIsNull() {
        InternalServerErrorException exception = assertThrows(
                InternalServerErrorException.class,
                () -> this.quizAttemptService.getQuizAttemptsByUser(null)
        );
        assertEquals("User Azure OID cannot be null", exception.getMessage());

        verify(this.quizAttemptRepository, never()).findByUserAzureOID(anyString());
        verify(this.quizAttemptMapperFacade, never()).toDTO(any(QuizAttempt.class));
    }

    @Test
    @DisplayName("Should return all quizAttempts created by a user given his azure oid")
    void test06GetQuizAttemptsByUser_ReturnAllQuizAttemptsByUser() {
        String testUserAzureOID = "testUserAzureOID";

        QuizAttempt quizAttempt1 = createTestQuizAttempt();
        QuizAttempt quizAttempt2 = createTestQuizAttempt();
        List<QuizAttempt> userQuizAttemptsList = List.of(quizAttempt1, quizAttempt2);

        when(this.quizAttemptRepository.findByUserAzureOID(testUserAzureOID)).thenReturn(userQuizAttemptsList);
        when(this.quizAttemptMapperFacade.toDTO(any(QuizAttempt.class))).thenReturn(new QuizAttemptDTO());

        List<QuizAttemptDTO> quizAttemptDTOList = this.quizAttemptService.getQuizAttemptsByUser(testUserAzureOID);
        assertNotNull(quizAttemptDTOList);
        assertEquals(userQuizAttemptsList.size(), quizAttemptDTOList.size());

        verify(this.quizAttemptRepository, times(1)).findByUserAzureOID(testUserAzureOID);
        verify(this.quizAttemptMapperFacade, times(userQuizAttemptsList.size())).toDTO(any(QuizAttempt.class));
    }

    @Test
    @DisplayName("Should throw BadRequestError because publicationId is null")
    void test07GetQuizAttemptsByPublication_ThrowBadRequestErrorPublicationIdIsNull() {
        BadRequestException exception = assertThrows(
                BadRequestException.class,
                () -> this.quizAttemptService.getQuizAttemptsByPublication(null)
        );
        assertEquals("Publication ID cannot be null", exception.getMessage());

        verify(this.quizAttemptRepository, never()).findByPublicationId(any(ObjectId.class));
        verify(this.quizAttemptMapperFacade, never()).toDTO(any(QuizAttempt.class));
    }

    @Test
    @DisplayName("Should return all QuizAttemptsDTO founded by a publication Id")
    void test08GetQuizAttemptsByPublication_ReturnAllQuizAttemptsByPublicationId() {
        ObjectId publicationId = new ObjectId();
        QuizAttempt quizAttempt1 = createTestQuizAttempt();
        quizAttempt1.quizPublicationId = publicationId;
        QuizAttempt quizAttempt2 = createTestQuizAttempt();
        quizAttempt2.quizPublicationId = publicationId;

        List<QuizAttempt> quizAttemptsInPublication = List.of(quizAttempt1, quizAttempt2);

        when(this.quizAttemptRepository.findByPublicationId(publicationId)).thenReturn(quizAttemptsInPublication);
        when(this.quizAttemptMapperFacade.toDTO(any(QuizAttempt.class))).thenReturn(new QuizAttemptDTO());

        List<QuizAttemptDTO> quizAttemptDTOList = this.quizAttemptService.getQuizAttemptsByPublication(publicationId);
        assertNotNull(quizAttemptDTOList);
        assertEquals(quizAttemptsInPublication.size(), quizAttemptDTOList.size());

        verify(this.quizAttemptRepository, times(1)).findByPublicationId(publicationId);
        verify(this.quizAttemptMapperFacade, times(quizAttemptsInPublication.size())).toDTO(any(QuizAttempt.class));
    }

    @Test
    @DisplayName("Should throw BadRequestError because PublicationId or QuestionId are null")
    void test09GetQuizAttemptsByPublicationAndQuestion_ThrowBadRequestErrorPublicationIdOrQuestionIdIsNull() {
        assertAll(
                () -> assertThrows(
                        BadRequestException.class,
                        () -> this.quizAttemptService.getQuizAttemptsByPublicationAndQuestion(null, new ObjectId())
                ),
                () -> assertThrows(
                        BadRequestException.class,
                        () -> this.quizAttemptService.getQuizAttemptsByPublicationAndQuestion(new ObjectId(), null)
                )
        );
    }

    @Test
    @DisplayName("Should return all QuizAttempts of a specific publication and question")
    void test10GetQuizAttemptsByPublicationAndQuestion_ReturnAllQuizAttempts() {
        QuizAttempt quizAttempt1 = createTestQuizAttempt();
        List<QuizAttempt> quizAttemptList = List.of(quizAttempt1);

        when(this.quizAttemptRepository.findByPublicationIdAndQuestionId(any(ObjectId.class), any(ObjectId.class))).thenReturn(List.of(quizAttempt1));

        List<QuizAttemptDTO> quizAttemptsInPublication = this.quizAttemptService.getQuizAttemptsByPublicationAndQuestion(new ObjectId(), new ObjectId());
        assertNotNull(quizAttemptsInPublication);
        assertEquals(quizAttemptsInPublication.size(), quizAttemptList.size());

        verify(this.quizAttemptRepository, times(1)).findByPublicationIdAndQuestionId(any(ObjectId.class), any(ObjectId.class));
        verify(this.quizAttemptMapperFacade, times(quizAttemptList.size())).toDTO(any(QuizAttempt.class));
    }

    @Test
    @DisplayName("Should throw BadRequestError because parameters passed are invalid")
    void test11AssignBadge_ThrowBadRequestErrorParametersInvalid() {
        assertAll(
                () -> assertThrows(
                        BadRequestException.class,
                        () -> this.quizAttemptService.assignBadge(null, BadgeType.BEST_ATTEMPT, "")
                ),
                () -> assertThrows(
                        BadRequestException.class,
                        () -> this.quizAttemptService.assignBadge(new ObjectId(), null, "")
                ),
                () -> assertThrows(
                        InternalServerErrorException.class,
                        () -> this.quizAttemptService.assignBadge(new ObjectId(), BadgeType.BEST_ATTEMPT, null)
                ),
                () -> assertThrows(
                        InternalServerErrorException.class,
                        () -> this.quizAttemptService.assignBadge(new ObjectId(), BadgeType.BEST_ATTEMPT, "")
                )
        );

        verify(this.quizAttemptRepository, never()).findByIdOptional(any(ObjectId.class));
        verify(this.quizAttemptRepository, never()).update(any(QuizAttempt.class));
    }

    @Test
    @DisplayName("Should throw BadRequestError because badge type is already assigned")
    void test12AssignBadge_ThrowBadRequestErrorBadgeTypeIsAlreadyAssigned() {
        QuizAttempt quizAttempt = createTestQuizAttempt();
        Badge badge = new Badge();
        badge.assignedAt = LocalDateTime.now();
        badge.type = BadgeType.BEST_ATTEMPT;
        badge.assignedBy = "TestOID";
        quizAttempt.badges.add(badge);

        when(this.quizAttemptRepository.findByIdOptional(any(ObjectId.class))).thenReturn(Optional.of(quizAttempt));

        BadRequestException exception = assertThrows(
                BadRequestException.class,
                () -> this.quizAttemptService.assignBadge(quizAttempt.id, BadgeType.BEST_ATTEMPT, "TestOID")
        );

        assertEquals("Badge " + badge.type + " already assigned to this attempt", exception.getMessage());

        verify(this.quizAttemptRepository, times(1)).findByIdOptional(quizAttempt.id);
        verify(this.quizAttemptRepository, never()).update(any(QuizAttempt.class));
    }

    @Test
    @DisplayName("Should assign new badge to a QuizAttempt")
    void test13AssignNewBadge() {
        QuizAttempt quizAttempt = createTestQuizAttempt();

        when(this.quizAttemptRepository.findByIdOptional(any(ObjectId.class))).thenReturn(Optional.of(quizAttempt));

        this.quizAttemptService.assignBadge(quizAttempt.id, BadgeType.BEST_ATTEMPT, "TestOID");
        assertEquals(1, quizAttempt.badges.size());
        assertEquals(BadgeType.BEST_ATTEMPT, quizAttempt.badges.getFirst().type);

        verify(this.quizAttemptRepository, times(1)).findByIdOptional(quizAttempt.id);
        verify(this.quizAttemptRepository, times(1)).update(quizAttempt);
    }

    public static QuizAttempt createTestQuizAttempt() {
        QuizAttempt quizAttempt = new QuizAttempt();
        quizAttempt.id = new ObjectId();
        quizAttempt.quizPublicationId = new ObjectId();
        quizAttempt.startedAt = LocalDateTime.now();
        return quizAttempt;
    }

    public static QuizAttempt createTestQuizAttempt(String userOid, ObjectId publicationId, List<QuestionResponse> responses) {
        QuizAttempt quizAttempt = new QuizAttempt();
        quizAttempt.id = new ObjectId();
        quizAttempt.quizPublicationId = publicationId;
        quizAttempt.startedAt = LocalDateTime.now();
        quizAttempt.responses = responses;
        quizAttempt.userAzureOID = userOid;
        return quizAttempt;
    }

    public static QuizAttemptDTO convertToDTO(QuizAttempt quizAttempt) {
        QuizAttemptDTO quizAttemptDTO = new QuizAttemptDTO();
        quizAttemptDTO.setId(quizAttempt.id.toString());
        quizAttemptDTO.setQuizPublicationId(quizAttempt.quizPublicationId.toString());
        quizAttemptDTO.setUser(new UserWithoutCoursesDTO(quizAttempt.userAzureOID, "name", "email@email.com", Role.STUDENT));
        quizAttemptDTO.setStartedAt(quizAttempt.startedAt);
        quizAttemptDTO.setCompletedAt(quizAttempt.completedAt);
        return quizAttemptDTO;
    }
}
