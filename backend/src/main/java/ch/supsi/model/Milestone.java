package ch.supsi.model;


import io.quarkus.mongodb.panache.PanacheMongoEntity;

public class Milestone extends PanacheMongoEntity {
    public String name;

    public Milestone() {

    }

    public Milestone(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
}
