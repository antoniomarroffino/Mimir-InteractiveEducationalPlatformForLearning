package ch.supsi.model.dto.api.questionBank;

import ch.supsi.model.dto.api.QuestionBankDTO;
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
public class QuestionBankDTOTest {
    @Test
    @DisplayName("Should create correctly QuestionBankDTO with constructor no parameters")
    void test01CreateQuestionBankDTO_ConstructorNoParameters() {
        QuestionBankDTO questionBankDTO = new QuestionBankDTO();
        assertNull(questionBankDTO.getId());
        assertNull(questionBankDTO.getName());
        assertNull(questionBankDTO.getLastModified());
        assertNotNull(questionBankDTO.getQuestions());
        assertTrue(questionBankDTO.getQuestions().isEmpty());
    }

    @Test
    @DisplayName("Should create correctly QuestionBankDTO passing name to constructor")
    void test02CreateQuestionBankDTO_ConstructorNameParameter() {
        String name = "name";
        QuestionBankDTO questionBankDTO = new QuestionBankDTO(name);
        assertNull(questionBankDTO.getId());
        assertEquals(name, questionBankDTO.getName());
        assertNull(questionBankDTO.getLastModified());
        assertNotNull(questionBankDTO.getQuestions());
        assertTrue(questionBankDTO.getQuestions().isEmpty());
    }

    @Test
    @DisplayName("Should all setters work correctly")
    void test03SettersWorkCorrectly() {
        String id = new ObjectId().toString();
        String name = "name";
        LocalDateTime lastModified = LocalDateTime.now();
        TrueFalseQuestionDTO trueFalseQuestionDTO = new TrueFalseQuestionDTO();
        List<QuestionDTO> questionDTOList = List.of(trueFalseQuestionDTO);

        QuestionBankDTO questionBankDTO = new QuestionBankDTO();
        questionBankDTO.setId(id);
        questionBankDTO.setName(name);
        questionBankDTO.setLastModified(lastModified);
        questionBankDTO.setQuestions(questionDTOList);

        assertEquals(id, questionBankDTO.getId());
        assertEquals(name, questionBankDTO.getName());
        assertEquals(lastModified, questionBankDTO.getLastModified());
        assertEquals(questionDTOList, questionBankDTO.getQuestions());

        questionBankDTO.setQuestions(null);
        assertNotNull(questionBankDTO.getQuestions());
        assertTrue(questionBankDTO.getQuestions().isEmpty());
    }
}
