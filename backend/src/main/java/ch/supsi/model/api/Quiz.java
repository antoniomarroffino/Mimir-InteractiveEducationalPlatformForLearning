package ch.supsi.model.api;

import org.bson.types.ObjectId;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Schema(description = "Quiz model", name = "Quiz")
public class Quiz {
    public ObjectId id;
    public String name;
    public String description;
    public Set<ObjectId> questionsId = new HashSet<>();
    public LocalDateTime createdAt;
    public LocalDateTime updatedAt;
    public Integer timeLimitMinutes;

    public Quiz() {
        this.id = new ObjectId();
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.timeLimitMinutes = null;
    }

    public Quiz(String name) {
        this();
        this.name = name;
    }
}