package ch.supsi.config;

import com.microsoft.graph.requests.GraphServiceClient;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import okhttp3.Request;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertSame;

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
