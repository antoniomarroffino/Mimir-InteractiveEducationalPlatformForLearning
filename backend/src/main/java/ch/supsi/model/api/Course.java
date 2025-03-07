package ch.supsi.model.api;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import io.quarkus.mongodb.panache.common.MongoEntity;
import io.quarkus.mongodb.panache.common.jackson.ObjectIdDeserializer;
import jakarta.validation.constraints.NotBlank;
import org.bson.codecs.pojo.annotations.BsonId;
import org.bson.types.ObjectId;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

import java.util.ArrayList;
import java.util.List;
@MongoEntity(collection = "courses")
@Schema(description = "Course model", name = "Course")
public class Course{

    @BsonId
    private ObjectId id;

    @NotBlank(message = "Course name cannot be null or empty")
    private String name;

    private List<Folder> folders = new ArrayList<>();

    public Course() {

    }

    public Course(String name) {
        this.name = name;
    }

    public ObjectId getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<Folder> getFolders() {
        return folders;
    }

    public void setFolders(List<Folder> folders) {
        this.folders = folders;
    }

    public void setId(ObjectId objectId) {
        this.id = objectId;
    }
}