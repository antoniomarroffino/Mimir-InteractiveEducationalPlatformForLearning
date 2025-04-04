package ch.supsi.service.user;

import ch.supsi.model.api.user.Role;
import ch.supsi.model.api.user.User;
import ch.supsi.repository.UserRepository;
import ch.supsi.service.user.changeRole.builder.ChangeRoleStrategyBuilder;
import ch.supsi.service.user.changeRole.builder.IChangeRoleStrategyBuilder;
import ch.supsi.service.user.changeRole.strategy.IChangeRoleStrategy;
import io.quarkus.security.identity.SecurityIdentity;
import io.quarkus.test.Mock;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import jakarta.json.Json;
import org.eclipse.microprofile.jwt.JsonWebToken;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.*;

@QuarkusTest
@TestMethodOrder(MethodOrderer.MethodName.class)
public class UserServiceTest {


    public static User createTestUser(String azureOid, Role role) {
        User user = new User();
        user.azureOid = azureOid;
        user.role = role;
        return user;
    }
}
