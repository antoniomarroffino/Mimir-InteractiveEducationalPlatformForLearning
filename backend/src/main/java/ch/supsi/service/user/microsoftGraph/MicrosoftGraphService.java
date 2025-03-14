package ch.supsi.service.user.microsoftGraph;

import ch.supsi.auth.GraphClientConfig;
import ch.supsi.model.dto.api.UserWithoutCoursesDTO;
import com.microsoft.graph.models.User;
import com.microsoft.graph.requests.GraphServiceClient;
import com.microsoft.graph.requests.UserCollectionPage;
import jakarta.annotation.PostConstruct;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.InternalServerErrorException;
import jakarta.ws.rs.NotFoundException;
import okhttp3.Request;

import java.util.List;
import java.util.Optional;

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
    public User getUserByOid(String oid) {
        Optional<User> microsoftUser =
                Optional.ofNullable(this.graphServiceClient.users(oid)
                        .buildRequest()
                        .get());

        if (microsoftUser.isEmpty())
            throw new NotFoundException("User with OID " + oid + " does not exist in microsoft graph");

        return microsoftUser.get();
    }

    @Override
    public User getUserByEmail(String email) {
        UserCollectionPage response = this.graphServiceClient.users()
                .buildRequest()
                .filter("userPrincipalName eq '" + email + "'")
                .get();

        if (response == null)
            throw new InternalServerErrorException("Error calling MicrosoftGraphService");

        Optional<User> microsoftUser = response.getCurrentPage().stream().findFirst();

        if (microsoftUser.isEmpty())
            throw new NotFoundException("User with mail " + email + " does not exist in microsoft graph");

        return microsoftUser.get();
    }

    @Override
    public List<User> getAllUsers() {
        UserCollectionPage response = this.graphServiceClient.users()
                .buildRequest()
                .get();

        if (response == null)
            throw new InternalServerErrorException("Error calling MicrosoftGraphService");

        return response.getCurrentPage()
                .stream()
                .toList();
    }
}
