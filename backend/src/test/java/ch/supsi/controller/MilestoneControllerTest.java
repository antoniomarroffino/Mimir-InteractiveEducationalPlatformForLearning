package ch.supsi.controller;

import ch.supsi.service.IMilestoneService;
import io.quarkus.test.InjectMock;
import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

import java.util.Collections;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;
import static org.mockito.Mockito.*;

@QuarkusTest
@TestMethodOrder(MethodOrderer.MethodName.class)
public class MilestoneControllerTest {

    @InjectMock
    IMilestoneService milestoneService;

    @Test
    void test01GetMilestones_Empty() {
        when(this.milestoneService.getAllMilestones()).thenReturn(Collections.emptyList());

        given()
                .when().get("/milestones")
                .then()
                .statusCode(200)
                .body("$", empty());

        verify(this.milestoneService, times(1)).getAllMilestones();
    }
}
