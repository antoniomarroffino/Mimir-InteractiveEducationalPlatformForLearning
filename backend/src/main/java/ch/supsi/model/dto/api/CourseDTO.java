package ch.supsi.model.dto;

import ch.supsi.model.api.Course;
import ch.supsi.model.api.Folder;
import org.bson.types.ObjectId;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class CourseDTO {
    // I campi che verranno inviati/ricevuti dal frontend
    private String id;
    private String name;
    private List<Folder> folders = new ArrayList<>();

    // Costruttore vuoto necessario per la deserializzazione JSON
    public CourseDTO() {
    }

    // Metodo per convertire da Entity (Course) a DTO (CourseDTO)
    public static CourseDTO fromEntity(Course course) {
        if (course == null) return null;

        CourseDTO dto = new CourseDTO();
        dto.setId(course.getId() != null ? course.getId().toString() : null);
        dto.setName(course.getName());
        dto.setFolders(course.getFolders());
        return dto;
    }

    // Metodo per convertire da DTO (CourseDTO) a Entity (Course)
    public Course toEntity() {
        Course course = new Course();
        if (this.id != null) {
            course.setId(new ObjectId(this.id));
        }
        course.setName(this.name);
        course.setFolders(this.folders);
        return course;
    }

    // Getters e Setters
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