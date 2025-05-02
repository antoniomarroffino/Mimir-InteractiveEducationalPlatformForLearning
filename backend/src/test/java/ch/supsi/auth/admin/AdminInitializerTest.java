package ch.supsi.auth.admin;

import ch.supsi.config.AdminConfig;
import ch.supsi.service.user.admin.IAdminService;
import ch.supsi.service.user.microsoftGraph.IMicrosoftGraphService;
import io.quarkus.test.InjectMock;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import org.junit.jupiter.api.*;

import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@QuarkusTest
@TestMethodOrder(MethodOrderer.MethodName.class)
public class AdminInitializerTest {

    private static final List<String> TEST_EMAILS = List.of("admin1@test.com", "admin2@test.com");
    private static final com.microsoft.graph.models.User MOCK_USER = new com.microsoft.graph.models.User();
    @Inject
    AdminInitializer adminInitializer;
    @InjectMock
    IMicrosoftGraphService microsoftGraphService;
    @InjectMock
    IAdminService adminService;
    @InjectMock
    AdminConfig adminConfig;

    @BeforeEach
    void setUp() {
        MOCK_USER.id = "user-id";
        MOCK_USER.userPrincipalName = "user@test.com";

        when(this.adminConfig.getAdminEmails()).thenReturn(TEST_EMAILS);
        when(this.microsoftGraphService.getUserByEmail(any())).thenReturn(MOCK_USER);
    }

    @Test
    @DisplayName("Should create admins for all configured emails")
    void test01OnStart_ShouldCreateAdminsForAllConfiguredEmails() {
        this.adminInitializer.onStart(null);

        verify(this.adminConfig, times(1)).getAdminEmails();
        verify(this.microsoftGraphService, times(TEST_EMAILS.size())).getUserByEmail(any());
        verify(this.adminService, times(TEST_EMAILS.size())).createAdmin(MOCK_USER);
    }

    @Test
    @DisplayName("Should handle an empty list of possible admins")
    void test02OnStart_ShouldHandleEmptyAdminList() {
        when(this.adminConfig.getAdminEmails()).thenReturn(Collections.emptyList());

        this.adminInitializer.onStart(null);

        verify(this.adminService, never()).createAdmin(any());
    }

    @Test
    @DisplayName("Should handle gracefully exception if admin email is not founded")
    void test03OnStart_ShouldHandleServiceErrorsGracefully() {
        when(this.microsoftGraphService.getUserByEmail("admin1@test.com"))
                .thenThrow(new RuntimeException("API Error"));

        assertThrows(RuntimeException.class, () -> this.adminInitializer.onStart(null));
    }
}