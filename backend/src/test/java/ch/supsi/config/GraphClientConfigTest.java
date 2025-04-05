package ch.supsi.config;

import com.microsoft.graph.requests.GraphServiceClient;
import com.microsoft.graph.authentication.TokenCredentialAuthProvider;
import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.junit.QuarkusTestProfile;
import io.quarkus.test.junit.TestProfile;
import jakarta.inject.Inject;
import okhttp3.Request;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@QuarkusTest
class GraphClientConfigTest {

    @Inject
    GraphClientConfig graphClientConfig;

    @ConfigProperty(name = "app.azure.tenant-id")
    String tenantId;

    @ConfigProperty(name = "app.azure.client-id")
    String clientId;

    @ConfigProperty(name = "app.azure.client-secret")
    String clientSecret;

    @ConfigProperty(name = "app.azure.graph.scope")
    String graphScope;

    @Test
    @DisplayName("Should load correctly configuration by properties")
    void test01LoadConfigurationCorrectly() {
        assertAll(
                () -> assertEquals(tenantId, this.graphClientConfig.tenantId),
                () -> assertEquals(clientId, this.graphClientConfig.clientId),
                () -> assertEquals(clientSecret, this.graphClientConfig.clientSecret),
                () -> assertEquals(graphScope, this.graphClientConfig.graphScope)
        );
    }

    @Test
    @DisplayName("Should return always same instance of GraphServiceClient due to Singleton pattern")
    void test02GetGraphServiceClient() {
        GraphServiceClient<Request> client = this.graphClientConfig.getGraphServiceClient();

        assertNotNull(client);
        assertSame(client, this.graphClientConfig.getGraphServiceClient(), "Should be singleton instance");
    }
}
