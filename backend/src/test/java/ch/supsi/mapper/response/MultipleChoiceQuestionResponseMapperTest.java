package ch.supsi.mapper.response;

import ch.supsi.mapper.question.MultipleChoiceQuestionMapper;
import ch.supsi.model.api.question.MultipleChoiceQuestion;
import ch.supsi.model.api.response.MultipleChoiceQuestionResponse;
import ch.supsi.model.dto.api.question.MultipleChoiceQuestionDTO;
import ch.supsi.model.dto.api.response.MultipleChoiceQuestionResponseDTO;
import io.quarkus.test.junit.QuarkusTest;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.assertEquals;

@QuarkusTest
@TestMethodOrder(MethodOrderer.MethodName.class)
public class MultipleChoiceQuestionResponseMapperTest {
    private final MultipleChoiceQuestionResponseMapper multipleChoiceQuestionResponseMapper = new MultipleChoiceQuestionResponseMapper();

    @Test
    @DisplayName("Should return null because MultipleChoiceQuestionResponse passed is null")
    void test01ToDTOReturnNull_MultipleChoiceQuestionResponsePassedIsNull() {
        MultipleChoiceQuestionResponseDTO dto = this.multipleChoiceQuestionResponseMapper.toDTO(null);
        assertNull(dto);
    }

    @Test
    @DisplayName("Should return MultipleChoiceQuestionResponseDTO passed entity")
    void test02ToDTOReturnMultipleChoiceQuestionResponseDTOPassedEntity() {
        ObjectId id = new ObjectId();
        ObjectId questionId = new ObjectId();
        int timeSpent = 5;
        Integer selectAnswerIndex = 1;
        List<Integer> selectAnswersIndexes = List.of(selectAnswerIndex);

        MultipleChoiceQuestionResponse multipleChoiceQuestionResponse = new MultipleChoiceQuestionResponse();
        multipleChoiceQuestionResponse.id = id;
        multipleChoiceQuestionResponse.questionId = questionId;
        multipleChoiceQuestionResponse.timeSpent = timeSpent;
        multipleChoiceQuestionResponse.selectedAnswerIndexes = selectAnswersIndexes;


        MultipleChoiceQuestionResponseDTO dto = this.multipleChoiceQuestionResponseMapper.toDTO(multipleChoiceQuestionResponse);
        assertNotNull(dto);
        assertEquals(id.toString(), dto.getId());
        assertEquals(questionId.toString(), dto.getQuestionId());
        assertEquals(timeSpent, dto.getTimeSpent());
        assertEquals(selectAnswersIndexes, dto.getSelectedAnswerIndexes());
    }

    @Test
    @DisplayName("Should return null because MultipleChoiceQuestionResponseDTO passed is null")
    void test03ToEntityReturnNull_MultipleChoiceQuestionResponseDTOPassedIsNull() {
        MultipleChoiceQuestionResponse entity = this.multipleChoiceQuestionResponseMapper.toEntity(null);
        assertNull(entity);
    }

    @Test
    @DisplayName("Should return MultipleChoiceQuestionResponse passed DTO")
    void test04ToEntityReturnMultipleChoiceQuestionResponsePassedDTO() {
        ObjectId id = new ObjectId();
        ObjectId questionId = new ObjectId();
        int timeSpent = 5;
        Integer selectAnswerIndex = 1;
        List<Integer> selectAnswersIndexes = List.of(selectAnswerIndex);

        MultipleChoiceQuestionResponseDTO multipleChoiceQuestionResponseDTO = new MultipleChoiceQuestionResponseDTO();
        multipleChoiceQuestionResponseDTO.setId(id.toString());
        multipleChoiceQuestionResponseDTO.setQuestionId(questionId.toString());
        multipleChoiceQuestionResponseDTO.setTimeSpent(timeSpent);
        multipleChoiceQuestionResponseDTO.setSelectedAnswerIndexes(selectAnswersIndexes);

        MultipleChoiceQuestionResponse multipleChoiceQuestionResponse = this.multipleChoiceQuestionResponseMapper.toEntity(multipleChoiceQuestionResponseDTO);
        assertNotNull(multipleChoiceQuestionResponse);
        assertEquals(id, multipleChoiceQuestionResponse.id);
        assertEquals(questionId, multipleChoiceQuestionResponse.questionId);
        assertEquals(timeSpent, multipleChoiceQuestionResponse.timeSpent);
        assertEquals(selectAnswersIndexes, multipleChoiceQuestionResponse.selectedAnswerIndexes);
    }

    @Test
    @DisplayName("Should return MultipleChoiceQuestionResponse passed DTO with id null")
    void test05ToEntityReturnMultipleChoiceQuestionResponsePassedDTOWithIdNull() {
        ObjectId questionId = new ObjectId();
        int timeSpent = 5;
        Integer selectAnswerIndex = 1;
        List<Integer> selectAnswersIndexes = List.of(selectAnswerIndex);

        MultipleChoiceQuestionResponseDTO multipleChoiceQuestionResponseDTO = new MultipleChoiceQuestionResponseDTO();
        multipleChoiceQuestionResponseDTO.setId(null);
        multipleChoiceQuestionResponseDTO.setQuestionId(questionId.toString());
        multipleChoiceQuestionResponseDTO.setTimeSpent(timeSpent);
        multipleChoiceQuestionResponseDTO.setSelectedAnswerIndexes(selectAnswersIndexes);

        MultipleChoiceQuestionResponse multipleChoiceQuestionResponse = this.multipleChoiceQuestionResponseMapper.toEntity(multipleChoiceQuestionResponseDTO);
        assertNotNull(multipleChoiceQuestionResponse);
        assertNotNull(multipleChoiceQuestionResponse.id);
        assertEquals(questionId, multipleChoiceQuestionResponse.questionId);
        assertEquals(timeSpent, multipleChoiceQuestionResponse.timeSpent);
        assertEquals(selectAnswersIndexes, multipleChoiceQuestionResponse.selectedAnswerIndexes);
    }
}
