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
    public UserWithoutCoursesDTO getUserByOid(String oid) {
        Optional<UserWithoutCoursesDTO> userWithoutCoursesDTOOptional =
                this.buildUser(this.graphServiceClient.users(oid)
                        .buildRequest()
                        .get());

        if (userWithoutCoursesDTOOptional.isEmpty())
            throw new NotFoundException("User with OID " + oid + " not found");

        return userWithoutCoursesDTOOptional.get();
    }

    @Override
    public UserWithoutCoursesDTO getUserByEmail(String email) {
        UserCollectionPage response = this.graphServiceClient.users()
                .buildRequest()
                .filter("userPrincipalName eq '" + email + "'")
                .get();

        if (response == null)
            throw new InternalServerErrorException("Error calling MicrosoftGraphService");


        Optional<UserWithoutCoursesDTO> userWithoutCoursesDTOOptional =
                this.buildUser(response.getCurrentPage().stream()
                        .findFirst().orElse(null));

        if (userWithoutCoursesDTOOptional.isEmpty())
            throw new NotFoundException("User with mail " + email + " not found");

        return userWithoutCoursesDTOOptional.get();
    }

    @Override
    public List<UserWithoutCoursesDTO> getAllUsers() {
        UserCollectionPage response = this.graphServiceClient.users()
                .buildRequest()
                .get();

        if (response == null)
            throw new InternalServerErrorException("Error calling MicrosoftGraphService");

        return response.getCurrentPage()
                .stream()
                .map(this::buildUser)
                .map(Optional::orElseThrow)
                .toList();
    }

    private Optional<UserWithoutCoursesDTO> buildUser(User microsoftGraphUser) {
        if (microsoftGraphUser == null) return Optional.empty();

        UserWithoutCoursesDTO userWithoutCoursesDTO = new UserWithoutCoursesDTO();
        userWithoutCoursesDTO.setAzureOid(microsoftGraphUser.id);
        userWithoutCoursesDTO.setName(microsoftGraphUser.displayName);
        userWithoutCoursesDTO.setEmail(microsoftGraphUser.userPrincipalName);
        return Optional.of(userWithoutCoursesDTO);
    }
}
