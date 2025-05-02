package ch.supsi.auth.roles;

import ch.supsi.model.api.user.Role;
import ch.supsi.model.api.user.User;
import ch.supsi.service.user.IUserService;
import io.quarkus.security.identity.SecurityIdentity;
import io.quarkus.security.runtime.QuarkusSecurityIdentity;
import io.quarkus.test.InjectMock;
import io.quarkus.test.junit.QuarkusTest;
import io.smallrye.mutiny.Uni;
import io.smallrye.mutiny.helpers.test.UniAssertSubscriber;
import jakarta.inject.Inject;
import org.eclipse.microprofile.jwt.JsonWebToken;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@QuarkusTest
@TestMethodOrder(MethodOrderer.MethodName.class)
public class RolesAugmentorTest {

    private static final String TEST_OID = "test-oid-123";
    @Inject
    RolesAugmentor rolesAugmentor;
    @InjectMock
    IUserService userService;
    @InjectMock
    JsonWebToken jwt;

    @Test
    @DisplayName("Should add Student Role because user is not founded by his azure oid in DB")
    void test01Augment_ShouldAddStudentRole_WhenUserNotFound() {
        when(this.jwt.getClaim("oid")).thenReturn(TEST_OID);

        SecurityIdentity identity = QuarkusSecurityIdentity.builder()
                .setPrincipal(this.jwt)
                .build();

        when(this.userService.getUserByAzureOid(TEST_OID)).thenReturn(null);

        Uni<SecurityIdentity> result = this.rolesAugmentor.augment(identity, null);
        SecurityIdentity augmented = result.subscribe().withSubscriber(UniAssertSubscriber.create())
                .awaitItem()
                .getItem();

        assertTrue(augmented.getRoles().contains(Role.STUDENT.name()));
        assertFalse(augmented.getRoles().contains(Role.TEACHER.name()));
    }

    @Test
    @DisplayName("Should add Teacher Role, User is saved in DB")
    void test02Augment_ShouldAddUserTeacherRole_WhenUserExistsAndIsTeacher() {
        User user = new User();
        user.role = Role.TEACHER;

        when(this.jwt.getClaim("oid")).thenReturn(TEST_OID);

        SecurityIdentity identity = QuarkusSecurityIdentity.builder()
                .setPrincipal(this.jwt)
                .build();

        when(this.userService.getUserByAzureOid(TEST_OID)).thenReturn(user);

        Uni<SecurityIdentity> result = this.rolesAugmentor.augment(identity, null);
        SecurityIdentity augmented = result.subscribe().withSubscriber(UniAssertSubscriber.create())
                .awaitItem()
                .getItem();

        assertTrue(augmented.getRoles().contains(Role.TEACHER.name()));
        assertEquals(1, augmented.getRoles().size());
    }

    @Test
    @DisplayName("Should add Admin Role, User is saved in DB")
    void test03Augment_ShouldAddUserAdminRole_WhenUserExistsAndIsAdmin() {
        User user = new User();
        user.role = Role.ADMIN;

        when(this.jwt.getClaim("oid")).thenReturn(TEST_OID);

        SecurityIdentity identity = QuarkusSecurityIdentity.builder()
                .setPrincipal(this.jwt)
                .build();

        when(this.userService.getUserByAzureOid(TEST_OID)).thenReturn(user);

        Uni<SecurityIdentity> result = this.rolesAugmentor.augment(identity, null);
        SecurityIdentity augmented = result.subscribe().withSubscriber(UniAssertSubscriber.create())
                .awaitItem()
                .getItem();

        assertTrue(augmented.getRoles().contains(Role.ADMIN.name()));
        assertEquals(1, augmented.getRoles().size());
    }

    @Test
    @DisplayName("Should return same identity passed because is anonymous")
    void test04Augment_ShouldReturnSameIdentity_ForAnonymousUser() {
        SecurityIdentity identity = QuarkusSecurityIdentity.builder()
                .setAnonymous(true)
                .build();

        Uni<SecurityIdentity> result = this.rolesAugmentor.augment(identity, null);
        SecurityIdentity augmented = result.subscribe().withSubscriber(UniAssertSubscriber.create())
                .awaitItem()
                .getItem();

        assertTrue(augmented.isAnonymous());
        assertTrue(augmented.getRoles().isEmpty());
    }

    @Test
    @DisplayName("Should handle missing oid claim from jwt gracefully")
    void test05Augment_ShouldHandleMissingOidClaimGracefully() {
        SecurityIdentity identity = QuarkusSecurityIdentity.builder()
                .setPrincipal(this.jwt)
                .build();

        Uni<SecurityIdentity> result = this.rolesAugmentor.augment(identity, null);
        SecurityIdentity augmented = result.subscribe().withSubscriber(UniAssertSubscriber.create())
                .awaitItem()
                .getItem();

        assertTrue(augmented.getRoles().contains(Role.STUDENT.name()));
    }
}