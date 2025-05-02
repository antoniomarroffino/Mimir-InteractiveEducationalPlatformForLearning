package ch.supsi.model.api.badgeHolder;

import ch.supsi.model.api.BadgeHolder;
import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

import static org.junit.jupiter.api.Assertions.*;

@QuarkusTest
@TestMethodOrder(MethodOrderer.MethodName.class)
public class BadgeHolderTest {
    @Test
    @DisplayName("Should create new BadgeHolder with constructor no parameters")
    void test01CreateBadgeHolder_ConstructorNoParameters() {
        BadgeHolder badgeHolder = new BadgeHolder();
        assertNull(badgeHolder.id);
        assertNull(badgeHolder.azureOID);
        assertNotNull(badgeHolder.badges);
        assertTrue(badgeHolder.badges.isEmpty());
    }

    @Test
    @DisplayName("Should create new BadgeHolder passing azureOid")
    void test02CreateBadgeHolder_PassingAzureOidToConstructor() {
        String azureOid = "fake-azure-oid";
        BadgeHolder badgeHolder = new BadgeHolder(azureOid);
        assertNull(badgeHolder.id);
        assertEquals(azureOid, badgeHolder.azureOID);
        assertNotNull(badgeHolder.badges);
        assertTrue(badgeHolder.badges.isEmpty());
    }
}
