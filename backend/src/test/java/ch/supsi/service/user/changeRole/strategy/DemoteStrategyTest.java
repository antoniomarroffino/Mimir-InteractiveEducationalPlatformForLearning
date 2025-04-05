package ch.supsi.service.user.changeRole.strategy;

import ch.supsi.model.api.user.Role;
import ch.supsi.repository.UserRepository;
import com.microsoft.graph.models.User;
import io.quarkus.test.InjectMock;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import jakarta.ws.rs.ForbiddenException;
import org.junit.jupiter.api.*;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;


@QuarkusTest
@TestMethodOrder(MethodOrderer.MethodName.class)
public class DemoteStrategyTest {
    @Inject
    DemoteStrategy demoteStrategy;

    @InjectMock
    UserRepository userRepository;

    private static final User TEST_MICROSOFT_USER = new User();

    private static final String TEST_OID = "oid-123";

    @BeforeEach
    public void setup() {
        TEST_MICROSOFT_USER.id = TEST_OID;
    }

    @Test
    @DisplayName("Should do nothing because user is already a Student")
    void test01ChangeRole_DoNothingUserIsAlreadyAStudent() {
        when(this.userRepository.findByAzureOidOptional(TEST_OID)).thenReturn(Optional.empty());

        this.demoteStrategy.changeRole(TEST_MICROSOFT_USER);

        verify(this.userRepository, times(1)).findByAzureOidOptional(TEST_OID);
        verify(this.userRepository, never()).deleteByAzureOid(TEST_OID);
    }

    @Test
    @DisplayName("Should throw ForbiddenError because want to modify ADMIN user to STUDENT")
    void test02ChangeRole_ThrowForbiddenErrorUserIsAdmin() {
        ch.supsi.model.api.user.User user = new ch.supsi.model.api.user.User();
        user.azureOid = TEST_OID;
        user.role = Role.ADMIN;

        when(this.userRepository.findByAzureOidOptional(TEST_OID)).thenReturn(Optional.of(user));

        ForbiddenException exception = assertThrows(
                ForbiddenException.class,
                () -> this.demoteStrategy.changeRole(TEST_MICROSOFT_USER)
        );

        assertEquals("Cannot change role of admin", exception.getMessage());

        verify(this.userRepository, times(1)).findByAzureOidOptional(TEST_OID);
        verify(this.userRepository, never()).deleteByAzureOid(TEST_OID);
    }

    @Test
    @DisplayName("Should change role correctly to STUDENT")
    void test03ChangeRole() {
        ch.supsi.model.api.user.User user = new ch.supsi.model.api.user.User();
        user.azureOid = TEST_OID;
        user.role = Role.TEACHER;

        when(this.userRepository.findByAzureOidOptional(TEST_OID)).thenReturn(Optional.of(user));

        this.demoteStrategy.changeRole(TEST_MICROSOFT_USER);

        verify(this.userRepository, times(1)).findByAzureOidOptional(TEST_OID);
        verify(this.userRepository, times(1)).deleteByAzureOid(TEST_OID);
    }
}
