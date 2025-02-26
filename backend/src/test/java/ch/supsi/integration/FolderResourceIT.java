package ch.supsi.integration;

import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;

@QuarkusTest
@Tag("integration")
@TestMethodOrder(MethodOrderer.MethodName.class)
public class FolderResourceIT {

    /*@Test
    void test01GetMilestones_Empty() {
       // when(this.milestoneService.getAllMilestones()).thenReturn(Collections.emptyList());

        given()
                .when().get("/folders")
                .then()
                .statusCode(200)
                .body("$", empty());

       // verify(this.milestoneService, times(1)).getAllMilestones();
    }*/
}
