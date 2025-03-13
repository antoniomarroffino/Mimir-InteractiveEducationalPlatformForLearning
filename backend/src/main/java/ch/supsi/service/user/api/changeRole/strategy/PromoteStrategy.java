package ch.supsi.service.user.api.changeRole.strategy;

import ch.supsi.model.api.user.Role;
import ch.supsi.model.api.user.User;
import ch.supsi.model.dto.api.UserWithoutCoursesDTO;
import ch.supsi.repository.UserRepository;
import jakarta.enterprise.context.Dependent;
import jakarta.inject.Inject;

@Dependent
public class PromoteStrategy implements ChangeRoleStrategy {
    private final Role newRole = Role.TEACHER;
    @Inject
    UserRepository userRepository;

    @Override
    public void changeRole(UserWithoutCoursesDTO userWithoutCoursesDTO) {
        User newTeacher = new User();
        newTeacher.azureOid = userWithoutCoursesDTO.getAzureOid();
        newTeacher.role = this.newRole;
        this.userRepository.persist(newTeacher);
    }
}
