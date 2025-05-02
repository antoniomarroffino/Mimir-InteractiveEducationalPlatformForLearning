package ch.supsi.model.api.badge;

import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

import static org.junit.jupiter.api.Assertions.*;

@QuarkusTest
@TestMethodOrder(MethodOrderer.MethodName.class)
public class BadgeTest {
    @Test
    @DisplayName("Should create a badge with a constructor with no parameters")
    void test01CreateBadge_ConstructorWithNoParameters() {
        Badge badge = new Badge();
        assertNotNull(badge.assignedAt);
        assertNull(badge.assignedBy);
        assertNull(badge.type);
    }

    @Test
    @DisplayName("Should create a badge passing parameters")
    void test02CreateBadge_ConstructorWithParameters() {
        String assignedBy = "TEST-OID";
        Badge badge = new Badge(BadgeType.BEST_ATTEMPT, assignedBy);
        assertEquals(assignedBy, badge.assignedBy);
        assertEquals(BadgeType.BEST_ATTEMPT, badge.type);
        assertNotNull(badge.assignedAt);
    }

    @Test
    @DisplayName("Should create correctly a Badge.BEST_ATTEMPT with parameters")
    void test03CreateBadgeBEST_ATTEMPT_Correctly() {
        assertEquals("Best attempt", BadgeType.BEST_ATTEMPT.getDisplayName());
        assertEquals("trophy", BadgeType.BEST_ATTEMPT.getIcon());
    }
}
