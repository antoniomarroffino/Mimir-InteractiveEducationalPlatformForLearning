package ch.supsi.mapper.response;

import ch.supsi.mapper.question.TrueFalseQuestionMapper;
import ch.supsi.model.api.question.TrueFalseQuestion;
import ch.supsi.model.api.response.TrueFalseQuestionResponse;
import ch.supsi.model.dto.api.question.TrueFalseQuestionDTO;
import ch.supsi.model.dto.api.response.TrueFalseQuestionResponseDTO;
import io.quarkus.test.junit.QuarkusTest;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

import static org.junit.jupiter.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.assertEquals;

@QuarkusTest
@TestMethodOrder(MethodOrderer.MethodName.class)
public class TrueFalseQuestionResponseMapperTest {
    private final TrueFalseQuestionResponseMapper trueFalseQuestionResponseMapper = new TrueFalseQuestionResponseMapper();

    @Test
    @DisplayName("Should return null because TrueFalseQuestionResponse passed is null")
    void test01ToDTOReturnNull_TrueFalseQuestionResponsePassedIsNull() {
        TrueFalseQuestionResponseDTO dto = this.trueFalseQuestionResponseMapper.toDTO(null);
        assertNull(dto);
    }

    @Test
    @DisplayName("Should return TrueFalseQuestionResponseDTO passed entity")
    void test02ToDTOReturnTrueFalseQuestionResponseDTOPassedEntity() {
        ObjectId id = new ObjectId();
        ObjectId questionId = new ObjectId();
        int timeSpent = 5;
        boolean selectedAnswer = true;

        TrueFalseQuestionResponse trueFalseQuestionResponse = new TrueFalseQuestionResponse();
        trueFalseQuestionResponse.id = id;
        trueFalseQuestionResponse.questionId = questionId;
        trueFalseQuestionResponse.timeSpent = timeSpent;
        trueFalseQuestionResponse.selectedAnswer = selectedAnswer;

        TrueFalseQuestionResponseDTO dto = this.trueFalseQuestionResponseMapper.toDTO(trueFalseQuestionResponse);
        assertNotNull(dto);
        assertEquals(id.toString(), dto.getId());
        assertEquals(questionId.toString(), dto.getQuestionId());
        assertEquals(timeSpent, dto.getTimeSpent());
        assertEquals(selectedAnswer, dto.getSelectedAnswer());
    }

    @Test
    @DisplayName("Should return null because TrueFalseQuestionResponseDTO passed is null")
    void test03ToEntityReturnNull_TrueFalseQuestionResponseDTOPassedIsNull() {
        TrueFalseQuestionResponse entity = this.trueFalseQuestionResponseMapper.toEntity(null);
        assertNull(entity);
    }

    @Test
    @DisplayName("Should return TrueFalseQuestionResponse passed DTO")
    void test04ToEntityReturnTrueFalseQuestionResponsePassedDTO() {
        ObjectId id = new ObjectId();
        ObjectId questionId = new ObjectId();
        int timeSpent = 5;
        boolean selectedAnswer = true;

        TrueFalseQuestionResponseDTO trueFalseQuestionResponseDTO = new TrueFalseQuestionResponseDTO();
        trueFalseQuestionResponseDTO.setId(id.toString());
        trueFalseQuestionResponseDTO.setQuestionId(questionId.toString());
        trueFalseQuestionResponseDTO.setTimeSpent(timeSpent);
        trueFalseQuestionResponseDTO.setSelectedAnswer(selectedAnswer);

        TrueFalseQuestionResponse trueFalseQuestionResponse = this.trueFalseQuestionResponseMapper.toEntity(trueFalseQuestionResponseDTO);
        assertNotNull(trueFalseQuestionResponse);
        assertEquals(id, trueFalseQuestionResponse.id);
        assertEquals(questionId, trueFalseQuestionResponse.questionId);
        assertEquals(timeSpent, trueFalseQuestionResponse.timeSpent);
        assertEquals(selectedAnswer, trueFalseQuestionResponse.selectedAnswer);
    }

    @Test
    @DisplayName("Should return TrueFalseQuestionResponse passed DTO with id null")
    void test05ToEntityReturnTrueFalseQuestionResponsePassedDTOWithIdNull() {
        ObjectId questionId = new ObjectId();
        int timeSpent = 5;
        boolean selectedAnswer = true;

        TrueFalseQuestionResponseDTO trueFalseQuestionResponseDTO = new TrueFalseQuestionResponseDTO();
        trueFalseQuestionResponseDTO.setId(null);
        trueFalseQuestionResponseDTO.setQuestionId(questionId.toString());
        trueFalseQuestionResponseDTO.setTimeSpent(timeSpent);
        trueFalseQuestionResponseDTO.setSelectedAnswer(selectedAnswer);

        TrueFalseQuestionResponse trueFalseQuestionResponse = this.trueFalseQuestionResponseMapper.toEntity(trueFalseQuestionResponseDTO);
        assertNotNull(trueFalseQuestionResponse);
        assertNotNull(trueFalseQuestionResponse.id);
        assertEquals(questionId, trueFalseQuestionResponse.questionId);
        assertEquals(timeSpent, trueFalseQuestionResponse.timeSpent);
        assertEquals(selectedAnswer, trueFalseQuestionResponse.selectedAnswer);
    }
}
