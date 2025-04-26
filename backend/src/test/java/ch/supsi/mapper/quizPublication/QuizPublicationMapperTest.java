package ch.supsi.mapper.quizPublication;

import ch.supsi.model.api.QuizPublication;
import ch.supsi.model.api.question.MultipleChoiceQuestion;
import ch.supsi.model.api.question.Question;
import ch.supsi.model.api.question.TrueFalseQuestion;
import ch.supsi.model.dto.api.QuizPublicationDTO;
import ch.supsi.model.dto.api.question.MultipleChoiceQuestionDTO;
import ch.supsi.model.dto.api.question.QuestionDTO;
import ch.supsi.model.dto.api.question.TrueFalseQuestionDTO;
import ch.supsi.service.quizpublication.QuizPublicationServiceTest;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@QuarkusTest
@TestMethodOrder(MethodOrderer.MethodName.class)
public class QuizPublicationMapperTest {
    @Inject
    QuizPublicationMapper quizPublicationMapper;

    @Test
    @DisplayName("Should return new QuizPublicationDTO given QuizPublicationEntity and List of QuestionDTO")
    void test01ToDTO_ReturnQuizPublicationDTO() {
        QuizPublication quizPublication = QuizPublicationServiceTest.createTestQuizPublication();
        quizPublication.publicationCode = "TEST-CODE";
        quizPublication.anonymous = true;
        quizPublication.published = true;
        quizPublication.createdAt = LocalDateTime.now();
        quizPublication.closedAt = LocalDateTime.now();

        TrueFalseQuestionDTO trueFalseQuestionDTO = new TrueFalseQuestionDTO();
        MultipleChoiceQuestionDTO multipleChoiceQuestionDTO = new MultipleChoiceQuestionDTO();

        List<QuestionDTO> questionDTOList = new ArrayList<>();
        questionDTOList.add(trueFalseQuestionDTO);
        questionDTOList.add(multipleChoiceQuestionDTO);

        QuizPublicationDTO quizPublicationDTO = this.quizPublicationMapper.toDTO(quizPublication, questionDTOList);

        assertNotNull(quizPublicationDTO);
        assertEquals(quizPublication.id.toString(), quizPublicationDTO.getId());
        assertEquals(quizPublication.courseId.toString(), quizPublicationDTO.getCourseId());
        assertEquals(quizPublication.folderId.toString(), quizPublicationDTO.getFolderId());
        assertEquals(quizPublication.quizId.toString(), quizPublicationDTO.getQuizId());
        assertEquals(quizPublication.publicationCode, quizPublicationDTO.getPublicationCode());
        assertTrue(quizPublicationDTO.getPublished());
        assertTrue(quizPublicationDTO.getAnonymous());
        assertEquals(quizPublication.createdAt, quizPublicationDTO.getCreatedAt());
        assertEquals(quizPublication.closedAt, quizPublicationDTO.getClosedAt());
        assertEquals(questionDTOList.size(), quizPublicationDTO.getQuestions().size());
    }

    @Test
    @DisplayName("Should return new QuizPublication given QuizPublicationDTO and List of Question, and QuizPublicationDTO id is null")
    void test02ToEntity_ReturnQuizPublicationWithIdDifferentFromQuizPublicationDTO() {
        QuizPublicationDTO quizPublicationDTO = new QuizPublicationDTO();
        quizPublicationDTO.setId(null);
        quizPublicationDTO.setCourseId(new ObjectId().toString());
        quizPublicationDTO.setFolderId(new ObjectId().toString());
        quizPublicationDTO.setQuizId(new ObjectId().toString());
        quizPublicationDTO.setPublicationCode("TEST-CODE");
        quizPublicationDTO.setPublished(true);
        quizPublicationDTO.setAnonymous(false);
        quizPublicationDTO.setCreatedAt(LocalDateTime.now());
        quizPublicationDTO.setClosedAt(LocalDateTime.now());


        TrueFalseQuestion trueFalseQuestion = new TrueFalseQuestion();
        MultipleChoiceQuestion multipleChoiceQuestion = new MultipleChoiceQuestion();
        List<Question> questionList = List.of(trueFalseQuestion, multipleChoiceQuestion);

        QuizPublication quizPublication = this.quizPublicationMapper.toEntity(quizPublicationDTO, questionList);

        assertNotNull(quizPublication);
        assertNull(quizPublication.id);
        assertEquals(quizPublicationDTO.getCourseId(), quizPublication.courseId.toString());
        assertEquals(quizPublicationDTO.getFolderId(), quizPublication.folderId.toString());
        assertEquals(quizPublicationDTO.getQuizId(), quizPublication.quizId.toString());
        assertEquals(quizPublicationDTO.getPublicationCode(), quizPublication.publicationCode);
        assertTrue(quizPublicationDTO.getPublished());
        assertFalse(quizPublicationDTO.getAnonymous());
        assertEquals(quizPublication.createdAt, quizPublicationDTO.getCreatedAt());
        assertEquals(quizPublication.closedAt, quizPublicationDTO.getClosedAt());
        assertEquals(questionList.size(), quizPublication.questions.size());
    }

    @Test
    @DisplayName("Should return new QuizPublication given QuizPublicationDTO and List of Question, and QuizPublicationDTO id is not null")
    void test03ToEntity_ReturnQuizPublicationWithIdEqualFromQuizPublicationDTO() {
        QuizPublicationDTO quizPublicationDTO = new QuizPublicationDTO();
        quizPublicationDTO.setId(new ObjectId().toString());
        quizPublicationDTO.setCourseId(new ObjectId().toString());
        quizPublicationDTO.setFolderId(new ObjectId().toString());
        quizPublicationDTO.setQuizId(new ObjectId().toString());
        quizPublicationDTO.setPublicationCode("TEST-CODE");
        quizPublicationDTO.setPublished(false);
        quizPublicationDTO.setAnonymous(true);
        quizPublicationDTO.setCreatedAt(LocalDateTime.now());
        quizPublicationDTO.setClosedAt(LocalDateTime.now());


        TrueFalseQuestion trueFalseQuestion = new TrueFalseQuestion();
        MultipleChoiceQuestion multipleChoiceQuestion = new MultipleChoiceQuestion();
        List<Question> questionList = List.of(trueFalseQuestion, multipleChoiceQuestion);

        QuizPublication quizPublication = this.quizPublicationMapper.toEntity(quizPublicationDTO, questionList);

        assertNotNull(quizPublication);
        assertEquals(quizPublicationDTO.getId(), quizPublication.id.toString());
        assertEquals(quizPublicationDTO.getCourseId(), quizPublication.courseId.toString());
        assertEquals(quizPublicationDTO.getFolderId(), quizPublication.folderId.toString());
        assertEquals(quizPublicationDTO.getQuizId(), quizPublication.quizId.toString());
        assertEquals(quizPublicationDTO.getPublicationCode(), quizPublication.publicationCode);
        assertFalse(quizPublicationDTO.getPublished());
        assertTrue(quizPublicationDTO.getAnonymous());
        assertEquals(quizPublication.createdAt, quizPublicationDTO.getCreatedAt());
        assertEquals(quizPublication.closedAt, quizPublicationDTO.getClosedAt());
        assertEquals(questionList.size(), quizPublication.questions.size());
    }
}
