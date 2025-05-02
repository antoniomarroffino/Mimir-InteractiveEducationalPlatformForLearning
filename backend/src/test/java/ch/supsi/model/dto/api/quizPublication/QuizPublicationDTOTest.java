package ch.supsi.model.dto.api.quizPublication;

import ch.supsi.model.dto.api.QuizPublicationDTO;
import ch.supsi.model.dto.api.question.MultipleChoiceQuestionDTO;
import ch.supsi.model.dto.api.question.QuestionDTO;
import ch.supsi.model.dto.api.question.TrueFalseQuestionDTO;
import io.quarkus.test.junit.QuarkusTest;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@QuarkusTest
@TestMethodOrder(MethodOrderer.MethodName.class)
public class QuizPublicationDTOTest {
    @Test
    @DisplayName("Should create QuizPublicationDTO with constructor no parameters")
    void test01CreateQuizPublicationDTO_ConstructorWithNoParameters() {
        QuizPublicationDTO quizPublicationDTO = new QuizPublicationDTO();
        assertNull(quizPublicationDTO.getId());
        assertNull(quizPublicationDTO.getCourseId());
        assertNull(quizPublicationDTO.getFolderId());
        assertNull(quizPublicationDTO.getQuizId());
        assertNull(quizPublicationDTO.getQuestions());
        assertNull(quizPublicationDTO.getPublicationCode());
        assertNull(quizPublicationDTO.getClosedAt());
        assertFalse(quizPublicationDTO.getPublished());
        assertTrue(quizPublicationDTO.getAnonymous());
        assertNotNull(quizPublicationDTO.getCreatedAt());
    }

    @Test
    @DisplayName("Should create QuizPublicationDTO passing parameters to constructor")
    void test02CreateQuizPublicationDTO_ConstructorWithParameters() {
        String id = new ObjectId().toString();
        String courseId = new ObjectId().toString();
        String folderId = new ObjectId().toString();
        String quizId = new ObjectId().toString();
        String publicationCode = new ObjectId().toString();

        TrueFalseQuestionDTO testQuestionDTO = new TrueFalseQuestionDTO();
        MultipleChoiceQuestionDTO testMultipleChoiceQuestionDTO = new MultipleChoiceQuestionDTO();
        List<QuestionDTO> questionDTOList = List.of(testQuestionDTO, testMultipleChoiceQuestionDTO);

        QuizPublicationDTO quizPublicationDTO = new QuizPublicationDTO(id, courseId, folderId, quizId, questionDTOList, publicationCode);
        assertEquals(id, quizPublicationDTO.getId());
        assertEquals(courseId, quizPublicationDTO.getCourseId());
        assertEquals(folderId, quizPublicationDTO.getFolderId());
        assertEquals(quizId, quizPublicationDTO.getQuizId());
        assertEquals(publicationCode, quizPublicationDTO.getPublicationCode());
        assertEquals(questionDTOList.size(), quizPublicationDTO.getQuestions().size());
        assertEquals(testQuestionDTO.getType(), quizPublicationDTO.getQuestions().getFirst().getType());
        assertEquals(testMultipleChoiceQuestionDTO.getType(), quizPublicationDTO.getQuestions().get(1).getType());
        assertNull(quizPublicationDTO.getClosedAt());
        assertFalse(quizPublicationDTO.getPublished());
        assertTrue(quizPublicationDTO.getAnonymous());
        assertNotNull(quizPublicationDTO.getCreatedAt());
    }
}
