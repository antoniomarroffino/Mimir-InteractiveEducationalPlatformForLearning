package ch.supsi.service.user.changeRole.strategy;

import ch.supsi.model.api.user.Role;
import ch.supsi.repository.UserRepository;
import com.microsoft.graph.models.User;
import io.quarkus.test.InjectMock;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import org.junit.jupiter.api.*;

import java.util.Optional;

import static org.mockito.Mockito.*;

@QuarkusTest
@TestMethodOrder(MethodOrderer.MethodName.class)
public class PromoteStrategyTest {
    private static final User TEST_MICROSOFT_USER = new User();
    private static final String TEST_OID = "oid-123";
    @Inject
    PromoteStrategy promoteStrategy;
    @InjectMock
    UserRepository userRepository;

    @BeforeEach
    public void setup() {
        TEST_MICROSOFT_USER.id = TEST_OID;
    }

    @Test
    @DisplayName("Should do nothing because user is already a Teacher")
    void test01ChangeRole_DoNothingUserIsAlreadyATeacher() {
        ch.supsi.model.api.user.User teacher = new ch.supsi.model.api.user.User();
        teacher.azureOid = TEST_OID;
        teacher.role = Role.TEACHER;

        when(this.userRepository.findByAzureOidOptional(TEST_OID)).thenReturn(Optional.of(teacher));

        this.promoteStrategy.changeRole(TEST_MICROSOFT_USER);

        verify(this.userRepository, times(1)).findByAzureOidOptional(TEST_OID);
        verify(this.userRepository, never()).persist(any(ch.supsi.model.api.user.User.class));
    }

    @Test
    @DisplayName("Should change role correctly to TEACHER")
    void test02ChangeRole() {
        when(this.userRepository.findByAzureOidOptional(TEST_OID)).thenReturn(Optional.empty());

        this.promoteStrategy.changeRole(TEST_MICROSOFT_USER);

        verify(this.userRepository, times(1)).findByAzureOidOptional(TEST_OID);
        verify(this.userRepository, times(1)).persist(any(ch.supsi.model.api.user.User.class));
    }
}
