package ch.supsi.model.api;

import io.quarkus.mongodb.panache.common.MongoEntity;
import org.bson.codecs.pojo.annotations.BsonId;
import org.bson.types.ObjectId;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

import java.util.ArrayList;
import java.util.List;

@MongoEntity(collection = "courses")
@Schema(description = "Course model", name = "Course")
public class Course {
    @BsonId
    public ObjectId id;
    public String name;
    public String description;
    public List<Folder> folders = new ArrayList<>();

    public Course() {

    }

    public Course(String name) {
        this.name = name;
    }
}