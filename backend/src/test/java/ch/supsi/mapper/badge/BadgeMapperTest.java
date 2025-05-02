package ch.supsi.mapper.badge;

import ch.supsi.mapper.BadgeMapper;
import ch.supsi.model.api.badge.Badge;
import ch.supsi.model.api.badge.BadgeType;
import ch.supsi.model.api.user.Role;
import ch.supsi.model.dto.api.BadgeDTO;
import ch.supsi.model.dto.api.UserWithoutCoursesDTO;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

@QuarkusTest
@TestMethodOrder(MethodOrderer.MethodName.class)
public class BadgeMapperTest {
    @Inject
    BadgeMapper badgeMapper;

    @Test
    @DisplayName("Should return null because entity passed is null")
    void test01ToDTO_ReturnNull() {
        BadgeDTO dto = this.badgeMapper.toDTO(null);
        assertNull(dto);
    }

    @Test
    @DisplayName("Should return new DTO created from an entity")
    void test02ToDTO_ReturnDTO() {
        Badge badge = new Badge(BadgeType.BEST_ATTEMPT, "TEST_OID");
        BadgeDTO dto = this.badgeMapper.toDTO(badge);
        assertNotNull(dto);
        assertEquals(badge.type, dto.getType());
        assertEquals(badge.assignedBy, dto.getAssignedBy().getAzureOid());
        assertEquals(badge.assignedAt, dto.getAssignedAt());
    }

    @Test
    @DisplayName("Should return null because dto passed is null")
    void test03ToEntity_ReturnNull() {
        Badge badge = this.badgeMapper.toEntity(null);
        assertNull(badge);
    }

    @Test
    @DisplayName("Should return new Entity created from a dto")
    void test04ToEntity_ReturnEntity() {
        UserWithoutCoursesDTO userWithoutCoursesDTO = new UserWithoutCoursesDTO("TEST_OID", "name", "email@email.com", Role.STUDENT);

        BadgeDTO badgeDTO = new BadgeDTO();
        badgeDTO.setType(BadgeType.BEST_ATTEMPT);
        badgeDTO.setAssignedBy(userWithoutCoursesDTO);
        badgeDTO.setAssignedAt(LocalDateTime.now());

        Badge badge = this.badgeMapper.toEntity(badgeDTO);
        assertNotNull(badge);
        assertEquals(badgeDTO.getType(), badge.type);
        assertEquals(badgeDTO.getAssignedBy().getAzureOid(), badge.assignedBy);
        assertEquals(badgeDTO.getAssignedAt(), badge.assignedAt);
    }
}
