package ch.supsi.integration.questionBank;

import ch.supsi.JWTProducer.JwtProducer;
import ch.supsi.model.api.QuestionBank;
import ch.supsi.model.api.question.TrueFalseQuestion;
import ch.supsi.model.api.user.Role;
import ch.supsi.model.api.user.User;
import ch.supsi.model.dto.api.QuestionBankDTO;
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

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.*;

@QuarkusTest
@QuarkusTestResource(MongoTestResource.class)
@Tag("integration")
@TestMethodOrder(MethodOrderer.MethodName.class)
public class QuestionBankResourceIT {
    @Inject
    QuestionBankRepository questionBankRepository;

    @Inject
    QuestionRepository questionRepository;

    @Inject
    UserRepository userRepository;

    @BeforeEach
    public void beforeEach() {
        User user = new User();
        user.azureOid = JwtProducer.DEFAULT_OID;
        user.role = Role.TEACHER;
        this.userRepository.persist(user);
    }

    @AfterEach
    public void afterEach() {
        this.questionRepository.deleteAll();
        this.questionBankRepository.deleteAll();
        this.userRepository.deleteAll();
    }

    @Test
    @DisplayName("Should return empty question bank list")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    @JwtSecurity(
            claims = {
                    @Claim(key = JwtProducer.OID_CLAIM_KEY, value = JwtProducer.DEFAULT_OID),
                    @Claim(key = JwtProducer.NAME_CLAIM_KEY, value = JwtProducer.DEFAULT_NAME),
                    @Claim(key = JwtProducer.EMAIL_CLAIM_KEY, value = JwtProducer.DEFAULT_PREFERRED_USERNAME)
            })
    void test01GetQuestionBanks_Empty() {
        given()
                .when()
                .get("/question_banks")
                .then()
                .statusCode(Response.Status.OK.getStatusCode())
                .body("$", empty());
    }

    @Test
    @DisplayName("Should return question bank list with data")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    @JwtSecurity(
            claims = {
                    @Claim(key = JwtProducer.OID_CLAIM_KEY, value = JwtProducer.DEFAULT_OID),
                    @Claim(key = JwtProducer.NAME_CLAIM_KEY, value = JwtProducer.DEFAULT_NAME),
                    @Claim(key = JwtProducer.EMAIL_CLAIM_KEY, value = JwtProducer.DEFAULT_PREFERRED_USERNAME)
            })
    void test02GetQuestionBanks_WithData() {
        QuestionBank bank = new QuestionBank("Test Bank");
        this.questionBankRepository.persist(bank);

        given()
                .when()
                .get("/question_banks")
                .then()
                .statusCode(Response.Status.OK.getStatusCode())
                .body("$", hasSize(1))
                .body("[0].name", equalTo("Test Bank"));
    }

    @Test
    @DisplayName("Should get question bank by ID")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    @JwtSecurity(
            claims = {
                    @Claim(key = JwtProducer.OID_CLAIM_KEY, value = JwtProducer.DEFAULT_OID),
                    @Claim(key = JwtProducer.NAME_CLAIM_KEY, value = JwtProducer.DEFAULT_NAME),
                    @Claim(key = JwtProducer.EMAIL_CLAIM_KEY, value = JwtProducer.DEFAULT_PREFERRED_USERNAME)
            })
    void test03GetQuestionBankById_Found() {
        QuestionBank bank = new QuestionBank("Test Bank");
        this.questionBankRepository.persist(bank);

        given()
                .pathParam("id", bank.id.toString())
                .when()
                .get("/question_banks/{id}")
                .then()
                .statusCode(Response.Status.OK.getStatusCode())
                .body("name", equalTo("Test Bank"));
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
    void test04GetQuestionBankById_NotFound() {
        ObjectId nonExistentId = new ObjectId();
        given()
                .pathParam("id", nonExistentId.toString())
                .when()
                .get("/question_banks/{id}")
                .then()
                .statusCode(Response.Status.NOT_FOUND.getStatusCode())
                .body("message", equalTo("Question bank with id " + nonExistentId + " not found"));
    }

    @Test
    @DisplayName("Should create new question bank")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    @JwtSecurity(
            claims = {
                    @Claim(key = JwtProducer.OID_CLAIM_KEY, value = JwtProducer.DEFAULT_OID),
                    @Claim(key = JwtProducer.NAME_CLAIM_KEY, value = JwtProducer.DEFAULT_NAME),
                    @Claim(key = JwtProducer.EMAIL_CLAIM_KEY, value = JwtProducer.DEFAULT_PREFERRED_USERNAME)
            })
    void test05CreateQuestionBank_Success() {
        QuestionBankDTO dto = new QuestionBankDTO("New Bank");

        given()
                .contentType(ContentType.JSON)
                .body(dto)
                .when()
                .post("/question_banks")
                .then()
                .statusCode(Response.Status.CREATED.getStatusCode())
                .body("id", notNullValue())
                .body("name", equalTo("New Bank"));

        assertEquals(1, this.questionBankRepository.listAll().size());
        assertEquals("New Bank", this.questionBankRepository.listAll().getFirst().name);
    }

    @Test
    @DisplayName("Should return 400 for empty name")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    @JwtSecurity(
            claims = {
                    @Claim(key = JwtProducer.OID_CLAIM_KEY, value = JwtProducer.DEFAULT_OID),
                    @Claim(key = JwtProducer.NAME_CLAIM_KEY, value = JwtProducer.DEFAULT_NAME),
                    @Claim(key = JwtProducer.EMAIL_CLAIM_KEY, value = JwtProducer.DEFAULT_PREFERRED_USERNAME)
            })
    void test06CreateQuestionBank_EmptyName() {
        QuestionBankDTO dto = new QuestionBankDTO("");

        given()
                .contentType(ContentType.JSON)
                .body(dto)
                .when()
                .post("/question_banks")
                .then()
                .statusCode(Response.Status.BAD_REQUEST.getStatusCode())
                .body("message", equalTo("Validation failed"));

        assertTrue(this.questionBankRepository.listAll().isEmpty());
    }

    @Test
    @DisplayName("Should return 400 for null name")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    @JwtSecurity(
            claims = {
                    @Claim(key = JwtProducer.OID_CLAIM_KEY, value = JwtProducer.DEFAULT_OID),
                    @Claim(key = JwtProducer.NAME_CLAIM_KEY, value = JwtProducer.DEFAULT_NAME),
                    @Claim(key = JwtProducer.EMAIL_CLAIM_KEY, value = JwtProducer.DEFAULT_PREFERRED_USERNAME)
            })
    void test07CreateQuestionBank_NullName() {
        QuestionBankDTO dto = new QuestionBankDTO(null);

        given()
                .contentType(ContentType.JSON)
                .body(dto)
                .when()
                .post("/question_banks")
                .then()
                .statusCode(Response.Status.BAD_REQUEST.getStatusCode())
                .body("message", equalTo("Validation failed"));

        assertTrue(this.questionBankRepository.listAll().isEmpty());
    }

    @Test
    @DisplayName("Should return 400 for duplicate name")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    @JwtSecurity(
            claims = {
                    @Claim(key = JwtProducer.OID_CLAIM_KEY, value = JwtProducer.DEFAULT_OID),
                    @Claim(key = JwtProducer.NAME_CLAIM_KEY, value = JwtProducer.DEFAULT_NAME),
                    @Claim(key = JwtProducer.EMAIL_CLAIM_KEY, value = JwtProducer.DEFAULT_PREFERRED_USERNAME)
            })
    void test08CreateQuestionBank_DuplicateName() {
        QuestionBank bank = new QuestionBank("Existing Bank");
        this.questionBankRepository.persist(bank);

        QuestionBankDTO dto = new QuestionBankDTO();
        dto.setName("Existing Bank");

        given()
                .contentType(ContentType.JSON)
                .body(dto)
                .when()
                .post("/question_banks")
                .then()
                .statusCode(Response.Status.BAD_REQUEST.getStatusCode())
                .body("message", containsString("QuestionBankDTO name already exists"));

        assertEquals(1, this.questionBankRepository.listAll().size());
    }

    @Test
    @DisplayName("Should update question bank")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    @JwtSecurity(
            claims = {
                    @Claim(key = JwtProducer.OID_CLAIM_KEY, value = JwtProducer.DEFAULT_OID),
                    @Claim(key = JwtProducer.NAME_CLAIM_KEY, value = JwtProducer.DEFAULT_NAME),
                    @Claim(key = JwtProducer.EMAIL_CLAIM_KEY, value = JwtProducer.DEFAULT_PREFERRED_USERNAME)
            })
    void test09UpdateQuestionBank_Success() {
        QuestionBank bank = new QuestionBank("Old Name");
        this.questionBankRepository.persist(bank);

        QuestionBankDTO dto = new QuestionBankDTO("New Name");

        given()
                .pathParam("id", bank.id.toString())
                .contentType(ContentType.JSON)
                .body(dto)
                .when()
                .put("/question_banks/{id}")
                .then()
                .statusCode(Response.Status.OK.getStatusCode())
                .body("name", equalTo("New Name"));

        QuestionBank updated = this.questionBankRepository.findById(bank.id);
        assertEquals("New Name", updated.name);
    }

    @Test
    @DisplayName("Should return 404 when updating non-existent bank")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    @JwtSecurity(
            claims = {
                    @Claim(key = JwtProducer.OID_CLAIM_KEY, value = JwtProducer.DEFAULT_OID),
                    @Claim(key = JwtProducer.NAME_CLAIM_KEY, value = JwtProducer.DEFAULT_NAME),
                    @Claim(key = JwtProducer.EMAIL_CLAIM_KEY, value = JwtProducer.DEFAULT_PREFERRED_USERNAME)
            })
    void test10UpdateQuestionBank_NotFound() {
        ObjectId nonExistentId = new ObjectId();
        QuestionBankDTO dto = new QuestionBankDTO("New Name");

        given()
                .pathParam("id", nonExistentId.toString())
                .contentType(ContentType.JSON)
                .body(dto)
                .when()
                .put("/question_banks/{id}")
                .then()
                .statusCode(Response.Status.NOT_FOUND.getStatusCode())
                .body("message", equalTo("Question bank with id " + nonExistentId + " not found"));
    }

    @Test
    @DisplayName("Should return 400 for empty name")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    @JwtSecurity(
            claims = {
                    @Claim(key = JwtProducer.OID_CLAIM_KEY, value = JwtProducer.DEFAULT_OID),
                    @Claim(key = JwtProducer.NAME_CLAIM_KEY, value = JwtProducer.DEFAULT_NAME),
                    @Claim(key = JwtProducer.EMAIL_CLAIM_KEY, value = JwtProducer.DEFAULT_PREFERRED_USERNAME)
            })
    void test11UpdateQuestionBank_EmptyName() {
        QuestionBank bank = new QuestionBank("Old Name");
        this.questionBankRepository.persist(bank);

        QuestionBankDTO dto = new QuestionBankDTO("");

        given()
                .pathParam("id", bank.id.toString())
                .contentType(ContentType.JSON)
                .body(dto)
                .when()
                .put("/question_banks/{id}")
                .then()
                .statusCode(Response.Status.BAD_REQUEST.getStatusCode())
                .body("message", equalTo("Validation failed"));
    }

    @Test
    @DisplayName("Should return 400 for null name")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    @JwtSecurity(
            claims = {
                    @Claim(key = JwtProducer.OID_CLAIM_KEY, value = JwtProducer.DEFAULT_OID),
                    @Claim(key = JwtProducer.NAME_CLAIM_KEY, value = JwtProducer.DEFAULT_NAME),
                    @Claim(key = JwtProducer.EMAIL_CLAIM_KEY, value = JwtProducer.DEFAULT_PREFERRED_USERNAME)
            })
    void test12UpdateQuestionBank_NullName() {
        QuestionBank bank = new QuestionBank("Old Name");
        this.questionBankRepository.persist(bank);

        QuestionBankDTO dto = new QuestionBankDTO(null);

        given()
                .pathParam("id", bank.id.toString())
                .contentType(ContentType.JSON)
                .body(dto)
                .when()
                .put("/question_banks/{id}")
                .then()
                .statusCode(Response.Status.BAD_REQUEST.getStatusCode())
                .body("message", equalTo("Validation failed"));
    }

    @Test
    @DisplayName("Should return 400 for duplicate name")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    @JwtSecurity(
            claims = {
                    @Claim(key = JwtProducer.OID_CLAIM_KEY, value = JwtProducer.DEFAULT_OID),
                    @Claim(key = JwtProducer.NAME_CLAIM_KEY, value = JwtProducer.DEFAULT_NAME),
                    @Claim(key = JwtProducer.EMAIL_CLAIM_KEY, value = JwtProducer.DEFAULT_PREFERRED_USERNAME)
            })
    void test13UpdateQuestionBank_DuplicateName() {
        QuestionBank bank = new QuestionBank("Existing Bank");
        this.questionBankRepository.persist(bank);

        QuestionBankDTO dto = new QuestionBankDTO();
        dto.setName("Existing Bank");

        given()
                .pathParam("id", bank.id.toString())
                .contentType(ContentType.JSON)
                .body(dto)
                .when()
                .put("/question_banks/{id}")
                .then()
                .statusCode(Response.Status.BAD_REQUEST.getStatusCode())
                .body("message", containsString("QuestionBankDTO name already exists"));
    }

    @Test
    @DisplayName("Should delete question bank and associated questions")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    @JwtSecurity(
            claims = {
                    @Claim(key = JwtProducer.OID_CLAIM_KEY, value = JwtProducer.DEFAULT_OID),
                    @Claim(key = JwtProducer.NAME_CLAIM_KEY, value = JwtProducer.DEFAULT_NAME),
                    @Claim(key = JwtProducer.EMAIL_CLAIM_KEY, value = JwtProducer.DEFAULT_PREFERRED_USERNAME)
            })
    void test14DeleteQuestionBank_Success() {
        TrueFalseQuestion trueFalseQuestion = new TrueFalseQuestion("Test", true);
        this.questionRepository.persist(trueFalseQuestion);

        QuestionBank bank = new QuestionBank("Existing Bank");
        bank.questions.add(trueFalseQuestion.id.toString());
        this.questionBankRepository.persist(bank);

        trueFalseQuestion.questionBankId = bank.id.toString();
        this.questionRepository.update(trueFalseQuestion);

        given()
                .pathParam("id", bank.id.toString())
                .when()
                .delete("/question_banks/{id}")
                .then()
                .statusCode(Response.Status.NO_CONTENT.getStatusCode());

        assertFalse(this.questionBankRepository.findByIdOptional(bank.id).isPresent());
        assertFalse(this.questionRepository.findByIdOptional(trueFalseQuestion.id).isPresent());
    }

    @Test
    @DisplayName("Should return 404 when deleting non-existent bank")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    @JwtSecurity(
            claims = {
                    @Claim(key = JwtProducer.OID_CLAIM_KEY, value = JwtProducer.DEFAULT_OID),
                    @Claim(key = JwtProducer.NAME_CLAIM_KEY, value = JwtProducer.DEFAULT_NAME),
                    @Claim(key = JwtProducer.EMAIL_CLAIM_KEY, value = JwtProducer.DEFAULT_PREFERRED_USERNAME)
            })
    void test15DeleteQuestionBank_NotFound() {
        TrueFalseQuestion trueFalseQuestion = new TrueFalseQuestion("Test", true);
        this.questionRepository.persist(trueFalseQuestion);

        QuestionBank bank = new QuestionBank("Existing Bank");
        bank.questions.add(trueFalseQuestion.id.toString());
        this.questionBankRepository.persist(bank);

        trueFalseQuestion.questionBankId = bank.id.toString();
        this.questionRepository.update(trueFalseQuestion);

        ObjectId nonExistentId = new ObjectId();

        given()
                .pathParam("id", nonExistentId.toString())
                .when()
                .delete("/question_banks/{id}")
                .then()
                .statusCode(Response.Status.NOT_FOUND.getStatusCode())
                .body("message", equalTo("Question bank with id " + nonExistentId + " not found"));

        assertTrue(this.questionBankRepository.findByIdOptional(bank.id).isPresent());
        assertTrue(this.questionRepository.findByIdOptional(trueFalseQuestion.id).isPresent());
    }
}
