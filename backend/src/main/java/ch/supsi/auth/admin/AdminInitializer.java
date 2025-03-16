package ch.supsi.auth.admin;

import ch.supsi.config.AdminConfig;
import ch.supsi.service.user.admin.IAdminService;
import ch.supsi.service.user.microsoftGraph.IMicrosoftGraphService;
import io.quarkus.runtime.ShutdownEvent;
import io.quarkus.runtime.StartupEvent;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Observes;
import jakarta.inject.Inject;

@ApplicationScoped
public class AdminInitializer {
    @Inject
    IMicrosoftGraphService microsoftGraphService;

    @Inject
    IAdminService adminService;

    @Inject
    AdminConfig adminConfig;

    public void onStart(@Observes StartupEvent ev) {
        this.createAdmins();
    }

    public void onStop(@Observes ShutdownEvent ev) {
        System.out.println("Shutting down");
        this.adminService.deleteAdmins();
    }

    private void createAdmins() {
        for (String mail : this.adminConfig.getAdminEmails()) {
            try {
                this.adminService.createAdmin(this.microsoftGraphService.getUserByEmail(mail));
            } catch (Exception ignored) {
            }
        }
    }
}
