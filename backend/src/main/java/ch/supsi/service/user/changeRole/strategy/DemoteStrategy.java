package ch.supsi.service.user.changeRole.strategy;

import ch.supsi.model.api.user.Role;
import ch.supsi.model.api.user.User;
import ch.supsi.model.dto.api.UserWithoutCoursesDTO;
import ch.supsi.repository.UserRepository;
import jakarta.enterprise.context.Dependent;
import jakarta.inject.Inject;
import jakarta.ws.rs.ForbiddenException;

@Dependent
public class DemoteStrategy implements ChangeRoleStrategy {
    @Inject
    UserRepository userRepository;

    @Override
    public void changeRole(com.microsoft.graph.models.User microsoftUser) {
        User userToDelete = this.userRepository.findByAzureOidOptional(microsoftUser.id).orElseThrow();

        if (userToDelete.role == Role.ADMIN)
            throw new ForbiddenException("Cannot change role of admin");

        this.userRepository.deleteByAzureOid(userToDelete.azureOid);
    }
}
