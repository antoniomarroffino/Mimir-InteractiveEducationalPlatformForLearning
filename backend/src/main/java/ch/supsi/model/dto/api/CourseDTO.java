package ch.supsi.model.dto.api;

import io.quarkus.runtime.annotations.RegisterForReflection;
import jakarta.validation.constraints.NotBlank;
import java.util.ArrayList;
import java.util.List;

@RegisterForReflection
public class CourseDTO {
    private String id;

    @NotBlank(message = "Course name cannot be null or empty")
    private String name;

    private List<FolderDTO> folders = new ArrayList<>();

    public CourseDTO() {
    }

    public CourseDTO(String name) {
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

    public List<FolderDTO> getFolders() {
        return this.folders;
    }

    public void setFolders(List<FolderDTO> folders) {
        this.folders = folders != null ? folders : new ArrayList<>();
    }
}