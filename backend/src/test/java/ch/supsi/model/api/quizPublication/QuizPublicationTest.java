package ch.supsi.model.api.quizPublication;

import ch.supsi.model.api.QuizPublication;
import ch.supsi.model.api.question.MultipleChoiceQuestion;
import ch.supsi.model.api.question.Question;
import ch.supsi.model.api.question.TrueFalseQuestion;
import io.quarkus.test.junit.QuarkusTest;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@QuarkusTest
@TestMethodOrder(MethodOrderer.MethodName.class)
public class QuizPublicationTest {
    @Test
    @DisplayName("Should create new QuizPublication with constructor no parameters")
    void test01CreateQuizPublication_ConstructorNoParameters() {
        QuizPublication quizPublication = new QuizPublication();
        assertNull(quizPublication.id);
        assertNull(quizPublication.courseId);
        assertNull(quizPublication.folderId);
        assertNull(quizPublication.quizId);
        assertNull(quizPublication.questions);
        assertNull(quizPublication.publicationCode);
        assertFalse(quizPublication.published);
        assertTrue(quizPublication.anonymous);
        assertNotNull(quizPublication.createdAt);
        assertNull(quizPublication.closedAt);
    }

    @Test
    @DisplayName("Should create new QuizPublication with constructor with parameters")
    void test02CreateQuizPublication_ConstructorWithParameters() {
        ObjectId courseId = new ObjectId();
        ObjectId folderId = new ObjectId();
        ObjectId quizId = new ObjectId();
        String publicationCode = "test";

        TrueFalseQuestion trueFalseQuestion = new TrueFalseQuestion();
        MultipleChoiceQuestion multipleChoiceQuestion = new MultipleChoiceQuestion();
        List<Question> questionList = List.of(trueFalseQuestion, multipleChoiceQuestion);

        QuizPublication quizPublication = new QuizPublication(courseId, folderId, quizId, questionList, publicationCode);
        assertNull(quizPublication.id);
        assertEquals(courseId, quizPublication.courseId);
        assertEquals(folderId, quizPublication.folderId);
        assertEquals(quizId, quizPublication.quizId);
        assertEquals(questionList.size(), quizPublication.questions.size());
        assertEquals(trueFalseQuestion.type, quizPublication.questions.getFirst().type);
        assertEquals(multipleChoiceQuestion.type, quizPublication.questions.get(1).type);
        assertEquals(publicationCode, quizPublication.publicationCode);
        assertFalse(quizPublication.published);
        assertTrue(quizPublication.anonymous);
        assertNotNull(quizPublication.createdAt);
        assertNull(quizPublication.closedAt);
    }
}
