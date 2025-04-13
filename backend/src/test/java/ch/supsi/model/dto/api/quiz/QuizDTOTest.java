package ch.supsi.model.dto.api.quiz;

import ch.supsi.model.dto.api.QuizAttemptDTO;
import ch.supsi.model.dto.api.QuizDTO;
import ch.supsi.model.dto.api.question.QuestionDTO;
import ch.supsi.model.dto.api.question.TrueFalseQuestionDTO;
import io.quarkus.test.junit.QuarkusTest;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@QuarkusTest
@TestMethodOrder(MethodOrderer.MethodName.class)
public class QuizDTOTest {
    @Test
    @DisplayName("Should create correctly QuizDTO with constructor no parameters")
    void test01CreateQuizDTO_ConstructorNoParameters() {
        QuizDTO quizDTO = new QuizDTO();
        assertNull(quizDTO.getId());
        assertNull(quizDTO.getName());
        assertNull(quizDTO.getDescription());
        assertNull(quizDTO.getCreatedAt());
        assertNull(quizDTO.getUpdatedAt());
        assertNull(quizDTO.getTimeLimitMinutes());
        assertNotNull(quizDTO.getQuestions());
        assertTrue(quizDTO.getQuestions().isEmpty());
    }

    @Test
    @DisplayName("Should create correctly QuizDTO passing name to constructor")
    void test02CreateQuizDTO_ConstructorPassingNameToConstructor() {
        String name = "test";
        QuizDTO quizDTO = new QuizDTO(name);
        assertNull(quizDTO.getId());
        assertEquals(name, quizDTO.getName());
        assertNull(quizDTO.getDescription());
        assertNull(quizDTO.getCreatedAt());
        assertNull(quizDTO.getUpdatedAt());
        assertNull(quizDTO.getTimeLimitMinutes());
        assertNotNull(quizDTO.getQuestions());
        assertTrue(quizDTO.getQuestions().isEmpty());
    }

    @Test
    @DisplayName("Should all setters work correctly")
    void test03SettersWorkCorrectly() {
        String id = new ObjectId().toString();
        String name = "test";
        String description = "test";
        TrueFalseQuestionDTO trueFalseQuestionDTO = new TrueFalseQuestionDTO();
        List<QuestionDTO> questionDTOList = List.of(trueFalseQuestionDTO);
        LocalDateTime createdAt = LocalDateTime.now();
        LocalDateTime updatedAt = LocalDateTime.now();
        Integer timeLimitMinutes = 1;

        QuizDTO quizDTO = new QuizDTO();
        quizDTO.setId(id);
        quizDTO.setName(name);
        quizDTO.setDescription(description);
        quizDTO.setCreatedAt(createdAt);
        quizDTO.setUpdatedAt(updatedAt);
        quizDTO.setTimeLimitMinutes(timeLimitMinutes);
        quizDTO.setQuestions(questionDTOList);

        assertEquals(id, quizDTO.getId());
        assertEquals(name, quizDTO.getName());
        assertEquals(description, quizDTO.getDescription());
        assertEquals(createdAt, quizDTO.getCreatedAt());
        assertEquals(updatedAt, quizDTO.getUpdatedAt());
        assertEquals(timeLimitMinutes, quizDTO.getTimeLimitMinutes());
        assertEquals(questionDTOList, quizDTO.getQuestions());

        quizDTO.setQuestions(null);
        assertNotNull(quizDTO.getQuestions());
        assertTrue(quizDTO.getQuestions().isEmpty());
    }
}
