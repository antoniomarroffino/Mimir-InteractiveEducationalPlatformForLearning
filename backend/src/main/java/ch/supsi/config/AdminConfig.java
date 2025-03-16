package ch.supsi.config;


import jakarta.inject.Singleton;
import org.eclipse.microprofile.config.inject.ConfigProperty;

import java.util.List;

@Singleton
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
