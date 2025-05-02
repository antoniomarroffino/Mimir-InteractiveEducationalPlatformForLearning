package ch.supsi.model.api.user;

import io.quarkus.mongodb.panache.common.MongoEntity;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

import java.util.HashSet;
import java.util.Set;

@MongoEntity(collection = "users")
@Schema(description = "User model", name = "User")
public class User {
    public String azureOid;

    public Role role;

    public Set<String> coursesId;

    public User() {
        this.role = Role.STUDENT;
        this.coursesId = new HashSet<>();
    }
}
