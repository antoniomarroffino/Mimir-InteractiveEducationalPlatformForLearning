package ch.supsi.model.dto.api;

import ch.supsi.model.api.Quiz;
import ch.supsi.model.api.Folder;
import io.quarkus.runtime.annotations.RegisterForReflection;
import jakarta.validation.constraints.NotBlank;
import org.bson.types.ObjectId;

import java.util.ArrayList;
import java.util.List;

@RegisterForReflection
public class FolderDTO {
    @NotBlank(message = "Folder name cannot be null or empty")
    private String name;

    private List<Quiz> quizzes = new ArrayList<>();

    public FolderDTO() {
    }

    public FolderDTO(String name) {
        this.name = name;
    }

    public FolderDTO fromEntity(Folder folder) {
        if (folder == null) return null;

        FolderDTO dto = new FolderDTO();
        dto.setName(folder.getName());
        dto.setQuizzes(folder.getQuizzes());
        return dto;
    }

    public Folder toEntity() {
        Folder folder = new Folder();
        folder.setName(this.name);
        folder.setQuizzes(this.quizzes);
        return folder;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<Quiz> getQuizzes() {
        return this.quizzes;
    }

    public void setQuizzes(List<Quiz> quizzes) {
        this.quizzes = this.quizzes != null ? this.quizzes : new ArrayList<>();
    }
}
