package ch.supsi.service.user.changeRole.strategy;

import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import jakarta.ws.rs.ForbiddenException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

@QuarkusTest
@TestMethodOrder(MethodOrderer.MethodName.class)
public class InvalidAdminStrategyTest {
    @Inject
    InvalidAdminStrategy invalidAdminStrategy;

    @Test
    @DisplayName("Should throw ForbiddenError because cannot change role directly to ADMIN")
    void test01ChangeRole_ThrowForbiddenError() {
        ForbiddenException forbiddenException = assertThrows(
                ForbiddenException.class,
                () -> invalidAdminStrategy.changeRole(new com.microsoft.graph.models.User())
        );
        assertEquals("Cannot change role to admin", forbiddenException.getMessage());
    }
}
