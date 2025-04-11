package ch.supsi.mapper.question;

import ch.supsi.model.api.question.MultipleChoiceQuestion;
import ch.supsi.model.api.question.TrueFalseQuestion;
import ch.supsi.model.dto.api.question.MultipleChoiceQuestionDTO;
import ch.supsi.model.dto.api.question.TrueFalseQuestionDTO;
import io.quarkus.test.junit.QuarkusTest;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.assertEquals;

@QuarkusTest
@TestMethodOrder(MethodOrderer.MethodName.class)
public class MultipleChoiceQuestionMapperTest {
    private final MultipleChoiceQuestionMapper multipleChoiceQuestionMapper = new MultipleChoiceQuestionMapper();

    @Test
    @DisplayName("Should return null because MultipleChoiceQuestion passed is null")
    void test01ToDTOReturnNull_MultipleChoiceQuestionPassedIsNull() {
        MultipleChoiceQuestionDTO dto = this.multipleChoiceQuestionMapper.toDTO(null);
        assertNull(dto);
    }

    @Test
    @DisplayName("Should return MultipleChoiceQuestionDTO passed entity")
    void test02ToDTOReturnMultipleChoiceQuestionDTOPassedEntity() {
        ObjectId id = new ObjectId();
        String questionText = "test";
        ObjectId questionBankId = new ObjectId();
        String choice1 = "choice1";
        String choice2 = "choice2";
        List<String> choices = List.of(choice1, choice2);
        Integer correctAnswerIndex = 1;
        List<Integer> correctAnswersIndexes = List.of(correctAnswerIndex);

        MultipleChoiceQuestion multipleChoiceQuestion = new MultipleChoiceQuestion();
        multipleChoiceQuestion.id = id;
        multipleChoiceQuestion.questionText = questionText;
        multipleChoiceQuestion.questionBankId = questionBankId.toString();
        multipleChoiceQuestion.choices = choices;
        multipleChoiceQuestion.correctAnswerIndexes = correctAnswersIndexes;


        MultipleChoiceQuestionDTO dto = this.multipleChoiceQuestionMapper.toDTO(multipleChoiceQuestion);
        assertNotNull(dto);
        assertEquals(id.toString(), dto.getId());
        assertEquals(questionText, dto.getQuestionText());
        assertEquals(questionBankId.toString(), dto.getQuestionBankId());
        assertEquals(choices, dto.getChoices());
        assertEquals(correctAnswersIndexes, dto.getCorrectAnswerIndexes());
    }

    @Test
    @DisplayName("Should return null because MultipleChoiceQuestionDTO passed is null")
    void test03ToEntityReturnNull_MultipleChoiceQuestionDTOPassedIsNull() {
        MultipleChoiceQuestion entity = this.multipleChoiceQuestionMapper.toEntity(null);
        assertNull(entity);
    }

    @Test
    @DisplayName("Should return MultipleChoiceQuestion passed DTO")
    void test04ToEntityReturnMultipleChoiceQuestionPassedDTO() {
        ObjectId id = new ObjectId();
        String questionText = "test";
        ObjectId questionBankId = new ObjectId();
        String choice1 = "choice1";
        String choice2 = "choice2";
        List<String> choices = List.of(choice1, choice2);
        Integer correctAnswerIndex = 1;
        List<Integer> correctAnswersIndexes = List.of(correctAnswerIndex);

        MultipleChoiceQuestionDTO multipleChoiceQuestionDTO = new MultipleChoiceQuestionDTO();
        multipleChoiceQuestionDTO.setId(id.toString());
        multipleChoiceQuestionDTO.setQuestionText(questionText);
        multipleChoiceQuestionDTO.setQuestionBankId(questionBankId.toString());
        multipleChoiceQuestionDTO.setChoices(choices);
        multipleChoiceQuestionDTO.setCorrectAnswerIndexes(correctAnswersIndexes);

        MultipleChoiceQuestion multipleChoiceQuestion = this.multipleChoiceQuestionMapper.toEntity(multipleChoiceQuestionDTO);
        assertNotNull(multipleChoiceQuestion);
        assertEquals(id, multipleChoiceQuestion.id);
        assertEquals(questionText, multipleChoiceQuestion.questionText);
        assertEquals(questionBankId.toString(), multipleChoiceQuestion.questionBankId);
        assertEquals(choices, multipleChoiceQuestion.choices);
        assertEquals(correctAnswersIndexes, multipleChoiceQuestion.correctAnswerIndexes);
    }

    @Test
    @DisplayName("Should return MultipleChoiceQuestion passed DTO with id null")
    void test05ToEntityReturnMultipleChoiceQuestionPassedDTOWithIdNull() {
        String questionText = "test";
        ObjectId questionBankId = new ObjectId();
        String choice1 = "choice1";
        String choice2 = "choice2";
        List<String> choices = List.of(choice1, choice2);
        Integer correctAnswerIndex = 1;
        List<Integer> correctAnswersIndexes = List.of(correctAnswerIndex);

        MultipleChoiceQuestionDTO multipleChoiceQuestionDTO = new MultipleChoiceQuestionDTO();
        multipleChoiceQuestionDTO.setId(null);
        multipleChoiceQuestionDTO.setQuestionText(questionText);
        multipleChoiceQuestionDTO.setQuestionBankId(questionBankId.toString());
        multipleChoiceQuestionDTO.setChoices(choices);
        multipleChoiceQuestionDTO.setCorrectAnswerIndexes(correctAnswersIndexes);

        MultipleChoiceQuestion multipleChoiceQuestion = this.multipleChoiceQuestionMapper.toEntity(multipleChoiceQuestionDTO);
        assertNotNull(multipleChoiceQuestion);
        assertNull(multipleChoiceQuestion.id);
        assertEquals(questionText, multipleChoiceQuestion.questionText);
        assertEquals(questionBankId.toString(), multipleChoiceQuestion.questionBankId);
        assertEquals(choices, multipleChoiceQuestion.choices);
        assertEquals(correctAnswersIndexes, multipleChoiceQuestion.correctAnswerIndexes);
    }
}
