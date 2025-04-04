package ch.supsi.service.user.changeRole.strategy;

import ch.supsi.model.api.user.Role;
import ch.supsi.model.api.user.User;
import ch.supsi.repository.UserRepository;
import jakarta.enterprise.context.Dependent;
import jakarta.inject.Inject;
import jakarta.ws.rs.ForbiddenException;

import java.util.Optional;

@Dependent
public class DemoteStrategy implements IChangeRoleStrategy {
    @Inject
    UserRepository userRepository;

    @Override
    public void changeRole(com.microsoft.graph.models.User microsoftUser) {
        Optional<User> userToDeleteOpt = this.userRepository.findByAzureOidOptional(microsoftUser.id);

        if (userToDeleteOpt.isEmpty())
            return;

        User userToDelete = userToDeleteOpt.get();
        if (userToDelete.role == Role.ADMIN)
            throw new ForbiddenException("Cannot change role of admin");

        this.userRepository.deleteByAzureOid(userToDelete.azureOid);
    }
}
