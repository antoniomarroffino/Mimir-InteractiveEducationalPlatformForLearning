package ch.supsi.model.dto.api;

import ch.supsi.model.api.Course;
import ch.supsi.model.api.Folder;
import org.bson.types.ObjectId;

import java.util.ArrayList;
import java.util.List;

public class CourseDTO {
    private String id;
    private String name;
    private List<Folder> folders = new ArrayList<>();

    public CourseDTO() {
    }
    public static CourseDTO fromEntity(Course course) {
        if (course == null) return null;

        CourseDTO dto = new CourseDTO();
        dto.setId(course.getId() != null ? course.getId().toString() : null);
        dto.setName(course.getName());
        dto.setFolders(course.getFolders());
        return dto;
    }

    public Course toEntity() {
        Course course = new Course();
        if (this.id != null) {
            course.setId(new ObjectId(this.id));
        }
        course.setName(this.name);
        course.setFolders(this.folders);
        return course;
    }

    public String getId() {
        return id;
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

    public List<Folder> getFolders() {
        return folders;
    }

    public void setFolders(List<Folder> folders) {
        this.folders = folders != null ? folders : new ArrayList<>();
    }
}