package ch.supsi.model.dto.api.badgeHolder;

import ch.supsi.model.api.badge.Badge;
import ch.supsi.model.dto.api.BadgeHolderDTO;
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
        assertNull(badgeHolderDTO.getAzureOID());
        assertNotNull(badgeHolderDTO.getBadges());
        assertTrue(badgeHolderDTO.getBadges().isEmpty());
    }

    @Test
    @DisplayName("Should create new BadgeHolderDTO passing azure oid to constructor")
    void test02CreateBadgeHolder_ConstructorAzureOidToConstructor() {
        String azureOid = "fake-azure-oid";
        BadgeHolderDTO badgeHolderDTO = new BadgeHolderDTO(azureOid);
        assertNull(badgeHolderDTO.getId());
        assertEquals(azureOid, badgeHolderDTO.getAzureOID());
        assertNotNull(badgeHolderDTO.getBadges());
        assertTrue(badgeHolderDTO.getBadges().isEmpty());
    }

    @Test
    @DisplayName("Should all setters work correctly")
    void test03CreateBadgeHolder_SettersWorkCorrectly() {
        String id = new ObjectId().toString();
        String azureOid = "fake-azure-oid";
        List<Badge> badges = List.of(new Badge());

        BadgeHolderDTO badgeHolderDTO = new BadgeHolderDTO();
        badgeHolderDTO.setId(id);
        badgeHolderDTO.setAzureOID(azureOid);
        badgeHolderDTO.setBadges(badges);

        assertEquals(id, badgeHolderDTO.getId());
        assertEquals(azureOid, badgeHolderDTO.getAzureOID());
        assertNotNull(badgeHolderDTO.getBadges());
    }
}
