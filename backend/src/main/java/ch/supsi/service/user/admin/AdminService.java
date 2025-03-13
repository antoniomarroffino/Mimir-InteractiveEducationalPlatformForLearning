package ch.supsi.service.user.admin;

import ch.supsi.auth.AdminConfig;
import ch.supsi.model.api.user.Role;
import ch.supsi.model.api.user.User;
import ch.supsi.model.dto.api.UserWithoutCoursesDTO;
import ch.supsi.repository.UserRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.InternalServerErrorException;

import java.util.Optional;

@ApplicationScoped
public class AdminService implements IAdminService {
    @Inject
    UserRepository userRepository;

    @Inject
    AdminConfig adminConfig;

    @Override
    public void createAdmin(UserWithoutCoursesDTO userWithoutCoursesDTO) {
        if (userWithoutCoursesDTO == null)
            throw new InternalServerErrorException("UserWithoutCoursesDTO is null");

        if (this.isNotAnAdmin(userWithoutCoursesDTO))
            return;

        String oid = userWithoutCoursesDTO.getAzureOid();
        Optional<User> adminOpt = this.userRepository.findByAzureOidOptional(oid);
        if (adminOpt.isEmpty())
            this.buildNewAdmin(userWithoutCoursesDTO);
    }

    private boolean isNotAnAdmin(UserWithoutCoursesDTO userWithoutCoursesDTO) {
        if (this.adminConfig.getAdminNames().contains(userWithoutCoursesDTO.getName()))
            return !this.adminConfig.getAdminEmails().contains(userWithoutCoursesDTO.getEmail());
        return true;
    }

    private void buildNewAdmin(UserWithoutCoursesDTO userWithoutCoursesDTO) {
        User admin = new User();
        admin.azureOid = userWithoutCoursesDTO.getAzureOid();
        admin.role = Role.ADMIN;
        this.userRepository.persist(admin);
    }
}
