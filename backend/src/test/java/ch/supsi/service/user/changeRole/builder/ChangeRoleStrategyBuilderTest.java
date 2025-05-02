package ch.supsi.service.user.changeRole.builder;

import ch.supsi.model.api.user.Role;
import ch.supsi.service.user.changeRole.strategy.DemoteStrategy;
import ch.supsi.service.user.changeRole.strategy.IChangeRoleStrategy;
import ch.supsi.service.user.changeRole.strategy.InvalidAdminStrategy;
import ch.supsi.service.user.changeRole.strategy.PromoteStrategy;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

import static org.junit.jupiter.api.Assertions.*;

@QuarkusTest
@TestMethodOrder(MethodOrderer.MethodName.class)
public class ChangeRoleStrategyBuilderTest {
    @Inject
    ChangeRoleStrategyBuilder changeRoleStrategyBuilder;

    @Test
    @DisplayName("Should return PromoteStrategy given TEACHER Role")
    void test01BuildChangeRoleStrategy_ShouldReturnPromoteStrategy_WhenRoleToPromoteIsTeacher() {
        IChangeRoleStrategy strategy = this.changeRoleStrategyBuilder.buildChangeRoleStrategy(Role.TEACHER);

        assertInstanceOf(PromoteStrategy.class, strategy);
    }

    @Test
    @DisplayName("Should return DemoteStrategy given STUDENT Role")
    void test02BuildChangeRoleStrategy_ShouldReturnDemoteStrategy_WhenRoleToPromoteIsStudent() {
        IChangeRoleStrategy strategy = this.changeRoleStrategyBuilder.buildChangeRoleStrategy(Role.STUDENT);

        assertInstanceOf(DemoteStrategy.class, strategy);
    }

    @Test
    @DisplayName("Should return AdminStrategy given ADMIN Role")
    void test03BuildChangeRoleStrategy_ShouldReturnAdminStrategy_WhenRoleToPromoteIsAdmin() {
        IChangeRoleStrategy strategy = this.changeRoleStrategyBuilder.buildChangeRoleStrategy(Role.ADMIN);

        assertInstanceOf(InvalidAdminStrategy.class, strategy);
    }

    @Test
    @DisplayName("Should support all existing roles")
    void test04VerifyAllRolesAreSupported() {
        for (Role role : Role.values())
            assertDoesNotThrow(() -> this.changeRoleStrategyBuilder.buildChangeRoleStrategy(role));
    }

    @Test
    @DisplayName("Should throw UnsupportedOperationError when give a null researching key")
    void test05BuildChangeRoleStrategy_ShouldThrowException_WhenRoleIsNull() {
        UnsupportedOperationException exception = assertThrows(
                UnsupportedOperationException.class,
                () -> this.changeRoleStrategyBuilder.buildChangeRoleStrategy(null)
        );

        assertEquals("Role not supported: null", exception.getMessage());
    }
}
