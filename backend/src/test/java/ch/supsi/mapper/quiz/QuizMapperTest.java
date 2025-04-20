package ch.supsi.mapper.quiz;

import ch.supsi.model.api.Quiz;
import ch.supsi.model.dto.api.QuizDTO;
import ch.supsi.model.dto.api.question.MultipleChoiceQuestionDTO;
import ch.supsi.model.dto.api.question.QuestionDTO;
import ch.supsi.model.dto.api.question.TrueFalseQuestionDTO;
import ch.supsi.service.quiz.QuizServiceTest;
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
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

@QuarkusTest
@TestMethodOrder(MethodOrderer.MethodName.class)
public class QuizMapperTest {
    @Inject
    QuizMapper quizMapper;

    @Test
    @DisplayName("Should return new QuizDTO given QuizEntity and List of QuestionDTO")
    void test01ToDTO_ReturnQuizDTO() {
        Quiz quiz = QuizServiceTest.createTestQuiz("Test", "Test");
        quiz.updatedAt = LocalDateTime.now();

        TrueFalseQuestionDTO trueFalseQuestionDTO = new TrueFalseQuestionDTO();
        MultipleChoiceQuestionDTO multipleChoiceQuestionDTO = new MultipleChoiceQuestionDTO();

        List<QuestionDTO> questionDTOList = new ArrayList<>();
        questionDTOList.add(trueFalseQuestionDTO);
        questionDTOList.add(multipleChoiceQuestionDTO);

        QuizDTO quizDTO = this.quizMapper.toDTO(quiz, questionDTOList);

        assertNotNull(quizDTO);
        assertEquals(quiz.id.toString(), quizDTO.getId());
        assertEquals(quiz.name, quizDTO.getName());
        assertEquals(quiz.description, quizDTO.getDescription());
        assertEquals(quiz.updatedAt, quizDTO.getUpdatedAt());
        assertEquals(questionDTOList.size(), quizDTO.getQuestions().size());
    }

    @Test
    @DisplayName("Should return new Quiz given QuizDTO and List of Question, and QuizDTO id is null")
    void test02ToEntity_ReturnQuizWithIdDifferentFromQuizDTO() {
        QuizDTO quizDTO = new QuizDTO();
        quizDTO.setId(null);
        quizDTO.setName("Test");
        quizDTO.setDescription("Test");
        quizDTO.setUpdatedAt(LocalDateTime.now());
        quizDTO.setCreatedAt(LocalDateTime.now());

        String questionId1 = new ObjectId().toString();
        String questionId2 = new ObjectId().toString();
        List<String> questionIdList = List.of(questionId1, questionId2);


        Quiz quiz = this.quizMapper.toEntity(quizDTO, questionIdList);
        assertNotNull(quiz);
        assertNotNull(quiz.id);
        assertEquals(quiz.name, quizDTO.getName());
        assertEquals(quiz.description, quizDTO.getDescription());
        assertEquals(quiz.updatedAt, quizDTO.getUpdatedAt());
        assertEquals(quiz.createdAt, quizDTO.getCreatedAt());
        assertEquals(questionIdList.size(), quiz.questionsId.size());
        quiz.questionsId.forEach(qId -> assertInstanceOf(ObjectId.class, qId));
    }

    @Test
    @DisplayName("Should return new Quiz given QuizDTO and List of Question, and QuizDTO id is not null")
    void test03ToEntity_ReturnQuizWithIdEqualFromQuizDTO() {
        QuizDTO quizDTO = new QuizDTO();
        quizDTO.setId(new ObjectId().toString());
        quizDTO.setName("Test");
        quizDTO.setDescription("Test");
        quizDTO.setUpdatedAt(null);
        quizDTO.setCreatedAt(null);

        String questionId1 = new ObjectId().toString();
        String questionId2 = new ObjectId().toString();
        List<String> questionIdList = List.of(questionId1, questionId2);


        Quiz quiz = this.quizMapper.toEntity(quizDTO, questionIdList);
        assertNotNull(quiz);
        assertEquals(quiz.id.toString(), quizDTO.getId());
        assertEquals(quiz.name, quizDTO.getName());
        assertEquals(quiz.description, quizDTO.getDescription());
        assertNotNull(quiz.updatedAt);
        assertNotNull(quiz.createdAt);
        assertEquals(questionIdList.size(), quiz.questionsId.size());
        quiz.questionsId.forEach(qId -> assertInstanceOf(ObjectId.class, qId));
    }
}
