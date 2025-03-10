package ch.supsi.auth;


import jakarta.enterprise.context.ApplicationScoped;
import org.eclipse.microprofile.config.inject.ConfigProperty;

import java.util.List;

@ApplicationScoped
public class AdminConfig {
    @ConfigProperty(name = "app.admin.names")
    List<String> adminNames;
    @ConfigProperty(name = "app.admin.emails")
    List<String> adminEmails;

    public List<String> getAdminNames() {
        return this.adminNames;
    }

    public List<String> getAdminEmails() {
        return this.adminEmails;
    }
}
