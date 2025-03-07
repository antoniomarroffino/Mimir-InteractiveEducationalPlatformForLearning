package ch.supsi.model.api;

import io.quarkus.mongodb.panache.common.MongoEntity;
import jakarta.validation.constraints.NotBlank;
import org.bson.codecs.pojo.annotations.BsonId;
import org.bson.types.ObjectId;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

@MongoEntity(collection = "quizzes")
@Schema(description = "Quiz model", name = "Quiz")
public class Quiz {

    @BsonId
    private ObjectId id;

    @NotBlank(message = "Quiz name cannot be null or empty")
    private String name;

    public Quiz() {

    }

    public Quiz(String name) {
        this.name = name;
    }

    public ObjectId getId() {
        return this.id;
    }

    public void setId(ObjectId objectId) {
        this.id = objectId;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }
}