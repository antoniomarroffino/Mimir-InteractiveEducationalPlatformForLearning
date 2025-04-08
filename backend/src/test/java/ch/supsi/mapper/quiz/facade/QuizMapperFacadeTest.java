package ch.supsi.mapper.quiz.facade;

import ch.supsi.mapper.IBaseMapper;
import ch.supsi.mapper.question.TrueFalseQuestionMapper;
import ch.supsi.mapper.question.builder.IQuestionMapperBuilder;
import ch.supsi.mapper.quiz.QuizMapper;
import ch.supsi.model.api.Quiz;
import ch.supsi.model.api.question.Question;
import ch.supsi.model.api.question.QuestionType;
import ch.supsi.model.api.question.TrueFalseQuestion;
import ch.supsi.model.dto.api.QuizDTO;
import ch.supsi.model.dto.api.question.TrueFalseQuestionDTO;
import ch.supsi.repository.QuestionRepository;
import ch.supsi.service.quiz.QuizServiceTest;
import io.quarkus.test.InjectMock;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;


@QuarkusTest
@TestMethodOrder(MethodOrderer.MethodName.class)
public class QuizMapperFacadeTest {
    @Inject
    QuizMapperFacade quizMapperFacade;

    @InjectMock
    QuizMapper quizMapper;

    @InjectMock
    IQuestionMapperBuilder questionMapperBuilder;

    @InjectMock
    QuestionRepository questionRepository;

    @Test
    @DisplayName("Should return null DTO because entity passed is null")
    void test01ToDTO_ReturnNullDueToQuizIsNull() {
        QuizDTO quizDTO = this.quizMapperFacade.toDTO(null);
        assertNull(quizDTO);
    }

    @Test
    @DisplayName("Should return new QuizDTO passed Quiz entity")
    void test02ToDTO_ReturnQuizEntity() {
        TrueFalseQuestionMapper trueFalseQuestionMapper = mock(TrueFalseQuestionMapper.class);

        TrueFalseQuestion trueFalseQuestion = new TrueFalseQuestion();
        trueFalseQuestion.id = new ObjectId();

        ObjectId nonExistingId = new ObjectId();

        Quiz quiz = QuizServiceTest.createTestQuiz("Test", "");
        quiz.questionsId.add(nonExistingId);
        quiz.questionsId.add(trueFalseQuestion.id);

        when(this.questionRepository.findByIdOptional(trueFalseQuestion.id)).thenReturn(Optional.of(trueFalseQuestion));
        when(this.questionRepository.findByIdOptional(nonExistingId)).thenReturn(Optional.empty());
        when(this.questionMapperBuilder.getQuestionDTOMapper(trueFalseQuestion.type)).thenReturn((IBaseMapper) trueFalseQuestionMapper);
        when(trueFalseQuestionMapper.toDTO(trueFalseQuestion)).thenReturn(new TrueFalseQuestionDTO());
        when(this.quizMapper.toDTO(any(Quiz.class), anyList())).thenReturn(new QuizDTO());

        QuizDTO quizDTO = this.quizMapperFacade.toDTO(quiz);
        assertNotNull(quizDTO);

        verify(this.questionRepository, times(2)).findByIdOptional(any(ObjectId.class));
        verify(this.questionMapperBuilder, times(1)).getQuestionDTOMapper(trueFalseQuestion.type);
        verify(trueFalseQuestionMapper, times(1)).toDTO(trueFalseQuestion);
        verify(this.quizMapper, times(1)).toDTO(any(Quiz.class), anyList());
    }

    @Test
    @DisplayName("Should return QuizDTO with empty questions when no IDs found")
    void test03ToDTO_EmptyQuestionsWhenNoIdsFound() {
        Quiz quiz = new Quiz();
        ObjectId invalidId = new ObjectId();
        quiz.questionsId = Set.of(invalidId);

        when(this.questionRepository.findByIdOptional(invalidId)).thenReturn(Optional.empty());
        when(this.quizMapper.toDTO(quiz, List.of())).thenReturn(new QuizDTO());

        QuizDTO result = this.quizMapperFacade.toDTO(quiz);
        assertNotNull(result);

        verify(this.questionRepository, times(1)).findByIdOptional(invalidId);
        verify(this.quizMapper, times(1)).toDTO(quiz, List.of());
    }

    @Test
    @DisplayName("Should handle empty question IDs in Quiz entity")
    void test04ToDTO_HandleEmptyQuestionIds() {
        Quiz quiz = new Quiz();
        quiz.questionsId = Set.of();

        when(this.quizMapper.toDTO(quiz, List.of())).thenReturn(new QuizDTO());

        QuizDTO result = this.quizMapperFacade.toDTO(quiz);
        assertNotNull(result);
        verify(this.quizMapper, times(1)).toDTO(quiz, List.of());
        verifyNoInteractions(this.questionRepository);
    }

    @Test
    @DisplayName("Should return null Entity because DTO passed is null")
    void test05ToEntity_ReturnNullDueToDTOIsNull() {
        Quiz quiz = this.quizMapperFacade.toEntity(null);
        assertNull(quiz);
    }

    @Test
    @DisplayName("Should return Quiz entity with mapped question IDs from DTO")
    void test06ToEntity_ReturnMappedEntity() {
        QuizDTO quizDTO = new QuizDTO();
        TrueFalseQuestionDTO q1 = new TrueFalseQuestionDTO();
        q1.setId(new ObjectId().toString());
        TrueFalseQuestionDTO q2 = new TrueFalseQuestionDTO();
        q2.setId(new ObjectId().toString());
        quizDTO.setQuestions(List.of(q1, q2));

        when(this.quizMapper.toEntity(quizDTO, Set.of(q1.getId(), q2.getId()))).thenReturn(new Quiz());

        Quiz result = this.quizMapperFacade.toEntity(quizDTO);
        assertNotNull(result);
        verify(this.quizMapper, times(1)).toEntity(quizDTO, Set.of(q1.getId(), q2.getId()));
    }

    @Test
    @DisplayName("Should handle empty question list in DTO")
    void test07ToEntity_HandleEmptyQuestions() {
        QuizDTO quizDTO = new QuizDTO();
        quizDTO.setQuestions(List.of());

        when(this.quizMapper.toEntity(quizDTO, Set.of())).thenReturn(new Quiz());

        Quiz result = this.quizMapperFacade.toEntity(quizDTO);
        assertNotNull(result);
        verify(this.quizMapper).toEntity(quizDTO, Set.of());
    }

}
