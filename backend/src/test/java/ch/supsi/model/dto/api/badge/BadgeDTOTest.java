package ch.supsi.model.dto.api.badge;

import ch.supsi.model.api.badge.BadgeType;
import ch.supsi.model.dto.api.BadgeDTO;
import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

@QuarkusTest
@TestMethodOrder(MethodOrderer.MethodName.class)
public class BadgeDTOTest {
    @Test
    @DisplayName("Should create new BadgeDTO with constructor no parameters")
    void test01CreateBadgeDTO_ConstructorWithNoParameters() {
        BadgeDTO badgeDTO = new BadgeDTO();
        assertNull(badgeDTO.getType());
        assertNull(badgeDTO.getAssignedAt());
        assertNull(badgeDTO.getAssignedBy());
    }

    @Test
    @DisplayName("Should create new BadgeDTO empty but setting all fields with setters")
    void test02CreateBadgeDTO_Setters() {
        BadgeDTO badgeDTO = new BadgeDTO();
        String assignedBy = "TEST-OID";
        LocalDateTime assignedAt = LocalDateTime.now();
        badgeDTO.setAssignedBy(assignedBy);
        badgeDTO.setAssignedAt(assignedAt);
        badgeDTO.setType(BadgeType.BEST_ATTEMPT);

        assertEquals(assignedAt, badgeDTO.getAssignedAt());
        assertEquals(assignedBy, badgeDTO.getAssignedBy());
        assertEquals(BadgeType.BEST_ATTEMPT, badgeDTO.getType());
    }
}
