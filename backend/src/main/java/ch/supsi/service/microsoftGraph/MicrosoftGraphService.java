package ch.supsi.service.microsoftGraph;

import ch.supsi.auth.GraphClientConfig;
import com.microsoft.graph.http.GraphServiceException;
import com.microsoft.graph.models.User;
import com.microsoft.graph.requests.GraphServiceClient;
import com.microsoft.graph.requests.UserCollectionPage;
import com.microsoft.graph.requests.UserCollectionResponse;
import jakarta.annotation.PostConstruct;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.InternalServerErrorException;
import jakarta.ws.rs.NotFoundException;
import okhttp3.Request;

@ApplicationScoped
public class MicrosoftGraphService implements IMicrosoftGraphService {
    @Inject
    GraphClientConfig graphClientConfig;

    private GraphServiceClient<Request> graphServiceClient;

    @PostConstruct
    void init() {
        this.graphServiceClient = this.graphClientConfig.getGraphServiceClient();
    }


    @Override
    public void getUserByOid(String oid) {

    }

    //displayName: Admin
    //userPrincipalName: mail
    //id -> oid
    @Override
    public void getUserByEmail(String email) {
        try {
            UserCollectionPage response = graphServiceClient.users()
                    .buildRequest()
                    .filter("userPrincipalName eq '" + email + "'")
                    .get();

            if (response != null) {
                User user = response.getCurrentPage().stream()
                        .findFirst()
                        .orElseThrow(() -> new NotFoundException("User not found"));

                System.out.println(user.userPrincipalName);
            }

        } catch (GraphServiceException ex) {
            throw new InternalServerErrorException(ex);
        }
    }
}
