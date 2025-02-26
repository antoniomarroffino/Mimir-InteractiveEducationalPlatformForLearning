package ch.supsi.model;


import io.quarkus.mongodb.panache.PanacheMongoEntity;
import io.quarkus.mongodb.panache.common.MongoEntity;

@MongoEntity(collection = "folders")
public class Folder extends PanacheMongoEntity {
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
