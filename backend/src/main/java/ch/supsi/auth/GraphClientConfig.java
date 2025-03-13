package ch.supsi.auth;

import com.azure.identity.ClientSecretCredential;
import com.azure.identity.ClientSecretCredentialBuilder;
import com.microsoft.graph.authentication.TokenCredentialAuthProvider;
import com.microsoft.graph.requests.GraphServiceClient;
import jakarta.inject.Singleton;
import okhttp3.Request;
import org.eclipse.microprofile.config.inject.ConfigProperty;

import java.util.Collections;

@Singleton
public class GraphClientConfig {
    @ConfigProperty(name = "app.azure.tenant-id")
    String tenantId;

    @ConfigProperty(name = "app.azure.client-id")
    String clientId;

    @ConfigProperty(name = "app.azure.client-secret")
    String clientSecret;

    @ConfigProperty(name = "app.azure.graph.scope")
    String graphScope;

    private GraphServiceClient<Request> graphServiceClient = null;

    public GraphServiceClient<Request> getGraphServiceClient() {
        return this.graphServiceClient == null ? this.graphServiceClient = this.buildGraphServiceClient() : this.graphServiceClient;
    }

    private GraphServiceClient<Request> buildGraphServiceClient() {
        ClientSecretCredential clientSecretCredential = new ClientSecretCredentialBuilder()
                .clientId(this.clientId)
                .clientSecret(this.clientSecret)
                .tenantId(this.tenantId)
                .build();

        TokenCredentialAuthProvider authProvider = new TokenCredentialAuthProvider(
                Collections.singletonList(this.graphScope),
                clientSecretCredential);

        return  GraphServiceClient
                .builder()
                .authenticationProvider(authProvider)
                .buildClient();

    }
}
