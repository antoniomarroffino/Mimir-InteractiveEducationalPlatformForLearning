package ch.supsi.config;

import com.microsoft.graph.requests.GraphServiceClient;
import com.microsoft.graph.authentication.TokenCredentialAuthProvider;
import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.junit.QuarkusTestProfile;
import io.quarkus.test.junit.TestProfile;
import jakarta.inject.Inject;
import okhttp3.Request;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.junit.jupiter.api.*;

import static org.junit.jupiter.api.Assertions.*;

@QuarkusTest
@TestMethodOrder(MethodOrderer.MethodName.class)
class GraphClientConfigTest {

    @Inject
    GraphClientConfig graphClientConfig;

    @Test
    @DisplayName("Should return always same instance of GraphServiceClient due to Singleton pattern")
    void test02GetGraphServiceClient() {
        GraphServiceClient<Request> client = this.graphClientConfig.getGraphServiceClient();

        assertNotNull(client);
        assertSame(client, this.graphClientConfig.getGraphServiceClient(), "Should be singleton instance");
    }
}
