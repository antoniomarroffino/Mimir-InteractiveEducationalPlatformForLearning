package ch.supsi.service.user.admin;

import ch.supsi.auth.AdminConfig;
import ch.supsi.model.api.user.Role;
import ch.supsi.model.api.user.User;
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
    public void createAdmin(com.microsoft.graph.models.User microsoftUser) {
        if (microsoftUser == null)
            throw new InternalServerErrorException("Microsoft user is null");

        if (this.isNotAnAdmin(microsoftUser))
            return;

        String oid = microsoftUser.id;
        Optional<User> adminOpt = this.userRepository.findByAzureOidOptional(oid);
        if (adminOpt.isEmpty())
            this.buildNewAdmin(microsoftUser);
    }

    @Override
    public void deleteAdmins() {
        for (User admin : this.userRepository.findAdminUsers())
            this.userRepository.delete(admin);
    }

    private boolean isNotAnAdmin(com.microsoft.graph.models.User microsoftUser) {
        if (this.adminConfig.getAdminNames().contains(microsoftUser.displayName))
            return !this.adminConfig.getAdminEmails().contains(microsoftUser.userPrincipalName);
        return true;
    }

    private void buildNewAdmin(com.microsoft.graph.models.User microsoftUser) {
        User admin = new User();
        admin.azureOid = microsoftUser.id;
        admin.role = Role.ADMIN;
        this.userRepository.persist(admin);
    }
}
