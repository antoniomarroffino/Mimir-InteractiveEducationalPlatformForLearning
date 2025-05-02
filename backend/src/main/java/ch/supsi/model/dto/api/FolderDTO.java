package ch.supsi.model.dto.api;

import io.quarkus.runtime.annotations.RegisterForReflection;
import jakarta.validation.constraints.NotBlank;

import java.util.ArrayList;
import java.util.List;

@RegisterForReflection
public class FolderDTO {
    private String id;

    @NotBlank(message = "Folder name cannot be null or empty")
    private String name;

    private List<QuizDTO> quizzes;

    public FolderDTO() {
        this.quizzes = new ArrayList<>();
    }

    public FolderDTO(String name) {
        this();
        this.name = name;
    }

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<QuizDTO> getQuizzes() {
        return this.quizzes;
    }

    public void setQuizzes(List<QuizDTO> quizzes) {
        this.quizzes = quizzes != null ? quizzes : new ArrayList<>();
    }
}