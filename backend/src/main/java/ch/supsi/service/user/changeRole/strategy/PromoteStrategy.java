package ch.supsi.service.user.changeRole.strategy;

import ch.supsi.model.api.user.Role;
import ch.supsi.model.api.user.User;
import ch.supsi.repository.UserRepository;
import jakarta.enterprise.context.Dependent;
import jakarta.inject.Inject;

import java.util.Optional;

@Dependent
public class PromoteStrategy implements IChangeRoleStrategy {
    private final Role newRole = Role.TEACHER;
    @Inject
    UserRepository userRepository;

    @Override
    public void changeRole(com.microsoft.graph.models.User microsoftUser) {
        Optional<User> userOpt = this.userRepository.findByAzureOidOptional(microsoftUser.id);

        if (userOpt.isPresent())
            return;

        User newTeacher = new User();
        newTeacher.azureOid = microsoftUser.id;
        newTeacher.role = this.newRole;
        this.userRepository.persist(newTeacher);
    }
}
