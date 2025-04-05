package ch.supsi.service.questionBank;

import ch.supsi.model.api.QuestionBank;
import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.TestMethodOrder;

import java.util.HashSet;

@QuarkusTest
@TestMethodOrder(MethodOrderer.MethodName.class)
public class QuestionBankServiceTest {

    public static QuestionBank createTestQuestionBank(String name) {
        QuestionBank qb = new QuestionBank();
        qb.name = name;
        qb.questions = new HashSet<>();
        return qb;
    }
}
