package ch.supsi.model.dto.api;

import ch.supsi.model.api.Folder;
import io.quarkus.runtime.annotations.RegisterForReflection;
import jakarta.validation.constraints.NotBlank;
import org.bson.types.ObjectId;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RegisterForReflection
public class FolderDTO {
    private String id;

    @NotBlank(message = "Folder name cannot be null or empty")
    private String name;

    private List<QuizDTO> quizzes = new ArrayList<>();

    public FolderDTO() {
    }

    public static FolderDTO fromEntity(Folder folder) {
        if (folder == null) return null;

        FolderDTO dto = new FolderDTO();
        dto.setId(folder.getId() != null ? folder.getId().toString() : null);
        dto.setName(folder.getName());
        dto.setQuizzes(folder.getQuizzes().stream()
                .map(QuizDTO::fromEntity)
                .collect(Collectors.toList()));
        return dto;
    }

    public Folder toEntity() {
        Folder folder = new Folder(this.name);
        if (this.id != null) {
            folder.setId(new ObjectId(this.id));
        }
        if (this.quizzes != null) {
            folder.setQuizzes(this.quizzes.stream()
                    .map(QuizDTO::toEntity)
                    .collect(Collectors.toList()));
        }

        return folder;
    }

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
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