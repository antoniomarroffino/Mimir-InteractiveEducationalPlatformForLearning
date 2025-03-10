package ch.supsi.service.user;

import ch.supsi.model.api.user.Role;
import ch.supsi.model.api.user.User;
import ch.supsi.repository.UserRepository;
import io.quarkus.runtime.StartupEvent;
import jakarta.annotation.PostConstruct;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Observes;
import jakarta.inject.Inject;
import org.eclipse.microprofile.config.inject.ConfigProperty;

import java.util.Optional;

@ApplicationScoped
public class AdminInitializer {
    @ConfigProperty(name = "app.admin.email")
    String adminEmail;

    @Inject
    UserRepository userRepository;

    public void onstart(@Observes StartupEvent ev) {
        System.out.println("Admin initialized with admin email: " + adminEmail);
        /*Optional<User> userOpt = this.userRepository.findByEmailOptional(adminEmail);
        if(userOpt.isEmpty())
            this.userRepository.persist(this.createBaseAdminUser());*/
    }

    private User createBaseAdminUser() {
        User user = new User();
        user.setEmail(adminEmail);
        user.setRole(Role.ADMIN);
        return user;
    }
}
