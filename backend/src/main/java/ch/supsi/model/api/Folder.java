package ch.supsi.model.api;

import jakarta.validation.constraints.NotBlank;
import org.bson.types.ObjectId;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

import java.util.ArrayList;
import java.util.List;

@Schema(description = "Folder model", name = "Folder")
public class Folder {

    public ObjectId id;

    @NotBlank(message = "Folder name cannot be null or empty")
    public String name;

    public List<Quiz> quizzes = new ArrayList<>();

    public Folder() {
        this.id = new ObjectId();
    }

    public Folder(String name) {
        this();
        this.name = name;
    }
}