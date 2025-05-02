package ch.supsi.mapper.quizAttempt.facade;

import ch.supsi.mapper.BadgeMapper;
import ch.supsi.mapper.IBaseMapper;
import ch.supsi.mapper.quizAttempt.QuizAttemptMapper;
import ch.supsi.mapper.response.TrueFalseQuestionResponseMapper;
import ch.supsi.mapper.response.builder.IQuestionResponseMapperBuilder;
import ch.supsi.model.api.QuizAttempt;
import ch.supsi.model.api.badge.Badge;
import ch.supsi.model.api.question.QuestionType;
import ch.supsi.model.api.response.TrueFalseQuestionResponse;
import ch.supsi.model.dto.api.BadgeDTO;
import ch.supsi.model.dto.api.QuizAttemptDTO;
import ch.supsi.model.dto.api.response.TrueFalseQuestionResponseDTO;
import io.quarkus.test.InjectMock;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.*;

@QuarkusTest
@TestMethodOrder(MethodOrderer.MethodName.class)
@SuppressWarnings("unchecked")
public class QuizAttemptMapperFacadeTest {
    @Inject
    QuizAttemptMapperFacade quizAttemptMapperFacade;

    @InjectMock
    QuizAttemptMapper quizAttemptMapper;

    @InjectMock
    IQuestionResponseMapperBuilder questionResponseMapperBuilder;

    @InjectMock
    BadgeMapper badgeMapper;

    @Test
    @DisplayName("Should return null when entity is null")
    void test01ToDTO_ReturnNullForNullInput() {
        QuizAttemptDTO result = this.quizAttemptMapperFacade.toDTO(null);
        assertNull(result);

        verifyNoInteractions(this.quizAttemptMapper, this.questionResponseMapperBuilder, this.badgeMapper);
    }

    @Test
    @DisplayName("Should correctly map full entity to DTO")
    void test02ToDTO_FullMapping() {
        QuizAttempt entity = new QuizAttempt();
        TrueFalseQuestionResponse response = new TrueFalseQuestionResponse();
        Badge badge = new Badge();

        entity.responses = List.of(response);
        entity.badges = List.of(badge);

        TrueFalseQuestionResponseDTO responseDTO = new TrueFalseQuestionResponseDTO();
        BadgeDTO badgeDTO = new BadgeDTO();

        TrueFalseQuestionResponseMapper trueFalseQuestionResponseMapper = mock(TrueFalseQuestionResponseMapper.class);

        when(this.questionResponseMapperBuilder.getQuestionResponseDTOMapper(response.responseType)).thenReturn((IBaseMapper) trueFalseQuestionResponseMapper);
        when(trueFalseQuestionResponseMapper.toDTO(response)).thenReturn(responseDTO);
        when(this.badgeMapper.toDTO(badge)).thenReturn(badgeDTO);
        when(this.quizAttemptMapper.toDTO(entity, List.of(responseDTO), List.of(badgeDTO))).thenReturn(new QuizAttemptDTO());

        QuizAttemptDTO result = this.quizAttemptMapperFacade.toDTO(entity);
        assertNotNull(result);

        verify(this.questionResponseMapperBuilder, times(1)).getQuestionResponseDTOMapper(QuestionType.TRUE_FALSE);
        verify(trueFalseQuestionResponseMapper, times(1)).toDTO(response);
        verify(this.badgeMapper, times(1)).toDTO(badge);
        verify(this.quizAttemptMapper, times(1)).toDTO(entity, List.of(responseDTO), List.of(badgeDTO));
    }

    @Test
    @DisplayName("Should handle empty collections gracefully")
    void test03ToDTO_EmptyCollections() {
        QuizAttempt entity = new QuizAttempt();
        entity.responses = Collections.emptyList();
        entity.badges = Collections.emptyList();

        when(this.quizAttemptMapper.toDTO(entity, Collections.emptyList(), Collections.emptyList())).thenReturn(new QuizAttemptDTO());

        QuizAttemptDTO result = this.quizAttemptMapperFacade.toDTO(entity);
        assertNotNull(result);

        verify(this.quizAttemptMapper, times(1)).toDTO(entity, Collections.emptyList(), Collections.emptyList());
        verifyNoInteractions(this.questionResponseMapperBuilder, this.badgeMapper);
    }

    @Test
    @DisplayName("Should return null when DTO is null")
    void test04ToEntity_ReturnNullForNullInput() {
        QuizAttempt result = this.quizAttemptMapperFacade.toEntity(null);
        assertNull(result);

        verifyNoMoreInteractions(this.quizAttemptMapper, this.questionResponseMapperBuilder, this.badgeMapper);
    }

    @Test
    @DisplayName("Should correctly map full DTO to entity")
    void test05ToEntity_FullMapping() {
        QuizAttemptDTO dto = new QuizAttemptDTO();
        TrueFalseQuestionResponseDTO responseDTO = new TrueFalseQuestionResponseDTO();
        BadgeDTO badgeDTO = new BadgeDTO();

        dto.setResponses(List.of(responseDTO));
        dto.setBadges(List.of(badgeDTO));

        TrueFalseQuestionResponse response = new TrueFalseQuestionResponse();
        Badge badge = new Badge();
        QuizAttempt expectedEntity = new QuizAttempt();

        TrueFalseQuestionResponseMapper trueFalseQuestionResponseMapper = mock(TrueFalseQuestionResponseMapper.class);

        when(this.questionResponseMapperBuilder.getQuestionResponseDTOMapper(responseDTO.getResponseType())).thenReturn((IBaseMapper) trueFalseQuestionResponseMapper);
        when(trueFalseQuestionResponseMapper.toEntity(responseDTO)).thenReturn(response);
        when(this.badgeMapper.toEntity(badgeDTO)).thenReturn(badge);
        when(this.quizAttemptMapper.toEntity(dto, List.of(response), List.of(badge))).thenReturn(expectedEntity);

        QuizAttempt result = this.quizAttemptMapperFacade.toEntity(dto);
        assertNotNull(result);

        verify(this.questionResponseMapperBuilder, times(1)).getQuestionResponseDTOMapper(QuestionType.TRUE_FALSE);
        verify(trueFalseQuestionResponseMapper, times(1)).toEntity(responseDTO);
        verify(this.badgeMapper, times(1)).toEntity(badgeDTO);
        verify(this.quizAttemptMapper, times(1)).toEntity(dto, List.of(response), List.of(badge));
    }

    @Test
    @DisplayName("Should handle empty collections gracefully")
    void test06ToEntity_EmptyCollections() {
        QuizAttemptDTO dto = new QuizAttemptDTO();
        dto.setResponses(Collections.emptyList());
        dto.setBadges(Collections.emptyList());

        when(this.quizAttemptMapper.toEntity(dto, Collections.emptyList(), Collections.emptyList())).thenReturn(new QuizAttempt());

        QuizAttempt result = this.quizAttemptMapperFacade.toEntity(dto);
        assertNotNull(result);

        verify(this.quizAttemptMapper, times(1)).toEntity(dto, Collections.emptyList(), Collections.emptyList());
        verifyNoInteractions(this.questionResponseMapperBuilder, this.badgeMapper);
    }
}
