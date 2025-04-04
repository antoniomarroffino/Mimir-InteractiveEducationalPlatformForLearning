package ch.supsi.mapper.quiz.facade;

import ch.supsi.mapper.question.builder.IQuestionMapperBuilder;
import ch.supsi.mapper.question.builder.QuestionMapperBuilder;
import ch.supsi.mapper.quiz.QuizMapper;
import ch.supsi.model.api.Quiz;
import ch.supsi.model.dto.api.QuizDTO;
import ch.supsi.repository.QuestionRepository;
import io.quarkus.test.InjectMock;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import jakarta.ws.rs.InternalServerErrorException;
import jakarta.ws.rs.core.Response;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

import static org.junit.jupiter.api.Assertions.*;

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
    @DisplayName("Should throw InternalServerError 500 because user logged is null")
    void test01ToDTO_ReturnNullDueToQuizIsNull() {
        QuizDTO quizDTO = this.quizMapperFacade.toDTO(null);
        assertNull(quizDTO);
    }
}
