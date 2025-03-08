package ch.supsi.model.dto.api;

import ch.supsi.model.api.Course;
import ch.supsi.model.api.Folder;
import io.quarkus.runtime.annotations.RegisterForReflection;
import jakarta.validation.constraints.NotBlank;
import org.bson.types.ObjectId;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RegisterForReflection
public class CourseDTO {
    private String id;

    @NotBlank(message = "Course name cannot be null or empty")
    private String name;

    private List<FolderDTO> folders = new ArrayList<>();

    public CourseDTO() {
    }
    public CourseDTO fromEntity(Course course) {
        if (course == null) return null;

        CourseDTO dto = new CourseDTO();
        dto.setId(course.getId() != null ? course.getId().toString() : null);
        dto.setName(course.getName());
        dto.setFolders(course.getFolders().stream().map(new FolderDTO()::fromEntity).toList());
        return dto;
    }

    public Course toEntity() {
        Course course = new Course();
        if (this.id != null) {
            course.setId(new ObjectId(this.id));
        }
        course.setName(this.name);
        course.setFolders(this.folders.stream().map(FolderDTO::toEntity).toList());
        return course;
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