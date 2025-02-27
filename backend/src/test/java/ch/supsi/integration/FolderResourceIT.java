package ch.supsi.integration;

import ch.supsi.model.api.Folder;
import ch.supsi.service.testContainersResource.MongoTestResource;
import io.quarkus.test.common.QuarkusTestResource;
import io.quarkus.test.junit.QuarkusTest;
import io.restassured.http.ContentType;
import jakarta.ws.rs.core.Response;
import org.junit.jupiter.api.*;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;

@QuarkusTest
@QuarkusTestResource(MongoTestResource.class)
@Tag("integration")
@TestMethodOrder(MethodOrderer.MethodName.class)
public class FolderResourceIT {

    @BeforeEach
    @AfterEach
    void cleanup() {
        Folder.deleteAll();
    }

    @Test
    @DisplayName("Should return Response 200 (ok) with empty folders list")
    void test01GetFolders_Empty() {
        given()
                .when().get("/folders")
                .then()
                .statusCode(Response.Status.OK.getStatusCode())
                .body("$", empty());
    }

    @Test
    @DisplayName("Should return Response 200 (ok) with two folders into list")
    void tes02GetFolders() {
        String folderName_1 = "Test Folder1";
        String folderName_2 = "Test Folder2";

        Folder folder1 = new Folder(folderName_1);
        Folder folder2 = new Folder(folderName_2);

        folder1.persist();
        folder2.persist();

        given()
                .when().get("/folders")
                .then()
                .statusCode(Response.Status.OK.getStatusCode())
                .body("$", hasSize(2))
                .body("[0].id", notNullValue())
                .body("[0].name", equalTo(folderName_1))
                .body("[1].id", notNullValue())
                .body("[1].name", equalTo(folderName_2));
    }


    @Test
    @DisplayName("Should return Response 200 (ok) persist one folder passing as argument and return it")
    void test03CreateFolder() {
        String folderName = "Test Folder";

        Folder folder = new Folder(folderName);

        given()
                .contentType(ContentType.JSON)
                .body(folder)
                .when()
                .post("/folders")
                .then()
                .statusCode(Response.Status.CREATED.getStatusCode())
                .body("id", notNullValue())
                .body("name", equalTo(folderName));
    }

    @Test
    @DisplayName("Should return Response 400 (bad request) folder name is null")
    void test04CreateFolder_FolderNameIsNull() {
        Folder folderWithEmptyName = new Folder();
        given()
                .contentType(ContentType.JSON)
                .body(folderWithEmptyName)
                .when()
                .post("/folders")
                .then()
                .statusCode(Response.Status.BAD_REQUEST.getStatusCode())
                .body("message", equalTo("Validation failed"));
    }

    @Test
    @DisplayName("Should return Response 400 (bad request) folder is empty")
    void test05CreateFolder_FolderNameIsEmpty() {
        Folder folderWithEmptyName = new Folder("");
        given()
                .contentType(ContentType.JSON)
                .body(folderWithEmptyName)
                .when()
                .post("/folders")
                .then()
                .statusCode(Response.Status.BAD_REQUEST.getStatusCode())
                .body("message", equalTo("Validation failed"));
    }
}
