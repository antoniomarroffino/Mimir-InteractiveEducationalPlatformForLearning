package ch.supsi.service.question;

import ch.supsi.mapper.CourseMapper;
import ch.supsi.mapper.IBaseMapper;
import ch.supsi.mapper.question.MultipleChoiceQuestionMapper;
import ch.supsi.mapper.question.TrueFalseQuestionMapper;
import ch.supsi.mapper.question.builder.IQuestionMapperBuilder;
import ch.supsi.mapper.question.builder.QuestionMapperBuilder;
import ch.supsi.model.api.question.Question;
import ch.supsi.model.api.question.QuestionType;
import ch.supsi.model.api.question.TrueFalseQuestion;
import ch.supsi.model.dto.api.question.QuestionDTO;
import ch.supsi.model.dto.api.question.TrueFalseQuestionDTO;
import ch.supsi.repository.QuestionBankRepository;
import ch.supsi.repository.QuestionRepository;
import ch.supsi.service.question.builder.QuestionFactory;
import ch.supsi.service.question.strategy.IQuestionCreationStrategy;
import ch.supsi.service.question.strategy.TrueFalseQuestionStrategy;
import io.quarkus.test.InjectMock;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.mockito.InOrder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@QuarkusTest
@TestMethodOrder(MethodOrderer.MethodName.class)
@SuppressWarnings("unchecked")
public class QuestionServiceTest {
    @Inject
    QuestionService questionService;

    @InjectMock
    QuestionRepository questionRepository;

    @InjectMock
    QuestionBankRepository questionBankRepository;

    @InjectMock
    QuestionFactory questionFactory;

    @InjectMock
    QuestionMapperBuilder questionMapperBuilder;

    @Test
    @DisplayName("Should create a TrueFalseQuestion template")
    void test01CreateQuestionTemplate_TrueFalseQuestion() {
        when(this.questionMapperBuilder.getQuestionDTOMapper(QuestionType.TRUE_FALSE)).thenReturn((IBaseMapper) mock(TrueFalseQuestionMapper.class));
        when(this.questionFactory.getStrategy(QuestionType.TRUE_FALSE)).thenReturn((IQuestionCreationStrategy) mock(TrueFalseQuestionStrategy.class));

        InOrder inOrder = inOrder(this.questionMapperBuilder, this.questionFactory);

        this.questionService.createQuestionTemplate(QuestionType.TRUE_FALSE);

        inOrder.verify(this.questionMapperBuilder, times(1)).getQuestionDTOMapper(QuestionType.TRUE_FALSE);
        inOrder.verify(this.questionFactory, times(1)).getStrategy(QuestionType.TRUE_FALSE);
    }

}
