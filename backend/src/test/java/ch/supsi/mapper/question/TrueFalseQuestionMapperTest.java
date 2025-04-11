package ch.supsi.mapper.question;

import ch.supsi.model.api.question.TrueFalseQuestion;
import ch.supsi.model.dto.api.question.TrueFalseQuestionDTO;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

import static org.junit.jupiter.api.Assertions.*;

@QuarkusTest
@TestMethodOrder(MethodOrderer.MethodName.class)
public class TrueFalseQuestionMapperTest {
    private final TrueFalseQuestionMapper trueFalseQuestionMapper = new TrueFalseQuestionMapper();

    @Test
    @DisplayName("Should return null because TrueFalseQuestion passed is null")
    void test01ToDTOReturnNull_TrueFalseQuestionPassedIsNull() {
        TrueFalseQuestionDTO dto = this.trueFalseQuestionMapper.toDTO(null);
        assertNull(dto);
    }

    @Test
    @DisplayName("Should return TrueFalseQuestionDTO passed entity")
    void test02ToDTOReturnTrueFalseQuestionDTOPassedEntity() {
        ObjectId id = new ObjectId();
        String questionText = "test";
        ObjectId questionBankId = new ObjectId();
        Boolean correctAnswer = true;

        TrueFalseQuestion trueFalseQuestion = new TrueFalseQuestion();
        trueFalseQuestion.id = id;
        trueFalseQuestion.questionText = questionText;
        trueFalseQuestion.questionBankId = questionBankId.toString();
        trueFalseQuestion.correctAnswer = correctAnswer;

        TrueFalseQuestionDTO dto = this.trueFalseQuestionMapper.toDTO(trueFalseQuestion);
        assertNotNull(dto);
        assertEquals(id.toString(), dto.getId());
        assertEquals(questionText, dto.getQuestionText());
        assertEquals(questionBankId.toString(), dto.getQuestionBankId());
        assertEquals(correctAnswer, dto.getCorrectAnswer());
    }

    @Test
    @DisplayName("Should return null because TrueFalseQuestionDTO passed is null")
    void test03ToEntityReturnNull_TrueFalseQuestionDTOPassedIsNull() {
        TrueFalseQuestion entity = this.trueFalseQuestionMapper.toEntity(null);
        assertNull(entity);
    }

    @Test
    @DisplayName("Should return TrueFalseQuestion passed DTO")
    void test04ToEntityReturnTrueFalseQuestionPassedDTO() {
        ObjectId id = new ObjectId();
        String questionText = "test";
        ObjectId questionBankId = new ObjectId();
        Boolean correctAnswer = true;

        TrueFalseQuestionDTO trueFalseQuestionDTO = new TrueFalseQuestionDTO();
        trueFalseQuestionDTO.setId(id.toString());
        trueFalseQuestionDTO.setQuestionText(questionText);
        trueFalseQuestionDTO.setQuestionBankId(questionBankId.toString());
        trueFalseQuestionDTO.setCorrectAnswer(correctAnswer);

        TrueFalseQuestion trueFalseQuestion = this.trueFalseQuestionMapper.toEntity(trueFalseQuestionDTO);
        assertNotNull(trueFalseQuestion);
        assertEquals(id, trueFalseQuestion.id);
        assertEquals(questionText, trueFalseQuestion.questionText);
        assertEquals(questionBankId.toString(), trueFalseQuestion.questionBankId);
        assertEquals(correctAnswer, trueFalseQuestion.correctAnswer);
    }

    @Test
    @DisplayName("Should return TrueFalseQuestion passed DTO with id null")
    void test05ToEntityReturnTrueFalseQuestionPassedDTOWithIdNull() {
        String questionText = "test";
        ObjectId questionBankId = new ObjectId();
        Boolean correctAnswer = true;

        TrueFalseQuestionDTO trueFalseQuestionDTO = new TrueFalseQuestionDTO();
        trueFalseQuestionDTO.setId(null);
        trueFalseQuestionDTO.setQuestionText(questionText);
        trueFalseQuestionDTO.setQuestionBankId(questionBankId.toString());
        trueFalseQuestionDTO.setCorrectAnswer(correctAnswer);

        TrueFalseQuestion trueFalseQuestion = this.trueFalseQuestionMapper.toEntity(trueFalseQuestionDTO);
        assertNotNull(trueFalseQuestion);
        assertNull(trueFalseQuestion.id);
        assertEquals(questionText, trueFalseQuestion.questionText);
        assertEquals(questionBankId.toString(), trueFalseQuestion.questionBankId);
        assertEquals(correctAnswer, trueFalseQuestion.correctAnswer);
    }
}
