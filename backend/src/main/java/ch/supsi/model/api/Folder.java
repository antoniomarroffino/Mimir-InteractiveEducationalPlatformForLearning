package ch.supsi.model.api;


import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import io.quarkus.mongodb.panache.PanacheMongoEntity;
import io.quarkus.mongodb.panache.common.MongoEntity;
import io.quarkus.mongodb.panache.common.jackson.ObjectIdDeserializer;
import jakarta.validation.constraints.NotBlank;
import org.bson.types.ObjectId;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

@MongoEntity(collection = "folders")
@Schema(description = "Folder model", name = "Folder")
public class Folder extends PanacheMongoEntity {

    @JsonSerialize(using = ToStringSerializer.class)
    @JsonDeserialize(using = ObjectIdDeserializer.class)
    @Schema(implementation = String.class, description = "Unique identifier")
    public ObjectId id;
    @NotBlank(message = "Folder name cannot be null or empty")
    public String name;

    public Folder() {

    }

    public Folder(String name) {
        this.name = name;
    }

    public ObjectId getId() {
        return this.id;
    }

    public String getName() {
        return this.name;
    }
    public void setName(String name) {
        this.name = name;
    }
}
