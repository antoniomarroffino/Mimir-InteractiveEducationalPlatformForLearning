package ch.supsi.mapper.quizPublication.facade;

import ch.supsi.mapper.IBaseMapper;
import ch.supsi.mapper.question.TrueFalseQuestionMapper;
import ch.supsi.mapper.question.builder.IQuestionMapperBuilder;
import ch.supsi.mapper.quizPublication.QuizPublicationMapper;
import ch.supsi.model.api.QuizPublication;
import ch.supsi.model.api.question.QuestionType;
import ch.supsi.model.api.question.TrueFalseQuestion;
import ch.supsi.model.dto.api.QuizPublicationDTO;
import ch.supsi.model.dto.api.question.QuestionDTO;
import ch.supsi.model.dto.api.question.TrueFalseQuestionDTO;
import ch.supsi.service.quizpublication.QuizPublicationServiceTest;
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
public class QuizPublicationMapperFacadeTest {
    @Inject
    QuizPublicationMapperFacade quizPublicationMapperFacade;

    @InjectMock
    QuizPublicationMapper quizPublicationMapper;

    @InjectMock
    IQuestionMapperBuilder questionMapperBuilder;

    @Test
    @DisplayName("Should return null when entity is null")
    void test01ToDTO_ReturnNullForNullInput() {
        QuizPublicationDTO result = this.quizPublicationMapperFacade.toDTO(null);
        assertNull(result);

        verifyNoInteractions(this.quizPublicationMapper, this.questionMapperBuilder);
    }

    @Test
    @DisplayName("Should map entity with questions correctly")
    void test02ToDTO_FullMapping() {
        QuizPublication entity = QuizPublicationServiceTest.createTestQuizPublication();
        TrueFalseQuestion question = new TrueFalseQuestion();
        entity.questions = List.of(question);

        TrueFalseQuestionMapper mapper = mock(TrueFalseQuestionMapper.class);
        TrueFalseQuestionDTO questionDTO = new TrueFalseQuestionDTO();

        when(this.questionMapperBuilder.getQuestionDTOMapper(QuestionType.TRUE_FALSE)).thenReturn((IBaseMapper) mapper);
        when(mapper.toDTO(question)).thenReturn(questionDTO);
        when(this.quizPublicationMapper.toDTO(entity, List.of(questionDTO))).thenReturn(new QuizPublicationDTO());

        QuizPublicationDTO result = this.quizPublicationMapperFacade.toDTO(entity);
        assertNotNull(result);

        verify(this.questionMapperBuilder, times(1)).getQuestionDTOMapper(QuestionType.TRUE_FALSE);
        verify(mapper, times(1)).toDTO(question);
        verify(this.quizPublicationMapper, times(1)).toDTO(entity, List.of(questionDTO));
    }

    @Test
    @DisplayName("Should handle empty questions list")
    void test03ToDTO_EmptyQuestions() {
        QuizPublication entity = new QuizPublication();
        entity.questions = Collections.emptyList();

        when(this.quizPublicationMapper.toDTO(entity, Collections.emptyList())).thenReturn(new QuizPublicationDTO());

        QuizPublicationDTO result = this.quizPublicationMapperFacade.toDTO(entity);
        assertNotNull(result);

        verify(this.quizPublicationMapper, times(1)).toDTO(entity, Collections.emptyList());
        verifyNoInteractions(this.questionMapperBuilder);
    }

    @Test
    @DisplayName("Test04 - toEntity should return null when DTO is null")
    void test04ToEntity_ReturnNullForNullInput() {
        QuizPublication result = this.quizPublicationMapperFacade.toEntity(null);
        assertNull(result);
    }

    @Test
    @DisplayName("Should map DTO with questions correctly")
    void test05ToEntity_FullMapping() {
        QuizPublicationDTO dto = new QuizPublicationDTO();
        TrueFalseQuestionDTO questionDTO = new TrueFalseQuestionDTO();
        dto.setQuestions(List.of(questionDTO));

        TrueFalseQuestionMapper mapper = mock(TrueFalseQuestionMapper.class);
        TrueFalseQuestion question = new TrueFalseQuestion();

        when(this.questionMapperBuilder.getQuestionDTOMapper(QuestionType.TRUE_FALSE)).thenReturn((IBaseMapper) mapper);
        when(mapper.toEntity(questionDTO)).thenReturn(question);
        when(this.quizPublicationMapper.toEntity(dto, List.of(question))).thenReturn(new QuizPublication());

        QuizPublication result = this.quizPublicationMapperFacade.toEntity(dto);
        assertNotNull(result);

        verify(this.questionMapperBuilder, times(1)).getQuestionDTOMapper(QuestionType.TRUE_FALSE);
        verify(mapper, times(1)).toEntity(questionDTO);
        verify(this.quizPublicationMapper, times(1)).toEntity(dto, List.of(question));
    }

    @Test
    @DisplayName("Should handle empty questions list")
    void test06ToEntity_EmptyQuestions() {
        QuizPublicationDTO dto = new QuizPublicationDTO();
        dto.setQuestions(Collections.emptyList());

        when(this.quizPublicationMapper.toEntity(dto, Collections.emptyList())).thenReturn(new QuizPublication());

        QuizPublication result = this.quizPublicationMapperFacade.toEntity(dto);
        assertNotNull(result);

        verify(this.quizPublicationMapper, times(1)).toEntity(dto, Collections.emptyList());
        verifyNoInteractions(this.questionMapperBuilder);
    }
}
