package ch.supsi.mapper.quiz.facade;

import ch.supsi.mapper.question.builder.IQuestionMapperBuilder;
import ch.supsi.mapper.question.builder.QuestionMapperBuilder;
import ch.supsi.mapper.quiz.QuizMapper;
import ch.supsi.model.api.Quiz;
import ch.supsi.model.api.question.MultipleChoiceQuestion;
import ch.supsi.model.api.question.TrueFalseQuestion;
import ch.supsi.model.dto.api.QuizDTO;
import ch.supsi.repository.QuestionRepository;
import ch.supsi.service.question.QuestionServiceTest;
import io.quarkus.test.InjectMock;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import jakarta.ws.rs.InternalServerErrorException;
import jakarta.ws.rs.core.Response;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;


@QuarkusTest
@TestMethodOrder(MethodOrderer.MethodName.class)
public class QuizMapperFacadeTest {
    @Inject
    QuizMapperFacade quizMapperFacade;

    @InjectMock
    QuizMapper quizMapper;

    @Inject
    IQuestionMapperBuilder questionMapperBuilder;

    @InjectMock
    QuestionRepository questionRepository;

    @Test
    @DisplayName("Should return null DTO because entity passed is null")
    void test01ToDTO_ReturnNullDueToQuizIsNull() {
        QuizDTO quizDTO = this.quizMapperFacade.toDTO(null);
        assertNull(quizDTO);
    }
}
