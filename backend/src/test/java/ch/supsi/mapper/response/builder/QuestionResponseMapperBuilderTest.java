package ch.supsi.mapper.response.builder;

import ch.supsi.mapper.question.builder.QuestionMapperBuilder;
import ch.supsi.model.api.question.QuestionType;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

import static org.junit.jupiter.api.Assertions.*;

@QuarkusTest
@TestMethodOrder(MethodOrderer.MethodName.class)
public class QuestionResponseMapperBuilderTest {
    @Inject
    QuestionResponseMapperBuilder questionResponseMapperBuilder;

    @Test
    @DisplayName("Should all QuestionType have a mapper")
    void test01BuildQuestionResponseMapperAllQuestionType() {
        for(QuestionType questionType : QuestionType.values()) {
            assertNotNull(this.questionResponseMapperBuilder.getQuestionResponseDTOMapper(questionType));
        }
    }

    @Test
    @DisplayName("Should throw UnsupportedOperationError because question type is not supported / null")
    void test02BuildQuestionResponseMapperNullQuestionType() {
        UnsupportedOperationException exception = assertThrows(
                UnsupportedOperationException.class,
                () -> this.questionResponseMapperBuilder.getQuestionResponseDTOMapper(null)
        );

        assertEquals("Question type not supported: null", exception.getMessage());
    }
}
