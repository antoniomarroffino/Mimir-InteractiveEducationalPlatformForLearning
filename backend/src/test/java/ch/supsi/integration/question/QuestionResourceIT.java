package ch.supsi.integration.question;

import ch.supsi.JWTProducer.JwtProducer;
import ch.supsi.model.api.QuestionBank;
import ch.supsi.model.api.question.MultipleChoiceQuestion;
import ch.supsi.model.api.question.Question;
import ch.supsi.model.api.question.QuestionType;
import ch.supsi.model.api.question.TrueFalseQuestion;
import ch.supsi.model.api.user.Role;
import ch.supsi.model.api.user.User;
import ch.supsi.model.dto.api.question.MultipleChoiceQuestionDTO;
import ch.supsi.model.dto.api.question.QuestionDTO;
import ch.supsi.model.dto.api.question.TrueFalseQuestionDTO;
import ch.supsi.repository.QuestionBankRepository;
import ch.supsi.repository.QuestionRepository;
import ch.supsi.repository.UserRepository;
import ch.supsi.testContainersResource.MongoTestResource;
import io.quarkus.test.common.QuarkusTestResource;
import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.security.TestSecurity;
import io.quarkus.test.security.jwt.Claim;
import io.quarkus.test.security.jwt.JwtSecurity;
import io.restassured.http.ContentType;
import jakarta.inject.Inject;
import jakarta.ws.rs.core.Response;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.*;

import java.util.ArrayList;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.*;

@QuarkusTest
@QuarkusTestResource(MongoTestResource.class)
@Tag("integration")
@TestMethodOrder(MethodOrderer.MethodName.class)
public class QuestionResourceIT {
    @Inject
    QuestionRepository questionRepository;

    @Inject
    QuestionBankRepository questionBankRepository;

    @Inject
    UserRepository userRepository;

    private static QuestionBank questionBank;

    @BeforeEach
    public void beforeEach() {
        User user = new User();
        user.azureOid = JwtProducer.DEFAULT_OID;
        user.role = Role.TEACHER;
        this.userRepository.persist(user);

        questionBank = new QuestionBank("Test Bank");
        this.questionBankRepository.persist(questionBank);
    }

    @AfterEach
    public void afterEach() {
        this.questionRepository.deleteAll();
        this.questionBankRepository.deleteAll();
        this.userRepository.deleteAll();
    }

    @Test
    @DisplayName("Should create TRUE_FALSE question template")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    @JwtSecurity(
            claims = {
                    @Claim(key = JwtProducer.OID_CLAIM_KEY, value = JwtProducer.DEFAULT_OID),
                    @Claim(key = JwtProducer.NAME_CLAIM_KEY, value = JwtProducer.DEFAULT_NAME),
                    @Claim(key = JwtProducer.EMAIL_CLAIM_KEY, value = JwtProducer.DEFAULT_PREFERRED_USERNAME)
            })
    void test01CreateQuestionTemplate() {
        given()
                .queryParam("type", QuestionType.TRUE_FALSE)
                .contentType(ContentType.JSON)
                .when()
                .post("/questions/type")
                .then()
                .statusCode(Response.Status.CREATED.getStatusCode())
                .body("type", equalTo("TRUE_FALSE"))
                .body("questionText", nullValue())
                .body("correctAnswer", nullValue());
    }

    @Test
    @DisplayName("Should create question in question bank")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    @JwtSecurity(
            claims = {
                    @Claim(key = JwtProducer.OID_CLAIM_KEY, value = JwtProducer.DEFAULT_OID),
                    @Claim(key = JwtProducer.NAME_CLAIM_KEY, value = JwtProducer.DEFAULT_NAME),
                    @Claim(key = JwtProducer.EMAIL_CLAIM_KEY, value = JwtProducer.DEFAULT_PREFERRED_USERNAME)
            })
    void test02CreateQuestionInBank() {
        TrueFalseQuestionDTO questionDTO = new TrueFalseQuestionDTO();
        questionDTO.setQuestionText("Is Quarkus awesome?");
        questionDTO.setCorrectAnswer(true);
        questionDTO.setQuestionBankId(questionBank.id.toString());

        given()
                .contentType(ContentType.JSON)
                .body(questionDTO)
                .when()
                .post("/questions")
                .then()
                .statusCode(Response.Status.CREATED.getStatusCode())
                .body("id", notNullValue())
                .body("questionText", equalTo("Is Quarkus awesome?"))
                .body("correctAnswer", equalTo(true));

        QuestionBank updatedBank = this.questionBankRepository.findById(questionBank.id);
        Question createdQuestion = this.questionRepository.listAll().getFirst();

        assertNotNull(createdQuestion);
        assertEquals(QuestionType.TRUE_FALSE, createdQuestion.type);
        assertEquals(1, updatedBank.questions.size());
    }

    @Test
    @DisplayName("Should return 404 for non-existent question bank")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    @JwtSecurity(
            claims = {
                    @Claim(key = JwtProducer.OID_CLAIM_KEY, value = JwtProducer.DEFAULT_OID),
                    @Claim(key = JwtProducer.NAME_CLAIM_KEY, value = JwtProducer.DEFAULT_NAME),
                    @Claim(key = JwtProducer.EMAIL_CLAIM_KEY, value = JwtProducer.DEFAULT_PREFERRED_USERNAME)
            })
    void test03CreateQuestion_NotFoundQuestionBank() {
        ObjectId nonExistingQuestionBankId = new ObjectId();

        TrueFalseQuestionDTO questionDTO = new TrueFalseQuestionDTO();
        questionDTO.setQuestionText("Is Quarkus awesome?");
        questionDTO.setCorrectAnswer(true);
        questionDTO.setQuestionBankId(nonExistingQuestionBankId.toString());

        given()
                .contentType(ContentType.JSON)
                .body(questionDTO)
                .when()
                .post("/questions")
                .then()
                .statusCode(Response.Status.NOT_FOUND.getStatusCode())
                .body("message", equalTo("Question bank with id " + nonExistingQuestionBankId + " not found"));
    }

    @Test
    @DisplayName("Should return 400 because true false question correct answer is null")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    @JwtSecurity(
            claims = {
                    @Claim(key = JwtProducer.OID_CLAIM_KEY, value = JwtProducer.DEFAULT_OID),
                    @Claim(key = JwtProducer.NAME_CLAIM_KEY, value = JwtProducer.DEFAULT_NAME),
                    @Claim(key = JwtProducer.EMAIL_CLAIM_KEY, value = JwtProducer.DEFAULT_PREFERRED_USERNAME)
            })
    void test04CreateQuestion_ValidationFailed_TrueFalseQuestionCorrectAnswerIsNull() {
        TrueFalseQuestionDTO questionDTO = new TrueFalseQuestionDTO();
        questionDTO.setQuestionText("Is Quarkus awesome?");
        questionDTO.setCorrectAnswer(null);
        questionDTO.setQuestionBankId(questionBank.id.toString());

        given()
                .contentType(ContentType.JSON)
                .body(questionDTO)
                .when()
                .post("/questions")
                .then()
                .statusCode(Response.Status.BAD_REQUEST.getStatusCode())
                .body("message", equalTo("Validation failed"));
    }

    @Test
    @DisplayName("Should return 400 because Multiple choice question choices is null")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    @JwtSecurity(
            claims = {
                    @Claim(key = JwtProducer.OID_CLAIM_KEY, value = JwtProducer.DEFAULT_OID),
                    @Claim(key = JwtProducer.NAME_CLAIM_KEY, value = JwtProducer.DEFAULT_NAME),
                    @Claim(key = JwtProducer.EMAIL_CLAIM_KEY, value = JwtProducer.DEFAULT_PREFERRED_USERNAME)
            })
    void test05CreateQuestion_ValidationFailed_MultipleChoiceQuestionChoicesIsNull() {
        MultipleChoiceQuestionDTO questionDTO = new MultipleChoiceQuestionDTO();
        questionDTO.setQuestionText("Is Quarkus awesome?");
        questionDTO.setChoices(null);
        questionDTO.setCorrectAnswerIndexes(new ArrayList<>());
        questionDTO.setQuestionBankId(questionBank.id.toString());

        given()
                .contentType(ContentType.JSON)
                .body(questionDTO)
                .when()
                .post("/questions")
                .then()
                .statusCode(Response.Status.BAD_REQUEST.getStatusCode())
                .body("message", equalTo("Validation failed"));
    }

    @Test
    @DisplayName("Should return 400 because Multiple choice question correctAnswerIndexes is null")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    @JwtSecurity(
            claims = {
                    @Claim(key = JwtProducer.OID_CLAIM_KEY, value = JwtProducer.DEFAULT_OID),
                    @Claim(key = JwtProducer.NAME_CLAIM_KEY, value = JwtProducer.DEFAULT_NAME),
                    @Claim(key = JwtProducer.EMAIL_CLAIM_KEY, value = JwtProducer.DEFAULT_PREFERRED_USERNAME)
            })
    void test06CreateQuestion_ValidationFailed_MultipleChoiceQuestionCorrectAnswerIndexesIsNull() {
        MultipleChoiceQuestionDTO questionDTO = new MultipleChoiceQuestionDTO();
        questionDTO.setQuestionText("Is Quarkus awesome?");
        questionDTO.setChoices(new ArrayList<>());
        questionDTO.setCorrectAnswerIndexes(null);
        questionDTO.setQuestionBankId(questionBank.id.toString());

        given()
                .contentType(ContentType.JSON)
                .body(questionDTO)
                .when()
                .post("/questions")
                .then()
                .statusCode(Response.Status.BAD_REQUEST.getStatusCode())
                .body("message", equalTo("Validation failed"));
    }

    @Test
    @DisplayName("Should update question successfully")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    @JwtSecurity(
            claims = {
                    @Claim(key = JwtProducer.OID_CLAIM_KEY, value = JwtProducer.DEFAULT_OID),
                    @Claim(key = JwtProducer.NAME_CLAIM_KEY, value = JwtProducer.DEFAULT_NAME),
                    @Claim(key = JwtProducer.EMAIL_CLAIM_KEY, value = JwtProducer.DEFAULT_PREFERRED_USERNAME)
            })
    void test07UpdateQuestion() {
        TrueFalseQuestion question = new TrueFalseQuestion("Initial question", false);
        question.questionBankId = questionBank.id.toString();
        this.questionRepository.persist(question);

        TrueFalseQuestionDTO updateDTO = new TrueFalseQuestionDTO();
        updateDTO.setQuestionText("Updated question");
        updateDTO.setCorrectAnswer(true);

        given()
                .pathParam("questionId", question.id.toString())
                .contentType(ContentType.JSON)
                .body(updateDTO)
                .when()
                .put("/questions/{questionId}")
                .then()
                .statusCode(Response.Status.OK.getStatusCode())
                .body("questionText", equalTo("Updated question"))
                .body("correctAnswer", equalTo(true));

        TrueFalseQuestion updated = (TrueFalseQuestion) this.questionRepository.findById(question.id);
        assertEquals("Updated question", updated.questionText);
        assertTrue(updated.correctAnswer);
    }

    @Test
    @DisplayName("Should return 404 when updating non-existent question")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    @JwtSecurity(
            claims = {
                    @Claim(key = JwtProducer.OID_CLAIM_KEY, value = JwtProducer.DEFAULT_OID),
                    @Claim(key = JwtProducer.NAME_CLAIM_KEY, value = JwtProducer.DEFAULT_NAME),
                    @Claim(key = JwtProducer.EMAIL_CLAIM_KEY, value = JwtProducer.DEFAULT_PREFERRED_USERNAME)
            })
    void test08UpdateQuestion_NotFound() {
        ObjectId nonExistingQuestionId = new ObjectId();

        TrueFalseQuestionDTO questionDTO = new TrueFalseQuestionDTO();
        questionDTO.setQuestionText("Is Quarkus awesome?");
        questionDTO.setCorrectAnswer(true);

        given()
                .pathParam("questionId", nonExistingQuestionId.toString())
                .contentType(ContentType.JSON)
                .body(questionDTO)
                .when()
                .put("/questions/{questionId}")
                .then()
                .statusCode(Response.Status.NOT_FOUND.getStatusCode())
                .body("message", equalTo("Question with id " + nonExistingQuestionId + " not found"));
    }

    @Test
    @DisplayName("Should return 400 because true false question correct answer is null")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    @JwtSecurity(
            claims = {
                    @Claim(key = JwtProducer.OID_CLAIM_KEY, value = JwtProducer.DEFAULT_OID),
                    @Claim(key = JwtProducer.NAME_CLAIM_KEY, value = JwtProducer.DEFAULT_NAME),
                    @Claim(key = JwtProducer.EMAIL_CLAIM_KEY, value = JwtProducer.DEFAULT_PREFERRED_USERNAME)
            })
    void test09UpdateQuestion_ValidationFailed_TrueFalseQuestionCorrectAnswerIsNull() {
        TrueFalseQuestion question = new TrueFalseQuestion("Initial question", false);
        question.questionBankId = questionBank.id.toString();
        this.questionRepository.persist(question);

        TrueFalseQuestionDTO questionDTO = new TrueFalseQuestionDTO();
        questionDTO.setQuestionText("Is Quarkus awesome?");
        questionDTO.setCorrectAnswer(null);
        questionDTO.setQuestionBankId(questionBank.id.toString());

        given()
                .pathParam("questionId", question.id.toString())
                .contentType(ContentType.JSON)
                .body(questionDTO)
                .when()
                .put("/questions/{questionId}")
                .then()
                .statusCode(Response.Status.BAD_REQUEST.getStatusCode())
                .body("message", equalTo("Validation failed"));
    }

    @Test
    @DisplayName("Should return 400 because Multiple choice question choices is null")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    @JwtSecurity(
            claims = {
                    @Claim(key = JwtProducer.OID_CLAIM_KEY, value = JwtProducer.DEFAULT_OID),
                    @Claim(key = JwtProducer.NAME_CLAIM_KEY, value = JwtProducer.DEFAULT_NAME),
                    @Claim(key = JwtProducer.EMAIL_CLAIM_KEY, value = JwtProducer.DEFAULT_PREFERRED_USERNAME)
            })
    void test10UpdateQuestion_ValidationFailed_MultipleChoiceQuestionChoicesIsNull() {
        MultipleChoiceQuestion question = new MultipleChoiceQuestion("Initial question", new ArrayList<>(), new ArrayList<>());
        question.questionBankId = questionBank.id.toString();
        this.questionRepository.persist(question);

        MultipleChoiceQuestionDTO questionDTO = new MultipleChoiceQuestionDTO();
        questionDTO.setQuestionText("Is Quarkus awesome?");
        questionDTO.setChoices(null);
        questionDTO.setCorrectAnswerIndexes(new ArrayList<>());
        questionDTO.setQuestionBankId(questionBank.id.toString());

        given()
                .pathParam("questionId", question.id.toString())
                .contentType(ContentType.JSON)
                .body(questionDTO)
                .when()
                .put("/questions/{questionId}")
                .then()
                .statusCode(Response.Status.BAD_REQUEST.getStatusCode())
                .body("message", equalTo("Validation failed"));
    }

    @Test
    @DisplayName("Should return 400 because Multiple choice question correctAnswerIndexes is null")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    @JwtSecurity(
            claims = {
                    @Claim(key = JwtProducer.OID_CLAIM_KEY, value = JwtProducer.DEFAULT_OID),
                    @Claim(key = JwtProducer.NAME_CLAIM_KEY, value = JwtProducer.DEFAULT_NAME),
                    @Claim(key = JwtProducer.EMAIL_CLAIM_KEY, value = JwtProducer.DEFAULT_PREFERRED_USERNAME)
            })
    void test11UpdateQuestion_ValidationFailed_MultipleChoiceQuestionCorrectAnswerIndexesIsNull() {
        MultipleChoiceQuestion question = new MultipleChoiceQuestion("Initial question", new ArrayList<>(), new ArrayList<>());
        question.questionBankId = questionBank.id.toString();
        this.questionRepository.persist(question);

        MultipleChoiceQuestionDTO questionDTO = new MultipleChoiceQuestionDTO();
        questionDTO.setQuestionText("Is Quarkus awesome?");
        questionDTO.setChoices(new ArrayList<>());
        questionDTO.setCorrectAnswerIndexes(null);
        questionDTO.setQuestionBankId(questionBank.id.toString());

        given()
                .pathParam("questionId", question.id.toString())
                .contentType(ContentType.JSON)
                .body(questionDTO)
                .when()
                .put("/questions/{questionId}")
                .then()
                .statusCode(Response.Status.BAD_REQUEST.getStatusCode())
                .body("message", equalTo("Validation failed"));
    }

    @Test
    @DisplayName("Should delete question successfully")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    @JwtSecurity(
            claims = {
                    @Claim(key = JwtProducer.OID_CLAIM_KEY, value = JwtProducer.DEFAULT_OID),
                    @Claim(key = JwtProducer.NAME_CLAIM_KEY, value = JwtProducer.DEFAULT_NAME),
                    @Claim(key = JwtProducer.EMAIL_CLAIM_KEY, value = JwtProducer.DEFAULT_PREFERRED_USERNAME)
            })
    void test12DeleteQuestion() {
        TrueFalseQuestion question = new TrueFalseQuestion("To delete", true);
        question.questionBankId = questionBank.id.toString();
        this.questionRepository.persist(question);
        this.questionBankRepository.addQuestionToQuestionBank(question.id.toString(), questionBank.id);

        given()
                .pathParam("questionId", question.id.toString())
                .when()
                .delete("/questions/{questionId}")
                .then()
                .statusCode(Response.Status.NO_CONTENT.getStatusCode());

        assertFalse(this.questionRepository.findByIdOptional(question.id).isPresent());

        QuestionBank bank = this.questionBankRepository.findById(questionBank.id);
        assertFalse(bank.questions.contains(question.id.toString()));
        assertTrue(bank.questions.isEmpty());
    }

    @Test
    @DisplayName("Should return 400 for invalid question type")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    @JwtSecurity(
            claims = {
                    @Claim(key = JwtProducer.OID_CLAIM_KEY, value = JwtProducer.DEFAULT_OID),
                    @Claim(key = JwtProducer.NAME_CLAIM_KEY, value = JwtProducer.DEFAULT_NAME),
                    @Claim(key = JwtProducer.EMAIL_CLAIM_KEY, value = JwtProducer.DEFAULT_PREFERRED_USERNAME)
            })
    void test13InvalidQuestionType() {
        given()
                .queryParam("type", "INVALID_TYPE")
                .when()
                .post("/questions/type")
                .then()
                .statusCode(Response.Status.UNSUPPORTED_MEDIA_TYPE.getStatusCode());
    }
}
