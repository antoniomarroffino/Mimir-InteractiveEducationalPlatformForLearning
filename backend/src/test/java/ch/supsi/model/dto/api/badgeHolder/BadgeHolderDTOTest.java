package ch.supsi.model.dto.api.badgeHolder;

import ch.supsi.model.api.badge.Badge;
import ch.supsi.model.dto.api.BadgeHolderDTO;
import ch.supsi.model.dto.api.UserWithoutCoursesDTO;
import io.quarkus.test.junit.QuarkusTest;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@QuarkusTest
@TestMethodOrder(MethodOrderer.MethodName.class)
public class BadgeHolderDTOTest {
    @Test
    @DisplayName("Should create new BadgeHolderDTO with constructor no parameters")
    void test01CreateBadgeHolder_ConstructorNoParameters() {
        BadgeHolderDTO badgeHolderDTO = new BadgeHolderDTO();
        assertNull(badgeHolderDTO.getId());
        assertNull(badgeHolderDTO.getUser());
        assertNotNull(badgeHolderDTO.getBadges());
        assertTrue(badgeHolderDTO.getBadges().isEmpty());
    }

    @Test
    @DisplayName("Should create new BadgeHolderDTO passing UserWithoutCoursesDTO to constructor")
    void test02CreateBadgeHolder_ConstructorUserWithoutCoursesDTOToConstructor() {
        String azureOid = "fake-azure-oid";
        UserWithoutCoursesDTO userWithoutCoursesDTO = new UserWithoutCoursesDTO();
        userWithoutCoursesDTO.setAzureOid(azureOid);
        BadgeHolderDTO badgeHolderDTO = new BadgeHolderDTO(userWithoutCoursesDTO);
        assertNull(badgeHolderDTO.getId());
        assertNotNull(badgeHolderDTO.getUser());
        assertEquals(azureOid, badgeHolderDTO.getUser().getAzureOid());
        assertNull(badgeHolderDTO.getUser().getName());
        assertNull(badgeHolderDTO.getUser().getEmail());
        assertNull(badgeHolderDTO.getUser().getRole());
        assertNotNull(badgeHolderDTO.getBadges());
        assertTrue(badgeHolderDTO.getBadges().isEmpty());
    }

    @Test
    @DisplayName("Should all setters work correctly")
    void test03CreateBadgeHolder_SettersWorkCorrectly() {
        String id = new ObjectId().toString();
        String azureOid = "fake-azure-oid";
        List<Badge> badges = List.of(new Badge());
        UserWithoutCoursesDTO userWithoutCoursesDTO = new UserWithoutCoursesDTO();
        userWithoutCoursesDTO.setAzureOid(azureOid);

        BadgeHolderDTO badgeHolderDTO = new BadgeHolderDTO();
        badgeHolderDTO.setId(id);
        badgeHolderDTO.setUser(userWithoutCoursesDTO);
        badgeHolderDTO.setBadges(badges);

        assertEquals(id, badgeHolderDTO.getId());
        assertNotNull(badgeHolderDTO.getUser());
        assertEquals(azureOid, badgeHolderDTO.getUser().getAzureOid());
        assertNull(badgeHolderDTO.getUser().getName());
        assertNull(badgeHolderDTO.getUser().getEmail());
        assertNull(badgeHolderDTO.getUser().getRole());
        assertNotNull(badgeHolderDTO.getBadges());

        badgeHolderDTO.setBadges(null);
        assertNotNull(badgeHolderDTO.getBadges());
        assertTrue(badgeHolderDTO.getBadges().isEmpty());
    }
}
