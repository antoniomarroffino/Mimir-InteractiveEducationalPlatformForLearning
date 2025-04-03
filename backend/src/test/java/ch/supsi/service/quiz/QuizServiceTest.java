package ch.supsi.service.quiz;

import ch.supsi.model.api.Quiz;
import ch.supsi.model.dto.api.QuizDTO;
import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.TestMethodOrder;

@QuarkusTest
@TestMethodOrder(MethodOrderer.MethodName.class)
public class QuizServiceTest {

    public static Quiz createTestQuiz(String name, String description) {
        Quiz quiz = new Quiz();
        quiz.name = name;
        quiz.description = description;
        return quiz;
    }

    public static QuizDTO convertToDTO(Quiz quiz) {
        QuizDTO quizDTO = new QuizDTO();
        quizDTO.setId(quiz.id.toString());
        quizDTO.setName(quiz.name);
        quizDTO.setDescription(quiz.description);
        quizDTO.setUpdatedAt(quiz.updatedAt);
        quizDTO.setCreatedAt(quiz.createdAt);
        return quizDTO;
    }
}
