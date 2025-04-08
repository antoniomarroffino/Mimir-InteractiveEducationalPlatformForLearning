package ch.supsi.service.user;

import ch.supsi.model.api.user.Role;
import ch.supsi.model.api.user.User;
import ch.supsi.model.dto.api.UserWithoutCoursesDTO;
import ch.supsi.repository.UserRepository;
import ch.supsi.service.user.changeRole.builder.ChangeRoleStrategyBuilder;
import ch.supsi.service.user.changeRole.strategy.PromoteStrategy;
import io.quarkus.security.identity.SecurityIdentity;
import io.quarkus.test.InjectMock;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import jakarta.ws.rs.InternalServerErrorException;
import jakarta.ws.rs.NotFoundException;
import org.eclipse.microprofile.jwt.JsonWebToken;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.mockito.InOrder;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@QuarkusTest
@TestMethodOrder(MethodOrderer.MethodName.class)
public class UserServiceTest {
    private static final String TEST_OID = "test-oid-123";
    private static final String TEST_NAME = "Test User";
    private static final String TEST_EMAIL = "test@example.com";
    private static final String OID_CLAIM_KEY = "oid";
    private static final String NAME_CLAIM_KEY = "name";
    private static final String EMAIL_CLAIM_KEY = "preferred_username";
    @Inject
    UserService userService;
    @InjectMock
    UserRepository userRepository;
    @InjectMock
    SecurityIdentity securityIdentity;
    @InjectMock
    JsonWebToken jwt;
    @InjectMock
    ChangeRoleStrategyBuilder changeRoleStrategyBuilder;

    public static User createTestUser(String azureOid, Role role) {
        User user = new User();
        user.azureOid = azureOid;
        user.role = role;
        return user;
    }

    @Test
    @DisplayName("Should return list of teachers from repository")
    void test01GetTeachers_ReturnsTeachersList() {
        User teacher = createTestUser(TEST_OID, Role.TEACHER);
        when(this.userRepository.findTeacherUsers()).thenReturn(List.of(teacher));

        List<User> result = this.userService.getTeachers();

        assertEquals(1, result.size());
        assertEquals(teacher.azureOid, result.getFirst().azureOid);

        verify(this.userRepository, times(1)).findTeacherUsers();
    }

    @Test
    @DisplayName("Should return null because user is not found in DB by his azure ID so is a STUDENT")
    void test02GetUSerByAzureOid_ReturnNullUserIsStudent() {
        when(this.userRepository.findByAzureOidOptional(anyString())).thenReturn(Optional.empty());
        User foundedByOid = this.userService.getUserByAzureOid(TEST_OID);
        assertNull(foundedByOid);
        verify(this.userRepository, times(1)).findByAzureOidOptional(TEST_OID);
    }

    @Test
    @DisplayName("Should return user founded by Azure Oid, he is TEACHER or ADMIN")
    void test03GetUSerByAzureOid_ReturnUserFoundedByAzureOid() {
        User user = createTestUser(TEST_OID, Role.TEACHER);
        when(this.userRepository.findByAzureOidOptional(TEST_OID)).thenReturn(Optional.of(user));
        User foundedByOid = this.userService.getUserByAzureOid(TEST_OID);
        assertNotNull(foundedByOid);
        assertEquals(user.azureOid, foundedByOid.azureOid);
        verify(this.userRepository, times(1)).findByAzureOidOptional(TEST_OID);
    }

    @Test
    @DisplayName("Should throw InternalServerError because MicrosoftUser passed is null")
    void test04ChangeRole_ThrowsInternalServerErrorMicrosoftUserPassedIsNull() {
        PromoteStrategy changeRoleStrategyMocked = mock(PromoteStrategy.class);
        InternalServerErrorException exception = assertThrows(
                InternalServerErrorException.class,
                () -> this.userService.changeRole(null, Role.TEACHER)
        );
        assertEquals("Microsoft user is null", exception.getMessage());
        verify(this.changeRoleStrategyBuilder, never()).buildChangeRoleStrategy(any(Role.class));
        verify(changeRoleStrategyMocked, never()).changeRole(any());
    }

    @Test
    @DisplayName("Should throw UnsupportedOperationError because Role passed is unsupported or null")
    void test05ChangeRole_ThrowsInternalServerErrorMicrosoftUserPassedIsNull() {
        PromoteStrategy changeRoleStrategyMocked = mock(PromoteStrategy.class);

        when(this.changeRoleStrategyBuilder.buildChangeRoleStrategy(null)).thenThrow(new UnsupportedOperationException("Role not supported: null"));

        UnsupportedOperationException exception = assertThrows(
                UnsupportedOperationException.class,
                () -> this.userService.changeRole(new com.microsoft.graph.models.User(), null)
        );
        assertEquals("Role not supported: null", exception.getMessage());
        verify(this.changeRoleStrategyBuilder, times(1)).buildChangeRoleStrategy(null);
        verify(changeRoleStrategyMocked, never()).changeRole(any());
    }

    @Test
    @DisplayName("Should change role of a User correctly")
    void test06ChangeRole() {
        PromoteStrategy changeRoleStrategyMocked = mock(PromoteStrategy.class);

        when(this.changeRoleStrategyBuilder.buildChangeRoleStrategy(any(Role.class))).thenReturn(changeRoleStrategyMocked);

        this.userService.changeRole(new com.microsoft.graph.models.User(), Role.TEACHER);

        verify(this.changeRoleStrategyBuilder, times(1)).buildChangeRoleStrategy(any(Role.class));
        verify(changeRoleStrategyMocked, times(1)).changeRole(any(com.microsoft.graph.models.User.class));
    }

    @Test
    @DisplayName("Should return logged user when exists in database")
    void test04GetCurrentLoggedUser_UserFound() {
        User expectedUser = createTestUser(TEST_OID, Role.STUDENT);

        when(this.securityIdentity.getPrincipal()).thenReturn(this.jwt);
        when(this.jwt.getClaim(OID_CLAIM_KEY)).thenReturn(TEST_OID);
        when(this.userRepository.findByAzureOidOptional(TEST_OID)).thenReturn(Optional.of(expectedUser));

        InOrder inOrder = inOrder(this.userRepository, this.securityIdentity, this.jwt);

        User result = this.userService.getCurrentLoggedUser();

        assertEquals(expectedUser.azureOid, result.azureOid);

        inOrder.verify(this.securityIdentity, times(1)).getPrincipal();
        inOrder.verify(this.jwt, times(1)).getClaim(OID_CLAIM_KEY);
        inOrder.verify(this.userRepository, times(1)).findByAzureOidOptional(TEST_OID);
    }

    @Test
    @DisplayName("Should throw NotFoundError because user does not exist in db")
    void test05GetCurrentLoggedUser_ThrowNotFoundErrorUserDoesNotExistInDB() {
        when(this.securityIdentity.getPrincipal()).thenReturn(this.jwt);
        when(this.jwt.getClaim(OID_CLAIM_KEY)).thenReturn(TEST_OID);
        when(this.userRepository.findByAzureOidOptional(TEST_OID)).thenReturn(Optional.empty());

        InOrder inOrder = inOrder(this.userRepository, this.securityIdentity, this.jwt);

        NotFoundException exception = assertThrows(
                NotFoundException.class,
                () -> this.userService.getCurrentLoggedUser()
        );

        assertEquals("User with oid " + TEST_OID + " not found", exception.getMessage());

        inOrder.verify(this.securityIdentity, times(1)).getPrincipal();
        inOrder.verify(this.jwt, times(1)).getClaim(OID_CLAIM_KEY);
        inOrder.verify(this.userRepository, times(1)).findByAzureOidOptional(TEST_OID);
    }

    @Test
    @DisplayName("Should build DTO with existing user role")
    void test06BuildUserWithoutCoursesDTO_UserExists() {
        com.microsoft.graph.models.User msUser = new com.microsoft.graph.models.User();
        msUser.id = TEST_OID;
        msUser.displayName = TEST_NAME;
        msUser.userPrincipalName = TEST_EMAIL;

        User dbUser = createTestUser(TEST_OID, Role.TEACHER);

        when(this.userRepository.findByAzureOidOptional(msUser.id)).thenReturn(Optional.of(dbUser));

        UserWithoutCoursesDTO dto = this.userService.buildUserWithoutCoursesDTO(msUser);

        assertEquals(TEST_OID, dto.getAzureOid());
        assertEquals(TEST_NAME, dto.getName());
        assertEquals(TEST_EMAIL, dto.getEmail());
        assertEquals(Role.TEACHER, dto.getRole());

        verify(this.userRepository, times(1)).findByAzureOidOptional(TEST_OID);
    }

    @Test
    @DisplayName("Should build DTO with default STUDENT role")
    void test07BuildUserWithoutCoursesDTO_UserNotExistsInDBSoIsAStudent() {
        com.microsoft.graph.models.User msUser = new com.microsoft.graph.models.User();
        msUser.id = TEST_OID;
        msUser.displayName = TEST_NAME;
        msUser.userPrincipalName = TEST_EMAIL;

        when(this.userRepository.findByAzureOidOptional(msUser.id)).thenReturn(Optional.empty());

        UserWithoutCoursesDTO dto = this.userService.buildUserWithoutCoursesDTO(msUser);

        assertEquals(TEST_OID, dto.getAzureOid());
        assertEquals(TEST_NAME, dto.getName());
        assertEquals(TEST_EMAIL, dto.getEmail());
        assertEquals(Role.STUDENT, dto.getRole());

        verify(this.userRepository, times(1)).findByAzureOidOptional(TEST_OID);

    }

    @Test
    @DisplayName("Should throw exception when building DTO with null microsoft user passed")
    void test08BuildUserWithoutCoursesDTO_ThrowsInternalServerErrorMicrosoftUserPassedIsNull() {
        InternalServerErrorException exception = assertThrows(
                InternalServerErrorException.class,
                () -> userService.buildUserWithoutCoursesDTO(null)
        );
        assertEquals("Microsoft user is null", exception.getMessage());

        verify(this.userRepository, never()).findByAzureOidOptional(TEST_OID);
    }

    @Test
    @DisplayName("Should extract OID from JWT claims")
    void test09GetOidFromJWT_ReturnsValue() {
        when(this.securityIdentity.getPrincipal()).thenReturn(this.jwt);
        when(this.jwt.getClaim(OID_CLAIM_KEY)).thenReturn(TEST_OID);

        String result = this.userService.getOidFromJWT();

        assertEquals(TEST_OID, result);

        verify(this.securityIdentity, times(1)).getPrincipal();
        verify(this.jwt, times(1)).getClaim(OID_CLAIM_KEY);
    }

    @Test
    @DisplayName("Should extract name from JWT claims")
    void test10GetNameFromJWT_ReturnsValue() {
        when(this.securityIdentity.getPrincipal()).thenReturn(this.jwt);
        when(this.jwt.getClaim(NAME_CLAIM_KEY)).thenReturn(TEST_NAME);

        String result = this.userService.getNameFromJWT();

        assertEquals(TEST_NAME, result);

        verify(this.securityIdentity, times(1)).getPrincipal();
        verify(this.jwt, times(1)).getClaim(NAME_CLAIM_KEY);
    }

    @Test
    @DisplayName("Should extract email from JWT claims")
    void test11GetEmailFromJWT_ReturnsValue() {
        when(this.securityIdentity.getPrincipal()).thenReturn(this.jwt);
        when(this.jwt.getClaim(EMAIL_CLAIM_KEY)).thenReturn(TEST_EMAIL);

        String result = this.userService.getEmailFromJWT();

        assertEquals(TEST_EMAIL, result);

        verify(this.securityIdentity, times(1)).getPrincipal();
        verify(this.jwt, times(1)).getClaim(EMAIL_CLAIM_KEY);
    }
}
