package ch.supsi.mapper.questionBank;

import ch.supsi.model.api.QuestionBank;
import ch.supsi.model.api.question.MultipleChoiceQuestion;
import ch.supsi.model.api.question.Question;
import ch.supsi.model.api.question.TrueFalseQuestion;
import ch.supsi.model.dto.api.QuestionBankDTO;
import ch.supsi.model.dto.api.question.MultipleChoiceQuestionDTO;
import ch.supsi.model.dto.api.question.QuestionDTO;
import ch.supsi.model.dto.api.question.TrueFalseQuestionDTO;
import ch.supsi.service.questionBank.QuestionBankServiceTest;
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
public class QuestionBankMapperTest {
    @Inject
    QuestionBankMapper questionBankMapper;

    @Test
    @DisplayName("Should return new QuestionBankDTO given QuestionBankEntity and List of QuestionDTO")
    void test01ToDTO_ReturnQuestionBankDTO() {
        QuestionBank questionBank = QuestionBankServiceTest.createTestQuestionBank("Test");
        questionBank.id = new ObjectId();
        questionBank.lastModified = LocalDateTime.now();

        TrueFalseQuestionDTO trueFalseQuestionDTO = new TrueFalseQuestionDTO();
        MultipleChoiceQuestionDTO multipleChoiceQuestionDTO = new MultipleChoiceQuestionDTO();

        List<QuestionDTO> questionDTOList = new ArrayList<>();
        questionDTOList.add(trueFalseQuestionDTO);
        questionDTOList.add(multipleChoiceQuestionDTO);

        QuestionBankDTO questionBankDTO = this.questionBankMapper.toDTO(questionBank, questionDTOList);

        assertNotNull(questionBankDTO);
        assertEquals(questionBank.id.toString(), questionBankDTO.getId());
        assertEquals(questionBank.name, questionBankDTO.getName());
        assertEquals(questionBank.lastModified, questionBankDTO.getLastModified());
        assertEquals(questionDTOList.size(), questionBankDTO.getQuestions().size());
    }

    @Test
    @DisplayName("Should return new QuestionBank given QuestionBankDTO and List of Question, and QuestionBankDTO id is null")
    void test02ToEntity_ReturnQuestionBankWithIdDifferentFromQuestionBankDTO() {
        QuestionBankDTO questionBankDTO = new QuestionBankDTO();
        questionBankDTO.setId(null);
        questionBankDTO.setLastModified(LocalDateTime.now());
        questionBankDTO.setName("Test");

        Set<String> questionList = Set.of(new ObjectId().toString(), new ObjectId().toString());

        QuestionBank questionBank = this.questionBankMapper.toEntity(questionBankDTO, questionList);
        assertNotNull(questionBank);
        assertNull(questionBank.id);
        assertEquals(questionBankDTO.getName(), questionBank.name);
        assertEquals(questionBankDTO.getLastModified(), questionBank.lastModified);
        assertEquals(questionList.size(), questionBank.questions.size());
    }

    @Test
    @DisplayName("Should return new questionBank given questionBankDTO and List of Question, and questionBankDTO id is not null")
    void test03ToEntity_ReturnQuestionBankWithIdEqualFromQuestionBankDTO() {
        QuestionBankDTO questionBankDTO = new QuestionBankDTO();
        questionBankDTO.setId(new ObjectId().toString());
        questionBankDTO.setLastModified(LocalDateTime.now());
        questionBankDTO.setName("Test");

        Set<String> questionList = Set.of(new ObjectId().toString(), new ObjectId().toString());

        QuestionBank questionBank = this.questionBankMapper.toEntity(questionBankDTO, questionList);
        assertNotNull(questionBank);
        assertEquals(questionBankDTO.getId(), questionBank.id.toString());
        assertEquals(questionBankDTO.getName(), questionBank.name);
        assertEquals(questionBankDTO.getLastModified(), questionBank.lastModified);
        assertEquals(questionList.size(), questionBank.questions.size());
    }
}
