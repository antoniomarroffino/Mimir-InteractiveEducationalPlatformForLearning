package ch.supsi.model.api.user;

import io.quarkus.mongodb.panache.common.MongoEntity;
import org.bson.codecs.pojo.annotations.BsonId;
import org.bson.codecs.pojo.annotations.BsonProperty;
import org.bson.types.ObjectId;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@MongoEntity(collection = "users")
@Schema(description = "User model", name = "User")
public class User {
    public String azureOid;

    public String name;

    public String email;

    public Role role;

    public Set<String> coursesId;

    public User() {
        this.role = Role.STUDENT;
        this.coursesId = new HashSet<>();
    }

    public void addCourse(String courseId) {
        this.coursesId.add(courseId);
    }
}
