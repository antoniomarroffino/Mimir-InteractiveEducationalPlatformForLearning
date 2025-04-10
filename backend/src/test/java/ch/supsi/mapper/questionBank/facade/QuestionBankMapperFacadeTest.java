package ch.supsi.mapper.questionBank.facade;

import ch.supsi.mapper.IBaseMapper;
import ch.supsi.mapper.question.TrueFalseQuestionMapper;
import ch.supsi.mapper.question.builder.IQuestionMapperBuilder;
import ch.supsi.mapper.questionBank.QuestionBankMapper;
import ch.supsi.model.api.QuestionBank;
import ch.supsi.model.api.question.Question;
import ch.supsi.model.api.question.QuestionType;
import ch.supsi.model.api.question.TrueFalseQuestion;
import ch.supsi.model.dto.api.QuestionBankDTO;
import ch.supsi.model.dto.api.QuizPublicationDTO;
import ch.supsi.model.dto.api.question.TrueFalseQuestionDTO;
import ch.supsi.repository.QuestionRepository;
import ch.supsi.service.questionBank.QuestionBankServiceTest;
import io.quarkus.test.InjectMock;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.*;
import static org.mockito.Mockito.when;

@QuarkusTest
@TestMethodOrder(MethodOrderer.MethodName.class)
@SuppressWarnings("unchecked")
public class QuestionBankMapperFacadeTest {
    @Inject
    QuestionBankMapperFacade questionBankMapperFacade;

    @InjectMock
    QuestionBankMapper questionBankMapper;

    @InjectMock
    IQuestionMapperBuilder questionMapperBuilder;

    @InjectMock
    QuestionRepository questionRepository;

    @Test
    @DisplayName("Should return null when entity is null")
    void test01ToDTO_ReturnNullForNullInput() {
        QuestionBankDTO questionBankDTO = this.questionBankMapperFacade.toDTO(null);
        assertNull(questionBankDTO);

        verifyNoInteractions(this.questionBankMapper, this.questionMapperBuilder, this.questionRepository);
    }

    @Test
    @DisplayName("Should map entity with questions correctly")
    void test02ToDTO_FullMapping() {
        QuestionBank questionBank = QuestionBankServiceTest.createTestQuestionBank("Test");
        TrueFalseQuestion trueFalseQuestion = new TrueFalseQuestion();
        trueFalseQuestion.id = new ObjectId();
        questionBank.questions.add(trueFalseQuestion.id.toString());

        TrueFalseQuestionMapper mapper = mock(TrueFalseQuestionMapper.class);
        TrueFalseQuestionDTO questionDTO = new TrueFalseQuestionDTO();

        when(this.questionRepository.findByIdOptional(any(ObjectId.class))).thenReturn(Optional.of(trueFalseQuestion));
        when(this.questionMapperBuilder.getQuestionDTOMapper(QuestionType.TRUE_FALSE)).thenReturn((IBaseMapper) mapper);
        when(mapper.toDTO(trueFalseQuestion)).thenReturn(questionDTO);
        when(this.questionBankMapper.toDTO(questionBank, List.of(questionDTO))).thenReturn(new QuestionBankDTO());

        QuestionBankDTO dto = this.questionBankMapperFacade.toDTO(questionBank);
        assertNotNull(dto);

        verify(this.questionRepository, times(questionBank.questions.size())).findByIdOptional(any(ObjectId.class));
        verify(this.questionMapperBuilder, times(questionBank.questions.size())).getQuestionDTOMapper(QuestionType.TRUE_FALSE);
        verify(mapper, times(1)).toDTO(trueFalseQuestion);
        verify(this.questionBankMapper, times(1)).toDTO(questionBank, List.of(questionDTO));
    }

    @Test
    @DisplayName("Should handle empty questions list")
    void test03ToDTO_EmptyQuestionsList() {
        QuestionBank entity = new QuestionBank();
        entity.questions = Collections.emptySet();

        when(this.questionBankMapper.toDTO(entity, Collections.emptyList())).thenReturn(new QuestionBankDTO());

        QuestionBankDTO result = this.questionBankMapperFacade.toDTO(entity);

        assertNotNull(result);
        verify(this.questionBankMapper, times(1)).toDTO(entity, Collections.emptyList());
        verifyNoInteractions(this.questionRepository, this.questionMapperBuilder);
    }

    @Test
    @DisplayName("Should return null when DTO is null")
    void test04ToEntity_ReturnNullForNullInput() {
        QuestionBank result = this.questionBankMapperFacade.toEntity(null);
        assertNull(result);
        verifyNoInteractions(this.questionBankMapper);
    }

    @Test
    @DisplayName("Should map DTO with questions correctly")
    void test05ToEntity_FullMapping() {
        QuestionBankDTO dto = new QuestionBankDTO();
        TrueFalseQuestionDTO q1 = new TrueFalseQuestionDTO();
        q1.setId(new ObjectId().toString());
        TrueFalseQuestionDTO q2 = new TrueFalseQuestionDTO();
        q2.setId(new ObjectId().toString());
        dto.setQuestions(List.of(q1, q2));

        when(this.questionBankMapper.toEntity(dto, Set.of(q1.getId(), q2.getId()))).thenReturn(new QuestionBank());

        QuestionBank result = this.questionBankMapperFacade.toEntity(dto);

        assertNotNull(result);
        verify(this.questionBankMapper, times(1)).toEntity(dto, Set.of(q1.getId(), q2.getId()));
    }

    @Test
    @DisplayName("Should handle empty questions list")
    void test06ToEntity_EmptyQuestionsList() {
        QuestionBankDTO dto = new QuestionBankDTO();
        dto.setQuestions(Collections.emptyList());

        when(this.questionBankMapper.toEntity(dto, Collections.emptySet())).thenReturn(new QuestionBank());

        QuestionBank result = this.questionBankMapperFacade.toEntity(dto);

        assertNotNull(result);
        verify(this.questionBankMapper, times(1)).toEntity(dto, Collections.emptySet());
    }
}
