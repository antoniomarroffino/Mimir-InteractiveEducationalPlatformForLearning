package ch.supsi.controller.badgeHolder;

import ch.supsi.controller.badgeholder.BadgeHolderController;
import ch.supsi.model.api.badge.Badge;
import ch.supsi.model.dto.api.BadgeHolderDTO;
import ch.supsi.model.dto.api.UserWithoutCoursesDTO;
import ch.supsi.service.badgeholder.IBadgeHolderService;
import ch.supsi.service.user.IUserService;
import ch.supsi.service.user.microsoftGraph.IMicrosoftGraphService;
import com.microsoft.graph.models.User;
import io.quarkus.test.InjectMock;
import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.security.TestSecurity;
import jakarta.inject.Inject;
import jakarta.ws.rs.BadRequestException;
import jakarta.ws.rs.NotFoundException;
import jakarta.ws.rs.core.Response;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@QuarkusTest
@TestMethodOrder(MethodOrderer.MethodName.class)
public class BadgeHolderControllerTest {
    @Inject
    BadgeHolderController badgeHolderController;

    @InjectMock
    IBadgeHolderService badgeHolderService;

    @InjectMock
    IMicrosoftGraphService microsoftGraphService;

    @InjectMock
    IUserService userService;

    @Test
    @DisplayName("Should return empty list")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    void test01GetAllBadgeHolders_Empty() {
        when(this.badgeHolderService.getAllBadgeHolders()).thenReturn(Collections.emptyList());

        Response response = this.badgeHolderController.getAllBadgeHolders();

        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        assertTrue(((List<?>) response.getEntity()).isEmpty());

        verify(this.badgeHolderService, times(1)).getAllBadgeHolders();
        verifyNoMoreInteractions(this.userService, this.microsoftGraphService);
    }

    @Test
    @DisplayName("Should return badge holders with user info")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    void test02GetAllBadgeHolders_WithData() {
        UserWithoutCoursesDTO user = new UserWithoutCoursesDTO();
        user.setAzureOid("test-oid");
        BadgeHolderDTO dto = new BadgeHolderDTO();
        dto.setUser(user);

        when(this.badgeHolderService.getAllBadgeHolders()).thenReturn(List.of(dto));
        when(this.microsoftGraphService.getUserByOid(anyString())).thenReturn(new com.microsoft.graph.models.User());
        when(this.userService.buildUserWithoutCoursesDTO(any(com.microsoft.graph.models.User.class))).thenReturn(user);

        Response response = this.badgeHolderController.getAllBadgeHolders();

        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        List<BadgeHolderDTO> result = (List<BadgeHolderDTO>) response.getEntity();
        assertNotNull(result.getFirst().getUser());

        verify(this.badgeHolderService, times(1)).getAllBadgeHolders();
        verify(this.microsoftGraphService, times(1)).getUserByOid(anyString());
        verify(this.userService, times(1)).buildUserWithoutCoursesDTO(any(com.microsoft.graph.models.User.class));
    }

    @Test
    @DisplayName("Should throw Forbidden exception due to role not supported this operation")
    @TestSecurity(user = "testUser", roles = "STUDENT")
    void test03GetAllBadgeHolders_Unauthorized() {
        assertThrows(
                io.quarkus.security.ForbiddenException.class,
                () -> this.badgeHolderController.getAllBadgeHolders()
        );
    }

    @Test
    @DisplayName("Should return badge holder")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    void test04GetBadgeHolder_Success() {
        UserWithoutCoursesDTO user = new UserWithoutCoursesDTO();
        user.setAzureOid("test oid");
        BadgeHolderDTO dto = new BadgeHolderDTO();
        dto.setUser(user);

        when(this.badgeHolderService.getBadgeHolderByAzureOID(anyString())).thenReturn(dto);
        when(this.microsoftGraphService.getUserByOid(anyString())).thenReturn(new User());
        when(this.userService.buildUserWithoutCoursesDTO(any(User.class))).thenReturn(user);

        Response response = this.badgeHolderController.getBadgeHolder(user.getAzureOid());

        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        assertNotNull(((BadgeHolderDTO) response.getEntity()).getUser());

        verify(this.badgeHolderService, times(1)).getBadgeHolderByAzureOID(anyString());
        verify(this.microsoftGraphService, times(1)).getUserByOid(anyString());
        verify(this.userService, times(1)).buildUserWithoutCoursesDTO(any(User.class));
    }

    @Test
    @DisplayName("Should throw 404 because BadgeHolder does not exist so it is not found by AzureOID")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    void test05GetBadgeHolder_NotFound() {
        when(this.badgeHolderService.getBadgeHolderByAzureOID(anyString()))
                .thenThrow(new NotFoundException());

        assertThrows(
                NotFoundException.class,
                () -> this.badgeHolderController.getBadgeHolder("invalidOID")
        );
    }

    @Test
    @DisplayName("Should assign badge")
    @TestSecurity(user = "testUser", roles = "TEACHER")
    void test06AssignBadge_Success() {
        Response response = this.badgeHolderController.assignBadge("validOID", new Badge());

        assertEquals(Response.Status.NO_CONTENT.getStatusCode(), response.getStatus());

        verify(this.badgeHolderService, times(1)).addBadgeToHolder(anyString(), any(Badge.class));
    }

    @Test
    @DisplayName("Should throw Forbidden exception due to role not supported this operation")
    @TestSecurity(user = "testUser", roles = "STUDENT")
    void test07AssignBadge_Unauthorized() {
        assertThrows(
                io.quarkus.security.ForbiddenException.class,
                () -> this.badgeHolderController.assignBadge("test-oid", new Badge())
        );
    }
}
