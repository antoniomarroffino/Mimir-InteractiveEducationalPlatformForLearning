package ch.supsi.repository.badgeHolder;

import ch.supsi.model.api.BadgeHolder;
import ch.supsi.repository.BadgeHolderRepository;
import ch.supsi.testContainersResource.MongoTestResource;
import io.quarkus.test.common.QuarkusTestResource;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import org.junit.jupiter.api.*;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@QuarkusTest
@QuarkusTestResource(MongoTestResource.class)
@TestMethodOrder(MethodOrderer.MethodName.class)
public class BadgeHolderRepositoryTest {
    @Inject
    BadgeHolderRepository badgeHolderRepository;

    @BeforeEach
    void cleanup() {
        this.badgeHolderRepository.deleteAll();
    }

    @Test
    @DisplayName("Should find BadgeHolder by existing Azure OID")
    void test01FindByAzureOIDOptional_Found() {
        String testOid = "test-oid-123";
        BadgeHolder badgeHolder = new BadgeHolder(testOid);
        this.badgeHolderRepository.persist(badgeHolder);

        Optional<BadgeHolder> result = this.badgeHolderRepository.findByAzureOIDOptional(testOid);

        assertTrue(result.isPresent());
        assertEquals(testOid, result.get().azureOID);
    }

    @Test
    @DisplayName("Should return empty Optional for non-existing Azure OID")
    void test02FindByAzureOIDOptional_NotFound() {
        Optional<BadgeHolder> result = this.badgeHolderRepository.findByAzureOIDOptional("non-existing-oid");

        assertFalse(result.isPresent());
    }
}
