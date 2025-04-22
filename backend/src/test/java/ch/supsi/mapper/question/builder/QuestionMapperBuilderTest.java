package ch.supsi.mapper.question.builder;

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
public class QuestionMapperBuilderTest {
    @Inject
    QuestionMapperBuilder questionMapperBuilder;

    @Test
    @DisplayName("Should all QuestionType have a mapper")
    void test01BuildQuestionMapperAllQuestionType() {
        for (QuestionType questionType : QuestionType.values()) {
            assertNotNull(this.questionMapperBuilder.getQuestionDTOMapper(questionType));
        }
    }

    @Test
    @DisplayName("Should throw UnsupportedOperationError because question type is not supported / null")
    void test02BuildQuestionMapperNullQuestionType() {
        UnsupportedOperationException exception = assertThrows(
                UnsupportedOperationException.class,
                () -> this.questionMapperBuilder.getQuestionDTOMapper(null)
        );

        assertEquals("Question type not supported: null", exception.getMessage());
    }
}
