package ch.supsi.service.user.admin;

import ch.supsi.config.AdminConfig;
import ch.supsi.repository.UserRepository;
import com.microsoft.graph.models.User;
import io.quarkus.test.InjectMock;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import jakarta.ws.rs.InternalServerErrorException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@QuarkusTest
@TestMethodOrder(MethodOrderer.MethodName.class)
public class AdminServiceTest {
    @Inject
    AdminService adminService;

    @InjectMock
    AdminConfig adminConfig;

    @InjectMock
    UserRepository userRepository;

    private static final User testMsUser = new User();

    @Test
    @DisplayName("Should throw InternalServerError because Microsoft user passed is null")
    void test01CreateAdmin_NullUser_ShouldThrowException() {
        InternalServerErrorException exception = assertThrows(
                InternalServerErrorException.class,
                () -> this.adminService.createAdmin(null)
        );
        assertEquals("Microsoft user is null", exception.getMessage());
    }

    @Test
    @DisplayName("Should do nothing because user passed has not an admin's name")
    void test02CreateAdmin_NotAdmin_ShouldDoNothingNameIsNotAdmin() {
        this.setupTestUser("NotAdmin", "admin@test.com");
        when(this.adminConfig.getAdminNames()).thenReturn(List.of("Admin"));
        when(this.adminConfig.getAdminEmails()).thenReturn(List.of("admin@test.com"));

        this.adminService.createAdmin(testMsUser);

        verify(this.adminConfig, times(1)).getAdminNames();
        verify(this.adminConfig, never()).getAdminEmails();
        verify(this.userRepository, never()).findByAzureOidOptional(anyString());
        verify(this.userRepository, never()).persist(any(ch.supsi.model.api.user.User.class));
    }

    @Test
    @DisplayName("Should do nothing because user passed has not an admin's email")
    void test03CreateAdmin_NotAdmin_ShouldDoNothingEmailIsNotAdmin() {
        this.setupTestUser("Admin", "notAdmin@test.com");
        when(this.adminConfig.getAdminNames()).thenReturn(List.of("Admin"));
        when(this.adminConfig.getAdminEmails()).thenReturn(List.of("admin@test.com"));

        this.adminService.createAdmin(testMsUser);

        verify(this.adminConfig, times(1)).getAdminNames();
        verify(this.adminConfig, times(1)).getAdminEmails();
        verify(this.userRepository, never()).findByAzureOidOptional(anyString());
        verify(this.userRepository, never()).persist(any(ch.supsi.model.api.user.User.class));
    }

    @Test
    @DisplayName("Should do nothing because user which is admin already exist in DB")
    void test04CreateAdmin_ValidAdmin_AlreadyExists_ShouldDoNothing() {
        setupTestUser("Admin", "admin@test.com");
        when(this.adminConfig.getAdminNames()).thenReturn(List.of("Admin"));
        when(this.adminConfig.getAdminEmails()).thenReturn(List.of("admin@test.com"));
        when(this.userRepository.findByAzureOidOptional(anyString()))
                .thenReturn(Optional.of(new ch.supsi.model.api.user.User()));

        this.adminService.createAdmin(testMsUser);

        verify(this.adminConfig, times(1)).getAdminNames();
        verify(this.adminConfig, times(1)).getAdminEmails();
        verify(this.userRepository, times(1)).findByAzureOidOptional(anyString());
        verify(this.userRepository, never()).persist(any(ch.supsi.model.api.user.User.class));
    }

    @Test
    @DisplayName("Should persist new admin user")
    void test05CreateAdmin_ValidAdmin_NewUser_ShouldPersist() {
        setupTestUser("Admin", "admin@test.com");
        when(this.adminConfig.getAdminNames()).thenReturn(List.of("Admin"));
        when(this.adminConfig.getAdminEmails()).thenReturn(List.of("admin@test.com"));
        when(this.userRepository.findByAzureOidOptional(anyString()))
                .thenReturn(Optional.empty());

        this.adminService.createAdmin(testMsUser);

        verify(this.adminConfig, times(1)).getAdminNames();
        verify(this.adminConfig, times(1)).getAdminEmails();
        verify(this.userRepository, times(1)).findByAzureOidOptional(anyString());
        verify(this.userRepository, times(1)).persist(any(ch.supsi.model.api.user.User.class));    }

    @Test
    @DisplayName("Should remove all admins")
    void test06DeleteAdmins_ShouldRemoveAllAdmins() {
        ch.supsi.model.api.user.User admin1 = new ch.supsi.model.api.user.User();
        admin1.azureOid = "oid1";
        ch.supsi.model.api.user.User admin2 = new ch.supsi.model.api.user.User();
        admin2.azureOid = "oid2";

        when(this.userRepository.findAdminUsers()).thenReturn(List.of(admin1, admin2));

        this.adminService.deleteAdmins();

        verify(this.userRepository, times(1)).findAdminUsers();
        verify(this.userRepository, times(1)).deleteByAzureOid(admin1.azureOid);
        verify(this.userRepository, times(1)).deleteByAzureOid(admin2.azureOid);
    }

    private void setupTestUser(String name, String email) {
        testMsUser.id = "test-oid";
        testMsUser.displayName = name;
        testMsUser.userPrincipalName = email;
    }
}
