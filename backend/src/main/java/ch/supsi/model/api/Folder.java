package ch.supsi.model.api;

import org.bson.codecs.pojo.annotations.BsonId;
import jakarta.validation.constraints.NotBlank;
import org.bson.types.ObjectId;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

import java.util.ArrayList;
import java.util.List;

@Schema(description = "Folder model", name = "Folder")
public class Folder {

    private ObjectId id;

    @NotBlank(message = "Folder name cannot be null or empty")
    private String name;

    private List<Quiz> quizzes = new ArrayList<>();

    public Folder() {
        this.id = new ObjectId();
    }

    public Folder(String name) {
        this();
        this.name = name;
    }

    public ObjectId getId() {
        return this.id;
    }

    public void setId(ObjectId id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<Quiz> getQuizzes() {
        return this.quizzes;
    }

    public void setQuizzes(List<Quiz> quizzes) {
        this.quizzes = quizzes != null ? quizzes : new ArrayList<>();
    }
}