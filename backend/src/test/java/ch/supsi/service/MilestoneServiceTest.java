package ch.supsi.service;

import ch.supsi.model.Milestone;
import ch.supsi.service.testContainersResource.MongoTestResource;
import io.quarkus.test.common.QuarkusTestResource;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import org.junit.jupiter.api.*;


import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@QuarkusTest
@QuarkusTestResource(MongoTestResource.class)
@TestMethodOrder(MethodOrderer.MethodName.class)
public class MilestoneServiceTest {

    @Inject
    MilestoneService milestoneServiceTest;

    @BeforeEach
    @AfterEach
    void cleanup() {
        Milestone.deleteAll();
    }

    @Test
    @DisplayName("Should get empty list of milestones")
    void test01GetAllMilestones_Empty() {
        List<Milestone> milestones = this.milestoneServiceTest.getAllMilestones();
        assertTrue(milestones.isEmpty());
    }

    @Test
    @DisplayName("Should add two milestones and get them back")
    void test02GetAllMilestones() {
        Milestone milestone1 = new Milestone("Test Milestone1");
        Milestone milestone2 = new Milestone("Test Milestone2");

        milestone1.persist();
        milestone2.persist();

        List<Milestone> milestones = this.milestoneServiceTest.getAllMilestones();

        assertEquals(2, milestones.size());

        Milestone milestone1Retrieved = milestones.getFirst();
        assertNotNull(milestone1Retrieved.id);
        assertEquals("Test Milestone1", milestone1Retrieved.getName());

        Milestone milestone2Retrieved = milestones.get(1);
        assertNotNull(milestone2Retrieved.id);
        assertEquals("Test Milestone2", milestone2Retrieved.getName());
    }

    @Test
    @DisplayName("Should create one milestone")
    void test03CreateMilestone() {
        Milestone milestone = new Milestone("Test Milestone");

        assertTrue(this.milestoneServiceTest.getAllMilestones().isEmpty());

        this.milestoneServiceTest.createMilestone(milestone);

        assertEquals(1, Milestone.listAll().size());

        Milestone milestoneRetrieved = this.milestoneServiceTest.getAllMilestones().getFirst();
        assertNotNull(milestoneRetrieved.id);
        assertEquals("Test Milestone", milestoneRetrieved.getName());
    }
}