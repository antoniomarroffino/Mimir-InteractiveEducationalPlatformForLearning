package ch.supsi.model.api;


import io.quarkus.mongodb.panache.PanacheMongoEntity;
import io.quarkus.mongodb.panache.common.MongoEntity;
import jakarta.validation.constraints.NotBlank;

@MongoEntity(collection = "folders")
public class Folder extends PanacheMongoEntity {
    @NotBlank(message = "Folder name cannot be null or empty")
    public String name;

    public Folder() {

    }

    public Folder(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
}
