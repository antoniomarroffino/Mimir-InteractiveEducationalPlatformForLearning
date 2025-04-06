package ch.supsi.service.user.microsoftGraph;

import ch.supsi.config.GraphClientConfig;
import com.microsoft.graph.models.User;
import com.microsoft.graph.requests.*;
import io.quarkus.test.InjectMock;
import io.quarkus.test.Mock;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import jakarta.ws.rs.InternalServerErrorException;
import jakarta.ws.rs.NotFoundException;
import okhttp3.Request;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InOrder;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@QuarkusTest
@TestMethodOrder(MethodOrderer.MethodName.class)
public class MicrosoftGraphServiceTest {
    @Inject
    MicrosoftGraphService microsoftGraphService;

    @InjectMock
    GraphClientConfig graphClientConfig;

    private GraphServiceClient<Request> graphServiceClient;

    private static final String TEST_OID = "test-oid-123";
    private static final String TEST_EMAIL = "test@example.com";

    @BeforeEach
    @SuppressWarnings("unchecked")
    void setup() {
        this.graphServiceClient = (GraphServiceClient<Request>) mock(GraphServiceClient.class);
        when(this.graphClientConfig.getGraphServiceClient()).thenReturn(this.graphServiceClient);
        this.microsoftGraphService.init();
    }

    @Test
    @DisplayName("Should retrieve user by OID successfully")
    void test01GetUserByOid_Success() {
        UserRequestBuilder userRequestBuilder = mock(UserRequestBuilder.class);
        UserRequest userRequest = mock(UserRequest.class);

        User expectedUser = new User();
        expectedUser.id = TEST_OID;

        when(this.graphServiceClient.users(TEST_OID)).thenReturn(userRequestBuilder);
        when(userRequestBuilder.buildRequest()).thenReturn(userRequest);
        when(userRequest.get()).thenReturn(expectedUser);

        InOrder inOrder = inOrder(this.graphServiceClient, userRequestBuilder, userRequest);

        User result = this.microsoftGraphService.getUserByOid(TEST_OID);

        assertEquals(expectedUser.id, result.id);

        inOrder.verify(this.graphServiceClient, times(1)).users(TEST_OID);
        inOrder.verify(userRequestBuilder, times(1)).buildRequest();
        inOrder.verify(userRequest, times(1)).get();
    }

    @Test
    @DisplayName("Should throw NotFoundException for invalid OID")
    void test02GetUserByOid_UserNotFound() {
        UserRequestBuilder userRequestBuilder = mock(UserRequestBuilder.class);
        UserRequest userRequest = mock(UserRequest.class);

        when(this.graphServiceClient.users(anyString())).thenReturn(userRequestBuilder);
        when(userRequestBuilder.buildRequest()).thenReturn(userRequest);
        when(userRequest.get()).thenReturn(null);

        InOrder inOrder = inOrder(this.graphServiceClient, userRequestBuilder, userRequest);

        NotFoundException exception = assertThrows(
                NotFoundException.class,
                () -> this.microsoftGraphService.getUserByOid(TEST_OID)
        );
        assertEquals("User with OID " + TEST_OID + " does not exist in microsoft graph", exception.getMessage());

        inOrder.verify(this.graphServiceClient, times(1)).users(TEST_OID);
        inOrder.verify(userRequestBuilder, times(1)).buildRequest();
        inOrder.verify(userRequest, times(1)).get();
    }

    @Test
    @DisplayName("Should retrieve user by email successfully")
    void test03GetUserByEmail_Success() {
        UserCollectionRequestBuilder userCollectionRequestBuilder = mock(UserCollectionRequestBuilder.class);
        UserCollectionRequest userCollectionRequest = mock(UserCollectionRequest.class);
        UserCollectionPage page = mock(UserCollectionPage.class);

        User expectedUser = new User();
        expectedUser.userPrincipalName = TEST_EMAIL;

        when(this.graphServiceClient.users()).thenReturn(userCollectionRequestBuilder);
        when(userCollectionRequestBuilder.buildRequest()).thenReturn(userCollectionRequest);
        when(userCollectionRequest.filter(anyString())).thenReturn(userCollectionRequest);
        when(userCollectionRequest.get()).thenReturn(page);
        when(page.getCurrentPage()).thenReturn(List.of(expectedUser));

        User result = this.microsoftGraphService.getUserByEmail(TEST_EMAIL);

        assertEquals(expectedUser, result);

        InOrder inOrder = inOrder(this.graphServiceClient, userCollectionRequestBuilder, userCollectionRequest, page);

        inOrder.verify(this.graphServiceClient, times(1)).users();
        inOrder.verify(userCollectionRequestBuilder, times(1)).buildRequest();
        ArgumentCaptor<String> filterCaptor = ArgumentCaptor.forClass(String.class);
        inOrder.verify(userCollectionRequest, times(1)).filter(filterCaptor.capture());
        assertEquals("userPrincipalName eq '" + TEST_EMAIL + "'", filterCaptor.getValue());
        inOrder.verify(page, times(1)).getCurrentPage();
    }

    @Test
    @DisplayName("Should throw error on null Graph response")
    void test04GetUserByEmail_NullResponse_ThrowsError() {
        UserCollectionRequestBuilder userCollectionRequestBuilder = mock(UserCollectionRequestBuilder.class);
        UserCollectionRequest userCollectionRequest = mock(UserCollectionRequest.class);
        UserCollectionPage page = mock(UserCollectionPage.class);

        when(this.graphServiceClient.users()).thenReturn(userCollectionRequestBuilder);
        when(userCollectionRequestBuilder.buildRequest()).thenReturn(userCollectionRequest);
        when(userCollectionRequest.filter(anyString())).thenReturn(userCollectionRequest);
        when(userCollectionRequest.get()).thenReturn(null);

        InternalServerErrorException exception = assertThrows(
                InternalServerErrorException.class,
                () -> this.microsoftGraphService.getUserByEmail(TEST_EMAIL)
        );
        assertEquals("Error calling MicrosoftGraphService", exception.getMessage());

        InOrder inOrder = inOrder(this.graphServiceClient, userCollectionRequestBuilder, userCollectionRequest, page);

        inOrder.verify(this.graphServiceClient, times(1)).users();
        inOrder.verify(userCollectionRequestBuilder, times(1)).buildRequest();
        ArgumentCaptor<String> filterCaptor = ArgumentCaptor.forClass(String.class);
        inOrder.verify(userCollectionRequest, times(1)).filter(filterCaptor.capture());
        assertEquals("userPrincipalName eq '" + TEST_EMAIL + "'", filterCaptor.getValue());
        inOrder.verify(page, never()).getCurrentPage();
    }

    @Test
    @DisplayName("Should throw error when email not found")
    void test05GetUserByEmail_UserNotFound() {
        UserCollectionRequestBuilder userCollectionRequestBuilder = mock(UserCollectionRequestBuilder.class);
        UserCollectionRequest userCollectionRequest = mock(UserCollectionRequest.class);
        UserCollectionPage page = mock(UserCollectionPage.class);

        when(this.graphServiceClient.users()).thenReturn(userCollectionRequestBuilder);
        when(userCollectionRequestBuilder.buildRequest()).thenReturn(userCollectionRequest);
        when(userCollectionRequest.filter(anyString())).thenReturn(userCollectionRequest);
        when(userCollectionRequest.get()).thenReturn(page);
        when(page.getCurrentPage()).thenReturn(Collections.emptyList());

        NotFoundException exception = assertThrows(
                NotFoundException.class,
                () -> this.microsoftGraphService.getUserByEmail(TEST_EMAIL)
        );

        assertEquals("User with mail " + TEST_EMAIL + " does not exist in microsoft graph", exception.getMessage());

        InOrder inOrder = inOrder(this.graphServiceClient, userCollectionRequestBuilder, userCollectionRequest, page);

        inOrder.verify(this.graphServiceClient, times(1)).users();
        inOrder.verify(userCollectionRequestBuilder, times(1)).buildRequest();
        ArgumentCaptor<String> filterCaptor = ArgumentCaptor.forClass(String.class);
        inOrder.verify(userCollectionRequest, times(1)).filter(filterCaptor.capture());
        assertEquals("userPrincipalName eq '" + TEST_EMAIL + "'", filterCaptor.getValue());
        inOrder.verify(page, times(1)).getCurrentPage();
    }
}
