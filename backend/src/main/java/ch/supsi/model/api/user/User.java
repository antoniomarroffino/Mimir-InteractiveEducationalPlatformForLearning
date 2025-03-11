package ch.supsi.model.api.user;

import io.quarkus.mongodb.panache.common.MongoEntity;
import org.bson.codecs.pojo.annotations.BsonId;
import org.bson.types.ObjectId;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@MongoEntity(collection = "users")
@Schema(description = "User model", name = "User")
public class User {
    @BsonId
    private ObjectId id;

    private String azureOid;

    private String name;

    private String email;

    private Role role;

    private final List<ObjectId> coursesId;

    public User() {
        this.role = Role.STUDENT;
        this.coursesId = new ArrayList<>();
    }

    public ObjectId getId() {
        return id;
    }

    public void setId(ObjectId id) {
        this.id = id;
    }

    public String getAzureOid() {
        return this.azureOid;
    }

    public void setAzureOid(String azureId) {
        this.azureOid = azureId;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return this.email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Role getRole() {
        return this.role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public List<ObjectId> getCoursesId() {
        return this.coursesId;
    }

    public void addCourse(ObjectId coursesId) {
        if(!this.coursesId.contains(coursesId))
            this.coursesId.add(coursesId);
    }
}
